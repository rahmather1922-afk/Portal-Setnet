const mongoose = require('mongoose');

// Schema Transaksi Keuangan (Uang Masuk / Keluar) — dikelola oleh Staf Finance & Owner
const transaksiSchema = new mongoose.Schema({
  tanggal: { type: Date, required: true, default: Date.now },
  tipe: { type: String, enum: ['Masuk', 'Keluar'], required: true },
  kategori: { type: String, required: true },      // ex: Penjualan, Gaji, Operasional, Sewa, dll
  jumlah: { type: Number, required: true, min: 0 },
  metode: { type: String, default: 'Transfer' },   // Transfer, Cash, dll
  keterangan: { type: String, default: '' },
  dibuat_oleh: { type: String, default: '' },       // karyawan_id staf yang menginput
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaksi', transaksiSchema);
