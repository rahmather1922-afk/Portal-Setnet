const express = require('express');
const Pengajuan = require('../models/Pengajuan');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// --- KARYAWAN: AJUKAN CUTI / IZIN / SAKIT ---
router.post('/pengajuan', async (req, res) => {
  try {
    const { karyawan_id, nama, jenis, tanggal_mulai, tanggal_selesai, alasan, lampiran } = req.body;
    if (!karyawan_id || !nama || !jenis || !tanggal_mulai || !tanggal_selesai) {
      return res.status(400).json({ message: 'ID Karyawan, jenis, dan tanggal wajib diisi!' });
    }
    if (!['Cuti', 'Izin', 'Sakit'].includes(jenis)) {
      return res.status(400).json({ message: 'Jenis pengajuan harus Cuti, Izin, atau Sakit' });
    }
    const mulai = new Date(tanggal_mulai);
    const selesai = new Date(tanggal_selesai);
    if (selesai < mulai) {
      return res.status(400).json({ message: 'Tanggal selesai tidak boleh sebelum tanggal mulai' });
    }

    const pengajuanBaru = new Pengajuan({
      karyawan_id, nama, jenis,
      tanggal_mulai: mulai, tanggal_selesai: selesai,
      alasan: alasan || '', lampiran: lampiran || ''
    });
    await pengajuanBaru.save();
    res.status(201).json({ message: `Pengajuan ${jenis} berhasil dikirim, menunggu persetujuan Owner.`, data: pengajuanBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim pengajuan', error: error.message });
  }
});

// --- KARYAWAN: RIWAYAT PENGAJUAN MILIK SENDIRI ---
router.get('/pengajuan/mine/:karyawan_id', async (req, res) => {
  try {
    const data = await Pengajuan.find({ karyawan_id: req.params.karyawan_id }).sort({ tanggal_pengajuan: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat pengajuan', error: error.message });
  }
});

// --- KARYAWAN: NOTIFIKASI PENGAJUAN YANG SUDAH DIPUTUSKAN OWNER/HRD (ACC/TOLAK) ---
// Dipakai halaman "Notifikasi" di app mobile. Hanya menampilkan yang statusnya
// sudah bukan Pending lagi (artinya sudah ada keputusan dari Owner/HRD).
router.get('/pengajuan/notifikasi/:karyawan_id', async (req, res) => {
  try {
    const data = await Pengajuan.find({
      karyawan_id: req.params.karyawan_id,
      status: { $ne: 'Pending' }
    }).sort({ tanggal_keputusan: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil notifikasi pengajuan', error: error.message });
  }
});

// --- KARYAWAN: TANDAI NOTIFIKASI PENGAJUAN SEBAGAI SUDAH DIBACA ---
router.put('/pengajuan/:id/baca', async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findByIdAndUpdate(
      req.params.id,
      { notif_dibaca: true },
      { new: true }
    );
    if (!pengajuan) return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    res.status(200).json({ message: 'Notifikasi ditandai dibaca', data: pengajuan });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menandai notifikasi', error: error.message });
  }
});

// --- OWNER & HRD: DAFTAR SELURUH PENGAJUAN (filter opsional jenis/status) ---
router.get('/pengajuan', requireRole('owner', 'hrd'), async (req, res) => {
  try {
    const { jenis, status } = req.query;
    const filter = {};
    if (jenis && ['Cuti', 'Izin', 'Sakit'].includes(jenis)) filter.jenis = jenis;
    if (status && ['Pending', 'Disetujui', 'Ditolak'].includes(status)) filter.status = status;
    const data = await Pengajuan.find(filter).sort({ tanggal_pengajuan: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pengajuan', error: error.message });
  }
});

// --- OWNER & HRD: ACC / TOLAK PENGAJUAN ---
// HRD BOLEH approve Cuti/Izin/Sakit (beda dengan Kasbon yang khusus Owner).
router.put('/pengajuan/:id/keputusan', requireRole('owner', 'hrd'), async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    if (!['Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status keputusan harus "Disetujui" atau "Ditolak"' });
    }
    const diputuskan_oleh = req.header('x-user-id') || '';
    const pengajuan = await Pengajuan.findByIdAndUpdate(
      req.params.id,
      { status, catatan_admin: catatan_admin || '', diputuskan_oleh, tanggal_keputusan: new Date() },
      { new: true }
    );
    if (!pengajuan) return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    res.status(200).json({ message: `Pengajuan berhasil di-${status.toLowerCase()}`, data: pengajuan });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memproses keputusan pengajuan', error: error.message });
  }
});

module.exports = router;