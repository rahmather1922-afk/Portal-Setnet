const mongoose = require('mongoose');

// Schema Rekap Riwayat Absensi
const absensiSchema = new mongoose.Schema({
  karyawan_id: { type: String, required: true },
  nama: { type: String, required: true },
  waktu_absen: { type: Date, default: Date.now },
  status: { type: String, required: true },       // "Masuk" atau "Pulang"
  shift: { type: String, required: true },        // "Shift 1", "Shift 2", atau "Non-Shift"
  keterangan: { type: String, default: "Normal" }, // "Normal" atau "Terlambat (X Jam Y Menit)"
  foto: { type: String, required: true }          // Menyimpan string Base64 gambar wajah hasil capture HP
});

module.exports = mongoose.model('Absensi', absensiSchema);
