const express = require('express');
const Aset = require('../models/Aset');
const AsetLog = require('../models/AsetLog');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Sengaja pakai role yang SAMA dengan modul Pemakaian Material (routes/material.js):
// admin, gudang, korlap, owner, hrd boleh kelola; finance tidak akses modul ini.
const MANAGE_ROLES = requireRole('admin', 'gudang', 'korlap', 'owner', 'hrd');
const VIEW_ROLES = requireRole('admin', 'gudang', 'korlap', 'owner', 'hrd');

// ==================== MASTER DATA ASET (CRUD) ====================

// --- DAFTAR SELURUH ASET (filter opsional ?kategori=&status=) ---
router.get('/asset', VIEW_ROLES, async (req, res) => {
  try {
    const { kategori, status } = req.query;
    const filter = {};
    if (kategori) filter.kategori = kategori;
    if (status) filter.status = status;
    const data = await Aset.find(filter).sort({ kategori: 1, nama: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data aset', error: error.message });
  }
});

// --- TAMBAH ASET BARU (1 unit fisik) ---
router.post('/asset', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, nama, kode_aset, merek, kondisi, keterangan } = req.body;
    if (!nama) {
      return res.status(400).json({ message: 'Nama/jenis aset wajib diisi!' });
    }
    const dibuat_oleh = req.header('x-user-id') || '';
    const asetBaru = new Aset({
      kategori: kategori || 'Alat Fiber Optic',
      nama: String(nama).trim(),
      kode_aset: kode_aset || '',
      merek: merek || '',
      kondisi: kondisi || 'Baik',
      status: 'Tersedia',
      keterangan: keterangan || '',
      dibuat_oleh
    });
    await asetBaru.save();
    res.status(201).json({ message: 'Aset berhasil ditambahkan', data: asetBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan aset', error: error.message });
  }
});

// --- EDIT ASET (data master saja: nama/kategori/kode/merek/kondisi/keterangan) ---
// Untuk pindah tangan (siapa yang pegang) & status Dipakai/Tersedia, WAJIB lewat endpoint
// /asset/:id/serah-terima & /asset/:id/pengembalian di bawah supaya riwayatnya tercatat.
router.put('/asset/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, nama, kode_aset, merek, kondisi, status, keterangan } = req.body;
    const updateData = { kategori, nama, kode_aset, merek, keterangan };
    if (kondisi) updateData.kondisi = kondisi;
    // Status boleh diubah manual lewat form Edit HANYA untuk transisi ke/dari "Maintenance"
    // atau "Hilang" (mis. aset lagi diservis atau dilaporkan hilang) — bukan "Dipakai".
    if (status && ['Tersedia', 'Maintenance', 'Hilang'].includes(status)) {
      updateData.status = status;
      if (status !== 'Dipakai') { updateData.dipegang_oleh_id = ''; updateData.dipegang_oleh_nama = ''; }
    }

    const diupdate = await Aset.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!diupdate) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    res.status(200).json({ message: 'Aset berhasil diperbarui', data: diupdate });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui aset', error: error.message });
  }
});

// --- HAPUS ASET (tidak boleh kalau statusnya masih "Dipakai" — harus dikembalikan dulu) ---
router.delete('/asset/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const aset = await Aset.findById(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    if (aset.status === 'Dipakai') {
      return res.status(400).json({ message: `Aset masih dipegang oleh ${aset.dipegang_oleh_nama || 'teknisi'}. Kembalikan dulu sebelum dihapus.` });
    }
    await Aset.findByIdAndDelete(req.params.id);
    await AsetLog.deleteMany({ aset_id: req.params.id });
    res.status(200).json({ message: 'Aset berhasil dihapus', data: { _id: aset._id } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus aset', error: error.message });
  }
});

// ==================== SERAH TERIMA / PENGEMBALIAN ====================

// --- SERAH TERIMA ASET KE TEKNISI (aset harus berstatus "Tersedia") ---
router.post('/asset/:id/serah-terima', MANAGE_ROLES, async (req, res) => {
  try {
    const { teknisi_id, teknisi_nama, tanggal, keterangan } = req.body;
    if (!teknisi_nama) {
      return res.status(400).json({ message: 'Nama teknisi wajib diisi!' });
    }
    const aset = await Aset.findById(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    if (aset.status !== 'Tersedia') {
      return res.status(400).json({ message: `Aset "${aset.nama}" sedang tidak tersedia (status: ${aset.status}).` });
    }

    const tanggalFinal = tanggal ? new Date(tanggal) : new Date();
    aset.status = 'Dipakai';
    aset.dipegang_oleh_id = teknisi_id || '';
    aset.dipegang_oleh_nama = teknisi_nama;
    aset.tanggal_serah_terima = tanggalFinal;
    await aset.save();

    const dibuat_oleh = req.header('x-user-id') || '';
    const log = new AsetLog({
      aset_id: aset._id,
      aset_nama: aset.nama,
      tipe: 'Serah Terima',
      teknisi_id: teknisi_id || '',
      teknisi_nama,
      keterangan: keterangan || '',
      tanggal: tanggalFinal,
      dibuat_oleh
    });
    await log.save();
    res.status(200).json({ message: `Aset "${aset.nama}" berhasil diserahkan ke ${teknisi_nama}`, data: aset });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat serah terima aset', error: error.message });
  }
});

// --- PENGEMBALIAN ASET KE GUDANG (aset harus berstatus "Dipakai") ---
router.post('/asset/:id/pengembalian', MANAGE_ROLES, async (req, res) => {
  try {
    const { kondisi, keterangan, tanggal } = req.body;
    const aset = await Aset.findById(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    if (aset.status !== 'Dipakai') {
      return res.status(400).json({ message: `Aset "${aset.nama}" sedang tidak dalam status Dipakai.` });
    }

    const teknisiSebelumId = aset.dipegang_oleh_id;
    const teknisiSebelumNama = aset.dipegang_oleh_nama;
    const tanggalFinal = tanggal ? new Date(tanggal) : new Date();

    aset.status = 'Tersedia';
    aset.dipegang_oleh_id = '';
    aset.dipegang_oleh_nama = '';
    if (kondisi && ['Baik', 'Rusak Ringan', 'Rusak Berat'].includes(kondisi)) aset.kondisi = kondisi;
    await aset.save();

    const dibuat_oleh = req.header('x-user-id') || '';
    const log = new AsetLog({
      aset_id: aset._id,
      aset_nama: aset.nama,
      tipe: 'Pengembalian',
      teknisi_id: teknisiSebelumId,
      teknisi_nama: teknisiSebelumNama,
      kondisi: kondisi || '',
      keterangan: keterangan || '',
      tanggal: tanggalFinal,
      dibuat_oleh
    });
    await log.save();
    res.status(200).json({ message: `Aset "${aset.nama}" berhasil dikembalikan ke gudang`, data: aset });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat pengembalian aset', error: error.message });
  }
});

// ==================== RIWAYAT (LOG) ====================

// --- RIWAYAT SERAH TERIMA/PENGEMBALIAN (filter opsional ?aset_id=) ---
router.get('/asset/log', VIEW_ROLES, async (req, res) => {
  try {
    const { aset_id } = req.query;
    const filter = {};
    if (aset_id) filter.aset_id = aset_id;
    const data = await AsetLog.find(filter).sort({ tanggal: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat aset', error: error.message });
  }
});

module.exports = router;
