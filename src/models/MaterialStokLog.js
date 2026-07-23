const mongoose = require('mongoose');

// Schema Log Mutasi Stok Material — KHUSUS untuk 2 tipe pergerakan stok yang butuh
// angka bersih/pasti (beda dengan kolom "RETURN" bebas-teks di PemakaianMaterial):
//   "Penambahan"   -> restock baru masuk gudang, STOK BERTAMBAH
//   "Pengembalian" -> sisa material dari teknisi resmi dikembalikan & dihitung ulang
//                      sebagai stok siap pakai, STOK BERTAMBAH
// Dipisah dari PemakaianMaterial supaya report "stok awal / dipakai / ditambah /
// dikembalikan" bisa dihitung bersih per material (lihat routes/material.js -> /material/report).
const materialStokLogSchema = new mongoose.Schema({
  material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  material_nama: { type: String, required: true },
  tipe: { type: String, enum: ['Penambahan', 'Pengembalian'], required: true },
  jumlah: { type: Number, required: true, min: 0 },
  teknisi_id: { type: String, default: '' },   // diisi kalau tipe = Pengembalian (dari siapa)
  teknisi_nama: { type: String, default: '' },
  keterangan: { type: String, default: '' },
  tanggal: { type: Date, default: Date.now },
  dibuat_oleh: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MaterialStokLog', materialStokLogSchema);