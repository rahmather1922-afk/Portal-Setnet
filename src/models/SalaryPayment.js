const mongoose = require('mongoose');

// Schema Histori Pembayaran Gaji — 1 dokumen per karyawan PER PERIODE (bulan).
// periode disimpan format "YYYY-MM", ex: "2026-07" untuk gajian bulan Juli 2026.
//
// Alur: setiap kali owner/hrd buka menu Salary untuk periode tertentu, backend
// menghitung LIVE dulu (gaji_pokok - total kasbon Disetujui yang belum lunas) dan
// menampilkannya sebagai preview berstatus "Belum Dibayar" walau dokumen ini belum
// tentu ada di database. Dokumen di sini baru benar-benar dibuat/dikunci saat tombol
// "Tandai Sudah Dibayar" ditekan (lihat PUT /salary/payment/:karyawan_id/bayar di
// routes/salary.js) — supaya angka gaji histori bulan lalu tidak berubah-ubah lagi
// meskipun gaji_pokok karyawan tsb diedit belakangan.
const salaryPaymentSchema = new mongoose.Schema({
  karyawan_id: { type: String, required: true },
  nama: { type: String, required: true }, // snapshot nama saat dibayar
  periode: { type: String, required: true }, // "YYYY-MM"

  gaji_pokok: { type: Number, required: true, default: 0 }, // snapshot gaji pokok saat dibayar
  total_kasbon_dipotong: { type: Number, required: true, default: 0 }, // total kasbon Disetujui & belum lunas yang dipotong
  total_dibayar: { type: Number, required: true, default: 0 }, // gaji_pokok - total_kasbon_dipotong

  // Kasbon mana saja yang ikut dipotong & sekaligus ditandai lunas saat pembayaran ini dikunci
  kasbon_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kasbon' }],

  status: { type: String, enum: ['Belum Dibayar', 'Sudah Dibayar'], default: 'Belum Dibayar' },
  tanggal_dibayar: { type: Date, default: null },
  dibayar_oleh: { type: String, default: '' }, // karyawan_id owner/hrd yang menandai lunas

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Satu karyawan hanya boleh punya 1 dokumen histori per periode
salaryPaymentSchema.index({ karyawan_id: 1, periode: 1 }, { unique: true });

salaryPaymentSchema.pre('save', function () {
  this.updatedAt = new Date();
});
salaryPaymentSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);
