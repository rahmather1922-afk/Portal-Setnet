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

  merek_modem: { type: String, default: '' },   // kolom C, ex: NOKIA, ZTE (snapshot teks bebas)
  // ont_material_id — link OPSIONAL ke master Material (kategori ONT, bucket Penggunaan yg sama)
  // kalau merek_modem yang diketik/dipilih cocok dengan salah satu Material ONT terdaftar.
  // Kosong/null kalau merek_modem diisi manual ("Lainnya") & tidak match Material manapun —
  // dalam kondisi itu stok ONT TIDAK ikut terpotong (hanya kabel yang wajib & selalu terpotong).
  ont_material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', default: null },
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

  // id_wo — ID Work Order yang MEMAKAI unit material ini (1 baris = 1 unit, jadi 1 WO).
  // Opsional saat pengambilan awal (teknisi belum tentu tahu WO-nya di gudang), tapi WAJIB
  // diisi/dilengkapi begitu status diubah jadi "Terpakai" supaya tiap unit terpakai bisa
  // ditelusuri balik ke WO/tiket pemasangan mana yang menghabiskannya (dipakai gudang saat
  // konfirmasi di halaman "Stok di Tangan Teknisi" / edit log satu baris).
  id_wo: { type: String, default: '', trim: true },

  // catatan_report — kolom catatan/report BEBAS dari teknisi/admin, isinya beda-beda tiap
  // baris (bukan template baku), jadi disimpan sebagai teks polos apa adanya. Dibatasi 5000
  // karakter supaya cukup untuk laporan lapangan yang panjang tapi tetap wajar.
  catatan_report: { type: String, default: '', maxlength: 5000 },

  // Penggunaan (IB/MT) — snapshot dari bucket stok Material yang dipakai baris ini
  // (lihat models/Material.js). Menentukan Kabel mana yang boleh dipilih di form
  // (harus penggunaan-nya SAMA dengan yang dipilih di sini), dan dipakai untuk pecah
  // rekap "per Teknisi/Team" jadi Unit IB vs Unit MT di /material/report.
  penggunaan: { type: String, enum: ['IB', 'MT'], default: 'IB' },

  // Tambahan klasifikasi pekerjaan — diisi lewat dropdown di form Pemakaian Teknisi.
  project: { type: String, enum: ['AMT', 'FS', 'LinkNet', 'Hifi', ''], default: '' },
  region: {
    type: String,
    enum: ['Jakbar', 'Jakut', 'Jakpus', 'Jaksel', 'Jaktim', 'Bekasi', 'Bogor', 'Depok', 'Bekasi Timur', 'Tangerang', 'Tangkot', ''],
    default: ''
  },
  vendor: { type: String, enum: ['Quantum', 'Satu Visi', 'BBB', ''], default: '' },

  dibuat_oleh: { type: String, default: '' }, // karyawan_id admin/gudang yang input baris ini

  // batch_id — dokumen-dokumen yang dibuat dari SATU KALI submit form "Tambah Log Pemakaian"
  // (bisa beberapa unit ONT / beberapa jenis kabel sekaligus) berbagi batch_id yang sama.
  // Dipakai FE untuk menggabungkan tampilan jadi 1 baris ringkasan di tabel "Log Pemakaian
  // per Teknisi", walau di database tetap tersimpan sebagai dokumen terpisah per unit
  // (supaya potong-stok & edit/hapus per unit tetap akurat). Kosong untuk data lama.
  batch_id: { type: String, default: '', index: true },

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