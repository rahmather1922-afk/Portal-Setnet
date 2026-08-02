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


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);


app.use((req, res, next) => {
  if (req.path === '/employee') return res.redirect('/employee/');
  if (req.path === '/admin') return res.redirect('/admin/');
  next();
});
app.use('/employee', express.static(path.join(__dirname, 'public/employee')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin-dist')));

// 2. KONEKSI DATABASE MONGODB ATLAS
connectDB();

// 3. ROUTER API
app.use('/api', absenRoutes);
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