// ==================== LIMIT KASBON — MANUAL PER KARYAWAN ====================
// PERUBAHAN: limit kasbon TIDAK LAGI otomatis berdasarkan role. Sekarang limit
// murni ditentukan manual oleh owner/hrd lewat menu "Master Data Karyawan -> Salary"
// (lihat routes/salary.js, endpoint PUT /salary/:karyawan_id), yang menyimpan nilainya
// ke field `limit_kasbon_custom` di models/Karyawan.js.
//
// DEFAULT_LIMIT di bawah ini HANYA dipakai sebagai jaring pengaman kalau ada karyawan
// yang belum pernah diset limit-nya sama sekali (limit_kasbon_custom masih null),
// supaya karyawan baru tidak otomatis punya limit Rp0 sebelum sempat diatur owner.
const DEFAULT_LIMIT = 1000000;

// Mengembalikan limit kasbon efektif untuk satu data karyawan (Mongoose doc atau object biasa)
function getLimitForKaryawan(karyawan) {
  if (!karyawan) return DEFAULT_LIMIT;
  if (karyawan.limit_kasbon_custom !== undefined && karyawan.limit_kasbon_custom !== null) {
    return karyawan.limit_kasbon_custom;
  }
  return DEFAULT_LIMIT;
}

module.exports = { DEFAULT_LIMIT, getLimitForKaryawan };
