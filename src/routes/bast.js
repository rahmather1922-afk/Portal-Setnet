const express = require('express');
const router = express.Router();
const Bast = require('../models/Bast');

// Menu BAST Balap ada di sub-tab halaman Invoice/Penagihan di frontend,
// jadi akses rolenya disamakan dengan menu invoice: finance, owner, hrd.
const ROLE_DIIZINKAN = ['finance', 'owner', 'hrd'];
const cekAkses = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (!ROLE_DIIZINKAN.includes(role)) {
    return res.status(403).json({ message: 'Akses ditolak untuk role ini' });
  }
  next();
};

// GET /api/finance/bast — daftar semua BAST Balap, terbaru duluan
router.get('/finance/bast', cekAkses, async (req, res) => {
  try {
    const list = await Bast.find().sort({ dibuatPada: -1 });
    res.json(list);
  } catch (err) {
    console.error('Gagal mengambil data BAST Balap:', err);
    res.status(500).json({ message: 'Gagal mengambil data BAST Balap' });
  }
});

// POST /api/finance/bast — buat BAST Balap baru
router.post('/finance/bast', cekAkses, async (req, res) => {
  try {
    const {
      nomorSurat, tanggal, namaPekerjaan, nomorKontrak, rekananPelaksana, pihakKedua,
      jenisPekerjaan, periodeAwal, periodeAkhir, items,
      ttdClientNama, ttdClientJabatan, ttdRekananNama, ttdRekananJabatan, pakaiTtdBayhaky, pakaiStempel,
    } = req.body;

    if (!nomorSurat || !nomorSurat.trim()) return res.status(400).json({ message: 'No. Surat wajib diisi' });
    if (!tanggal) return res.status(400).json({ message: 'Tanggal wajib diisi' });
    if (!namaPekerjaan || !namaPekerjaan.trim()) return res.status(400).json({ message: 'Nama pekerjaan wajib diisi' });
    if (!Array.isArray(items) || !items.some((it) => (it.deskripsi || '').trim())) {
      return res.status(400).json({ message: 'Minimal 1 baris summary dengan deskripsi wajib diisi' });
    }

    const baru = await Bast.create({
      nomorSurat, tanggal, namaPekerjaan, nomorKontrak, rekananPelaksana, pihakKedua,
      jenisPekerjaan, periodeAwal, periodeAkhir,
      items: items.filter((it) => (it.deskripsi || '').trim()),
      ttdClientNama, ttdClientJabatan, ttdRekananNama, ttdRekananJabatan, pakaiTtdBayhaky, pakaiStempel,
    });

    res.status(201).json({ message: 'BAST Balap berhasil dibuat', data: baru });
  } catch (err) {
    console.error('Gagal membuat BAST Balap:', err);
    res.status(500).json({ message: 'Gagal membuat BAST Balap' });
  }
});

// PUT /api/finance/bast/:id — update BAST Balap yang sudah ada
router.put('/finance/bast/:id', cekAkses, async (req, res) => {
  try {
    const {
      nomorSurat, tanggal, namaPekerjaan, nomorKontrak, rekananPelaksana, pihakKedua,
      jenisPekerjaan, periodeAwal, periodeAkhir, items,
      ttdClientNama, ttdClientJabatan, ttdRekananNama, ttdRekananJabatan, pakaiTtdBayhaky, pakaiStempel,
    } = req.body;

    if (!nomorSurat || !nomorSurat.trim()) return res.status(400).json({ message: 'No. Surat wajib diisi' });
    if (!tanggal) return res.status(400).json({ message: 'Tanggal wajib diisi' });
    if (!namaPekerjaan || !namaPekerjaan.trim()) return res.status(400).json({ message: 'Nama pekerjaan wajib diisi' });
    if (!Array.isArray(items) || !items.some((it) => (it.deskripsi || '').trim())) {
      return res.status(400).json({ message: 'Minimal 1 baris summary dengan deskripsi wajib diisi' });
    }

    const diperbarui = await Bast.findByIdAndUpdate(
      req.params.id,
      {
        nomorSurat, tanggal, namaPekerjaan, nomorKontrak, rekananPelaksana, pihakKedua,
        jenisPekerjaan, periodeAwal, periodeAkhir,
        items: items.filter((it) => (it.deskripsi || '').trim()),
        ttdClientNama, ttdClientJabatan, ttdRekananNama, ttdRekananJabatan, pakaiTtdBayhaky, pakaiStempel,
      },
      { new: true, runValidators: true }
    );

    if (!diperbarui) return res.status(404).json({ message: 'BAST Balap tidak ditemukan' });
    res.json({ message: 'BAST Balap berhasil diperbarui', data: diperbarui });
  } catch (err) {
    console.error('Gagal memperbarui BAST Balap:', err);
    res.status(500).json({ message: 'Gagal memperbarui BAST Balap' });
  }
});

// DELETE /api/finance/bast/:id — hapus BAST Balap
router.delete('/finance/bast/:id', cekAkses, async (req, res) => {
  try {
    const dihapus = await Bast.findByIdAndDelete(req.params.id);
    if (!dihapus) return res.status(404).json({ message: 'BAST Balap tidak ditemukan' });
    res.json({ message: 'BAST Balap berhasil dihapus' });
  } catch (err) {
    console.error('Gagal menghapus BAST Balap:', err);
    res.status(500).json({ message: 'Gagal menghapus BAST Balap' });
  }
});

module.exports = router;