const mongoose = require('mongoose');

// Schema Pengajuan Cuti / Izin / Sakit
const pengajuanSchema = new mongoose.Schema({
  karyawan_id: { type: String, required: true },
  nama: { type: String, required: true },
  jenis: { type: String, enum: ['Cuti', 'Izin', 'Sakit'], required: true },
  tanggal_mulai: { type: Date, required: true },
  tanggal_selesai: { type: Date, required: true },
  alasan: { type: String, default: '' },
  lampiran: { type: String, default: '' },          // opsional: foto surat dokter dsb (Base64)
  status: {
    type: String,
    enum: ['Pending', 'Disetujui', 'Ditolak'],
    default: 'Pending'
  },
  catatan_admin: { type: String, default: '' },
  diputuskan_oleh: { type: String, default: '' },
  tanggal_pengajuan: { type: Date, default: Date.now },
  tanggal_keputusan: { type: Date, default: null }
});

module.exports = mongoose.model('Pengajuan', pengajuanSchema);
