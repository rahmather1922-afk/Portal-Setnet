const mongoose = require('mongoose');


const absensiSchema = new mongoose.Schema({
  karyawan_id: { type: String, required: true },
  nama: { type: String, required: true },
  waktu_absen: { type: Date, default: Date.now },
  status: { type: String, required: true },       // "Masuk" atau "Pulang"
  shift: { type: String, required: true },        // "Shift 1", "Shift 2", atau "Non-Shift"
  keterangan: { type: String, default: "Normal" }, // "Normal" atau "Terlambat (X Jam Y Menit)"
  foto: { type: String, required: true },         // URL foto hasil upload ke Cloudinary (bukan base64 lagi)
  foto_public_id: { type: String, default: "" },  // ID Cloudinary, dipakai kalau nanti perlu hapus foto dari Cloudinary
  lokasi: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    alamat: { type: String, default: "" }          // Alamat hasil reverse-geocode (boleh kosong jika gagal diambil)
  }
});

module.exports = mongoose.model('Absensi', absensiSchema);