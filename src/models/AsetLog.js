const mongoose = require('mongoose');

// Riwayat perpindahan tangan tiap unit Aset — 1 baris = 1 kejadian (Serah Terima ke
// teknisi, Pengembalian ke gudang, atau perubahan Kondisi/Status mis. masuk Maintenance).
// Dipakai sebagai audit trail "aset ini dulu pernah dipegang siapa saja & kapan" di
// halaman Master Aset (tombol Riwayat per baris).
const asetLogSchema = new mongoose.Schema({
  aset_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aset', required: true },
  aset_nama: { type: String, default: '' },
  tipe: {
    type: String,
    enum: ['Serah Terima', 'Pengembalian', 'Perubahan Kondisi'],
    required: true
  },
  teknisi_id: { type: String, default: '' },
  teknisi_nama: { type: String, default: '' },
  kondisi: { type: String, default: '' }, // diisi kalau tipe "Pengembalian"/"Perubahan Kondisi" (kondisi aset saat itu)
  keterangan: { type: String, default: '' },
  tanggal: { type: Date, default: Date.now },
  dibuat_oleh: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AsetLog', asetLogSchema);