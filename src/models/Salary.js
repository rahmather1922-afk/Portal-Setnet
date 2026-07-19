const mongoose = require('mongoose');

// Schema Master Gaji Karyawan — 1 dokumen per karyawan, dikelola di menu
// "Master Data Karyawan -> Salary" (khusus owner & hrd, lihat routes/salary.js).
//
// CATATAN: limit kasbon TIDAK disimpan di sini. Limit kasbon per-karyawan sudah
// punya tempatnya sendiri, yaitu field `limit_kasbon_custom` di models/Karyawan.js.
// Sengaja tidak diduplikasi supaya tidak ada 2 sumber kebenaran yang bisa beda nilai.
// Endpoint PUT /salary/:karyawan_id di routes/salary.js meng-update gaji_pokok DI SINI
// dan limit_kasbon_custom di Karyawan sekaligus dalam satu request dari form yang sama.
const salarySchema = new mongoose.Schema({
  karyawan_id: { type: String, required: true, unique: true },
  gaji_pokok: { type: Number, required: true, min: 0, default: 0 },
  diubah_oleh: { type: String, default: '' }, // karyawan_id owner/hrd yang terakhir mengubah
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

salarySchema.pre('save', function () {
  this.updatedAt = new Date();
});
salarySchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Salary', salarySchema);
