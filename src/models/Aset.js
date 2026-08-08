const mongoose = require('mongoose');

// Schema Master Data ASET — beda dari Material (Material = barang habis pakai/consumable
// yang stoknya berkurang tiap dipakai, mis. Kabel & ONT). Aset = barang INVENTARIS yang
// TIDAK habis, cuma berpindah tangan (dipinjam-pakaikan ke teknisi lalu dikembalikan lagi),
// contoh: Mobil, Motor, OPM, OTDR, Laser Fiber, Splicer, Tang Crimping, Tangga Fiber, dll.
// Satu dokumen = SATU unit fisik aset (bukan jenis), supaya tiap unit (mis. 2 buah OPM)
// bisa dilacak terpisah: siapa yang sedang pegang, kondisinya apa, dan riwayat serah-terima-nya
// masing-masing (lihat models/AsetLog.js).
const asetSchema = new mongoose.Schema({
  kategori: {
    type: String,
    enum: ['Kendaraan', 'Alat Fiber Optic', 'Lainnya'],
    default: 'Alat Fiber Optic'
  },
  // Nama/jenis aset, ex: "OPM (Optical Power Meter)", "OTDR", "Laser Fiber (Fiber Cleaver)",
  // "Splicer (Fusion Splicer)", "Tang Crimping", "Tangga Fiber", "Motor", "Mobil".
  nama: { type: String, required: true, trim: true },
  // Kode/nomor inventaris internal (opsional, boleh dikosongkan) — utk Kendaraan bisa diisi
  // Plat Nomor, utk alat lain bisa diisi No. Seri/kode gudang sendiri.
  kode_aset: { type: String, default: '', trim: true },
  merek: { type: String, default: '', trim: true },
  // Field detail tambahan (semua opsional) — ditampilkan di modal "Detail Aset" di frontend.
  // Boleh kosong utk aset lama yang sudah ada sebelum field ini ditambahkan (backward-compatible).
  tipe: { type: String, default: '', trim: true },       // ex: "Fusion Splicer FTTH", "Matic", dll
  no_seri: { type: String, default: '', trim: true },     // Serial Number pabrik
  tahun: { type: Number, default: null },                 // Tahun pembuatan/pembelian unit
  lokasi: { type: String, default: '', trim: true },      // Lokasi/gudang penyimpanan saat "Tersedia"
  tanggal_beli: { type: Date, default: null },
  harga_beli: { type: Number, default: null },
  supplier: { type: String, default: '', trim: true },
  deskripsi: { type: String, default: '' },
  kondisi: {
    type: String,
    enum: ['Baik', 'Rusak Ringan', 'Rusak Berat'],
    default: 'Baik'
  },
  // Status TERKINI aset — berubah otomatis tiap ada Serah Terima / Pengembalian
  // (lihat routes/asset.js), atau diubah manual admin/gudang saat aset masuk servis/hilang.
  status: {
    type: String,
    enum: ['Tersedia', 'Dipakai', 'Maintenance', 'Hilang'],
    default: 'Tersedia'
  },
  // Siapa yang SEDANG memegang aset ini sekarang (null/kosong kalau status "Tersedia" di gudang).
  dipegang_oleh_id: { type: String, default: '' },
  dipegang_oleh_nama: { type: String, default: '' },
  tanggal_serah_terima: { type: Date, default: null },
  keterangan: { type: String, default: '' },
  dibuat_oleh: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

asetSchema.pre('save', function () {
  this.updatedAt = new Date();
});
asetSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Aset', asetSchema);