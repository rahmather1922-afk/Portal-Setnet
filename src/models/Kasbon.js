const mongoose = require('mongoose');

// Schema Pengajuan Kasbon Karyawan
// Alur: karyawan mengajukan (status Pending) -> Owner meng-ACC / menolak ->
// kalau disetujui, admin/finance bisa menandai "lunas" setelah dipotong dari gaji.
const kasbonSchema = new mongoose.Schema({
  karyawan_id: { type: String, required: true },
  nama: { type: String, required: true },
  jumlah: { type: Number, required: true, min: 0 },
  alasan: { type: String, default: '' },
  region: { type: String, required: true },
  vendor: { type: String, required: true },
  metode_pembayaran: {
    type: String,
    enum: ['E-Wallet', 'Transfer Bank'],
    required: true
  },
  penyedia_pembayaran: { type: String, required: true }, // Dana/OVO/GoPay/ShopeePay (jika E-Wallet) atau BCA/BRI/Mandiri/dst (jika Transfer Bank)
  no_rekening: { type: String, required: true },          // no rekening bank atau no e-wallet tujuan pencairan
  status: {
    type: String,
    enum: ['Pending', 'Disetujui', 'Ditolak'],
    default: 'Pending'
  },
  lunas: { type: Boolean, default: false },        // ditandai true setelah kasbon dipotong/dibayar
  catatan_admin: { type: String, default: '' },     // alasan tolak / catatan owner
  diputuskan_oleh: { type: String, default: '' },   // karyawan_id owner yang ACC/tolak
  tanggal_pengajuan: { type: Date, default: Date.now },
  tanggal_keputusan: { type: Date, default: null },
  tanggal_lunas: { type: Date, default: null }
});

module.exports = mongoose.model('Kasbon', kasbonSchema);