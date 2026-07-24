const mongoose = require('mongoose');

// Schema Pengelolaan Akun Karyawan
const karyawanSchema = new mongoose.Schema({
  karyawan_id: { type: String, unique: true, required: true },
  nama: { type: String, required: true },
  password: { type: String, required: true }, // disimpan dalam bentuk hash (bcrypt)
  role: { type: String, default: 'karyawan' },
  alamat: { type: String, default: '-' },
  nik: { type: String, default: '' },
  tanggal_lahir: { type: Date, default: null },
  no_telp: { type: String, default: '' },
  cabang: { type: String, default: '' },
 
  limit_kasbon_custom: { type: Number, default: null },

  status: { type: String, enum: ['Aktif', 'Non Aktif'], default: 'Aktif' }
});

module.exports = mongoose.model('Karyawan', karyawanSchema);