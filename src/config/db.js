const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

/**
 * PENTING: fungsi ini sekarang async dan mengembalikan Promise.
 * Di server.js harus di-`await` SEBELUM app.listen().
 */
async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI belum diset. Buat file .env berdasarkan .env.example');
    process.exit(1);
  }

  // Log event koneksi -> ketahuan kalau koneksi putus-nyambung diam-diam
  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB terputus, mencoba reconnect...')
  );
  mongoose.connection.on('reconnected', () =>
    console.log('🔁 MongoDB tersambung kembali')
  );

  try {
    const t0 = Date.now();

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // ===== INI KUNCI PENYEMBUH LEMOTNYA =====
      // Jaga minimal 5 koneksi ke Atlas tetap hidup & hangat.
      // Tanpa ini koneksi idle ditutup, lalu setiap query baru harus
      // TCP handshake + TLS handshake + auth ulang ke Atlas.
      // Itu saja bisa menambah 200-400 ms per request.
      minPoolSize: 5,
      maxPoolSize: 20,
      maxIdleTimeMS: 0, // 0 = jangan pernah tutup koneksi idle

      // Kompresi wire-protocol antara server <-> Atlas.
      // Kalau ada endpoint yang narik ribuan dokumen, ini ngaruh besar.
      compressors: ['zstd', 'snappy', 'zlib'],

      retryWrites: true,
    });

    console.log(`✅ Terhubung ke MongoDB Atlas (${Date.now() - t0} ms)`);

    // Ukur latensi murni ke Atlas. Kalau angka ini > 100 ms,
    // berarti region Railway dan region Atlas kamu beda benua.
    const p0 = Date.now();
    await mongoose.connection.db.admin().ping();
    console.log(`📡 Ping ke Atlas: ${Date.now() - p0} ms`);
  } catch (err) {
    console.error('❌ Gagal koneksi ke MongoDB:', err.message);
    console.log('💡 Tips: Periksa kembali kuota/koneksi hotspot kamu atau gunakan VPN/Wi-Fi lain.');
    process.exit(1); // jangan lanjut listen kalau DB mati
  }
}

module.exports = connectDB;