const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  deskripsi: { type: String, required: true },
  qty: { type: Number, required: true, min: 0, default: 1 },
  hargaSatuan: { type: Number, required: true, min: 0, default: 0 }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  nomor: { type: String, required: true, unique: true, trim: true },
  tanggal: { type: Date, required: true, default: Date.now },
  po_number: { type: String, default: '' },
  jatuh_tempo: { type: Date, default: null },

  bill_nama: { type: String, required: true },
  bill_alamat: { type: String, default: '' },

  ship_sama: { type: Boolean, default: true },
  ship_nama: { type: String, default: '' },
  ship_alamat: { type: String, default: '' },

  items: {
    type: [invoiceItemSchema],
    validate: v => Array.isArray(v) && v.length > 0
  },

  
  pinalty: { type: Number, default: 0, min: 0 },
  less_deposit: { type: Number, default: 0, min: 0 },
  denda_setelah_ppn: { type: Number, default: 0, min: 0 },
  pungutan_ppn: { type: Number, default: 0, min: 0 },

  status: {
    type: String,
    enum: ['Belum Dibayar', 'Lunas'],
    default: 'Belum Dibayar'
  },

  // Rekening transfer & penandatangan — ditampilkan otomatis di cetak invoice
  rek_bank: { type: String, default: '' },
  rek_nomor: { type: String, default: '' },
  rek_kota: { type: String, default: '' },
  ttd_nama: { type: String, default: '' },
  ttd_jabatan: { type: String, default: 'Direktur' },
  // Checkbox tanda tangan & stempel di hasil cetak — dulu field ini tidak ada di schema
  // sama sekali sehingga selalu didrop Mongoose saat disimpan (makanya checkbox seolah
  // tidak berpengaruh). Sekarang ditambahkan terpisah, default true supaya invoice lama
  // yang belum punya field ini tetap tampil ttd & stempel seperti sebelumnya.
  pakai_ttd_bayhaky: { type: Boolean, default: true },
  pakai_stempel: { type: Boolean, default: true },

  // Ditandai true setelah pembayaran invoice ini dimasukkan ke modul Keuangan (Transaksi),
  // supaya tombol "+" di Invoice tidak bisa dobel-catat saldo yang sama.
  dicatat_keuangan: { type: Boolean, default: false },

  dibuat_oleh: { type: String, default: '' }, // karyawan_id staf yang membuat invoice
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

invoiceSchema.pre('save', function () {
  this.updatedAt = new Date();
});
invoiceSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Invoice', invoiceSchema);