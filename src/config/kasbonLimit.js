const DEFAULT_LIMIT = 1000000;

function getLimitForKaryawan(karyawan) {
  if (!karyawan) return DEFAULT_LIMIT;
  if (karyawan.limit_kasbon_custom !== undefined && karyawan.limit_kasbon_custom !== null) {
    return karyawan.limit_kasbon_custom;
  }
  return DEFAULT_LIMIT;
}

module.exports = { DEFAULT_LIMIT, getLimitForKaryawan };
