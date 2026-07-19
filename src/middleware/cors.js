// Pengaturan CORS manual agar aplikasi frontend (index.html & admin.html) bisa berkomunikasi lancar dengan server backend
function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // x-user-role & x-user-id ditambahkan agar header identitas role (dipakai sistem hak akses) tidak diblokir CORS
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-user-role, x-user-id");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // Browser mengirim preflight request (OPTIONS) sebelum request asli saat ada header custom.
  // Wajib dijawab langsung 200 di sini, kalau tidak Express akan lanjut ke routing dan
  // menghasilkan 404 untuk method OPTIONS, yang membuat browser membatalkan request aslinya.
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
}

module.exports = corsMiddleware;
