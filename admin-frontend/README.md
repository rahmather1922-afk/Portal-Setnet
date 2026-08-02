# SETNET Portal Admin — Frontend (Vite build)

Ini adalah versi "di-build" dari `admin.js` kamu. Isinya sama persis, cuma
sekarang dikompilasi sekali di komputer kamu (bukan di browser tiap user
buka halaman) — inilah yang bikin loading 2-3 menit jadi hitungan detik.

## 1. Testing di localhost dulu (sesuai request kamu)

### a. Backend Node.js kamu tetap jalan seperti biasa
Jalankan backend Express + MongoDB kamu seperti biasa, contoh:
```
node server.js
```
Catat di port berapa dia jalan (misal `http://localhost:5000`).

### b. Setup & jalankan project frontend ini
Di folder project ini (folder yang berisi `package.json` ini):
```
npm install
npm run dev
```
Vite akan jalan di `http://localhost:5173`. Buka di browser — kalau kosong
atau error network, cek `vite.config.js` bagian `server.proxy["/api"].target`,
samakan dengan port backend Node.js kamu di langkah (a).

Di mode `npm run dev` ini kamu masih dapat **Hot Reload** (edit kode, browser
auto-refresh) — jadi tetap enak untuk develop, bukan cuma untuk production.

### c. Login & coba semua fitur
Karena request API-nya path relatif (`/api/admin`, `/api/finance`, dst) dan
sudah di-proxy, login/fetch data harusnya jalan normal seperti versi lama,
tapi javascript-nya sudah jalan cepat (nggak nunggu Babel compile).

## 2. Kalau sudah oke, build untuk production
```
npm run build
```
Ini menghasilkan folder `dist/` berisi HTML+JS+CSS yang sudah di-minify dan
di-bundle (bukan lagi 1 file JSX mentah 8000 baris + Babel compiler).

## 3. Menyambungkan ke backend Express kamu (sebelum deploy ke Railway)

Di server Node.js kamu (yang sekarang serve `index.html` & `admin.js` versi
lama), ganti bagian yang serve folder admin lama dengan folder `dist/` hasil
build ini. Kira-kira begini di Express:

```js
// sebelumnya mungkin:
// app.use("/admin", express.static(path.join(__dirname, "public/admin")));

// ganti jadi arahkan ke folder dist hasil build Vite:
app.use("/admin", express.static(path.join(__dirname, "admin-dist")));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-dist/index.html"));
});
```
Lalu copy isi `dist/` ke folder `admin-dist` di project backend kamu (atau
sesuaikan path-nya langsung ke `dist/` — yang penting foldernya ke-include
saat deploy ke Railway).

**Catatan:** kalau backend kamu sekarang serve `admin.js` lewat route
custom (bukan `express.static` biasa) — misalnya yang bikin baris
`admin.js ... xhr ... transformScriptTag` muncul di Network tab — beri tahu
saya isi route/server file-nya, biar saya sesuaikan bagian ini supaya pas
dengan struktur project kamu.

## Yang berubah dari versi lama
- ❌ Tidak lagi load `@babel/standalone` + `type="text/babel"` (compile JSX
  di browser tiap kali dibuka)
- ❌ Tidak lagi pakai `react.development.js` / `react-dom.development.js`
  dari CDN — sekarang pakai build production react yang di-bundle
- ❌ Tidak lagi pakai Tailwind CDN browser JIT — sekarang di-compile ke CSS
  statis saat build
- ✅ Logika & tampilan aplikasi (semua isi `admin.js`) **tidak diubah sama
  sekali**, cuma dipindah ke `src/main.jsx` dengan `import` yang benar
