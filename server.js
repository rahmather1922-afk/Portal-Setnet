require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const connectDB = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const absenRoutes = require('./src/routes/absen');
const adminRoutes = require('./src/routes/admin');
const financeRoutes = require('./src/routes/finance');
const trackingRoutes = require('./src/routes/tracking');
const kasbonRoutes = require('./src/routes/kasbon');
const pengajuanRoutes = require('./src/routes/pengajuan');
const bastRoutes = require('./src/routes/bast');
const materialRoutes = require('./src/routes/material');
const assetRoutes = require('./src/routes/asset');
const salaryRoutes = require('./src/routes/salary');

const app = express();


app.use(compression()); // gzip/brotli semua response (JSON API maupun file statis)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);

// Helper: atur Cache-Control per file saat serve folder static.
// - index.html JANGAN di-cache lama (harus 'no-cache' / selalu revalidate),
//   supaya deploy baru langsung kepakai tanpa user perlu hard-refresh.
// - File lain (JS/CSS/gambar hasil build Vite/CRA) biasanya sudah ada
//   hash unik di nama filenya (mis. index-MIgZtcwY.js) -> aman di-cache
//   SANGAT LAMA + immutable, browser tidak perlu tanya-validasi lagi ke
//   server sama sekali kecuali nama filenya berubah.
const staticOptions = {
  setHeaders: (res, filePath) => {
    if (path.basename(filePath) === 'index.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
};


app.use((req, res, next) => {
  if (req.path === '/employee') return res.redirect('/employee/');
  if (req.path === '/admin') return res.redirect('/admin/');
  next();
});
app.use('/employee', express.static(path.join(__dirname, 'public/employee'), staticOptions));
app.use('/admin', express.static(path.join(__dirname, 'public/admin-dist'), staticOptions));

// 2. KONEKSI DATABASE MONGODB ATLAS
connectDB();

// 3. ROUTER API
app.use('/api', absenRoutes);
app.use('/api', adminRoutes);
app.use('/api', financeRoutes);
app.use('/api', trackingRoutes);
app.use('/api', kasbonRoutes);
app.use('/api', pengajuanRoutes);
app.use('/api', bastRoutes);
app.use('/api', materialRoutes);
app.use('/api', assetRoutes);
app.use('/api', salaryRoutes);


app.get('/', (req, res) => {
  res.redirect('/admin/');
});

// 4. RUNNING SERVER APPLICATION
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
  console.log(`👷 Portal Karyawan: http://localhost:${PORT}/employee`);
  console.log(`🛠️  Portal Admin   : http://localhost:${PORT}/admin`);
});