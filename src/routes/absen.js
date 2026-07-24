const express = require('express');
const bcrypt = require('bcryptjs');
const Karyawan = require('../models/Karyawan');
const Absensi = require('../models/Absensi');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Helper: apakah string terlihat seperti hash bcrypt ($2a$/$2b$/$2y$...)
const isBcryptHash = (str) => typeof str === 'string' && /^\$2[aby]\$\d{2}\$/.test(str);

// Helper: ambil jam & menit versi WIB (Asia/Jakarta) SECARA EKSPLISIT.
// PENTING: jangan pakai new Date().getHours() langsung, karena itu mengikuti
// timezone SERVER (kalau server di-hosting dengan TZ=UTC, jam 06:37 WIB akan
// terbaca sebagai 23:37 dan bikin perhitungan telat jadi kebalik / ngaco).
// Asia/Jakarta tidak pakai DST jadi offsetnya selalu tetap (UTC+7).
const getJamMenitWIB = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23' // pastikan range 00-23, hindari bug "24:xx" saat tengah malam
  });
  const parts = formatter.formatToParts(date);
  const jam = Number(parts.find(p => p.type === 'hour').value);
  const menit = Number(parts.find(p => p.type === 'minute').value);
  return { jam, menit };
};

// Helper: ambil rentang "hari ini" versi WIB (00:00 - 23:59:59.999 WIB), dikonversi
// ke Date UTC, supaya query "apakah sudah absen hari ini" akurat sesuai kalender WIB
// walaupun server hosting berjalan di timezone UTC.
const getRentangHariIniWIB = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const parts = formatter.formatToParts(date);
  const tahun = Number(parts.find(p => p.type === 'year').value);
  const bulan = Number(parts.find(p => p.type === 'month').value);
  const hari = Number(parts.find(p => p.type === 'day').value);
  // 00:00 WIB = 17:00 UTC hari sebelumnya (WIB = UTC+7, tanpa DST)
  const mulai = new Date(Date.UTC(tahun, bulan - 1, hari, -7, 0, 0, 0));
  const selesai = new Date(Date.UTC(tahun, bulan - 1, hari, 17, 0, 0, 0));
  return { mulai, selesai };
};

// Helper: hitung jarak antar 2 koordinat GPS pakai formula Haversine, hasil dalam meter.
const hitungJarakMeter = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // radius bumi dalam meter
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// --- API LOGIN / AUTENTIKASI KARYAWAN ---
router.post('/absen/login', async (req, res) => {
  try {
    const { karyawan_id, password } = req.body;
    if (!karyawan_id || !password) {
      return res.status(400).json({ message: 'ID Karyawan dan Password wajib diisi!' });
    }

    const akun = await Karyawan.findOne({ karyawan_id });
    if (!akun) {
      return res.status(401).json({ message: 'ID Karyawan atau Password salah!' });
    }

    let cocok = false;
    if (isBcryptHash(akun.password)) {
      cocok = await bcrypt.compare(password, akun.password);
    } else {
      // Kompatibilitas mundur: akun lama masih menyimpan password plain-text.
      // Jika cocok, migrasikan otomatis ke bentuk hash agar ke depannya lebih aman.
      cocok = akun.password === password;
      if (cocok) {
        akun.password = await bcrypt.hash(password, 10);
        await akun.save();
      }
    }

    if (!cocok) {
      return res.status(401).json({ message: 'ID Karyawan atau Password salah!' });
    }

    // Karyawan berstatus "Non Aktif" (sudah resign/diberhentikan) tidak boleh lagi masuk
    // ke sistem sama sekali — baik aplikasi absensi HP maupun Portal Admin, karena login
    // keduanya sama-sama lewat endpoint ini. Dicek SETELAH password cocok supaya pesan
    // error tetap "ID/Password salah" untuk kredensial yang memang salah (tidak membocorkan
    // status akun ke pihak yang belum tentu pemilik akun aslinya).
    if (akun.status === 'Non Aktif') {
      return res.status(403).json({
        message: 'Akun ini sudah Non Aktif (tidak bekerja lagi). Akses absensi & Portal Admin telah dinonaktifkan. Hubungi HRD/Owner jika ini keliru.'
      });
    }

    res.status(200).json({
      message: 'Login Berhasil!',
      karyawan: { karyawan_id: akun.karyawan_id, nama: akun.nama, role: akun.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan server pada proses login', error: error.message });
  }
});

// --- API UTAMA KIRIM DATA ABSENSI (LOGIKA SHIFT + FOTO + GPS + KETERANGAN) ---
router.post('/absen', async (req, res) => {
  try {
    const { karyawan_id, nama, status, shift, foto, latitude, longitude, alamat } = req.body;
    if (!karyawan_id || !nama || !status || !shift || !foto) {
      return res.status(400).json({ message: 'Data absensi tidak lengkap!' });
    }

    // Jaga-jaga untuk sesi yang sudah terlanjur login di HP SEBELUM status diubah jadi
    // "Non Aktif" (sesi HP disimpan di localStorage & tidak otomatis logout). Begitu status
    // berubah, karyawan yang bersangkutan tetap tidak boleh mengirim absensi baru.
    const akunAbsen = await Karyawan.findOne({ karyawan_id });
    if (!akunAbsen) {
      return res.status(404).json({ message: 'Data karyawan tidak ditemukan.' });
    }
    if (akunAbsen.status === 'Non Aktif') {
      return res.status(403).json({ message: 'Akun ini sudah Non Aktif. Tidak bisa melakukan absensi lagi.' });
    }

    // GPS wajib diisi, sama seperti foto wajib. Ditolak kalau tidak ada koordinat.
    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
      return res.status(400).json({ message: 'Lokasi GPS wajib aktif untuk melakukan absensi!' });
    }
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: 'Data lokasi GPS tidak valid!' });
    }

    // Cegah absen dobel: karyawan hanya boleh 1x Absen Masuk dan 1x Absen Pulang per hari (WIB).
    const { mulai: mulaiHariIni, selesai: selesaiHariIni } = getRentangHariIniWIB();
    const sudahAbsenHariIni = await Absensi.findOne({
      karyawan_id,
      status,
      waktu_absen: { $gte: mulaiHariIni, $lt: selesaiHariIni }
    });
    if (sudahAbsenHariIni) {
      return res.status(400).json({
        message: `Anda sudah melakukan Absen ${status} hari ini. Tidak bisa absen ${status} lagi hari ini.`
      });
    }

    let keterangan = "Normal";
    // --- SEMENTARA DINONAKTIFKAN: perhitungan terlambat berdasarkan shift ---
    // Absen sekarang tidak dibatasi jam berapapun, statusnya tetap "Masuk" dan
    // keterangan selalu "Normal" (tidak ada status Terlambat). Nanti kalau mau
    // dipakai lagi, tinggal uncomment blok di bawah ini.
    //
    // // Pengecekan status terlambat hanya dihitung saat karyawan melakukan "Absen Masuk"
    // if (status === "Masuk") {
    //   // PENTING: pakai jam WIB eksplisit (bukan jam lokal server) supaya perhitungan
    //   // telat tidak kebalik/ngaco kalau server hosting berjalan di timezone UTC.
    //   const { jam, menit } = getJamMenitWIB();
    //
    //   // Mengonversi waktu saat ini menjadi akumulasi total hitungan menit dari jam 00:00 dini hari (WIB)
    //   const totalMenitSekarang = (jam * 60) + menit;
    //   let batasMenitMasuk = 0;
    //   // Aturan Waktu Shift Masuk Kerja
    //   if (shift === "Shift 1") {
    //     batasMenitMasuk = 7 * 60;   // Batas Jam 07:00 Pagi = 420 Menit
    //   } else if (shift === "Shift 2") {
    //     batasMenitMasuk = 15 * 60;  // Batas Jam 15:00 Sore = 900 Menit
    //   } else if (shift === "Non-Shift") {
    //     batasMenitMasuk = 9 * 60;   // Batas Jam 09:00 Pagi = 540 Menit
    //   }
    //   // Jika waktu absen saat ini melewati batas menit shift yang ditentukan
    //   if (totalMenitSekarang > batasMenitMasuk) {
    //     const selisihMenit = totalMenitSekarang - batasMenitMasuk;
    //     const jamTelat = Math.floor(selisihMenit / 60);
    //     const menitTelat = selisihMenit % 60;
    //
    //     if (jamTelat > 0) {
    //       keterangan = `Terlambat (${jamTelat} Jam ${menitTelat} Menit)`;
    //     } else {
    //       keterangan = `Terlambat (${menitTelat} Menit)`;
    //     }
    //   }
    // }

    // Upload foto (base64 dataURL dari kamera HP) ke Cloudinary DULU, sebelum disimpan ke MongoDB.
    // Cloudinary bisa langsung menerima string base64 sebagai sumber file (tidak perlu multer/multipart
    // di endpoint ini karena frontend memang mengirimnya sebagai JSON, bukan form-data).
    // Yang disimpan ke MongoDB nantinya cuma URL-nya (pendek), bukan string base64 (bisa ratusan KB).
    let fotoUrl;
    let fotoPublicId;
    try {
      const hasilUpload = await cloudinary.uploader.upload(foto, {
        folder: 'absensi', // semua foto absen dikumpulkan rapi dalam 1 folder di Cloudinary
        resource_type: 'image',
      });
      fotoUrl = hasilUpload.secure_url;
      fotoPublicId = hasilUpload.public_id;
    } catch (uploadError) {
      return res.status(502).json({ message: 'Gagal mengunggah foto absensi ke penyimpanan cloud', error: uploadError.message });
    }

    // Pembuatan dokumen log baru ke MongoDB Atlas (foto disimpan sebagai URL Cloudinary)
    const absenBaru = new Absensi({
      karyawan_id, nama, status, shift, keterangan,
      foto: fotoUrl,
      foto_public_id: fotoPublicId,
      lokasi: { latitude: lat, longitude: lng, alamat: alamat || '' }
    });
    await absenBaru.save();

    // Mengembalikan objek data absensi yang utuh ke frontend agar parameter waktunya tidak bernilai 'undefined' atau 'Invalid Date'
    res.status(201).json({
      message: 'Absen berhasil dicatat!',
      data: absenBaru
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memproses data absensi', error: error.message });
  }
});

// --- API CEK STATUS ABSEN HARI INI (dipakai frontend untuk mengunci tombol Absen Masuk/Pulang
//     dan mengunci pilihan shift, supaya karyawan tidak bisa Absen Masuk 2x atau ganti shift
//     setelah sudah Absen Masuk di hari yang sama) ---
router.get('/absen/status-hari-ini/:karyawan_id', async (req, res) => {
  try {
    const { karyawan_id } = req.params;
    const { mulai, selesai } = getRentangHariIniWIB();

    const catatanHariIni = await Absensi.find({
      karyawan_id,
      waktu_absen: { $gte: mulai, $lt: selesai }
    }).sort({ waktu_absen: 1 });

    const absenMasuk = catatanHariIni.find(c => c.status === 'Masuk');
    const absenPulang = catatanHariIni.find(c => c.status === 'Pulang');

    res.status(200).json({
      sudahMasuk: !!absenMasuk,
      sudahPulang: !!absenPulang,
      // Shift dikunci ke shift yang dipakai saat Absen Masuk tadi, supaya konsisten sampai Absen Pulang
      shift: absenMasuk ? absenMasuk.shift : null,
      waktuMasuk: absenMasuk ? absenMasuk.waktu_absen : null,
      waktuPulang: absenPulang ? absenPulang.waktu_absen : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil status absensi hari ini', error: error.message });
  }
});

// --- API RIWAYAT ABSENSI MILIK SATU KARYAWAN (dipakai halaman "Kehadiran Bulan Ini" & "Riwayat Absensi" di app mobile) ---
router.get('/absen/mine/:karyawan_id', async (req, res) => {
  try {
    const { karyawan_id } = req.params;
    const riwayat = await Absensi.find({ karyawan_id }).sort({ waktu_absen: -1 });
    res.status(200).json(riwayat);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat absensi', error: error.message });
  }
});

module.exports = router;