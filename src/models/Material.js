const mongoose = require('mongoose');

// Schema Master Data Material — meniru tabel ringkasan "MATRIAL MASUK" di Excel
// (kolom I:L pada sheet JUNI -> Kabel | Stok Awal | idle | Terpakai).
// Satu dokumen = satu JENIS material PER Penggunaan (IB/MT), contoh: Kabel "100 M" (IB)
// dan Kabel "100 M" (MT) adalah 2 dokumen terpisah dengan stok masing-masing — supaya
// material yang dipakai utk Instalasi Baru tidak tercampur stoknya dengan yang dipakai
// utk Maintenance.
// stock_awal diisi manual oleh admin/gudang (sama seperti kolom "Stok Awal" di Excel).
// stock       = jumlah TERKINI, berubah otomatis setiap ada:
//                - log Pemakaian (lihat models/PemakaianMaterial.js) -> stock BERKURANG
//                - log Penambahan / Pengembalian (lihat models/MaterialStokLog.js) -> stock BERTAMBAH
const materialSchema = new mongoose.Schema({
  kategori: { type: String, enum: ['Kabel', 'ONT', 'Lainnya'], default: 'Kabel' },
  // Penggunaan: IB (Instalasi Baru) atau MT (Maintenance) — bucket stok TERPISAH.
  // Material dgn Nama+Kategori sama tapi beda Penggunaan dianggap 2 jenis material
  // yang berbeda, masing-masing punya stock_awal & stock sendiri (lihat routes/material.js).
  penggunaan: { type: String, enum: ['IB', 'MT'], required: true, default: 'IB' },
  nama: { type: String, required: true, trim: true },   // ex: "100 M", "150 M", "200 M", "250 M"
  satuan: { type: String, default: 'Roll' },             // ex: Roll, Meter, Pcs, Box
  stock_awal: { type: Number, required: true, min: 0, default: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  // Daftar SN ONT yang sudah "dikenal"/terdaftar untuk jenis material ini (khusus kategori ONT).
  // Diisi opsional saat Tambah Jenis Material (sesuai qty yang diinput), dan bertambah lagi tiap
  // kali ada penambahan stok (restock) lewat panel "Tambah Stok" di halaman Master Material.
  // Dipakai sebagai daftar pilihan (dropdown/autocomplete) SN ONT di form Pemakaian Teknisi &
  // tabel "Daftar SN ONT" di halaman Laporan.
  sn_list: { type: [String], default: [] },
  keterangan: { type: String, default: '' },
  dibuat_oleh: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

materialSchema.pre('save', function () {
  this.updatedAt = new Date();
});
materialSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Material', materialSchema);