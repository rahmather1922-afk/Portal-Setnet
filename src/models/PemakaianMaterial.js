const mongoose = require('mongoose');

// Schema Log Pemakaian Material oleh Teknisi — meniru PERSIS tabel utama di Excel
// sheet "JUNI" (kolom A:G): TGL PENGAMBILAN | NAMA TEAM | MEREK MODEM | SN ONT |
// KABEL | STATUS | RETURN.
// Satu dokumen = satu baris = satu unit ONT yang dipasang teknisi, sekaligus mencatat
// jenis/panjang kabel yang dipakai untuk pemasangan itu.
const pemakaianMaterialSchema = new mongoose.Schema({
  tanggal_pengambilan: { type: Date, required: true, default: Date.now }, // kolom A

  // kolom B "NAMA TEAM" — teknisi_id opsional (kalau mau di-link ke akun Karyawan role
  // teknisi), nama_team WAJIB diisi sebagai snapshot supaya riwayat tetap terbaca
  // walau akun karyawan yang bersangkutan diedit/dihapus di kemudian hari.
  teknisi_id: { type: String, default: '' },
  nama_team: { type: String, required: true, trim: true },

  merek_modem: { type: String, default: '' },   // kolom C, ex: NOKIA, ZTE
  // Link opsional ke master Material (kategori ONT) yang namanya cocok dengan merek_modem di atas —
  // dipakai untuk otomatis mengurangi/mengembalikan stok ONT di Master Material saat baris ini
  // status-nya "Terpakai" (persis seperti kabel_id di bawah). Null kalau merek_modem belum
  // terdaftar sebagai jenis material ONT (stok ONT tidak akan otomatis berkurang untuk baris itu).
  ont_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', default: null },
  sn_ont: { type: String, default: '' },         // kolom D, serial number ONT

  // kolom E "KABEL" — link ke master Material (kategori Kabel) + snapshot nama-nya
  kabel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  kabel_nama: { type: String, required: true },  // ex: "100 M", "150 M", "200 M"

  // kolom F "STATUS": Terpakai = sudah dipasang & kabel resmi dianggap terpakai dari stok.
  //                    Idle    = baru diambil/dicadangkan, BELUM mengurangi stok.
  status: { type: String, enum: ['Terpakai', 'Idle'], default: 'Idle' },

  // kolom G "RETURN" — sengaja dibiarkan teks bebas (bukan angka murni) karena di Excel
  // aslinya juga berisi catatan campuran, contoh: "100 M", "200 M DI IKR", "BAD 150 M".
  // Kalau ada kabel sisa yang BENERAN mau dikembalikan ke stok, catat lewat
  // model MaterialStokLog (tipe "Pengembalian") supaya angkanya rapi & bisa direkap.
  return_catatan: { type: String, default: '' },

  // Tambahan klasifikasi pekerjaan — diisi lewat dropdown di form Pemakaian Teknisi.
  project: { type: String, enum: ['AMT', 'FS', 'LinkNet', ''], default: '' },
  region: {
    type: String,
    enum: ['Jakbar', 'Jakut', 'Jakpus', 'Jaksel', 'Jaktim', 'Bekasi', 'Bogor', 'Depok', 'Bekasi Timur', 'Tangerang', 'Tangkot', ''],
    default: ''
  },
  vendor: { type: String, enum: ['Quantum', 'Satu Visi', 'BBB', ''], default: '' },

  dibuat_oleh: { type: String, default: '' }, // karyawan_id admin/gudang yang input baris ini

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pemakaianMaterialSchema.pre('save', function () {
  this.updatedAt = new Date();
});
pemakaianMaterialSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('PemakaianMaterial', pemakaianMaterialSchema);