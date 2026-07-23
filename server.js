require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const absenRoutes = require('./src/routes/absen');
const adminRoutes = require('./src/routes/admin');
const financeRoutes = require('./src/routes/finance');
const trackingRoutes = require('./src/routes/tracking');
const kasbonRoutes = require('./src/routes/kasbon');
const pengajuanRoutes = require('./src/routes/pengajuan');
const materialRoutes = require('./src/routes/material');
const salaryRoutes = require('./src/routes/salary');

const app = express();

// 1. MIDDLEWARE CONFIGURATION
// Limit body parser dinaikkan ke 10mb agar server mampu menerima string data foto Base64 yang dikirim dari HP tanpa error 'Payload Too Large'
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);

// Serve halaman frontend (public/employee & public/admin) lewat HTTP.
// WAJIB diakses via http://localhost:5000/... — kalau file index.html dibuka
// langsung dari File Explorer (file://...), fetch ke app.js/admin.js akan
// diblokir CORS oleh browser dan halaman jadi kosong.
//
// /admin & /employee (tanpa garis miring di akhir) di-redirect ke /admin/
// dan /employee/. Ini PENTING: kalau index.html langsung di-serve di path
// tanpa trailing slash, browser menghitung alamat relatif (admin.css,
// admin.js) dari folder ROOT (localhost:5000/), bukan dari folder /admin/,
// sehingga file CSS/JS-nya gagal ditemukan (404) walau isinya benar.
//
// CATATAN: sengaja pakai middleware manual (bukan app.get('/admin', ...))
// dan cek req.path secara PERSIS (===). Kalau pakai app.get('/admin', ...),
// Express secara default menganggap '/admin' dan '/admin/' sebagai route
// yang sama (trailing slash diabaikan), sehingga redirect ke '/admin/' akan
// mengenai handler yang sama lagi -> redirect tanpa henti (ERR_TOO_MANY_REDIRECTS).
app.use((req, res, next) => {
  if (req.path === '/employee') return res.redirect('/employee/');
  if (req.path === '/admin') return res.redirect('/admin/');
  next();
});
app.use('/employee', express.static(path.join(__dirname, 'public/employee')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// 2. KONEKSI DATABASE MONGODB ATLAS
connectDB();

// 3. ROUTER API
app.use('/', absenRoutes);
app.use('/api', adminRoutes);
app.use('/api', financeRoutes);
app.use('/api', trackingRoutes);
app.use('/api', kasbonRoutes);
app.use('/api', pengajuanRoutes);
app.use('/api', materialRoutes);
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