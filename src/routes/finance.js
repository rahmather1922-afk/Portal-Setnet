const express = require('express');
const Transaksi = require('../models/Transaksi');
const Invoice = require('../models/Invoice');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Role yang boleh mengakses modul Invoice/Penagihan (samakan dengan MENU_ACCESS.invoice di admin.js)
// Admin TIDAK lagi punya akses Invoice sesuai pembagian tugas terbaru — khusus Finance & Owner/hrd.
const INVOICE_ROLES = requireRole('finance', 'owner', 'hrd');

// Role yang boleh mengakses modul Keuangan (samakan dengan MENU_ACCESS.keuangan di admin.js) — hrd akses penuh.
const KEUANGAN_ROLES = requireRole('finance', 'owner', 'hrd');

// ==================== ENDPOINT MODUL KEUANGAN (STAF FINANCE, OWNER & HRD) ====================

// --- FINANCE: TAMBAH TRANSAKSI UANG MASUK / KELUAR ---
router.post('/finance/transaksi', KEUANGAN_ROLES, async (req, res) => {
  try {
    const { tanggal, tipe, kategori, jumlah, metode, keterangan } = req.body;
    if (!tipe || !kategori || jumlah === undefined || jumlah === null) {
      return res.status(400).json({ message: 'Tipe, kategori, dan jumlah wajib diisi!' });
    }
    if (!['Masuk', 'Keluar'].includes(tipe)) {
      return res.status(400).json({ message: 'Tipe transaksi harus "Masuk" atau "Keluar"' });
    }
    const dibuat_oleh = req.header('x-user-id') || '';
    const transaksiBaru = new Transaksi({
      tanggal: tanggal ? new Date(tanggal) : new Date(),
      tipe, kategori, jumlah: Number(jumlah), metode: metode || 'Transfer', keterangan: keterangan || '',
      dibuat_oleh
    });
    await transaksiBaru.save();
    res.status(201).json({ message: 'Transaksi berhasil dicatat!', data: transaksiBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat transaksi', error: error.message });
  }
});

// --- FINANCE: DAFTAR SELURUH TRANSAKSI (dengan filter opsional tanggal/tipe) ---
router.get('/finance/transaksi', KEUANGAN_ROLES, async (req, res) => {
  try {
    const { dari, sampai, tipe } = req.query;
    const filter = {};
    if (tipe && ['Masuk', 'Keluar'].includes(tipe)) filter.tipe = tipe;
    if (dari || sampai) {
      filter.tanggal = {};
      if (dari) filter.tanggal.$gte = new Date(dari);
      if (sampai) filter.tanggal.$lte = new Date(sampai + 'T23:59:59');
    }
    const data = await Transaksi.find(filter).sort({ tanggal: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data transaksi', error: error.message });
  }
});

// --- FINANCE: EDIT TRANSAKSI ---
router.put('/finance/transaksi/:id', KEUANGAN_ROLES, async (req, res) => {
  try {
    const { tanggal, tipe, kategori, jumlah, metode, keterangan } = req.body;
    const updateData = { kategori, metode, keterangan };
    if (tanggal) updateData.tanggal = new Date(tanggal);
    if (tipe && ['Masuk', 'Keluar'].includes(tipe)) updateData.tipe = tipe;
    if (jumlah !== undefined && jumlah !== null) updateData.jumlah = Number(jumlah);

    const diupdate = await Transaksi.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!diupdate) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    res.status(200).json({ message: 'Transaksi berhasil diperbarui', data: diupdate });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui transaksi', error: error.message });
  }
});

// --- FINANCE: HAPUS TRANSAKSI ---
router.delete('/finance/transaksi/:id', KEUANGAN_ROLES, async (req, res) => {
  try {
    const dihapus = await Transaksi.findByIdAndDelete(req.params.id);
    if (!dihapus) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    res.status(200).json({ message: 'Transaksi berhasil dihapus', data: { _id: dihapus._id } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus transaksi', error: error.message });
  }
});

// --- FINANCE: RINGKASAN / SUMMARY (total masuk, keluar, saldo, per kategori & per bulan) ---
router.get('/finance/summary', KEUANGAN_ROLES, async (req, res) => {
  try {
    const semua = await Transaksi.find();
    const totalMasuk = semua.filter(t => t.tipe === 'Masuk').reduce((a, b) => a + b.jumlah, 0);
    const totalKeluar = semua.filter(t => t.tipe === 'Keluar').reduce((a, b) => a + b.jumlah, 0);
    res.status(200).json({
      totalMasuk, totalKeluar, saldo: totalMasuk - totalKeluar, totalTransaksi: semua.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil ringkasan keuangan', error: error.message });
  }
});

// ==================== ENDPOINT MODUL INVOICE / PENAGIHAN (ADMIN, FINANCE & OWNER) ====================

// --- DAFTAR SELURUH INVOICE (filter opsional status) ---
router.get('/finance/invoice', INVOICE_ROLES, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['Belum Dibayar', 'Lunas'].includes(status)) filter.status = status;
    const data = await Invoice.find(filter).sort({ tanggal: -1, createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data invoice', error: error.message });
  }
});

// --- BUAT INVOICE BARU ---
router.post('/finance/invoice', INVOICE_ROLES, async (req, res) => {
  try {
    const {
      nomor, tanggal, po_number, jatuh_tempo,
      bill_nama, bill_alamat, ship_sama, ship_nama, ship_alamat,
      items, pinalty, less_deposit, denda_setelah_ppn, pungutan_ppn, status,
      rek_bank, rek_nomor, rek_kota, ttd_nama, ttd_jabatan
    } = req.body;

    if (!nomor || !tanggal || !bill_nama) {
      return res.status(400).json({ message: 'Invoice No, tanggal, dan nama penerima tagihan wajib diisi!' });
    }
    if (!Array.isArray(items) || items.filter(it => it.deskripsi && it.deskripsi.trim()).length === 0) {
      return res.status(400).json({ message: 'Minimal 1 item dengan deskripsi wajib diisi' });
    }

    const nomorDipakai = await Invoice.findOne({ nomor });
    if (nomorDipakai) {
      return res.status(400).json({ message: `Invoice No "${nomor}" sudah dipakai, gunakan nomor lain` });
    }

    const dibuat_oleh = req.header('x-user-id') || '';
    const invoiceBaru = new Invoice({
      nomor, tanggal: new Date(tanggal), po_number: po_number || '',
      jatuh_tempo: jatuh_tempo ? new Date(jatuh_tempo) : null,
      bill_nama, bill_alamat: bill_alamat || '',
      ship_sama: !!ship_sama, ship_nama: ship_nama || '', ship_alamat: ship_alamat || '',
      items,
      pinalty: Number(pinalty) || 0, less_deposit: Number(less_deposit) || 0,
      denda_setelah_ppn: Number(denda_setelah_ppn) || 0, pungutan_ppn: Number(pungutan_ppn) || 0,
      status: status || 'Belum Dibayar',
      rek_bank: rek_bank || '', rek_nomor: rek_nomor || '', rek_kota: rek_kota || '',
      ttd_nama: ttd_nama || '', ttd_jabatan: ttd_jabatan || 'Direktur',
      dibuat_oleh
    });
    await invoiceBaru.save();
    res.status(201).json({ message: 'Invoice berhasil dibuat', data: invoiceBaru });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Invoice No sudah dipakai, gunakan nomor lain' });
    }
    res.status(500).json({ message: 'Gagal membuat invoice', error: error.message });
  }
});

// --- EDIT INVOICE ---
router.put('/finance/invoice/:id', INVOICE_ROLES, async (req, res) => {
  try {
    const {
      nomor, tanggal, po_number, jatuh_tempo,
      bill_nama, bill_alamat, ship_sama, ship_nama, ship_alamat,
      items, pinalty, less_deposit, denda_setelah_ppn, pungutan_ppn, status,
      rek_bank, rek_nomor, rek_kota, ttd_nama, ttd_jabatan
    } = req.body;

    const updateData = {
      nomor, po_number: po_number || '', bill_nama, bill_alamat: bill_alamat || '',
      ship_sama: !!ship_sama, ship_nama: ship_nama || '', ship_alamat: ship_alamat || '',
      pinalty: Number(pinalty) || 0, less_deposit: Number(less_deposit) || 0,
      denda_setelah_ppn: Number(denda_setelah_ppn) || 0, pungutan_ppn: Number(pungutan_ppn) || 0,
      rek_bank: rek_bank || '', rek_nomor: rek_nomor || '', rek_kota: rek_kota || '',
      ttd_nama: ttd_nama || '', ttd_jabatan: ttd_jabatan || 'Direktur'
    };
    if (tanggal) updateData.tanggal = new Date(tanggal);
    updateData.jatuh_tempo = jatuh_tempo ? new Date(jatuh_tempo) : null;
    if (Array.isArray(items) && items.length > 0) updateData.items = items;
    if (status && ['Belum Dibayar', 'Lunas'].includes(status)) updateData.status = status;

    const diupdate = await Invoice.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!diupdate) return res.status(404).json({ message: 'Invoice tidak ditemukan' });
    res.status(200).json({ message: 'Invoice berhasil diperbarui', data: diupdate });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Invoice No sudah dipakai, gunakan nomor lain' });
    }
    res.status(500).json({ message: 'Gagal memperbarui invoice', error: error.message });
  }
});

// --- HAPUS INVOICE ---
router.delete('/finance/invoice/:id', INVOICE_ROLES, async (req, res) => {
  try {
    const dihapus = await Invoice.findByIdAndDelete(req.params.id);
    if (!dihapus) return res.status(404).json({ message: 'Invoice tidak ditemukan' });
    res.status(200).json({ message: 'Invoice berhasil dihapus', data: { _id: dihapus._id } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus invoice', error: error.message });
  }
});

// --- CATAT PEMBAYARAN INVOICE (STATUS LUNAS) KE MODUL KEUANGAN ---
// Membuat 1 transaksi "Masuk" otomatis (kategori tetap: Pembayaran Tagihan Pelanggan, metode: Transfer)
// dan menandai invoice supaya tidak bisa dicatat dobel ke saldo.
router.put('/finance/invoice/:id/catat-keuangan', INVOICE_ROLES, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice tidak ditemukan' });
    if (invoice.status !== 'Lunas') {
      return res.status(400).json({ message: 'Hanya invoice berstatus Lunas yang bisa dicatat ke Keuangan' });
    }
    if (invoice.dicatat_keuangan) {
      return res.status(400).json({ message: 'Invoice ini sudah pernah dicatat ke Keuangan' });
    }

    const { jumlah } = req.body;
    const nominal = Number(jumlah);
    if (!nominal || nominal <= 0) {
      return res.status(400).json({ message: 'Jumlah pembayaran tidak valid' });
    }

    const dibuat_oleh = req.header('x-user-id') || '';
    const transaksiBaru = new Transaksi({
      tanggal: new Date(),
      tipe: 'Masuk',
      kategori: 'Pembayaran Tagihan Pelanggan',
      jumlah: nominal,
      metode: 'Transfer',
      keterangan: `Pembayaran invoice ${invoice.nomor} - ${invoice.bill_nama}`,
      dibuat_oleh
    });
    await transaksiBaru.save();

    invoice.dicatat_keuangan = true;
    await invoice.save();

    res.status(201).json({ message: 'Pembayaran invoice berhasil dicatat ke Keuangan', data: transaksiBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat pembayaran invoice ke Keuangan', error: error.message });
  }
});

module.exports = router;