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

// Railway ada di belakang proxy. Tanpa ini req.ip / secure salah.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ============================================================
// 0. PROFILER — pasang PALING ATAS.
//    Ini yang akan kasih tahu kamu endpoint mana yang benar-benar
//    lambat di SERVER, vs lambat karena jaringan/antrean browser.
//    Bandingkan angka ini dengan kolom "Time" di DevTools:
//    - angka mirip  -> lambat di server (query/index bermasalah)
//    - angka jauh lebih kecil -> lambat di jaringan (beda region)
// ============================================================
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    if (ms > 200) {
      console.warn(`🐢 ${ms.toFixed(0).padStart(5)}ms  ${res.statusCode}  ${req.method} ${req.originalUrl}`);
    }
  });
  next();
});

// ============================================================
// 1. MIDDLEWARE
// ============================================================

// Jangan kompres file yang memang sudah terkompresi (jpg/png/webp/woff2/zip).
// Kompres ulang = buang CPU, ukuran malah bisa naik.
const ALREADY_COMPRESSED = /\.(png|jpe?g|gif|webp|avif|woff2?|zip|gz|br|mp4|pdf)$/i;
app.use(
  compression({
    threshold: 1024, // response < 1 KB tidak usah dikompres
    filter: (req, res) => {
      if (ALREADY_COMPRESSED.test(req.path)) return false;
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);

// ============================================================
// 2. STATIC FILES
// ============================================================
const staticOptions = {
  maxAge: '1y',
  immutable: true,
  etag: false,      // file di-hash namanya, ETag cuma nambah kerjaan
  lastModified: false,
  setHeaders: (res, filePath) => {
    if (path.basename(filePath) === 'index.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
};

app.use((req, res, next) => {
  if (req.path === '/employee') return res.redirect(301, '/employee/');
  if (req.path === '/admin') return res.redirect(301, '/admin/');
  next();
});
app.use('/employee', express.static(path.join(__dirname, 'public/employee'), staticOptions));
app.use('/admin', express.static(path.join(__dirname, 'public/admin-dist'), staticOptions));

// ============================================================
// 3. ROUTER API
// ============================================================
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'down' });
});

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

app.get('/', (req, res) => res.redirect('/admin/'));

// Error handler supaya request tidak menggantung "pending" selamanya
app.use((err, req, res, next) => {
  console.error('💥', req.method, req.originalUrl, '-', err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Terjadi kesalahan di server' });
});

// ============================================================
// 4. RUNNING SERVER — DB dulu, baru listen
// ============================================================
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(); // <- tunggu Mongo siap sebelum terima request

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
    console.log(`👷 Portal Karyawan: http://localhost:${PORT}/employee`);
    console.log(`🛠️  Portal Admin   : http://localhost:${PORT}/admin`);
  });

  // Matikan keep-alive timeout lebih lama dari proxy Railway,
  // mencegah koneksi diputus di tengah jalan (gejalanya: request "pending").
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 70000;
})();