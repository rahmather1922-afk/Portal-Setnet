const express = require('express');
const TrackingBast = require('../models/TrackingBast');
const Transaksi = require('../models/Transaksi');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Modul Tracking BAST: Owner (termasuk akun legacy 'hrd') dan sekarang Finance
// juga punya akses penuh (samakan dengan MENU_ACCESS.tracking di admin.js).
// Admin & gudang TETAP tidak dibuka — data ini sensitif secara bisnis.
const OWNER_ONLY = requireRole('owner', 'hrd', 'finance');

// --- TRACKING: DAFTAR SELURUH DATA (dengan filter opsional) ---
router.get('/tracking', OWNER_ONLY, async (req, res) => {
  try {
    const { region, status, woType, tahun } = req.query;
    const filter = {};
    if (region) filter.region = region;
    if (status) filter.status = status;
    if (woType) filter.woType = woType;
    if (tahun) filter.tahun = Number(tahun);
    const data = await TrackingBast.find(filter).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data tracking', error: error.message });
  }
});

// --- TRACKING: TAMBAH DATA BARU ---
router.post('/tracking', OWNER_ONLY, async (req, res) => {
  try {
    console.log("===== REQUEST BODY =====");
    console.log(req.body);

    const { region, tahun, woType, status } = req.body;

    if (!region || !tahun || !woType || !status) {
      return res.status(400).json({
        message: 'Region, tahun, jenis WO, dan status wajib diisi!'
      });
    }

    const dibuat_oleh = req.header('x-user-id') || '';

    const dataBaru = new TrackingBast({
      ...req.body,
      dibuat_oleh
    });

    console.log("===== DOCUMENT =====");
    console.log(dataBaru);

    await dataBaru.save();

    console.log("===== BERHASIL DISIMPAN =====");

    res.status(201).json({
      message: 'Data tracking berhasil ditambahkan!',
      data: dataBaru
    });

  } catch (error) {

    console.error("===============================");
    console.error(error);
    console.error(error.stack);
    console.error("===============================");

    res.status(500).json({
      message: error.message
    });

  }
});

// --- TRACKING: EDIT DATA ---
router.put('/tracking/:id', OWNER_ONLY, async (req, res) => {
  try {
    const diupdate = await TrackingBast.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!diupdate) return res.status(404).json({ message: 'Data tracking tidak ditemukan' });
    res.status(200).json({ message: 'Data tracking berhasil diperbarui', data: diupdate });
  } catch (error) {
    console.error('❌ Gagal memperbarui data tracking:', error);
    res.status(500).json({ message: 'Gagal memperbarui data tracking: ' + error.message, error: error.message });
  }
});

// --- TRACKING: HAPUS DATA ---
router.delete('/tracking/:id', OWNER_ONLY, async (req, res) => {
  try {
    const dihapus = await TrackingBast.findByIdAndDelete(req.params.id);
    if (!dihapus) return res.status(404).json({ message: 'Data tracking tidak ditemukan' });
    res.status(200).json({ message: 'Data tracking berhasil dihapus', data: { _id: dihapus._id } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data tracking', error: error.message });
  }
});

// --- TRACKING: TANDAI BAST FINAL -> PROSES FINANCE (dipicu tombol "+" Buat Invoice di Portal Admin) ---
// Dipanggil FE setelah Invoice berhasil dibuat dari baris tracking ini, supaya:
//  1. Status tracking otomatis pindah dari "BAST Final" -> "Proses Finance"
//  2. invoice_id disimpan sebagai linking balik ke Invoice yang baru dibuat
//  3. Tombol "+" di baris ini hilang (tidak bisa dobel-buat invoice untuk dokumen yang sama)
router.put('/tracking/:id/proses-finance', requireRole('owner', 'hrd', 'finance'), async (req, res) => {
  try {
    const { invoice_id } = req.body;
    const trk = await TrackingBast.findById(req.params.id);
    if (!trk) return res.status(404).json({ message: 'Data tracking tidak ditemukan' });
    if (trk.status !== 'BAST Final') {
      return res.status(400).json({ message: 'Hanya dokumen berstatus BAST Final yang bisa diproses ke Finance' });
    }
    trk.status = 'Proses Finance';
    trk.invoice_id = invoice_id || null;
    await trk.save();
    res.status(200).json({ message: 'Dokumen ditandai Proses Finance', data: trk });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memproses dokumen ke Finance', error: error.message });
  }
});

// --- TRACKING: TANDAI PROSES FINANCE -> DONE INVOICE (dipicu tombol dompet di Portal Admin) ---
// Dipanggil FE saat user meng-klik tombol "Catat ke Keuangan" pada baris berstatus "Proses
// Finance". Endpoint ini akan:
//  1. Membuat 1 transaksi "Masuk" baru di modul Keuangan (Transaksi) sebesar `jumlah` yang dikirim
//  2. Memindahkan status tracking dari "Proses Finance" -> "Done Invoice"
// Guard status di server (bukan cuma di FE) supaya baris yang sama tidak bisa dicatat dobel ke
// saldo Keuangan walau tombolnya di-klik berkali-kali/dua tab berbeda.
router.put('/tracking/:id/catat-keuangan', requireRole('owner', 'hrd', 'finance'), async (req, res) => {
  try {
    const trk = await TrackingBast.findById(req.params.id);
    if (!trk) return res.status(404).json({ message: 'Data tracking tidak ditemukan' });
    if (trk.status !== 'Proses Finance') {
      return res.status(400).json({ message: 'Hanya dokumen berstatus Proses Finance yang bisa dicatat ke Keuangan' });
    }

    const { jumlah } = req.body;
    const nominal = Number(jumlah);
    if (!nominal || nominal <= 0) {
      return res.status(400).json({ message: 'Jumlah tidak valid' });
    }

    const dibuat_oleh = req.header('x-user-id') || '';
    const transaksiBaru = new Transaksi({
      tanggal: new Date(),
      tipe: 'Masuk',
      kategori: 'Pencairan Invoice Tracking BAST',
      jumlah: nominal,
      metode: 'Transfer',
      keterangan: `Pencairan ${trk.region} - ${trk.woType}${trk.bulan ? ` (${trk.bulan} ${trk.tahun})` : ` (${trk.tahun})`}`,
      dibuat_oleh
    });
    await transaksiBaru.save();

    trk.status = 'Done Invoice';
    await trk.save();

    res.status(200).json({ message: 'Berhasil dicatat sebagai uang masuk di Keuangan', data: { tracking: trk, transaksi: transaksiBaru } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat ke Keuangan', error: error.message });
  }
});

// --- NOTIFIKASI RINGKAS DOKUMEN BAST FINAL YANG BELUM DIBUATKAN INVOICE ---
// Sebelumnya dipakai khusus untuk role yang punya akses Invoice tapi TIDAK punya akses
// Tracking penuh. Sekarang Finance sudah punya akses Tracking penuh (lihat OWNER_ONLY di
// atas), endpoint ini masih dipertahankan untuk kompatibilitas FE, admin dicabut karena
// admin sudah tidak lagi punya akses Invoice.
router.get('/tracking/notif-finance', requireRole('owner', 'hrd', 'finance'), async (req, res) => {
  try {
    const menunggu = await TrackingBast.find({ status: 'BAST Final' })
      .select('region woType nilaiAsianet tahun bulan batch')
      .sort({ createdAt: -1 });
    res.status(200).json({ jumlah: menunggu.length, data: menunggu });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil notifikasi finance', error: error.message });
  }
});

// --- TRACKING: REKAP RINGKASAN (per Region x Status, mirip sheet "Rekap") ---
router.get('/tracking/summary', OWNER_ONLY, async (req, res) => {
  try {
    const semua = await TrackingBast.find();
    const STATUSES = ['Waiting Submit', 'Waiting BAST Final', 'BAST Final', 'Proses Finance', 'Done Invoice'];

    const regionMap = {};
    semua.forEach(d => {
      if (!regionMap[d.region]) {
        regionMap[d.region] = {
          region: d.region,
          perStatus: Object.fromEntries(STATUSES.map(s => [s, { jumlahWO: 0, nilaiAsianet: 0, count: 0 }]))
        };
      }
      const bucket = regionMap[d.region].perStatus[d.status];
      if (bucket) {
        bucket.jumlahWO += d.jumlahWO || 0;
        bucket.nilaiAsianet += d.nilaiAsianet || 0;
        bucket.count += 1;
      }
    });

    const perRegion = Object.values(regionMap).sort((a, b) => a.region.localeCompare(b.region));

    const grandTotal = Object.fromEntries(STATUSES.map(s => [s, { jumlahWO: 0, nilaiAsianet: 0, count: 0 }]));
    perRegion.forEach(r => {
      STATUSES.forEach(s => {
        grandTotal[s].jumlahWO += r.perStatus[s].jumlahWO;
        grandTotal[s].nilaiAsianet += r.perStatus[s].nilaiAsianet;
        grandTotal[s].count += r.perStatus[s].count;
      });
    });

    res.status(200).json({ perRegion, grandTotal, totalEntri: semua.length });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil rekap tracking', error: error.message });
  }
});

module.exports = router;