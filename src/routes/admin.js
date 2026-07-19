const express = require('express');
const bcrypt = require('bcryptjs');
const Karyawan = require('../models/Karyawan');
const Absensi = require('../models/Absensi');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// --- API ADMIN: MENAMPILKAN SELURUH LOG DATA REKAP ABSENSI ---
router.get('/admin/rekap', requireRole('admin', 'gudang', 'finance', 'owner', 'hrd'), async (req, res) => {
  try {
    // Mengambil data absensi ter-update berurutan dari yang paling baru masuk (descending order)
    const dataAbsen = await Absensi.find().sort({ waktu_absen: -1 });
    res.status(200).json(dataAbsen);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data rekap', error: error.message });
  }
});

// --- API ADMIN: MENAMPILKAN DAFTAR SELURUH KARYAWAN (filter opsional ?role=) ---
router.get('/admin/karyawan', requireRole('admin', 'gudang', 'finance', 'owner', 'hrd'), async (req, res) => {
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

module.exports = router;