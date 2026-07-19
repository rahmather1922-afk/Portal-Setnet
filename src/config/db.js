const mongoose = require('mongoose');

function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI belum diset. Buat file .env berdasarkan .env.example');
    process.exit(1);
  }

  // Tambahkan opsi timeout 5 detik di bawah ini
  mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000 
  })
    .then(() => console.log('✅ Berhasil terhubung ke MongoDB Atlas Cloud!'))
    .catch(err => {
      console.error('❌ Gagal koneksi ke MongoDB:', err.message);
      console.log('💡 Tips: Periksa kembali kuota/koneksi hotspot kamu atau gunakan VPN/Wi-Fi lain.');
    });
}

module.exports = connectDB;