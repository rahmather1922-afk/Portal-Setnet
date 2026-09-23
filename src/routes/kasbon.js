const express = require('express');
const Kasbon = require('../models/Kasbon');
const Karyawan = require('../models/Karyawan');
const requireRole = require('../middleware/requireRole');
const { getLimitForKaryawan } = require('../config/kasbonLimit');

const router = express.Router();

// Helper: total kasbon yang masih "aktif" (belum lunas) milik satu karyawan.
// Yang dihitung: kasbon Pending (belum diputuskan) + kasbon Disetujui yang belum lunas.
// Kasbon yang Ditolak tidak dihitung sama sekali.
async function hitungKasbonAktif(karyawan_id) {
  const aktif = await Kasbon.find({
    karyawan_id,
    $or: [{ status: 'Pending' }, { status: 'Disetujui', lunas: false }]
  });
  // Kasbon Pending dihitung penuh (belum ada yang dibayar).
  // Kasbon Disetujui-belum-lunas dihitung dari SISA-nya saja, supaya cicilan/pembayaran
  // sebagian (jumlah_dibayar) langsung membebaskan sebagian limit karyawan.
  return aktif.reduce((total, k) => {
    const sisa = k.status === 'Disetujui' ? Math.max(k.jumlah - (k.jumlah_dibayar || 0), 0) : k.jumlah;
    return total + sisa;
  }, 0);
}

// --- KARYAWAN: CEK SISA LIMIT KASBON SENDIRI ---
router.get('/kasbon/limit/:karyawan_id', async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({ karyawan_id: req.params.karyawan_id });
    if (!karyawan) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });

    const limit = getLimitForKaryawan(karyawan);
    const terpakai = await hitungKasbonAktif(karyawan.karyawan_id);
    res.status(200).json({ limit, terpakai, sisa: Math.max(limit - terpakai, 0) });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data limit kasbon', error: error.message });
  }
});

// --- KARYAWAN: AJUKAN KASBON BARU ---
router.post('/kasbon', async (req, res) => {
  try {
    const {
      karyawan_id, nama, jumlah, alasan,
      region, vendor, metode_pembayaran, penyedia_pembayaran, no_rekening
    } = req.body;
    if (!karyawan_id || !nama || !jumlah) {
      return res.status(400).json({ message: 'ID Karyawan, nama, dan jumlah kasbon wajib diisi!' });
    }
    if (Number(jumlah) <= 0) {
      return res.status(400).json({ message: 'Jumlah kasbon harus lebih dari 0' });
    }
    if (Number(jumlah) < 10000) {
      return res.status(400).json({
        message: `Minimal pengajuan kasbon adalah Rp10.000. Jika maksud Anda Rp${Number(jumlah).toLocaleString('id-ID')} ribu, ketik "${Number(jumlah) * 1000}".`
      });
    }
    if (!region || !vendor) {
      return res.status(400).json({ message: 'Region dan vendor wajib diisi!' });
    }
    if (!['E-Wallet', 'Transfer Bank'].includes(metode_pembayaran)) {
      return res.status(400).json({ message: 'Metode pembayaran harus "E-Wallet" atau "Transfer Bank"' });
    }
    if (!penyedia_pembayaran) {
      return res.status(400).json({
        message: metode_pembayaran === 'E-Wallet'
          ? 'Pilih penyedia e-wallet (Dana/OVO/GoPay/ShopeePay)'
          : 'Pilih nama bank tujuan transfer'
      });
    }
    if (!no_rekening) {
      return res.status(400).json({
        message: metode_pembayaran === 'E-Wallet' ? 'Nomor e-wallet wajib diisi' : 'Nomor rekening wajib diisi'
      });
    }

    const karyawan = await Karyawan.findOne({ karyawan_id });
    if (!karyawan) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });

    const limit = getLimitForKaryawan(karyawan);
    const terpakai = await hitungKasbonAktif(karyawan_id);
    const sisa = limit - terpakai;

    if (Number(jumlah) > sisa) {
      return res.status(400).json({
        message: `Pengajuan melebihi sisa limit kasbon Anda. Limit: Rp${limit.toLocaleString('id-ID')}, sudah terpakai: Rp${terpakai.toLocaleString('id-ID')}, sisa: Rp${Math.max(sisa, 0).toLocaleString('id-ID')}.`
      });
    }

    const kasbonBaru = new Kasbon({
      karyawan_id, nama, jumlah: Number(jumlah), alasan: alasan || '',
      region, vendor, metode_pembayaran, penyedia_pembayaran, no_rekening
    });
    await kasbonBaru.save();
    res.status(201).json({ message: 'Pengajuan kasbon berhasil dikirim, menunggu persetujuan Owner.', data: kasbonBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengajukan kasbon', error: error.message });
  }
});

// --- KARYAWAN: RIWAYAT KASBON MILIK SENDIRI ---
router.get('/kasbon/mine/:karyawan_id', async (req, res) => {
  try {
    const data = await Kasbon.find({ karyawan_id: req.params.karyawan_id }).sort({ tanggal_pengajuan: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat kasbon', error: error.message });
  }
});

// --- KARYAWAN: NOTIFIKASI KASBON YANG SUDAH DIPUTUSKAN OWNER (ACC/TOLAK) ---
// Dipakai halaman "Notifikasi" di app mobile. Hanya menampilkan yang statusnya
// sudah bukan Pending lagi (artinya sudah ada keputusan dari Owner).
router.get('/kasbon/notifikasi/:karyawan_id', async (req, res) => {
  try {
    const data = await Kasbon.find({
      karyawan_id: req.params.karyawan_id,
      status: { $ne: 'Pending' }
    }).sort({ tanggal_keputusan: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil notifikasi kasbon', error: error.message });
  }
});

// --- KARYAWAN: TANDAI NOTIFIKASI KASBON SEBAGAI SUDAH DIBACA ---
router.put('/kasbon/:id/baca', async (req, res) => {
  try {
    const kasbon = await Kasbon.findByIdAndUpdate(
      req.params.id,
      { notif_dibaca: true },
      { new: true }
    );
    if (!kasbon) return res.status(404).json({ message: 'Pengajuan kasbon tidak ditemukan' });
    res.status(200).json({ message: 'Notifikasi ditandai dibaca', data: kasbon });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menandai notifikasi', error: error.message });
  }
});

// --- OWNER & HRD: DAFTAR SELURUH PENGAJUAN KASBON (filter opsional status) ---
// HRD boleh LIHAT daftar kasbon (akses penuh dashboard), tapi approve/tolak
// tetap DIKUNCI khusus 'owner' saja di endpoint /keputusan di bawah.
router.get('/kasbon', requireRole('owner', 'hrd'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['Pending', 'Disetujui', 'Ditolak'].includes(status)) filter.status = status;
    const data = await Kasbon.find(filter).sort({ tanggal_pengajuan: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kasbon', error: error.message });
  }
});

// --- OWNER SAJA: ACC / TOLAK PENGAJUAN KASBON ---
// SENGAJA hanya 'owner' (HRD TIDAK termasuk, meskipun HRD akses penuh di modul lain) —
// sesuai keputusan bisnis: approve kasbon murni kewenangan Owner.
router.put('/kasbon/:id/keputusan', requireRole('owner'), async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    if (!['Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status keputusan harus "Disetujui" atau "Ditolak"' });
    }
    const diputuskan_oleh = req.header('x-user-id') || '';
    const kasbon = await Kasbon.findByIdAndUpdate(
      req.params.id,
      { status, catatan_admin: catatan_admin || '', diputuskan_oleh, tanggal_keputusan: new Date() },
      { new: true }
    );
    if (!kasbon) return res.status(404).json({ message: 'Pengajuan kasbon tidak ditemukan' });
    res.status(200).json({ message: `Kasbon berhasil di-${status.toLowerCase()}`, data: kasbon });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memproses keputusan kasbon', error: error.message });
  }
});

// --- OWNER / FINANCE: TANDAI KASBON SUDAH LUNAS PENUH (dipotong dari gaji / dibayar semua sekaligus) ---
router.put('/kasbon/:id/lunas', requireRole('owner', 'finance'), async (req, res) => {
  try {
    const kasbon = await Kasbon.findById(req.params.id);
    if (!kasbon) return res.status(404).json({ message: 'Pengajuan kasbon tidak ditemukan' });
    if (kasbon.status !== 'Disetujui') {
      return res.status(400).json({ message: 'Hanya kasbon yang sudah Disetujui yang bisa ditandai lunas' });
    }
    kasbon.jumlah_dibayar = kasbon.jumlah; // lunas penuh = sisa jadi 0
    kasbon.lunas = true;
    kasbon.tanggal_lunas = new Date();
    await kasbon.save();
    res.status(200).json({ message: 'Kasbon ditandai lunas', data: kasbon });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menandai kasbon lunas', error: error.message });
  }
});

// --- OWNER / FINANCE: CATAT PEMBAYARAN KASBON (BISA SEBAGIAN / CICILAN) ---
// Dipakai kalau karyawan bayar cash/transfer tidak sekaligus lunas, mis. hutang 300rb baru
// bayar 200rb -> sisa 100rb tetap tercatat & tetap mengurangi limit kasbon yang terpakai.
router.put('/kasbon/:id/bayar', requireRole('owner', 'finance'), async (req, res) => {
  try {
    const { jumlah_bayar } = req.body;
    const bayar = Number(jumlah_bayar);
    if (!bayar || bayar <= 0) {
      return res.status(400).json({ message: 'Jumlah bayar harus lebih dari 0' });
    }

    const kasbon = await Kasbon.findById(req.params.id);
    if (!kasbon) return res.status(404).json({ message: 'Pengajuan kasbon tidak ditemukan' });
    if (kasbon.status !== 'Disetujui') {
      return res.status(400).json({ message: 'Hanya kasbon yang sudah Disetujui yang bisa dicatat pembayarannya' });
    }
    if (kasbon.lunas) {
      return res.status(400).json({ message: 'Kasbon ini sudah lunas' });
    }

    const sisaSaatIni = kasbon.jumlah - (kasbon.jumlah_dibayar || 0);
    if (bayar > sisaSaatIni) {
      return res.status(400).json({
        message: `Jumlah bayar melebihi sisa hutang. Sisa hutang saat ini: Rp${sisaSaatIni.toLocaleString('id-ID')}.`
      });
    }

    kasbon.jumlah_dibayar = (kasbon.jumlah_dibayar || 0) + bayar;
    const lunasSekarang = kasbon.jumlah_dibayar >= kasbon.jumlah;
    if (lunasSekarang) {
      kasbon.lunas = true;
      kasbon.tanggal_lunas = new Date();
    }
    await kasbon.save();

    const sisaBaru = Math.max(kasbon.jumlah - kasbon.jumlah_dibayar, 0);
    res.status(200).json({
      message: lunasSekarang
        ? 'Pembayaran tercatat, kasbon kini LUNAS'
        : `Pembayaran sebagian tercatat. Sisa hutang: Rp${sisaBaru.toLocaleString('id-ID')}.`,
      data: kasbon
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat pembayaran kasbon', error: error.message });
  }
});

module.exports = router;