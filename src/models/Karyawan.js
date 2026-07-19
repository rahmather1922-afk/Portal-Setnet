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
  // Opsional: kalau diisi (angka > 0), nilai ini MENIMPA limit kasbon default
  // berdasarkan role (lihat src/config/kasbonLimit.js) khusus untuk karyawan ini.
  // Biarkan null/kosong kalau ingin memakai limit default role-nya.
  limit_kasbon_custom: { type: Number, default: null },
  // ==================== STATUS KEPEGAWAIAN (BARU) ====================
  // "Aktif"     -> karyawan masih bekerja (default untuk semua akun)
  // "Non Aktif" -> karyawan sudah tidak bekerja / resign / diberhentikan.
  // CATATAN AKSES: hanya role 'hrd' & 'owner' yang boleh MENGUBAH status ini
  // (lihat requireRole di routes/admin.js, endpoint PUT /admin/karyawan/:id/status).
  // Role lain (admin, gudang, finance) tetap bisa MELIHAT status ini lewat
  // endpoint GET /admin/karyawan yang sudah ada, tapi tidak bisa mengubahnya.
  status: { type: String, enum: ['Aktif', 'Non Aktif'], default: 'Aktif' }
});

module.exports = mongoose.model('Karyawan', karyawanSchema);