# Sistem Absensi SATNET

## Struktur folder baru

```
.
├── server.js                  # entrypoint backend (tipis, cuma nyambungin semua)
├── .env                       # kredensial asli (JANGAN di-commit ke git)
├── .env.example                # contoh format .env, aman untuk di-commit
├── src/
│   ├── config/
│   │   └── db.js               # koneksi MongoDB
│   ├── models/
│   │   ├── Karyawan.js
│   │   ├── Absensi.js
│   │   └── Transaksi.js
│   ├── middleware/
│   │   ├── cors.js
│   │   └── requireRole.js      # role-based access control
│   └── routes/
│       ├── absen.js            # login & absen masuk/pulang
│       ├── admin.js            # CRUD karyawan + rekap absensi
│       ├── finance.js          # CRUD transaksi keuangan
│       └── tracking.js         # CRUD Tracking BAST + rekap (khusus Owner)
└── public/
    ├── employee/
    │   ├── index.html           # shell HTML (sebelumnya index.html)
    │   └── app.js                # logic React (JSX)
    └── admin/
        ├── index.html           # shell HTML (sebelumnya admin.html)
        ├── admin.css             # semua custom CSS
        └── admin.js              # logic React (JSX)
```

## Perubahan penting

1. **Kredensial MongoDB dipindah ke `.env`.** Sebelumnya username & password
   MongoDB Atlas tertulis langsung di `server.js` — ini bocor kalau file
   pernah di-push ke repo publik. Sekarang dibaca lewat `process.env.MONGO_URI`.
   Ganti dulu isi `.env` sesuai kredensial kamu, dan jangan commit file ini
   (sudah masuk `.gitignore`).
2. **`server.js` dipecah** jadi model / middleware / routes terpisah supaya
   gampang dicari & di-maintain, tanpa mengubah logika endpoint sama sekali.
3. **`index.html` & `admin.html`** dipisah jadi HTML (shell) + CSS + JS murni,
   tanpa mengubah tampilan atau perilaku aplikasi.
4. **Modul Tracking BAST (baru, khusus Owner)** — menu "Tracking BAST" di
   Portal Admin untuk memantau dokumen BAST per region & jenis WO, meniru alur
   di file Excel `Tracking_AMT`:
   - Setiap entri punya status: **Waiting Submit → Waiting BAST Final → BAST Final**
   - Dashboard rekap otomatis: total nilai & jumlah WO per status, dan tabel
     pivot Region x Status (setara sheet "Rekap" di file Excel)
   - Form tambah/edit lengkap: Region, Tahun, Jenis WO, Bulan, Batch, Jumlah WO,
     Amount, Nilai Asianet, Status, Tanggal, PIC, Remark, Action Plan, Note
   - Filter & pencarian di tabel (per Region / Status / Jenis WO)
   - Ekspor ke Excel (2 sheet: "Data Tracking" detail + "Rekap" pivot) — tombol
     hijau di kanan atas, formatnya mirip file Excel yang kamu kirim
   - Endpoint backend: `GET/POST /api/tracking`, `PUT/DELETE /api/tracking/:id`,
     `GET /api/tracking/summary` — semuanya dikunci `requireRole('owner','hrd')`,
     jadi role lain (admin/gudang/finance) tidak bisa mengakses data ini sama sekali.

## Cara jalanin

```bash
npm install
npm start   # atau: node server.js
```

Lalu buka di browser:
- Portal Karyawan: **http://localhost:5000/employee**
- Portal Admin: **http://localhost:5000/admin**

⚠️ **Jangan** dibuka langsung dari File Explorer (double-click `index.html`,
alamatnya jadi `file:///...`). Browser akan memblokir `fetch` ke `app.js` /
`admin.js` karena kebijakan CORS untuk protokol `file://`, sehingga halaman
tampil kosong. Harus diakses lewat server (`http://localhost:5000/...`) —
makanya `server.js` sudah di-set untuk ikut menyajikan folder `public/`.

## Catatan

- Endpoint API, urutan middleware, dan semua logika (perhitungan
  keterlambatan shift, role-based access, dsb) **tidak diubah** — cuma
  dipindah lokasi biar rapi.
- `requireRole` masih membaca role dari header `x-user-role` (belum pakai
  JWT/session). Ini sudah cukup untuk mencegah salah pakai menu antar role,
  tapi untuk data sensitif (keuangan) disarankan upgrade ke JWT di produksi.
