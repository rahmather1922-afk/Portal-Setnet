// ==================== ROLE-BASED ACCESS CONTROL ====================
// Struktur hak akses sistem:
//   teknisi -> hanya aplikasi absensi (index.html), TIDAK bisa masuk Portal Admin
//   admin   -> Dashboard, Kelola Karyawan (CRUD), Log Absensi
//   gudang  -> Dashboard, Log Absensi (lihat saja)
//   finance -> Dashboard, Log Absensi (lihat saja), Modul Keuangan (CRUD + laporan + ekspor)
//   owner   -> akses penuh ke seluruh modul
//
// CATATAN KEAMANAN: Middleware ini membaca role dari header 'x-user-role' yang dikirim
// frontend setelah login (sesuai arsitektur aplikasi ini yang belum memakai token/JWT).
// Ini CUKUP untuk mencegah kesalahan pemakaian tidak sengaja & memisahkan menu antar role,
// TAPI karena header bisa dimodifikasi oleh pengguna teknis, ini BUKAN proteksi keamanan
// yang kuat untuk data sensitif. Untuk produksi (apalagi data keuangan), sangat disarankan
// upgrade ke autentikasi berbasis JWT/session di endpoint login.
const requireRole = (...allowedRoles) => (req, res, next) => {
  const role = req.header('x-user-role');
  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Akses ditolak. Role akun Anda tidak memiliki izin untuk aksi ini.' });
  }
  next();
};

module.exports = requireRole;
