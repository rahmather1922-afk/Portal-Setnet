const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const XLSX = require('xlsx');
const Karyawan = require('../models/Karyawan');
const Absensi = require('../models/Absensi');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// File Excel disimpan sementara di memori (tidak ditulis ke disk)
const upload = multer({ storage: multer.memoryStorage() });

// Role yang diizinkan dipilih saat import (harus sinkron dengan enum di model/aplikasi)
const ROLE_VALID = ['teknisi', 'admin', 'gudang', 'korlap', 'finance', 'owner', 'hrd', 'karyawan'];

// --- API ADMIN: MENAMPILKAN SELURUH LOG DATA REKAP ABSENSI ---
router.get('/admin/rekap', requireRole('admin', 'gudang', 'korlap', 'finance', 'owner', 'hrd'), async (req, res) => {
  try {
    // Mengambil data absensi ter-update berurutan dari yang paling baru masuk (descending order)
    const dataAbsen = await Absensi.find().sort({ waktu_absen: -1 });
    res.status(200).json(dataAbsen);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data rekap', error: error.message });
  }
});

// --- API ADMIN: MENAMPILKAN DAFTAR SELURUH KARYAWAN (filter opsional ?role=) ---
router.get('/admin/karyawan', requireRole('admin', 'gudang', 'korlap', 'finance', 'owner', 'hrd'), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    // Password tidak pernah dikirim ke frontend
    const listKaryawan = await Karyawan.find(filter).select('-password');
    res.status(200).json(listKaryawan);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat daftar karyawan', error: error.message });
  }
});

// --- API ADMIN: REGISTRASI / MENAMBAH ANGGOTA KARYAWAN BARU ---
// DIUBAH: requireRole hanya diisi 'owner'
router.post('/admin/tambah-karyawan', requireRole('owner'), async (req, res) => {
  try {
    const { karyawan_id, nama, password, role, alamat, nik, tanggal_lahir, no_telp, cabang } = req.body;
    if (!karyawan_id || !nama || !password) {
      return res.status(400).json({ message: 'ID, Nama, dan Password wajib diisi!' });
    }

    const cekKaryawan = await Karyawan.findOne({ karyawan_id });
    if (cekKaryawan) {
      return res.status(400).json({ message: 'ID Karyawan sudah terdaftar di sistem!' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const karyawanBaru = new Karyawan({
      karyawan_id, nama, password: passwordHash, role, alamat,
      nik: nik || '', tanggal_lahir: tanggal_lahir || null, no_telp: no_telp || '', cabang: cabang || ''
    });
    await karyawanBaru.save();

    const { password: _omit, ...dataAman } = karyawanBaru.toObject();
    res.status(201).json({ message: 'Anggota baru berhasil terdaftar!', data: dataAman });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mendaftarkan karyawan', error: error.message });
  }
});

// --- API ADMIN: PREVIEW/VALIDASI FILE EXCEL IMPORT KARYAWAN (tahap 1) ---
// Menerima file .xlsx sesuai "Template Import Karyawan", membaca isinya,
// lalu memvalidasi setiap baris TANPA menyimpan apa pun ke database.
// Frontend menampilkan hasil ini sebagai tabel konfirmasi ke admin/owner.
router.post('/admin/import-karyawan/preview', requireRole('owner'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File Excel wajib diupload (field "file")' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: false });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (rows.length === 0) {
      return res.status(400).json({ message: 'File Excel kosong atau format tidak sesuai template' });
    }

    // Ambil semua karyawan_id yang sudah ada di database untuk cek duplikat
    const existingIds = new Set(
      (await Karyawan.find({}, 'karyawan_id')).map(k => k.karyawan_id)
    );

    const idsInFile = new Set();
    const hasil = rows.map((row, index) => {
      const nomorBaris = index + 2; // +2 karena baris 1 = header
      const errors = [];

      const karyawan_id = String(row.karyawan_id || '').trim();
      const nama = String(row.nama || '').trim();
      const password = String(row.password || '').trim();
      const role = String(row.role || 'karyawan').trim().toLowerCase();
      const alamat = String(row.alamat || '').trim();
      const nik = String(row.nik || '').trim();
      const tanggal_lahir = String(row.tanggal_lahir || '').trim();
      const no_telp = String(row.no_telp || '').trim();
      const cabang = String(row.cabang || '').trim();

      if (!karyawan_id) errors.push('karyawan_id kosong');
      if (!nama) errors.push('nama kosong');
      if (!password) errors.push('password kosong');
      if (role && !ROLE_VALID.includes(role)) errors.push(`role "${role}" tidak valid`);
      if (karyawan_id && existingIds.has(karyawan_id)) errors.push('karyawan_id sudah terdaftar di sistem');
      if (karyawan_id && idsInFile.has(karyawan_id)) errors.push('karyawan_id duplikat di dalam file ini');
      if (tanggal_lahir && isNaN(Date.parse(tanggal_lahir))) errors.push('format tanggal_lahir tidak valid (gunakan YYYY-MM-DD)');

      if (karyawan_id) idsInFile.add(karyawan_id);

      return {
        baris: nomorBaris,
        valid: errors.length === 0,
        errors,
        data: {
          karyawan_id, nama, role: role || 'karyawan', alamat,
          nik, tanggal_lahir, no_telp, cabang,
          // Password tidak dikirim balik demi keamanan, cukup ditandai terisi/tidak
          password_terisi: !!password
        },
        // password asli disertakan terpisah, hanya dipakai internal saat confirm
        _password: password
      };
    });

    const jumlahValid = hasil.filter(h => h.valid).length;
    const jumlahError = hasil.length - jumlahValid;

    res.status(200).json({
      message: `Ditemukan ${hasil.length} baris data (${jumlahValid} valid, ${jumlahError} bermasalah)`,
      total: hasil.length,
      valid: jumlahValid,
      invalid: jumlahError,
      rows: hasil
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membaca/memvalidasi file Excel', error: error.message });
  }
});

// --- API ADMIN: KONFIRMASI & SIMPAN HASIL IMPORT KARYAWAN (tahap 2) ---
// Dipanggil SETELAH admin/owner menekan tombol "Konfirmasi & Simpan" pada
// tabel preview. Body: { rows: [ { karyawan_id, nama, password, role, ... }, ... ] }
// Hanya baris yang sudah dinyatakan valid di tahap preview yang boleh dikirim ke sini.
router.post('/admin/import-karyawan/confirm', requireRole('owner'), async (req, res) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'Tidak ada data untuk disimpan' });
    }

    // Validasi ulang secara ringkas di server (jangan percaya penuh ke client)
    const existingIds = new Set(
      (await Karyawan.find({}, 'karyawan_id')).map(k => k.karyawan_id)
    );

    const berhasil = [];
    const gagal = [];

    for (const row of rows) {
      const { karyawan_id, nama, password, role, alamat, nik, tanggal_lahir, no_telp, cabang } = row;
      try {
        if (!karyawan_id || !nama || !password) {
          throw new Error('karyawan_id, nama, dan password wajib diisi');
        }
        if (existingIds.has(karyawan_id)) {
          throw new Error('karyawan_id sudah terdaftar');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const karyawanBaru = new Karyawan({
          karyawan_id,
          nama,
          password: passwordHash,
          role: role && ROLE_VALID.includes(role) ? role : 'karyawan',
          alamat: alamat || '-',
          nik: nik || '',
          tanggal_lahir: tanggal_lahir || null,
          no_telp: no_telp || '',
          cabang: cabang || ''
        });
        await karyawanBaru.save();
        existingIds.add(karyawan_id); // cegah duplikat antar-baris dalam batch yang sama

        const { password: _omit, ...dataAman } = karyawanBaru.toObject();
        berhasil.push(dataAman);
      } catch (err) {
        gagal.push({ karyawan_id: karyawan_id || '(kosong)', alasan: err.message });
      }
    }

    res.status(201).json({
      message: `Import selesai: ${berhasil.length} berhasil, ${gagal.length} gagal`,
      total_diproses: rows.length,
      total_berhasil: berhasil.length,
      total_gagal: gagal.length,
      berhasil,
      gagal
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyimpan data import', error: error.message });
  }
});

// --- API ADMIN: MEMPERBARUI / EDIT DATA PROFIL KARYAWAN ---
// DIUBAH: requireRole hanya diisi 'owner'
router.put('/admin/update-karyawan/:id', requireRole('owner'), async (req, res) => {
  try {
    const { nama, role, alamat, password, nik, tanggal_lahir, no_telp, cabang } = req.body;
    const updateData = { nama, role, alamat, nik: nik || '', tanggal_lahir: tanggal_lahir || null, no_telp: no_telp || '', cabang: cabang || '' };

    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const karyawanDiupdate = await Karyawan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!karyawanDiupdate) {
      return res.status(404).json({ message: 'Data karyawan tidak ditemukan' });
    }

    res.status(200).json({ message: 'Data karyawan berhasil diupdate', data: karyawanDiupdate });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate data karyawan', error: error.message });
  }
});

// --- API ADMIN: UBAH STATUS KEPEGAWAIAN (Aktif / Non Aktif) ---
// KHUSUS role 'hrd' & 'owner'. Role lain (admin, gudang, finance) hanya bisa
// MELIHAT status ini lewat GET /admin/karyawan yang sudah ada di atas.
router.put('/admin/karyawan/:id/status', requireRole('hrd', 'owner'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Aktif', 'Non Aktif'].includes(status)) {
      return res.status(400).json({ message: 'Status harus "Aktif" atau "Non Aktif"' });
    }

    const karyawanDiupdate = await Karyawan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!karyawanDiupdate) {
      return res.status(404).json({ message: 'Data karyawan tidak ditemukan' });
    }

    res.status(200).json({ message: `Status karyawan berhasil diubah menjadi ${status}`, data: karyawanDiupdate });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah status karyawan', error: error.message });
  }
});

// --- API ADMIN: MENGHAPUS DATA KARYAWAN ---
// DIUBAH: requireRole hanya diisi 'owner'
router.delete('/admin/hapus-karyawan/:id', requireRole('owner'), async (req, res) => {
  try {
    const dihapus = await Karyawan.findByIdAndDelete(req.params.id);
    if (!dihapus) {
      return res.status(404).json({ message: 'Data karyawan tidak ditemukan' });
    }
    res.status(200).json({ message: 'Karyawan berhasil dihapus', data: { _id: dihapus._id } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data karyawan', error: error.message });
  }
});

// --- API ADMIN: MENGHAPUS BANYAK KARYAWAN SEKALIGUS (checkbox di tabel Master Data) ---
// Body: { ids: ["<_id1>", "<_id2>", ...] }. Sama seperti hapus satuan, khusus role 'owner'.
router.post('/admin/karyawan/hapus-batch', requireRole('owner'), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Tidak ada data karyawan yang dipilih untuk dihapus' });
    }

    const hasil = await Karyawan.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: `${hasil.deletedCount} karyawan berhasil dihapus`,
      total_diminta: ids.length,
      total_dihapus: hasil.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data karyawan terpilih', error: error.message });
  }
});

module.exports = router;