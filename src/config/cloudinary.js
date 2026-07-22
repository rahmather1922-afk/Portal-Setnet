const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary diambil dari .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
// CLOUDINARY_API_SECRET). Pastikan file .env sudah diisi dengan Cloud Name asli
// dari dashboard Cloudinary (bukan placeholder "NAMA_CLOUD_KAMU").
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
