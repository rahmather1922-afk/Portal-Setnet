const mongoose = require('mongoose');

// Item ringkasan pekerjaan di dalam satu dokumen BAST Balap
// (baris tabel "Summary" pada form/hasil cetak BAST)
const BastItemSchema = new mongoose.Schema(
  {
    deskripsi: { type: String, default: '' },
    qtyTeam: { type: String, default: '' },
    totalWo: { type: String, default: '' },
    hargaWo: { type: String, default: '' },
    keterangan: { type: String, default: '' },
  },
  { _id: false }
);

const BastSchema = new mongoose.Schema(
  {
    nomorSurat: { type: String, required: true, trim: true },
    tanggal: { type: String, required: true }, // disimpan format "YYYY-MM-DD" sesuai input date di frontend
    namaPekerjaan: { type: String, required: true, trim: true },
    nomorKontrak: { type: String, default: '-' },
    rekananPelaksana: { type: String, default: "Serata Network's (Setnet's)" },
    pihakKedua: { type: String, default: 'PT. Satu Visi Media' },
    jenisPekerjaan: { type: String, default: 'Instalasi Baru' },
    periodeAwal: { type: String, default: '' },
    periodeAkhir: { type: String, default: '' },
    items: {
      type: [BastItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.some((it) => (it.deskripsi || '').trim() !== ''),
        message: 'Minimal 1 baris summary dengan deskripsi wajib diisi',
      },
    },
    ttdClientNama: { type: String, default: '' },
    ttdClientJabatan: { type: String, default: '' },
    ttdRekananNama: { type: String, default: 'Bayhaky' },
    ttdRekananJabatan: { type: String, default: 'Manager Operational' },
    pakaiTtdBayhaky: { type: Boolean, default: true },
    // Dicatat sekali saat dibuat, tidak berubah lagi walau dokumennya diedit belakangan.
    dibuatPada: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bast', BastSchema);
