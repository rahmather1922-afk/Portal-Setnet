const mongoose = require('mongoose');

// Schema Tracking Dokumen BAST (Berita Acara Serah Terima) per Region & Jenis WO
// Meniru alur kerja di file Excel "Tracking AMT": setiap dokumen berjalan lewat
// 3 tahap status sebelum dianggap selesai (lunas/dibayar).
const trackingBastSchema = new mongoose.Schema({
  region: { type: String, required: true, trim: true },           // ex: Jabodetabek, Medan, Jawa Timur, Bali
  tahun: { type: Number, required: true },                        // ex: 2026
  woType: { type: String, required: true },                       // IB, Fault Repair, ONM, Material ONM, SWAP ONT, LBS, Rectification, ODC
  bulan: { type: String, default: '' },                           // Januari..Desember
  batch: { type: Number, default: null },
  jumlahWO: { type: Number, default: 0, min: 0 },                 // Jumlah WO / Tiket
  amount: { type: Number, default: 0, min: 0 },                   // Nilai tagihan awal
  nilaiAsianet: { type: Number, default: 0, min: 0 },             // Nilai yang disetujui/dibayar Asianet
  status: {
    type: String,
    required: true,
    // "Proses Finance" = dokumen sudah BAST Final DAN sudah dibuatkan Invoice-nya,
    // sedang berjalan di modul Keuangan (Invoice) sampai lunas dibayar.
    enum: ['Waiting Submit', 'Waiting BAST Final', 'BAST Final', 'Proses Finance'],
    default: 'Waiting Submit'
  },
  tanggal: { type: Date, default: null },                         // Tgl Tiba (Waiting Submit) / Tgl Submit (2 status lainnya)
  pic: { type: String, default: '' },                             // Penanggung jawab region/batch
  remark: { type: String, default: '' },
  actionPlan: { type: String, default: '' },
  note: { type: String, default: '' },
  // Diisi otomatis begitu tombol "+" (Buat Invoice) dipakai dari baris BAST Final ini.
  // Dipakai untuk: (1) mencegah 1 dokumen BAST dibuatkan Invoice dobel, (2) linking balik ke Invoice terkait.
  invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },
  // Tambahan klasifikasi pekerjaan — diisi lewat dropdown di form Tracking BAST.
  project: { type: String, enum: ['AMT', 'FS', 'LinkNet', ''], default: '' },
  vendor: { type: String, enum: ['Quantum', 'Satu Visi', 'BBB', ''], default: '' },
  dibuat_oleh: { type: String, default: '' },                     // karyawan_id yang input
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// CATATAN PERBAIKAN: versi Mongoose yang dipakai project ini (7/8+) sudah tidak
// mendukung gaya callback lama `function (next) { ...; next(); }` untuk hook
// document (pre 'save'/'findOneAndUpdate') — parameter `next` tidak lagi
// disuntikkan, sehingga memanggilnya melempar "next is not a function" dan
// SEMUA proses simpan/update gagal. Hook cukup ditulis tanpa parameter `next`
// sama sekali (synchronous, tidak perlu return apa-apa) supaya kompatibel.
trackingBastSchema.pre('save', function () {
  this.updatedAt = new Date();
});
trackingBastSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('TrackingBast', trackingBastSchema);