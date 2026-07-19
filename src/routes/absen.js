const express = require('express');
const bcrypt = require('bcryptjs');
const Karyawan = require('../models/Karyawan');
const Absensi = require('../models/Absensi');

const router = express.Router();

// Helper: apakah string terlihat seperti hash bcrypt ($2a$/$2b$/$2y$...)
const isBcryptHash = (str) => typeof str === 'string' && /^\$2[aby]\$\d{2}\$/.test(str);

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

    res.status(200).json({
      message: 'Login Berhasil!',
      karyawan: { karyawan_id: akun.karyawan_id, nama: akun.nama, role: akun.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan server pada proses login', error: error.message });
  }
});

// --- API UTAMA KIRIM DATA ABSENSI (LOGIKA SHIFT + FOTO + KETERANGAN) ---
router.post('/absen', async (req, res) => {
  try {
    const { karyawan_id, nama, status, shift, foto } = req.body;
    if (!karyawan_id || !nama || !status || !shift || !foto) {
      return res.status(400).json({ message: 'Data absensi tidak lengkap!' });
    }

    let keterangan = "Normal";
    // Pengecekan status terlambat hanya dihitung saat karyawan melakukan "Absen Masuk"
    if (status === "Masuk") {
      const sekarang = new Date();
      const jam = sekarang.getHours();
      const menit = sekarang.getMinutes();

      // Mengonversi waktu saat ini menjadi akumulasi total hitungan menit dari jam 00:00 dini hari
      const totalMenitSekarang = (jam * 60) + menit;
      let batasMenitMasuk = 0;
      // Aturan Waktu Shift Masuk Kerja
      if (shift === "Shift 1") {
        batasMenitMasuk = 7 * 60;   // Batas Jam 07:00 Pagi = 420 Menit
      } else if (shift === "Shift 2") {
        batasMenitMasuk = 15 * 60;  // Batas Jam 15:00 Sore = 900 Menit
      } else if (shift === "Non-Shift") {
        batasMenitMasuk = 9 * 60;   // Batas Jam 09:00 Pagi = 540 Menit
      }
      // Jika waktu absen saat ini melewati batas menit shift yang ditentukan
      if (totalMenitSekarang > batasMenitMasuk) {
        const selisihMenit = totalMenitSekarang - batasMenitMasuk;
        const jamTelat = Math.floor(selisihMenit / 60);
        const menitTelat = selisihMenit % 60;

        if (jamTelat > 0) {
          keterangan = `Terlambat (${jamTelat} Jam ${menitTelat} Menit)`;
        } else {
          keterangan = `Terlambat (${menitTelat} Menit)`;
        }
      }
    }

    // Pembuatan dokumen log baru ke MongoDB Atlas
    const absenBaru = new Absensi({ karyawan_id, nama, status, shift, keterangan, foto });
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

module.exports = router;
