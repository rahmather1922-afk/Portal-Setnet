const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ---------------------------------- ICONS ---------------------------------- */
const Icon = ({ path, className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);
const IconHome = (p) => <Icon {...p} path={<><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></>} />;
const IconUsers = (p) => <Icon {...p} path={<><circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><path d="M16.2 4.8a3.2 3.2 0 0 1 0 6.2"/><path d="M18.5 13.6c2.6.5 3.8 2.3 3.8 4.9"/></>} />;
const IconClock = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>} />;
const IconSearch = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>} />;
const IconPlus = (p) => <Icon {...p} path={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />;
const IconEdit = (p) => <Icon {...p} path={<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>} />;
const IconTrash = (p) => <Icon {...p} path={<><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></>} />;
const IconRefresh = (p) => <Icon {...p} path={<><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></>} />;
const IconDownload = (p) => <Icon {...p} path={<><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></>} />;
const IconX = (p) => <Icon {...p} path={<><path d="M18 6 6 18"/><path d="M6 6l12 12"/></>} />;
const IconEye = (p) => <Icon {...p} path={<><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3"/></>} />;
const IconEyeOff = (p) => <Icon {...p} path={<><path d="M3 3l18 18"/><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c7 0 10.5 7 10.5 7a13.2 13.2 0 0 1-3 3.9M6.6 6.6C3.7 8.4 1.5 12 1.5 12s3.5 7 10.5 7a10.1 10.1 0 0 0 4.2-.9"/><path d="M9.5 9.8a3 3 0 0 0 4.2 4.2"/></>} />;
const IconAlert = (p) => <Icon {...p} path={<><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></>} />;
const IconCheck = (p) => <Icon {...p} path={<><path d="M20 6 9 17l-5-5"/></>} />;
const IconLogout = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></>} />;
const IconMenu = (p) => <Icon {...p} path={<><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>} />;
const IconChevronUp = (p) => <Icon {...p} path={<path d="m18 15-6-6-6 6"/>} />;
const IconChevronDown = (p) => <Icon {...p} path={<path d="m6 9 6 6 6-6"/>} />;
const IconChevronsLeft = (p) => <Icon {...p} path={<><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></>} />;
const IconWallet = (p) => <Icon {...p} path={<><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2Z"/><circle cx="16" cy="14" r="1.4"/></>} />;
const IconTrendUp = (p) => <Icon {...p} path={<><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></>} />;
const IconTrendDown = (p) => <Icon {...p} path={<><path d="M3 7l6 6 4-4 8 8"/><path d="M21 11v6h-6"/></>} />;
const IconFileExcel = (p) => <Icon {...p} path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 13 6 6"/><path d="m15 13-6 6"/></>} />;
const IconTracking = (p) => <Icon {...p} path={<><path d="M9 20V10"/><path d="M15 20V4"/><path d="M4 20a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1"/><circle cx="19" cy="6" r="3"/><path d="M19 9v2a2 2 0 0 1-2 2h-2"/></>} />;
const IconInvoice = (p) => <Icon {...p} path={<><path d="M6 2.5h9l3 3v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-18a1 1 0 0 1 1-1Z"/><path d="M15 2.5v3a1 1 0 0 0 1 1h3"/><path d="M8.5 11h7"/><path d="M8.5 14.5h7"/><path d="M8.5 18h4"/></>} />;
const IconPrinter = (p) => <Icon {...p} path={<><path d="M6 9V3h12v6"/><path d="M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><path d="M6 14h12v7H6z"/></>} />;
const IconBox = (p) => <Icon {...p} path={<><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></>} />;
const IconCable = (p) => <Icon {...p} path={<><path d="M4 4v4a4 4 0 0 0 4 4h1"/><path d="M20 20v-4a4 4 0 0 0-4-4h-1"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="20" r="2"/><path d="M9 12h6"/></>} />;
const IconReport = (p) => <Icon {...p} path={<><path d="M4 19V5a1 1 0 0 1 1-1h9l5 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M13 4v5h5"/><path d="M8 13h8"/><path d="M8 16.5h8"/></>} />;
const IconBell = (p) => <Icon {...p} path={<><path d="M6 8a6 6 0 0 1 12 0c0 4.2 1.3 6.2 2 7H4c.7-.8 2-2.8 2-7Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>} />;

/* ---------------------------------- HELPERS ---------------------------------- */
const AVATAR_BG_PALETTE = ["#E3F3F0","#FEF3E2","#EAF0FE","#FDECEC","#EDE9FE","#E0F6FA"];
const AVATAR_FG_PALETTE = ["#0B5148","#B45309","#3730A3","#B91C1C","#6D28D9","#0E7490"];
const hashString = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
};
const bgFromString = (s = "") => AVATAR_BG_PALETTE[hashString(s) % AVATAR_BG_PALETTE.length];
const fgFromString = (s = "") => AVATAR_FG_PALETTE[hashString(s) % AVATAR_FG_PALETTE.length];
// Inisial nama dipakai sebagai avatar (BUKAN emoji/foto) — konsisten & profesional untuk seluruh karyawan.
const initialsFromString = (s = "") => {
  const parts = s.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
// Path ke icon default yang ditaruh di public/admin/assets/. Sesuaikan nama file/ekstensi
// di sini kalau berbeda dari "avatar-default.svg" (mis. jadi .png) di server kamu.
const AVATAR_DEFAULT_SRC = "/admin/assets/avatar-default.svg";
const Avatar = ({ name, size = 36 }) => {
  const [gagalMuat, setGagalMuat] = useState(false);
  if (gagalMuat) {
    // Fallback ke inisial kalau file icon default tidak ditemukan/gagal dimuat
    return (
      <div
        className="rounded-full flex items-center justify-center shrink-0 font-black"
        style={{ width: size, height: size, fontSize: size * 0.38, background: bgFromString(name), color: fgFromString(name), lineHeight: 1 }}
      >{initialsFromString(name)}</div>
    );
  }
  return (
    <img
      src={AVATAR_DEFAULT_SRC}
      alt={name || "Avatar"}
      onError={() => setGagalMuat(true)}
      className="rounded-full shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  );
};

/* ---------------------------------- ROLE & ACCESS CONFIG ---------------------------------- */
// Struktur hak akses SETNET (update pembagian tugas terbaru):
//  teknisi -> TIDAK bisa masuk Portal Admin (hanya aplikasi absensi HP)
//  admin   -> HANYA menu Dashboard Utama (tanpa card Tracking BAST & Finance) + Pemakaian Material
//  gudang  -> sama seperti admin: Dashboard Utama (tanpa card Tracking BAST & Finance) + Pemakaian Material
//  finance -> Dashboard Utama, Keuangan, Invoice, Tracking BAST
//  hrd     -> akses PENUH (setara owner) termasuk approve Cuti/Izin/Sakit, KECUALI approve Kasbon (khusus owner)
//  owner   -> akses penuh ke seluruh modul, termasuk approve Kasbon
const ROLES = {
  teknisi: { label: "Teknisi", badgeBg: "#F1F5F9", badgeFg: "#475467" },
  admin:   { label: "Staf Admin", badgeBg: "#E3F3F0", badgeFg: "#0B5148" },
  gudang:  { label: "Staf Gudang", badgeBg: "#FEF3E2", badgeFg: "#B45309" },
  finance: { label: "Staf Finance", badgeBg: "#EDE9FE", badgeFg: "#6D28D9" },
  owner:   { label: "Owner", badgeBg: "#0B1220", badgeFg: "#FFFFFF" },
  hrd:       { label: "Owner (Legacy)", badgeBg: "#0B1220", badgeFg: "#FFFFFF" },
  karyawan: { label: "Teknisi (Legacy)", badgeBg: "#F1F5F9", badgeFg: "#475467" },
};
const roleInfo = (r) => ROLES[r] || { label: r || "—", badgeBg: "var(--canvas)", badgeFg: "var(--ink-soft)" };

// Role yang boleh masuk Portal Admin
const PORTAL_ROLES = ["admin", "gudang", "finance", "owner", "hrd"];

// Role yang setara "owner" (akses penuh) — termasuk akun legacy 'hrd'.
// CATATAN: hrd tetap "owner-like" untuk akses MENU, tapi approve Kasbon
// tetap dikunci khusus role 'owner' saja — lihat tombol ACC/Tolak Kasbon di bawah.
const isOwnerLike = (role) => role === "owner" || role === "hrd";

// Menu mana yang boleh diakses tiap role
const MENU_ACCESS = {
  dashboard: ["admin", "gudang", "finance", "owner", "hrd"],
  crud:      ["owner", "hrd"], // <--- BERHASIL DIKUNCI HANYA UNTUK OWNER
  log:       ["owner", "hrd"], // <--- Log Absensi: khusus Owner (admin/gudang/finance tidak lagi akses ini)
  keuangan:  ["finance", "owner", "hrd"],
  invoice:   ["finance", "owner", "hrd"], // <--- Invoice/Penagihan: khusus Finance & Owner
  tracking:  ["finance", "owner", "hrd"], // <--- Tracking BAST: sekarang Finance juga bisa akses
  kasbon:    ["owner", "hrd"], // <--- Menu Kasbon & Cuti/Izin/Sakit; approve KASBON tetap dikunci khusus owner (lihat tombol ACC di bawah)
  material:  ["admin", "gudang", "owner", "hrd"], // <--- Pemakaian Material: admin & gudang boleh kelola, finance tidak lagi akses
  salary:    ["owner", "hrd"], // <--- Submenu "Salary" di bawah Master Data Karyawan: gaji pokok, limit kasbon manual, tandai gaji dibayar
};
const canAccess = (role, menuKey) => (MENU_ACCESS[menuKey] || []).includes(role);

// Role yang boleh KELOLA material (CRUD master, input log pemakaian/stok) — mengikuti
// MANAGE_ROLES di backend routes/material.js. Role lain di menu "material" (finance, hrd)
// hanya bisa LIHAT daftar & laporan, tombol tambah/edit/hapus disembunyikan.
const MATERIAL_MANAGE_ROLES = ["admin", "gudang", "owner", "hrd"]; // hrd akses penuh, ikut bisa kelola material
const canManageMaterial = (role) => MATERIAL_MANAGE_ROLES.includes(role);
const fmtRupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

// Status kepegawaian: Aktif (masih bekerja) / Non Aktif (sudah tidak bekerja).
// Ubah status HANYA boleh oleh role hrd & owner (lihat PUT /admin/karyawan/:id/status di
// backend, yang sudah dikunci requireRole('hrd','owner')) — role lain hanya bisa melihat.
const statusInfo = (status) => status === "Non Aktif"
  ? { label: "Non Aktif", bg: "var(--red-soft)", fg: "var(--red)" }
  : { label: "Aktif", bg: "var(--green-soft)", fg: "var(--green)" };

// --- Terbilang: konversi angka ke teks Bahasa Indonesia (untuk cetak invoice) ---
const TERBILANG_SATUAN = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
const terbilangAngka = (n) => {
  n = Math.floor(Math.abs(n));
  if (n < 12) return TERBILANG_SATUAN[n];
  if (n < 20) return `${terbilangAngka(n - 10)} Belas`;
  if (n < 100) return `${terbilangAngka(Math.floor(n / 10))} Puluh ${terbilangAngka(n % 10)}`.trim();
  if (n < 200) return `Seratus ${terbilangAngka(n - 100)}`.trim();
  if (n < 1000) return `${terbilangAngka(Math.floor(n / 100))} Ratus ${terbilangAngka(n % 100)}`.trim();
  if (n < 2000) return `Seribu ${terbilangAngka(n - 1000)}`.trim();
  if (n < 1000000) return `${terbilangAngka(Math.floor(n / 1000))} Ribu ${terbilangAngka(n % 1000)}`.trim();
  if (n < 1000000000) return `${terbilangAngka(Math.floor(n / 1000000))} Juta ${terbilangAngka(n % 1000000)}`.trim();
  if (n < 1000000000000) return `${terbilangAngka(Math.floor(n / 1000000000))} Miliar ${terbilangAngka(n % 1000000000)}`.trim();
  return `${terbilangAngka(Math.floor(n / 1000000000000))} Triliun ${terbilangAngka(n % 1000000000000)}`.trim();
};
const terbilangRupiah = (n) => {
  const v = Math.round(Number(n) || 0);
  if (v === 0) return "Nol Rupiah";
  return `${terbilangAngka(v).replace(/\s+/g, " ").trim()} Rupiah`;
};

// Perhitungan total invoice mengikuti standar PPN 12% dengan DPP Nilai Lain (efektif 11%)
// Data perusahaan pengirim invoice — otomatis tampil di kop cetak invoice, tidak perlu diisi manual tiap buat invoice
const NAMA_PERUSAHAAN_INVOICE = "SERATA NETWORK'S";
const ALAMAT_PERUSAHAAN_INVOICE = "JL. Duku No. 02 Srengseng, Kembangan, Jakarta Barat";
const TELP_PERUSAHAAN_INVOICE = "+62 857 6184 3118";
// Logo perusahaan (base64) yang tampil di kop cetak invoice, di samping nama perusahaan.
const LOGO_PERUSAHAAN_INVOICE = "data:image/jpeg;base64,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";

const hitungTotalInvoice = (items, pinalty, lessDeposit, dendaSetelahPpn, pungutanPpn) => {
  const hargaJual = (items || []).reduce((a, it) => a + (Number(it.hargaSatuan) || 0), 0);
  const subtotalSetelahPinalty = hargaJual - (Number(pinalty) || 0);
  const balanceDue = subtotalSetelahPinalty - (Number(lessDeposit) || 0) - (Number(pungutanPpn) || 0) + (Number(dendaSetelahPpn) || 0);
  return { hargaJual, subtotalSetelahPinalty, balanceDue };
};

// --- Konstanta Modul Tracking BAST ---
const TRACKING_REGIONS = ["Jabodetabek", "Medan", "Jawa Timur", "Bali"];
const TRACKING_WO_TYPES = ["IB", "Fault Repair", "ONM", "Material ONM", "SWAP ONT", "LBS", "Rectification", "ODC"];
const TRACKING_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const TRACKING_STATUS = ["Waiting Submit", "Waiting BAST Final", "BAST Final", "Proses Finance"];
const trackingStatusTone = (s) => ({
  "Waiting Submit": { bg: "var(--amber-soft)", fg: "var(--amber)" },
  "Waiting BAST Final": { bg: "var(--brand-soft)", fg: "var(--brand-dark)" },
  "BAST Final": { bg: "var(--green-soft)", fg: "var(--green)" },
  "Proses Finance": { bg: "#EDE9FE", fg: "#6D28D9" },
}[s] || { bg: "var(--canvas)", fg: "var(--ink-soft)" });

// --- Konstanta Modul Kasbon & Pengajuan Cuti/Izin/Sakit ---
const PENGAJUAN_JENIS = ["Cuti", "Izin", "Sakit"];
const keputusanStatusTone = (s) => ({
  "Pending": { bg: "var(--amber-soft)", fg: "var(--amber)" },
  "Disetujui": { bg: "var(--green-soft)", fg: "var(--green)" },
  "Ditolak": { bg: "var(--red-soft)", fg: "var(--red)" },
}[s] || { bg: "var(--canvas)", fg: "var(--ink-soft)" });

const toCsv = (rows, headers) => {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.map(h => esc(h.label)).join(",")];
  rows.forEach(r => lines.push(headers.map(h => esc(h.get(r))).join(",")));
  return lines.join("\n");
};
const downloadCsv = (filename, csv) => {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/* ---------------------------------- SMALL UI PARTS ---------------------------------- */
const StatCard = ({ label, value, unit, tone, icon }) => {
  const tones = {
    brand: { bg: "var(--brand-grad)", fg: "#fff" },
    green: { bg: "linear-gradient(135deg,#22C55E,#15803D)", fg: "#fff" },
    amber: { bg: "linear-gradient(135deg,#F59E0B,#B45309)", fg: "#fff" },
  }[tone] || { bg: "var(--brand-grad)", fg: "#fff" };
  return (
    <div className="elev-card bg-white p-5 rounded-2xl border flex items-start justify-between" style={{ borderColor: "var(--border)" }}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{label}</p>
        <p className="text-3xl font-bold font-display mt-1.5" style={{ color: "var(--ink)" }}>
          {value} <span className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>{unit}</span>
        </p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tones.bg, color: tones.fg, boxShadow: "var(--shadow-xs)" }}>
        {icon}
      </div>
    </div>
  );
};

const EmptyState = ({ title, subtitle, icon }) => (
  <div className="p-12 flex flex-col items-center justify-center text-center gap-2">
    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--canvas)", color: "var(--ink-soft)" }}>{icon}</div>
    <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{title}</p>
    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{subtitle}</p>
  </div>
);

const Pagination = ({ page, setPage, totalPages, totalItems, pageSize, pageSizeOptions, onPageSizeChange }) => {
  if (totalItems === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-3 border-t text-xs" style={{ borderColor: "var(--border)" }}>
      <span style={{ color: "var(--ink-soft)" }}>Menampilkan <b style={{ color: "var(--ink)" }}>{from}–{to}</b> dari {totalItems}</span>
      <div className="flex items-center gap-3">
        {Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 && (
          <label className="flex items-center gap-1.5 whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>
            Tampilkan
            <select value={pageSize} onChange={e => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="border rounded-lg text-xs font-semibold px-2 py-1 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
              {pageSizeOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-2.5 py-1.5 rounded-lg border font-semibold disabled:opacity-40 hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>Prev</button>
          <span className="font-mono px-1.5" style={{ color: "var(--ink-soft)" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-2.5 py-1.5 rounded-lg border font-semibold disabled:opacity-40 hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>Next</button>
        </div>
      </div>
    </div>
  );
};

const SortHeader = ({ label, field, sortKey, sortDir, onSort, className = "" }) => (
  <th className={`p-4 select-none cursor-pointer ${className}`} onClick={() => onSort(field)}>
    <span className="inline-flex items-center gap-1">
      {label}
      {sortKey === field ? (sortDir === "asc" ? <IconChevronUp className="w-3 h-3" /> : <IconChevronDown className="w-3 h-3" />) : null}
    </span>
  </th>
);

const ToastStack = ({ toasts, dismiss }) => (
  <div className="fixed top-5 left-5 right-5 sm:left-auto sm:right-5 z-[100] space-y-2 w-auto sm:w-80">
    {toasts.map(t => (
      <div key={t.id} className={`toast-in flex items-start gap-2.5 p-3.5 rounded-xl shadow-lg border bg-white`} style={{ borderColor: t.type === "error" ? "#FCA5A5" : "var(--border)" }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: t.type === "error" ? "var(--red-soft)" : t.type === "info" ? "var(--amber-soft)" : "var(--green-soft)",
            color: t.type === "error" ? "var(--red)" : t.type === "info" ? "var(--amber)" : "var(--green)"
          }}>
          {t.type === "error" ? <IconAlert className="w-3.5 h-3.5" /> : t.type === "info" ? <IconBell className="w-3.5 h-3.5" /> : <IconCheck className="w-3.5 h-3.5" />}
        </div>
        <p className="text-xs font-semibold flex-1 pt-0.5" style={{ color: "var(--ink)" }}>{t.message}</p>
        <button onClick={() => dismiss(t.id)} className="text-gray-300 hover:text-gray-500"><IconX className="w-3.5 h-3.5" /></button>
      </div>
    ))}
  </div>
);

const ConfirmModal = ({ open, title, description, confirmLabel = "Hapus", onConfirm, onCancel, danger = true }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: "rgba(11,18,32,.45)" }} onClick={onCancel}>
      <div className="modal-in bg-white rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: danger ? "var(--red-soft)" : "var(--brand-soft)", color: danger ? "var(--red)" : "var(--brand-dark)" }}>
          <IconAlert className="w-5 h-5" />
        </div>
        <h3 className="font-bold font-display text-base" style={{ color: "var(--ink)" }}>{title}</h3>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{description}</p>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border font-semibold text-xs hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>Batal</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-white"
            style={{ background: danger ? "var(--red)" : "var(--brand)" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

const PhotoModal = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: "rgba(11,18,32,.6)" }} onClick={onClose}>
      <div className="modal-in bg-white rounded-2xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{data.nama}</p>
            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{data.label} · {data.waktu}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><IconX className="w-4 h-4" style={{ color: "var(--ink-soft)" }} /></button>
        </div>
        {data.foto ? (
          <img src={data.foto} alt={data.label} className="w-full rounded-xl border object-cover" style={{ borderColor: "var(--border)" }} />
        ) : (
          <div className="w-full aspect-video rounded-xl border flex items-center justify-center text-xs font-semibold" style={{ borderColor: "var(--border)", color: "var(--ink-soft)", background: "var(--canvas)" }}>Foto tidak tersedia</div>
        )}
      </div>
    </div>
  );
};

/* ---------------------------------- INVOICE PRINT VIEW ---------------------------------- */
const InvoicePrintView = ({ invoice }) => {
  if (!invoice) return null;
  const totals = hitungTotalInvoice(invoice.items, invoice.pinalty, invoice.less_deposit, invoice.denda_setelah_ppn, invoice.pungutan_ppn);
  const rows = [
    ["Harga Jual", totals.hargaJual],
    ["Pinalty", invoice.pinalty || 0],
    ["Less: Deposit", invoice.less_deposit || 0],
    ["Denda Setelah PPN", invoice.denda_setelah_ppn || 0],
    ["Pungtan PPN", invoice.pungutan_ppn || 0],
    ["Balance Due", totals.balanceDue],
  ];
  return (
    <div id="invoice-print-area" style={{ fontFamily: "Arial, sans-serif", color: "#111", padding: "28px", fontSize: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "6px" }}>
        <img src={LOGO_PERUSAHAAN_INVOICE} alt={NAMA_PERUSAHAAN_INVOICE} style={{ width: "56px", height: "56px", objectFit: "contain", flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "1px", marginBottom: "1px" }}>{NAMA_PERUSAHAAN_INVOICE}</p>
          <p style={{ fontSize: "11px", marginBottom: "1px" }}>{ALAMAT_PERUSAHAAN_INVOICE}</p>
          <p style={{ fontSize: "11px" }}>{TELP_PERUSAHAAN_INVOICE}</p>
        </div>
      </div>
      <h1 style={{ textAlign: "center", fontSize: "26px", fontWeight: 700, letterSpacing: "1px", marginBottom: "22px", marginTop: "-4px" }}>INVOICE</h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", marginBottom: "18px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, marginBottom: "2px" }}>Bill To:</p>
          <p style={{ fontWeight: 700 }}>{invoice.bill_nama}</p>
          <p style={{ maxWidth: "320px" }}>{invoice.bill_alamat}</p>
        </div>
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Invoice No", invoice.nomor],
              ["Date", new Date(invoice.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })],
              ["Page", "1"],
              ["P.O. Number", invoice.po_number || "-"],
              ["Payment Due Date", invoice.jatuh_tempo ? new Date(invoice.jatuh_tempo).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"],
            ].map(([k, v]) => (
              <tr key={k}>
                <td style={{ fontWeight: 700, padding: "1px 8px 1px 0" }}>{k}</td>
                <td style={{ padding: "1px 4px" }}>:</td>
                <td style={{ padding: "1px 0" }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginBottom: "18px" }}>
        <p style={{ fontWeight: 700, marginBottom: "2px" }}>Ship To:</p>
        <p style={{ fontWeight: 700 }}>{invoice.ship_nama}</p>
        <p style={{ maxWidth: "320px" }}>{invoice.ship_alamat}</p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", marginBottom: "16px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Item Description</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "60px" }}>Qty</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "110px" }}>Unit Price</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "130px" }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items || []).map((it, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #000", padding: "6px" }}>{it.deskripsi}</td>
              <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{Number(it.qty).toLocaleString("id-ID")}</td>
              <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right" }}>{fmtRupiah(it.hargaSatuan)}</td>
              <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right" }}>{fmtRupiah(Number(it.hargaSatuan))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, maxWidth: "320px" }}>
          <p style={{ fontWeight: 700, marginBottom: "2px" }}>Terbilang</p>
          <p style={{ fontStyle: "italic" }}>{terbilangRupiah(totals.balanceDue)}</p>
        </div>
        <table style={{ borderCollapse: "collapse", minWidth: "300px" }}>
          <tbody>
            {rows.map(([label, val]) => (
              <tr key={label}>
                <td style={{ border: "1px solid #000", padding: "5px 8px", fontWeight: label === "Balance Due" ? 700 : 500 }}>{label}</td>
                <td style={{ border: "1px solid #000", padding: "5px 8px", textAlign: "right", fontWeight: label === "Balance Due" ? 700 : 500 }}>{fmtRupiah(val)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(invoice.rek_bank || invoice.rek_nomor || invoice.ttd_nama) && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", marginTop: "48px" }}>
          <div style={{ flex: 1 }}>
            {(invoice.rek_bank || invoice.rek_nomor) && (
              <>
                <p style={{ fontWeight: 700, marginBottom: "2px" }}>{NAMA_PERUSAHAAN_INVOICE}</p>
                {invoice.rek_nomor && <p>No. Rek {invoice.rek_nomor}</p>}
                {invoice.rek_bank && <p>{invoice.rek_bank}</p>}
                {invoice.rek_kota && <p>{invoice.rek_kota}</p>}
              </>
            )}
          </div>
          {invoice.ttd_nama && (
            <div style={{ flex: 1, textAlign: "center" }}>
              <p>Hormat kami,</p>
              <p style={{ fontWeight: 700, marginBottom: "100px" }}>{invoice.ttd_jabatan || "Direktur"}</p>
              <p style={{ fontWeight: 700, textDecoration: "underline" }}>{invoice.ttd_nama}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------- LOGIN SCREEN ---------------------------------- */
const AUTH_API = "/api/absen/login";

const LoginScreen = ({ onLoginSuccess }) => {
  const [karyawanId, setKaryawanId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!karyawanId || !password) { setError("ID dan Password wajib diisi"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ karyawan_id: karyawanId, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status !== 200) {
        setError(data.message || "ID Karyawan atau password salah");
        return;
      }
      if (!PORTAL_ROLES.includes(data.karyawan.role)) {
        setError("Akun teknisi tidak memiliki akses ke Portal Admin. Silakan gunakan aplikasi absensi karyawan.");
        return;
      }
      onLoginSuccess(data.karyawan);
    } catch (err) {
      setError("Gagal terhubung ke server backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--canvas)" }}>
      <div className="bg-white p-7 rounded-2xl shadow-xl border w-full max-w-sm" style={{ borderColor: "var(--border)" }}>
        <div className="text-center mb-6">
          <span className="text-2xl font-bold font-display tracking-tight" style={{ color: "var(--brand)" }}>SETNET</span>
          <p className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: "var(--ink-soft)" }}>Portal Admin</p>
        </div>
        {error && (
          <div className="p-3 rounded-xl text-xs font-semibold mb-4 text-center flex items-center gap-2 justify-center" style={{ background: "var(--red-soft)", color: "var(--red)" }}>
            <IconAlert className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--ink-soft)" }}>ID Karyawan</label>
            <input type="text" placeholder="Contoh: K001" value={karyawanId} onChange={e => setKaryawanId(e.target.value)} autoFocus
              className="w-full px-4 py-2.5 border rounded-xl outline-none text-sm font-semibold" style={{ borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--ink-soft)" }}>Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border rounded-xl outline-none text-sm font-semibold" style={{ borderColor: "var(--border)" }} />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-60 text-sm" style={{ background: "var(--brand)" }}>
            {loading ? "Memvalidasi..." : "MASUK KE PORTAL"}
          </button>
        </form>
        <p className="text-[11px] text-center mt-4" style={{ color: "var(--ink-soft)" }}>Portal ini untuk Staf Admin, Staf Gudang, Staf Finance & Owner. Akun teknisi harap gunakan aplikasi absensi.</p>
      </div>
    </div>
  );
};

/* ---------------------------------- MAIN APP ---------------------------------- */
const API = "/api/admin";
const FIN_API = "/api/finance";
const TRACK_API = "/api";
const MATERIAL_API = "/api"; 
// Preset pilihan dropdown Master Material & Pemakaian Teknisi — bisa ditambah/kurangi sesuai kebutuhan.
const KABEL_METER_PRESETS = [50, 80, 100, 150, 200, 250];
const ONT_MEREK_PRESETS = ["ZTE", "Huawei", "Nokia", "Pejas"];
const PROJECT_PRESETS = ["AMT", "FS", "LinkNet"];
const REGION_PRESETS = ["Jakbar", "Jakut", "Jakpus", "Jaksel", "Jaktim", "Bekasi", "Bogor", "Depok", "Bekasi Timur", "Tangerang", "Tangkot"];
const VENDOR_PRESETS = ["Quantum", "Satu Visi", "BBB"];

function DashboardAdmin({ session, onLogout }) {
  // Header identitas role dikirim ke backend agar endpoint bisa memfilter akses per role.
  const authHeaders = useCallback(() => ({
    "x-user-role": session.role,
    "x-user-id": session.karyawan_id,
  }), [session]);

  // Jika menu yang tersimpan (mis. dari sesi sebelumnya) tidak diizinkan untuk role ini, alihkan ke dashboard
  const [currentMenu, _setCurrentMenu] = useState(canAccess(session.role, "dashboard") ? "dashboard" : "log");
  const setCurrentMenu = (key) => { if (canAccess(session.role, key)) _setCurrentMenu(key); };
  // Submenu sidebar yang sedang dibuka (mis. "crud" -> menampilkan sub-item "Salary" di bawahnya)
  const [expandedNav, setExpandedNav] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Konfirmasi sebelum benar-benar logout, supaya tidak ke-klik tidak sengaja.
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  // Mode rail (icon-only) untuk sidebar desktop — beda dari sidebarOpen (drawer mobile).
  // Preferensi disimpan di browser supaya nggak reset tiap refresh.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem("satnet_sidebar_collapsed") === "1"; } catch { return false; }
  });
  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(v => {
      const next = !v;
      try { localStorage.setItem("satnet_sidebar_collapsed", next ? "1" : "0"); } catch {}
      return next;
    });
  };

  const [karyawanList, setKaryawanList] = useState([]);
  const [rekapAbsen, setRekapAbsen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const dismissToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  // form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [karyawanId, setKaryawanId] = useState("");
  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [passwordKaryawan, setPasswordKaryawan] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleKaryawan, setRoleKaryawan] = useState("teknisi");
  const [nikKaryawan, setNikKaryawan] = useState("");
  const [tanggalLahirKaryawan, setTanggalLahirKaryawan] = useState("");
  const [noTelpKaryawan, setNoTelpKaryawan] = useState("");
  const [cabangKaryawan, setCabangKaryawan] = useState("");
  const [alamatKaryawan, setAlamatKaryawan] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // crud table controls
  const [searchKaryawan, setSearchKaryawan] = useState("");
  const [roleFilterKaryawan, setRoleFilterKaryawan] = useState("semua");
  const [statusFilterKaryawan, setStatusFilterKaryawan] = useState("semua");
  const [sortKey, setSortKey] = useState("nama");
  const [sortDir, setSortDir] = useState("asc");
  const [pageKaryawan, setPageKaryawan] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusUbahTarget, setStatusUbahTarget] = useState(null); // karyawan yang sedang dikonfirmasi ubah status Aktif/Non Aktif
  const PAGE_SIZE_K = 6;

  // log controls
  const [searchLog, setSearchLog] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [pageLog, setPageLog] = useState(1);
  const PAGE_SIZE_L = 8;

  const [transaksiList, setTransaksiList] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const [trackingList, setTrackingList] = useState([]);
  // Notifikasi ringkas dokumen BAST Final yang belum dibuatkan invoice — dipakai role
  // yang punya akses modul Invoice tapi TIDAK punya akses penuh modul Tracking (admin/finance).
  const [trackingNotifFinance, setTrackingNotifFinance] = useState({ jumlah: 0, data: [] });
  const [kasbonList, setKasbonList] = useState([]);
  const [pengajuanCISList, setPengajuanCISList] = useState([]);
  const [kasbonSubTab, setKasbonSubTab] = useState("Kasbon");
  const [searchKasbon, setSearchKasbon] = useState("");
  const [kasbonStatusFilter, setKasbonStatusFilter] = useState("semua");
  const [pageKasbon, setPageKasbon] = useState(1);
  const [pageSizeKasbon, setPageSizeKasbon] = useState(10);
  const [searchPengajuanCIS, setSearchPengajuanCIS] = useState("");
  const [pengajuanCISStatusFilter, setPengajuanCISStatusFilter] = useState("semua");
  const [pagePengajuanCIS, setPagePengajuanCIS] = useState(1);
  const [pageSizePengajuanCIS, setPageSizePengajuanCIS] = useState(10);
  const PAGE_SIZE_OPTIONS_KASBON = [10, 20, 50, 100];

  // ==================== NOTIFIKASI LONCENG (header): pengajuan kasbon & cuti/izin/sakit Pending ====================
  const [notifOpen, setNotifOpen] = useState(false);
  const notifSeenIdsRef = useRef(null); // Set id (kasbon+pengajuan) yang sudah pernah ditampilkan sbg toast, biar tidak dobel tiap polling 4 detik

  // ==================== MODUL SALARY (submenu Master Data Karyawan): state ====================
  const [salaryList, setSalaryList] = useState([]); // master: gaji pokok + limit kasbon per karyawan
  const [salaryLoading, setSalaryLoading] = useState(false);
  const salaryPeriodeDefault = () => new Date().toISOString().slice(0, 7); // "YYYY-MM" bulan berjalan
  const [salaryPeriode, setSalaryPeriode] = useState(salaryPeriodeDefault());
  const [salaryPaymentList, setSalaryPaymentList] = useState([]); // ringkasan bayar utk periode terpilih
  const [salaryPaymentLoading, setSalaryPaymentLoading] = useState(false);
  const [searchSalary, setSearchSalary] = useState("");
  const [pageSalary, setPageSalary] = useState(1);
  const PAGE_SIZE_SAL = 8;
  // Dialog edit gaji pokok & limit kasbon 1 karyawan
  const [salaryEditTarget, setSalaryEditTarget] = useState(null); // { karyawan_id, nama, ... }
  const [salaryEditGajiPokok, setSalaryEditGajiPokok] = useState("");
  const [salaryEditLimitKasbon, setSalaryEditLimitKasbon] = useState("");
  const [salaryFormErrors, setSalaryFormErrors] = useState({});
  const [salarySubmitting, setSalarySubmitting] = useState(false);
  const [bayarSubmittingId, setBayarSubmittingId] = useState(null); // karyawan_id yang sedang diproses tombol "Tandai Sudah Dibayar"

  // ==================== MODUL MATERIAL: state ====================
  const [materialSubTab, setMaterialSubTab] = useState("Master"); // Master | Pemakaian | Stok | Laporan
  const [materialList, setMaterialList] = useState([]);
  const [pemakaianList, setPemakaianList] = useState([]);
  const [stokLogList, setStokLogList] = useState([]);
  const [materialReport, setMaterialReport] = useState({ perMaterial: [], perTeam: [] });
  const [reportLoading, setReportLoading] = useState(false);

  // form: master material
  const [matEditId, setMatEditId] = useState(null);
  const [matKategori, setMatKategori] = useState("Kabel");
  const [matNama, setMatNama] = useState("50 M");
  const [matNamaPilihan, setMatNamaPilihan] = useState("50"); // dropdown preset (angka kabel / merek ONT / "Lainnya")
  const [matSatuan, setMatSatuan] = useState("Roll");
  const [matSnOnt, setMatSnOnt] = useState(""); // opsional, khusus kategori ONT saat pertama didaftarkan
  const [matFormErrors, setMatFormErrors] = useState({});
  const [matSubmitting, setMatSubmitting] = useState(false);
  const [matDeleteTarget, setMatDeleteTarget] = useState(null);
  const [searchMaterial, setSearchMaterial] = useState("");
  const [pageMaterial, setPageMaterial] = useState(1);
  const PAGE_SIZE_MAT = 8;

  // form: log pemakaian material oleh teknisi
  const [pmkEditId, setPmkEditId] = useState(null);
  const [pmkTanggal, setPmkTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [pmkTeknisiId, setPmkTeknisiId] = useState("");
  const [pmkNamaTeam, setPmkNamaTeam] = useState("");
  const [pmkMerekModem, setPmkMerekModem] = useState("ZTE");
  const [pmkMerekPilihan, setPmkMerekPilihan] = useState("ZTE"); // dropdown preset merek modem, "Lainnya" -> custom
  const [pmkSnOnt, setPmkSnOnt] = useState(""); // dipakai saat mode EDIT (1 baris)
  const [pmkKabelId, setPmkKabelId] = useState(""); // dipakai saat mode EDIT (1 baris)
  const [pmkJumlahOnt, setPmkJumlahOnt] = useState(1); // dipakai saat mode TAMBAH (batch)
  const [pmkSnOntList, setPmkSnOntList] = useState([""]); // dipakai saat mode TAMBAH (batch)
  const [pmkKabelRows, setPmkKabelRows] = useState([{ kabel_id: "", jumlah: 1 }]); // dipakai saat mode TAMBAH (batch)
  const [pmkStatus, setPmkStatus] = useState("Idle");
  const [pmkReturnCatatan, setPmkReturnCatatan] = useState("");
  const [pmkProject, setPmkProject] = useState("");
  const [pmkRegion, setPmkRegion] = useState("");
  const [pmkVendor, setPmkVendor] = useState("");
  const [pmkFormErrors, setPmkFormErrors] = useState({});
  const [pmkSubmitting, setPmkSubmitting] = useState(false);
  const [pmkDeleteTarget, setPmkDeleteTarget] = useState(null);
  const [searchPemakaian, setSearchPemakaian] = useState("");
  const [pemakaianStatusFilter, setPemakaianStatusFilter] = useState("semua");
  const [pagePemakaian, setPagePemakaian] = useState(1);
  const PAGE_SIZE_PMK = 8;

  // form: log stok masuk (Penambahan) / dikembalikan (Pengembalian)
  const [stkMaterialId, setStkMaterialId] = useState("");
  const [stkTipe, setStkTipe] = useState("Penambahan");
  const [stkJumlah, setStkJumlah] = useState("");
  const [stkTeknisiId, setStkTeknisiId] = useState("");
  const [stkTeknisiNama, setStkTeknisiNama] = useState("");
  const [stkKeterangan, setStkKeterangan] = useState("");
  const [stkSnOntList, setStkSnOntList] = useState([]); // muncul otomatis kalau material terpilih kategori ONT & tipe Penambahan
  const [stkFormErrors, setStkFormErrors] = useState({});
  const [stkSubmitting, setStkSubmitting] = useState(false);
  const [pageStok, setPageStok] = useState(1);
  const PAGE_SIZE_STK = 8;

  // filter laporan
  const [reportDari, setReportDari] = useState("");
  const [reportSampai, setReportSampai] = useState("");

  const muatSemuaData = useCallback(async (silent = false) => {
    try {
      const calls = [
        fetch(`${API}/karyawan`, { headers: authHeaders() }),
        fetch(`${API}/rekap`, { headers: authHeaders() }),
      ];
      if (canAccess(session.role, "keuangan")) calls.push(fetch(`${FIN_API}/transaksi`, { headers: authHeaders() }));
      if (canAccess(session.role, "invoice")) calls.push(fetch(`${FIN_API}/invoice`, { headers: authHeaders() }));
      if (canAccess(session.role, "tracking")) calls.push(fetch(`${TRACK_API}/tracking`, { headers: authHeaders() }));
      const perluNotifFinance = canAccess(session.role, "invoice") && !canAccess(session.role, "tracking");
      if (perluNotifFinance) calls.push(fetch(`${TRACK_API}/tracking/notif-finance`, { headers: authHeaders() }));
      if (canAccess(session.role, "kasbon")) calls.push(fetch(`${TRACK_API}/kasbon`, { headers: authHeaders() }));
      if (canAccess(session.role, "kasbon")) calls.push(fetch(`${TRACK_API}/pengajuan`, { headers: authHeaders() }));
      if (canAccess(session.role, "material")) {
        calls.push(fetch(`${MATERIAL_API}/material`, { headers: authHeaders() }));
        calls.push(fetch(`${MATERIAL_API}/pemakaian-material`, { headers: authHeaders() }));
        calls.push(fetch(`${MATERIAL_API}/material/stok`, { headers: authHeaders() }));
      }
      const results = await Promise.all(calls);
      const dataKaryawan = await results[0].json();
      const dataAbsen = await results[1].json();
      setKaryawanList(Array.isArray(dataKaryawan) ? dataKaryawan : []);
      setRekapAbsen(Array.isArray(dataAbsen) ? dataAbsen : []);
      let idx = 2;
      if (canAccess(session.role, "keuangan")) {
        const dataTransaksi = await results[idx++].json();
        setTransaksiList(Array.isArray(dataTransaksi) ? dataTransaksi : []);
      }
      if (canAccess(session.role, "invoice")) {
        const dataInvoice = await results[idx++].json();
        setInvoiceList(Array.isArray(dataInvoice) ? dataInvoice : []);
      }
      if (canAccess(session.role, "tracking")) {
        const dataTracking = await results[idx++].json();
        setTrackingList(Array.isArray(dataTracking) ? dataTracking : []);
      }
      if (canAccess(session.role, "invoice") && !canAccess(session.role, "tracking")) {
        const dataNotif = await results[idx++].json();
        setTrackingNotifFinance(dataNotif && Array.isArray(dataNotif.data) ? dataNotif : { jumlah: 0, data: [] });
      }
      if (canAccess(session.role, "kasbon")) {
        const dataKasbon = await results[idx++].json();
        setKasbonList(Array.isArray(dataKasbon) ? dataKasbon : []);
        const dataPengajuan = await results[idx++].json();
        setPengajuanCISList(Array.isArray(dataPengajuan) ? dataPengajuan : []);
      }
      if (canAccess(session.role, "material")) {
        const dataMaterial = await results[idx++].json();
        setMaterialList(Array.isArray(dataMaterial) ? dataMaterial : []);
        const dataPemakaian = await results[idx++].json();
        setPemakaianList(Array.isArray(dataPemakaian) ? dataPemakaian : []);
        const dataStokLog = await results[idx++].json();
        setStokLogList(Array.isArray(dataStokLog) ? dataStokLog : []);
      }
      setOnline(true);
      setLastSync(new Date());
    } catch (err) {
      console.error("Gagal sinkronisasi data dari backend server", err);
      setOnline(false);
      if (!silent) notify("Gagal terhubung ke server backend", "error");
    } finally {
      setLoading(false);
    }
  }, [notify, session.role, authHeaders]);

  useEffect(() => {
    muatSemuaData();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") muatSemuaData(true);
    }, 4000);
    const onVisible = () => { if (document.visibilityState === "visible") muatSemuaData(true); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
  }, [muatSemuaData]);

  const resetForm = () => {
    setIsEditing(false); setEditId(null); setKaryawanId(""); setNamaKaryawan("");
    setPasswordKaryawan(""); setRoleKaryawan("teknisi"); setNikKaryawan(""); setTanggalLahirKaryawan(""); setNoTelpKaryawan(""); setCabangKaryawan(""); setAlamatKaryawan("");
    setFormErrors({}); setShowPassword(false);
  };

  const validate = () => {
    const errs = {};
    if (!karyawanId.trim()) errs.karyawanId = "ID karyawan wajib diisi";
    if (!namaKaryawan.trim()) errs.nama = "Nama wajib diisi";
    if (!isEditing && passwordKaryawan.trim().length < 4) errs.password = "Password minimal 4 karakter";
    if (nikKaryawan.trim() && !/^\d{16}$/.test(nikKaryawan.trim())) errs.nik = "NIK KTP harus 16 digit angka";
    if (noTelpKaryawan.trim() && !/^[\d+][\d\s-]{7,}$/.test(noTelpKaryawan.trim())) errs.noTelp = "Format nomor telepon tidak valid";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitKaryawan = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const url = isEditing ? `${API}/update-karyawan/${editId}` : `${API}/tambah-karyawan`;
    const method = isEditing ? "PUT" : "POST";
    const passwordBaruDiisi = isEditing && passwordKaryawan.trim().length > 0 && passwordKaryawan !== "********";
    const bodyData = isEditing
      ? { nama: namaKaryawan, role: roleKaryawan, nik: nikKaryawan.trim(), tanggal_lahir: tanggalLahirKaryawan, no_telp: noTelpKaryawan.trim(), cabang: cabangKaryawan, alamat: alamatKaryawan, ...(passwordBaruDiisi ? { password: passwordKaryawan } : {}) }
      : { karyawan_id: karyawanId, nama: namaKaryawan, password: passwordKaryawan, role: roleKaryawan, nik: nikKaryawan.trim(), tanggal_lahir: tanggalLahirKaryawan, no_telp: noTelpKaryawan.trim(), cabang: cabangKaryawan, alamat: alamatKaryawan };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 200 || res.status === 201) {
        notify(isEditing ? "Data karyawan berhasil diperbarui" : "Anggota baru berhasil terdaftar");
        resetForm();
        muatSemuaData(true);
      } else {
        notify(resData.message || "Gagal memproses data", "error");
      }
    } catch (err) {
      notify("Gagal memproses aksi ke server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const pemicuEdit = (k) => {
    setIsEditing(true); setEditId(k._id); setKaryawanId(k.karyawan_id);
    setNamaKaryawan(k.nama); setRoleKaryawan(k.role); setNikKaryawan(k.nik || ""); setTanggalLahirKaryawan(k.tanggal_lahir ? k.tanggal_lahir.slice(0, 10) : ""); setNoTelpKaryawan(k.no_telp || ""); setCabangKaryawan(k.cabang || ""); setAlamatKaryawan(k.alamat || "");
    setPasswordKaryawan("********"); setFormErrors({});
    setCurrentMenu("crud");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapusKaryawan = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/hapus-karyawan/${deleteTarget._id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        notify(`Karyawan "${deleteTarget.nama}" berhasil dihapus`);
        if (editId === deleteTarget._id) resetForm();
        muatSemuaData(true);
      } else {
        notify("Gagal menghapus data karyawan", "error");
      }
    } catch {
      notify("Gagal menghapus data karyawan", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const onSort = (field) => {
    if (sortKey === field) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(field); setSortDir("asc"); }
  };

  const filteredKaryawan = useMemo(() => {
    const q = searchKaryawan.trim().toLowerCase();
    let list = karyawanList.filter(k => {
      const matchQ = !q || k.nama?.toLowerCase().includes(q) || k.karyawan_id?.toLowerCase().includes(q) || k.role?.toLowerCase().includes(q);
      const matchRole = roleFilterKaryawan === "semua" || k.role === roleFilterKaryawan;
      const matchStatus = statusFilterKaryawan === "semua" || (k.status || "Aktif") === statusFilterKaryawan;
      return matchQ && matchRole && matchStatus;
    });
    list = [...list].sort((a, b) => {
      const va = (a[sortKey] || "").toString().toLowerCase();
      const vb = (b[sortKey] || "").toString().toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [karyawanList, searchKaryawan, roleFilterKaryawan, statusFilterKaryawan, sortKey, sortDir]);

  const totalPagesKaryawan = Math.max(1, Math.ceil(filteredKaryawan.length / PAGE_SIZE_K));
  const pagedKaryawan = filteredKaryawan.slice((pageKaryawan - 1) * PAGE_SIZE_K, pageKaryawan * PAGE_SIZE_K);
  useEffect(() => { setPageKaryawan(1); }, [searchKaryawan, roleFilterKaryawan, statusFilterKaryawan, sortKey, sortDir]);

  // Ringkasan cepat Master Data Karyawan: total, Aktif, Non Aktif, dan jumlah role Owner
  // (dipakai untuk baris StatCard di atas tabel "Database Karyawan")
  const karyawanSummary = useMemo(() => {
    const total = karyawanList.length;
    const aktif = karyawanList.filter(k => (k.status || "Aktif") !== "Non Aktif").length;
    const nonAktif = total - aktif;
    const ownerCount = karyawanList.filter(k => isOwnerLike(k.role)).length;
    return { total, aktif, nonAktif, ownerCount };
  }, [karyawanList]);

  // Peta cepat karyawan_id -> data master (untuk menampilkan Jabatan & Cabang di Log Absensi)
  const karyawanMap = useMemo(() => {
    const map = {};
    karyawanList.forEach(k => { map[k.karyawan_id] = k; });
    return map;
  }, [karyawanList]);

  // Kelompokkan setiap catatan Masuk & Pulang milik karyawan yang sama pada hari yang sama menjadi satu baris (checkin/checkout)
  const groupedLog = useMemo(() => {
    const groups = {};
    [...rekapAbsen].sort((a, b) => new Date(a.waktu_absen) - new Date(b.waktu_absen)).forEach(a => {
      const tgl = new Date(a.waktu_absen);
      const key = `${a.karyawan_id}_${tgl.toDateString()}`;
      if (!groups[key]) {
        groups[key] = { key, karyawan_id: a.karyawan_id, nama: a.nama, tanggal: tgl, shift: a.shift || "Shift 1", masuk: null, pulang: null };
      }
      if (a.status === "Masuk") groups[key].masuk = a;
      else if (a.status === "Pulang") groups[key].pulang = a;
      // Selalu pakai shift dari catatan Masuk bila ada
      if (a.status === "Masuk" && a.shift) groups[key].shift = a.shift;
    });
    return Object.values(groups).sort((a, b) => b.tanggal - a.tanggal);
  }, [rekapAbsen]);

  const filteredLog = useMemo(() => {
    const q = searchLog.trim().toLowerCase();
    return groupedLog.filter(g => {
      const matchQ = !q || g.nama?.toLowerCase().includes(q) || g.karyawan_id?.toLowerCase().includes(q);
      const telat = g.masuk?.keterangan && g.masuk.keterangan !== "Normal";
      let matchStatus = true;
      if (statusFilter === "terlambat") matchStatus = !!telat;
      else if (statusFilter === "tepat") matchStatus = !!g.masuk && !telat;
      else if (statusFilter === "belum_checkout") matchStatus = !!g.masuk && !g.pulang;
      return matchQ && matchStatus;
    });
  }, [groupedLog, searchLog, statusFilter]);
  const totalPagesLog = Math.max(1, Math.ceil(filteredLog.length / PAGE_SIZE_L));
  const pagedLog = filteredLog.slice((pageLog - 1) * PAGE_SIZE_L, pageLog * PAGE_SIZE_L);
  useEffect(() => { setPageLog(1); }, [searchLog, statusFilter]);

  // Preview foto absen (dipakai kolom foto in/out di tabel Log Absensi)
  const [fotoPreview, setFotoPreview] = useState(null);

  const totalMasuk = rekapAbsen.filter(a => a.status === "Masuk").length;
  const totalPulang = rekapAbsen.filter(a => a.status === "Pulang").length;
  const kehadiranPct = karyawanList.length > 0 ? Math.round((new Set(rekapAbsen.filter(a => a.status === "Masuk").map(a => a.karyawan_id)).size / karyawanList.length) * 100) : 0;

  // ==================== DASHBOARD: PERFORMA TIM (RINGKASAN HARI INI, GRAFIK 7 HARI, TRACKING, FINANCE, TERLAMBAT) ====================
  const isSameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

  // 1. Ringkasan Absensi Hari Ini
  const absensiHariIni = useMemo(() => rekapAbsen.filter(a => isSameDay(a.waktu_absen, new Date())), [rekapAbsen]);
  const masukHariIni = useMemo(() => absensiHariIni.filter(a => a.status === "Masuk"), [absensiHariIni]);
  const pulangHariIni = useMemo(() => absensiHariIni.filter(a => a.status === "Pulang"), [absensiHariIni]);
  const hadirHariIniCount = useMemo(() => new Set(masukHariIni.map(a => a.karyawan_id)).size, [masukHariIni]);
  const kehadiranHariIniPct = karyawanList.length > 0 ? Math.round((hadirHariIniCount / karyawanList.length) * 100) : 0;
  const belumAbsenCount = Math.max(karyawanList.length - hadirHariIniCount, 0);

  // 2. Grafik Kehadiran 7 Hari Terakhir (jumlah "Masuk" per hari, H-6 s.d. hari ini)
  const kehadiran7Hari = useMemo(() => {
    const hasil = [];
    for (let i = 6; i >= 0; i--) {
      const tgl = new Date();
      tgl.setDate(tgl.getDate() - i);
      const count = rekapAbsen.filter(a => a.status === "Masuk" && isSameDay(a.waktu_absen, tgl)).length;
      hasil.push({ label: tgl.toLocaleDateString("id-ID", { weekday: "short" }), tanggal: tgl.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }), count, isToday: i === 0 });
    }
    return hasil;
  }, [rekapAbsen]);
  const maxKehadiran7Hari = Math.max(1, ...kehadiran7Hari.map(h => h.count));

  // 3. Statistik Tracking BAST (khusus role yang punya akses modul tracking)
  const trackingStatsDash = useMemo(() => {
    if (!canAccess(session.role, "tracking")) return null;
    const perStatus = Object.fromEntries(TRACKING_STATUS.map(s => [s, 0]));
    let totalWO = 0, totalNilai = 0;
    trackingList.forEach(t => {
      perStatus[t.status] = (perStatus[t.status] || 0) + 1;
      totalWO += t.jumlahWO || 0;
      totalNilai += t.nilaiAsianet || 0;
    });
    return { perStatus, totalWO, totalNilai, totalDokumen: trackingList.length };
  }, [trackingList, session.role]);

  // 4. Ringkasan Finance (khusus role yang punya akses modul keuangan)
  const financeStatsDash = useMemo(() => {
    if (!canAccess(session.role, "keuangan")) return null;
    const masuk = transaksiList.filter(t => t.tipe === "Masuk").reduce((a, b) => a + b.jumlah, 0);
    const keluar = transaksiList.filter(t => t.tipe === "Keluar").reduce((a, b) => a + b.jumlah, 0);
    return { masuk, keluar, saldo: masuk - keluar };
  }, [transaksiList, session.role]);

  // 4b. Ringkasan Material (khusus role yang punya akses modul material) — Stok Awal, Terpakai, Sisa Stok
  const materialStatsDash = useMemo(() => {
    if (!canAccess(session.role, "material")) return null;
    const stokAwal = materialList.reduce((a, m) => a + (m.stock_awal || 0), 0);
    const sisaStok = materialList.reduce((a, m) => a + (m.stock || 0), 0);
    const terpakai = pemakaianList.filter(p => p.status === "Terpakai").length;
    return { stokAwal, terpakai, sisaStok, jumlahJenis: materialList.length };
  }, [materialList, pemakaianList, session.role]);

  // 5. Karyawan Terlambat Hari Ini
  const terlambatHariIni = useMemo(
    () => masukHariIni.filter(a => (a.keterangan || "").startsWith("Terlambat")).sort((a, b) => new Date(a.waktu_absen) - new Date(b.waktu_absen)),
    [masukHariIni]
  );

  // 6. Karyawan Ulang Tahun Hari Ini
  const ulangTahunHariIni = useMemo(() => {
    const now = new Date();
    return karyawanList.filter(k => {
      if (!k.tanggal_lahir) return false;
      const d = new Date(k.tanggal_lahir);
      if (isNaN(d)) return false;
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    }).map(k => {
      const d = new Date(k.tanggal_lahir);
      const usia = new Date().getFullYear() - d.getFullYear();
      return { ...k, usia };
    });
  }, [karyawanList]);

  /* ---------------- MODUL KEUANGAN (Staf Finance & Owner) ---------------- */
  const [finEditId, setFinEditId] = useState(null);
  const [finTanggal, setFinTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [finTipe, setFinTipe] = useState("Masuk");
  const [finKategori, setFinKategori] = useState("");
  const [finJumlah, setFinJumlah] = useState("");
  const [finMetode, setFinMetode] = useState("Transfer");
  const [finKeterangan, setFinKeterangan] = useState("");
  const [finErrors, setFinErrors] = useState({});
  const [finSubmitting, setFinSubmitting] = useState(false);
  const [finDeleteTarget, setFinDeleteTarget] = useState(null);

  const [finSearch, setFinSearch] = useState("");
  const [finTipeFilter, setFinTipeFilter] = useState("semua");
  const [finDari, setFinDari] = useState("");
  const [finSampai, setFinSampai] = useState("");
  const [pageFin, setPageFin] = useState(1);
  const [pageSizeFin, setPageSizeFin] = useState(10);

  const KATEGORI_MASUK = ["Penjualan Jasa", "Pemasangan Baru", "Pembayaran Tagihan Pelanggan", "Lain-lain"];
  const KATEGORI_KELUAR = ["Gaji Karyawan", "Operasional", "Sewa & Utilitas", "Pembelian Perangkat", "Maintenance", "Lain-lain"];

  const resetFormFinance = () => {
    setFinEditId(null); setFinTanggal(new Date().toISOString().slice(0, 10)); setFinTipe("Masuk");
    setFinKategori(""); setFinJumlah(""); setFinMetode("Transfer"); setFinKeterangan(""); setFinErrors({});
  };

  const validateFinance = () => {
    const errs = {};
    if (!finTanggal) errs.tanggal = "Tanggal wajib diisi";
    if (!finKategori.trim()) errs.kategori = "Kategori wajib diisi";
    if (!finJumlah || Number(finJumlah) <= 0) errs.jumlah = "Jumlah harus lebih dari 0";
    setFinErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitFinance = async (e) => {
    e.preventDefault();
    if (!validateFinance()) return;
    setFinSubmitting(true);
    const url = finEditId ? `${FIN_API}/transaksi/${finEditId}` : `${FIN_API}/transaksi`;
    const method = finEditId ? "PUT" : "POST";
    const bodyData = { tanggal: finTanggal, tipe: finTipe, kategori: finKategori, jumlah: Number(finJumlah), metode: finMetode, keterangan: finKeterangan };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 200 || res.status === 201) {
        notify(finEditId ? "Transaksi berhasil diperbarui" : "Transaksi berhasil dicatat");
        resetFormFinance();
        muatSemuaData(true);
      } else {
        notify(resData.message || "Gagal memproses transaksi", "error");
      }
    } catch {
      notify("Gagal memproses aksi ke server", "error");
    } finally {
      setFinSubmitting(false);
    }
  };

  const pemicuEditFinance = (t) => {
    setFinEditId(t._id); setFinTanggal(new Date(t.tanggal).toISOString().slice(0, 10));
    setFinTipe(t.tipe); setFinKategori(t.kategori); setFinJumlah(String(t.jumlah));
    setFinMetode(t.metode || "Transfer"); setFinKeterangan(t.keterangan || ""); setFinErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapusTransaksi = async () => {
    if (!finDeleteTarget) return;
    try {
      const res = await fetch(`${FIN_API}/transaksi/${finDeleteTarget._id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        notify("Transaksi berhasil dihapus");
        if (finEditId === finDeleteTarget._id) resetFormFinance();
        muatSemuaData(true);
      } else {
        notify("Gagal menghapus transaksi", "error");
      }
    } catch {
      notify("Gagal menghapus transaksi", "error");
    } finally {
      setFinDeleteTarget(null);
    }
  };

  const filteredTransaksi = useMemo(() => {
    const q = finSearch.trim().toLowerCase();
    return transaksiList.filter(t => {
      const matchQ = !q || t.kategori?.toLowerCase().includes(q) || t.keterangan?.toLowerCase().includes(q);
      const matchTipe = finTipeFilter === "semua" || t.tipe === finTipeFilter;
      const d = new Date(t.tanggal);
      const matchDari = !finDari || d >= new Date(finDari);
      const matchSampai = !finSampai || d <= new Date(finSampai + "T23:59:59");
      return matchQ && matchTipe && matchDari && matchSampai;
    });
  }, [transaksiList, finSearch, finTipeFilter, finDari, finSampai]);
  const totalPagesFin = Math.max(1, Math.ceil(filteredTransaksi.length / pageSizeFin));
  const pagedFin = filteredTransaksi.slice((pageFin - 1) * pageSizeFin, pageFin * pageSizeFin);
  useEffect(() => { setPageFin(1); }, [finSearch, finTipeFilter, finDari, finSampai]);

  const finTotalMasuk = useMemo(() => filteredTransaksi.filter(t => t.tipe === "Masuk").reduce((a, b) => a + b.jumlah, 0), [filteredTransaksi]);
  const finTotalKeluar = useMemo(() => filteredTransaksi.filter(t => t.tipe === "Keluar").reduce((a, b) => a + b.jumlah, 0), [filteredTransaksi]);
  const finSaldo = finTotalMasuk - finTotalKeluar;

  // Ekspor Excel: Sheet "Transaksi" (detail), "Ringkasan" (rekap per kategori), "Pivot" (matriks bulan x kategori)
  const eksporExcelKeuangan = () => {
    if (typeof XLSX === "undefined") { notify("Modul export Excel gagal dimuat, cek koneksi internet.", "error"); return; }
    if (filteredTransaksi.length === 0) { notify("Tidak ada data transaksi untuk diekspor.", "error"); return; }

    const wb = XLSX.utils.book_new();

    // --- Sheet 1: Transaksi (detail mentah) ---
    const wsTransaksi = XLSX.utils.json_to_sheet(filteredTransaksi.map(t => ({
      Tanggal: new Date(t.tanggal).toLocaleDateString("id-ID"),
      Tipe: t.tipe, Kategori: t.kategori, Jumlah: t.jumlah, Metode: t.metode || "-",
      Keterangan: t.keterangan || "-", "Dicatat Oleh": t.dibuat_oleh || "-",
    })));
    wsTransaksi["!cols"] = [{ wch: 12 }, { wch: 9 }, { wch: 24 }, { wch: 14 }, { wch: 12 }, { wch: 30 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsTransaksi, "Transaksi");

    // --- Sheet 2: Ringkasan (total & subtotal per kategori) ---
    const kategoriMap = {};
    filteredTransaksi.forEach(t => {
      const k = `${t.tipe}||${t.kategori}`;
      kategoriMap[k] = (kategoriMap[k] || 0) + t.jumlah;
    });
    const ringkasanRows = [
      { Uraian: "TOTAL UANG MASUK", Jumlah: finTotalMasuk },
      { Uraian: "TOTAL UANG KELUAR", Jumlah: finTotalKeluar },
      { Uraian: "SALDO BERSIH", Jumlah: finSaldo },
      { Uraian: "", Jumlah: "" },
      { Uraian: "RINCIAN PER KATEGORI — MASUK", Jumlah: "" },
      ...Object.entries(kategoriMap).filter(([k]) => k.startsWith("Masuk||"))
        .map(([k, v]) => ({ Uraian: k.split("||")[1], Jumlah: v })),
      { Uraian: "", Jumlah: "" },
      { Uraian: "RINCIAN PER KATEGORI — KELUAR", Jumlah: "" },
      ...Object.entries(kategoriMap).filter(([k]) => k.startsWith("Keluar||"))
        .map(([k, v]) => ({ Uraian: k.split("||")[1], Jumlah: v })),
    ];
    const wsRingkasan = XLSX.utils.json_to_sheet(ringkasanRows);
    wsRingkasan["!cols"] = [{ wch: 32 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsRingkasan, "Ringkasan");

    // --- Sheet 3: Pivot — matriks Bulan x Kategori, dipisah blok Masuk & Keluar (mudah dibaca Owner) ---
    const bulanKey = (d) => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`; };
    const bulanLabel = (k) => { const [y, m] = k.split("-"); return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "numeric" }); };
    const bulanSet = [...new Set(filteredTransaksi.map(t => bulanKey(t.tanggal)))].sort();

    const buatPivotBlok = (tipe) => {
      const kategoriSet = [...new Set(filteredTransaksi.filter(t => t.tipe === tipe).map(t => t.kategori))].sort();
      const pivot = {};
      kategoriSet.forEach(k => { pivot[k] = {}; bulanSet.forEach(b => pivot[k][b] = 0); });
      filteredTransaksi.filter(t => t.tipe === tipe).forEach(t => {
        const b = bulanKey(t.tanggal);
        pivot[t.kategori][b] = (pivot[t.kategori][b] || 0) + t.jumlah;
      });
      const rows = kategoriSet.map(k => {
        const row = { Kategori: k };
        bulanSet.forEach(b => row[bulanLabel(b)] = pivot[k][b]);
        row["TOTAL"] = bulanSet.reduce((a, b) => a + pivot[k][b], 0);
        return row;
      });
      const rowTotal = { Kategori: "TOTAL" };
      bulanSet.forEach(b => rowTotal[bulanLabel(b)] = kategoriSet.reduce((a, k) => a + pivot[k][b], 0));
      rowTotal["TOTAL"] = rows.reduce((a, r) => a + r["TOTAL"], 0);
      rows.push(rowTotal);
      return rows;
    };

    const pivotData = [
      { Kategori: "=== PIVOT UANG MASUK (per Kategori x Bulan) ===" },
      ...buatPivotBlok("Masuk"),
      { Kategori: "" },
      { Kategori: "=== PIVOT UANG KELUAR (per Kategori x Bulan) ===" },
      ...buatPivotBlok("Keluar"),
    ];
    const wsPivot = XLSX.utils.json_to_sheet(pivotData);
    wsPivot["!cols"] = [{ wch: 26 }, ...bulanSet.map(() => ({ wch: 14 })), { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsPivot, "Pivot");

    const namaFile = `Laporan-Keuangan-SATNET-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, namaFile);
    notify("Laporan Excel berhasil diunduh (Transaksi, Ringkasan, Pivot)");
  };

  /* ---------------- MODUL INVOICE / PENAGIHAN (Staf Admin, Finance & Owner) ---------------- */
  const buatNomorItem = () => `it_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const itemKosong = () => ({ id: buatNomorItem(), deskripsi: "", qty: "1", hargaSatuan: "" });

  const [invEditId, setInvEditId] = useState(null);
  // Diisi saat invoice dibuat lewat tombol "+" dari baris Tracking BAST (status BAST Final).
  // Begitu invoice ini berhasil disimpan, dipakai untuk menandai baris tracking tsb -> "Proses Finance".
  const [trkAsalInvoiceId, setTrkAsalInvoiceId] = useState(null);
  const [invNomor, setInvNomor] = useState("");
  const [invTanggal, setInvTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [invPoNumber, setInvPoNumber] = useState("");
  const [invJatuhTempo, setInvJatuhTempo] = useState("");
  const [invBillNama, setInvBillNama] = useState("");
  const [invBillAlamat, setInvBillAlamat] = useState("");
  const [invShipSama, setInvShipSama] = useState(true);
  const [invShipNama, setInvShipNama] = useState("");
  const [invShipAlamat, setInvShipAlamat] = useState("");
  const [invItems, setInvItems] = useState([itemKosong()]);
  const [invPinalty, setInvPinalty] = useState("0");
  const [invLessDeposit, setInvLessDeposit] = useState("0");
  const [invDendaSetelahPpn, setInvDendaSetelahPpn] = useState("0");
  const [invPungutanPpn, setInvPungutanPpn] = useState("0");
  const [invStatus, setInvStatus] = useState("Belum Dibayar");
  const [invRekBank, setInvRekBank] = useState("");
  const [invRekNomor, setInvRekNomor] = useState("");
  const [invRekKota, setInvRekKota] = useState("");
  const [invTtdNama, setInvTtdNama] = useState("");
  const [invTtdJabatan, setInvTtdJabatan] = useState("Direktur");
  const [invErrors, setInvErrors] = useState({});
  const [invSubmitting, setInvSubmitting] = useState(false);
  const [invDeleteTarget, setInvDeleteTarget] = useState(null);
  const [invPrintTarget, setInvPrintTarget] = useState(null);

  const [invSearch, setInvSearch] = useState("");
  const [invStatusFilter, setInvStatusFilter] = useState("semua");
  const [pageInv, setPageInv] = useState(1);
  const [pageSizeInv, setPageSizeInv] = useState(10);

  const buatNomorInvoiceOtomatis = () => `QN${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${String(Math.floor(Math.random() * 90) + 10)}`;

  // Profil Rekening & Penandatangan invoice — begitu diisi sekali di sebuah invoice,
  // otomatis dipakai lagi sebagai default untuk invoice baru berikutnya (disimpan di browser ini).
  const INVOICE_PROFIL_KEY = "satnet_invoice_profil_v1";
  const muatProfilInvoiceTersimpan = () => {
    try {
      const raw = localStorage.getItem(INVOICE_PROFIL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const simpanProfilInvoice = (profil) => {
    try { localStorage.setItem(INVOICE_PROFIL_KEY, JSON.stringify(profil)); } catch {}
  };

  const resetFormInvoice = () => {
    const profil = muatProfilInvoiceTersimpan();
    setInvEditId(null); setTrkAsalInvoiceId(null); setInvNomor(buatNomorInvoiceOtomatis()); setInvTanggal(new Date().toISOString().slice(0, 10));
    setInvPoNumber(""); setInvJatuhTempo(""); setInvBillNama(""); setInvBillAlamat("");
    setInvShipSama(true); setInvShipNama(""); setInvShipAlamat("");
    setInvItems([itemKosong()]); setInvPinalty("0"); setInvLessDeposit("0"); setInvDendaSetelahPpn("0"); setInvPungutanPpn("0");
    setInvStatus("Belum Dibayar");
    setInvRekBank(profil.rek_bank || ""); setInvRekNomor(profil.rek_nomor || ""); setInvRekKota(profil.rek_kota || "");
    setInvTtdNama(profil.ttd_nama || ""); setInvTtdJabatan(profil.ttd_jabatan || "Direktur");
    setInvErrors({});
  };

  // Waktu pertama kali komponen dimuat, langsung isi form dengan profil tersimpan (kalau ada)
  useEffect(() => {
    const profil = muatProfilInvoiceTersimpan();
    if (profil.rek_bank) setInvRekBank(profil.rek_bank);
    if (profil.rek_nomor) setInvRekNomor(profil.rek_nomor);
    if (profil.rek_kota) setInvRekKota(profil.rek_kota);
    if (profil.ttd_nama) setInvTtdNama(profil.ttd_nama);
    if (profil.ttd_jabatan) setInvTtdJabatan(profil.ttd_jabatan);
  }, []); // eslint-disable-line

  useEffect(() => { if (!invNomor) setInvNomor(buatNomorInvoiceOtomatis()); }, []); // eslint-disable-line

  const tambahItemInvoice = () => setInvItems(list => [...list, itemKosong()]);
  const hapusItemInvoice = (id) => setInvItems(list => list.length > 1 ? list.filter(it => it.id !== id) : list);
  const updateItemInvoice = (id, field, value) => setInvItems(list => list.map(it => it.id === id ? { ...it, [field]: value } : it));

  const invTotals = useMemo(
    () => hitungTotalInvoice(invItems, invPinalty, invLessDeposit, invDendaSetelahPpn, invPungutanPpn),
    [invItems, invPinalty, invLessDeposit, invDendaSetelahPpn, invPungutanPpn]
  );

  const validateInvoice = () => {
    const errs = {};
    if (!invNomor.trim()) errs.nomor = "Invoice No wajib diisi";
    if (!invTanggal) errs.tanggal = "Tanggal wajib diisi";
    if (!invBillNama.trim()) errs.billNama = "Nama penerima tagihan wajib diisi";
    if (invItems.every(it => !it.deskripsi.trim())) errs.items = "Minimal 1 item dengan deskripsi wajib diisi";
    setInvErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitInvoice = async (e) => {
    e.preventDefault();
    if (!validateInvoice()) return;
    setInvSubmitting(true);
    const url = invEditId ? `${FIN_API}/invoice/${invEditId}` : `${FIN_API}/invoice`;
    const method = invEditId ? "PUT" : "POST";
    const bodyData = {
      nomor: invNomor, tanggal: invTanggal, po_number: invPoNumber, jatuh_tempo: invJatuhTempo,
      bill_nama: invBillNama, bill_alamat: invBillAlamat,
      ship_sama: invShipSama, ship_nama: invShipSama ? invBillNama : invShipNama, ship_alamat: invShipSama ? invBillAlamat : invShipAlamat,
      items: invItems.filter(it => it.deskripsi.trim()).map(it => ({ deskripsi: it.deskripsi, qty: Number(it.qty) || 0, hargaSatuan: Number(it.hargaSatuan) || 0 })),
      pinalty: Number(invPinalty) || 0, less_deposit: Number(invLessDeposit) || 0,
      denda_setelah_ppn: Number(invDendaSetelahPpn) || 0, pungutan_ppn: Number(invPungutanPpn) || 0,
      status: invStatus,
      rek_bank: invRekBank, rek_nomor: invRekNomor, rek_kota: invRekKota,
      ttd_nama: invTtdNama, ttd_jabatan: invTtdJabatan || "Direktur",
    };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 200 || res.status === 201) {
        simpanProfilInvoice({
          rek_bank: invRekBank, rek_nomor: invRekNomor, rek_kota: invRekKota,
          ttd_nama: invTtdNama, ttd_jabatan: invTtdJabatan || "Direktur"
        });
        // Kalau invoice ini dibuat lewat tombol "+" dari Tracking BAST, tandai baris
        // tracking asalnya jadi "Proses Finance" & simpan link ke invoice yang baru dibuat.
        if (trkAsalInvoiceId && resData?.data?._id) {
          try {
            await fetch(`${TRACK_API}/tracking/${trkAsalInvoiceId}/proses-finance`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", ...authHeaders() },
              body: JSON.stringify({ invoice_id: resData.data._id })
            });
          } catch {
            notify("Invoice tersimpan, tapi gagal update status tracking BAST — update manual ya", "error");
          }
          setTrkAsalInvoiceId(null);
        }
        notify(invEditId ? "Invoice berhasil diperbarui" : "Invoice berhasil dibuat");
        resetFormInvoice();
        muatSemuaData(true);
      } else {
        notify(resData.message || "Gagal memproses invoice", "error");
      }
    } catch {
      notify("Gagal memproses aksi ke server", "error");
    } finally {
      setInvSubmitting(false);
    }
  };

  const pemicuEditInvoice = (inv) => {
    setInvEditId(inv._id); setInvNomor(inv.nomor); setInvTanggal(new Date(inv.tanggal).toISOString().slice(0, 10));
    setInvPoNumber(inv.po_number || ""); setInvJatuhTempo(inv.jatuh_tempo ? new Date(inv.jatuh_tempo).toISOString().slice(0, 10) : "");
    setInvBillNama(inv.bill_nama || ""); setInvBillAlamat(inv.bill_alamat || "");
    setInvShipSama(!!inv.ship_sama); setInvShipNama(inv.ship_nama || ""); setInvShipAlamat(inv.ship_alamat || "");
    setInvItems(inv.items && inv.items.length ? inv.items.map(it => ({ id: buatNomorItem(), deskripsi: it.deskripsi, qty: String(it.qty), hargaSatuan: String(it.hargaSatuan) })) : [itemKosong()]);
    setInvPinalty(String(inv.pinalty || 0)); setInvLessDeposit(String(inv.less_deposit || 0));
    setInvDendaSetelahPpn(String(inv.denda_setelah_ppn || 0)); setInvPungutanPpn(String(inv.pungutan_ppn || 0));
    setInvStatus(inv.status || "Belum Dibayar");
    setInvRekBank(inv.rek_bank || ""); setInvRekNomor(inv.rek_nomor || ""); setInvRekKota(inv.rek_kota || "");
    setInvTtdNama(inv.ttd_nama || ""); setInvTtdJabatan(inv.ttd_jabatan || "Direktur");
    setInvErrors({});
    setCurrentMenu("invoice");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dipicu tombol "+" di baris Tracking BAST berstatus "BAST Final".
  // Membuka form Invoice dengan sebagian field sudah terisi dari data tracking,
  // dan menyimpan id baris tracking-nya supaya begitu invoice disimpan, status
  // tracking otomatis pindah ke "Proses Finance" (lihat handleSubmitInvoice).
  const pemicuBuatInvoiceDariTracking = (t) => {
    resetFormInvoice();
    setTrkAsalInvoiceId(t._id);
    setInvBillNama(`Asianet - ${t.region}`);
    setInvPoNumber(`${t.woType}${t.batch ? ` Batch ${t.batch}` : ""}`);
    setInvItems([{
      id: buatNomorItem(),
      deskripsi: `${t.woType} - ${t.region}${t.bulan ? ` (${t.bulan} ${t.tahun})` : ` (${t.tahun})`} - ${t.jumlahWO || 0} WO`,
      qty: "1",
      hargaSatuan: String(t.nilaiAsianet || t.amount || 0)
    }]);
    setCurrentMenu("invoice");
    window.scrollTo({ top: 0, behavior: "smooth" });
    notify(`Form invoice diisi dari data tracking "${t.region}" — lengkapi lalu simpan`);
  };

  const hapusInvoice = async () => {
    if (!invDeleteTarget) return;
    try {
      const res = await fetch(`${FIN_API}/invoice/${invDeleteTarget._id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        notify(`Invoice "${invDeleteTarget.nomor}" berhasil dihapus`);
        if (invEditId === invDeleteTarget._id) resetFormInvoice();
        muatSemuaData(true);
      } else {
        notify("Gagal menghapus invoice", "error");
      }
    } catch {
      notify("Gagal menghapus invoice", "error");
    } finally {
      setInvDeleteTarget(null);
    }
  };

  const filteredInvoice = useMemo(() => {
    const q = invSearch.trim().toLowerCase();
    return [...invoiceList].filter(inv => {
      const matchQ = !q || inv.nomor?.toLowerCase().includes(q) || inv.bill_nama?.toLowerCase().includes(q) || inv.po_number?.toLowerCase().includes(q);
      const matchStatus = invStatusFilter === "semua" || inv.status === invStatusFilter;
      return matchQ && matchStatus;
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [invoiceList, invSearch, invStatusFilter]);
  const totalPagesInv = Math.max(1, Math.ceil(filteredInvoice.length / pageSizeInv));
  const pagedInvoice = filteredInvoice.slice((pageInv - 1) * pageSizeInv, pageInv * pageSizeInv);
  useEffect(() => { setPageInv(1); }, [invSearch, invStatusFilter]);

  // Ekspor Excel: Sheet "Invoice" (daftar sesuai filter aktif) + Sheet "Ringkasan" (total per status)
  const eksporExcelInvoice = () => {
    if (typeof XLSX === "undefined") { notify("Modul export Excel gagal dimuat, cek koneksi internet.", "error"); return; }
    if (filteredInvoice.length === 0) { notify("Tidak ada data invoice untuk diekspor.", "error"); return; }

    const wb = XLSX.utils.book_new();

    const wsData = XLSX.utils.json_to_sheet(filteredInvoice.map(inv => {
      const t = hitungTotalInvoice(inv.items, inv.pinalty, inv.less_deposit, inv.denda_setelah_ppn, inv.pungutan_ppn);
      return {
        "No. Invoice": inv.nomor, Pelanggan: inv.bill_nama || "-", "PO Number": inv.po_number || "-",
        Tanggal: inv.tanggal ? new Date(inv.tanggal).toLocaleDateString("id-ID") : "-",
        "Harga Jual": t.hargaJual, "Balance Due": t.balanceDue, Status: inv.status || "Belum Dibayar",
        "Sudah Tercatat di Keuangan": inv.dicatat_keuangan ? "Ya" : "Tidak",
      };
    }));
    wsData["!cols"] = [{ wch: 16 }, { wch: 26 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsData, "Invoice");

    const totalHargaJual = filteredInvoice.reduce((a, inv) => a + hitungTotalInvoice(inv.items, inv.pinalty, inv.less_deposit, inv.denda_setelah_ppn, inv.pungutan_ppn).hargaJual, 0);
    const totalBalanceDue = filteredInvoice.reduce((a, inv) => a + hitungTotalInvoice(inv.items, inv.pinalty, inv.less_deposit, inv.denda_setelah_ppn, inv.pungutan_ppn).balanceDue, 0);
    const jumlahLunas = filteredInvoice.filter(inv => inv.status === "Lunas").length;
    const jumlahBelumDibayar = filteredInvoice.filter(inv => inv.status !== "Lunas").length;
    const wsRingkasan = XLSX.utils.json_to_sheet([
      { Uraian: "Jumlah Invoice", Nilai: filteredInvoice.length },
      { Uraian: "Jumlah Lunas", Nilai: jumlahLunas },
      { Uraian: "Jumlah Belum Dibayar", Nilai: jumlahBelumDibayar },
      { Uraian: "Total Harga Jual", Nilai: totalHargaJual },
      { Uraian: "Total Balance Due", Nilai: totalBalanceDue },
    ]);
    wsRingkasan["!cols"] = [{ wch: 26 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsRingkasan, "Ringkasan");

    const namaFile = `Invoice-SATNET-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, namaFile);
    notify("Laporan Invoice Excel berhasil diunduh (Invoice, Ringkasan)");
  };

  const handleCetakInvoice = (inv) => {
    setInvPrintTarget(inv);
    setTimeout(() => window.print(), 200);
  };

  const [invCatatSubmitting, setInvCatatSubmitting] = useState(null);
  const catatInvoiceKeKeuangan = async (inv) => {
    if (invCatatSubmitting) return;
    const t = hitungTotalInvoice(inv.items, inv.pinalty, inv.less_deposit, inv.denda_setelah_ppn, inv.pungutan_ppn);
    setInvCatatSubmitting(inv._id);
    try {
      const res = await fetch(`${FIN_API}/invoice/${inv._id}/catat-keuangan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ jumlah: t.balanceDue })
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) {
        notify(`Pembayaran invoice "${inv.nomor}" berhasil ditambahkan ke Keuangan`);
        muatSemuaData(true);
      } else {
        notify(resData.message || "Gagal menambahkan ke Keuangan", "error");
      }
    } catch {
      notify("Gagal menambahkan ke Keuangan", "error");
    } finally {
      setInvCatatSubmitting(null);
    }
  };

  /* ---------------- MODUL TRACKING BAST (Khusus Owner) ---------------- */
  const [trkEditId, setTrkEditId] = useState(null);
  const [trkRegion, setTrkRegion] = useState(TRACKING_REGIONS[0]);
  const [trkTahun, setTrkTahun] = useState(new Date().getFullYear());
  const [trkWoType, setTrkWoType] = useState(TRACKING_WO_TYPES[0]);
  const [trkBulan, setTrkBulan] = useState("");
  const [trkBatch, setTrkBatch] = useState("");
  const [trkJumlahWO, setTrkJumlahWO] = useState("");
  const [trkAmount, setTrkAmount] = useState("");
  const [trkNilaiAsianet, setTrkNilaiAsianet] = useState("");
  const [trkStatus, setTrkStatus] = useState("Waiting Submit");
  const [trkTanggal, setTrkTanggal] = useState("");
  const [trkPic, setTrkPic] = useState("");
  const [trkRemark, setTrkRemark] = useState("");
  const [trkActionPlan, setTrkActionPlan] = useState("");
  const [trkNote, setTrkNote] = useState("");
  const [trkProject, setTrkProject] = useState("");
  const [trkVendor, setTrkVendor] = useState("");
  const [trkErrors, setTrkErrors] = useState({});
  const [trkSubmitting, setTrkSubmitting] = useState(false);
  const [trkDeleteTarget, setTrkDeleteTarget] = useState(null);

  const [trkSearch, setTrkSearch] = useState("");
  const [trkRegionFilter, setTrkRegionFilter] = useState("semua");
  const [trkStatusFilter, setTrkStatusFilter] = useState("semua");
  const [trkWoTypeFilter, setTrkWoTypeFilter] = useState("semua");
  const [pageTrk, setPageTrk] = useState(1);
  const [pageSizeTrk, setPageSizeTrk] = useState(10);

  const resetFormTracking = () => {
    setTrkEditId(null); setTrkRegion(TRACKING_REGIONS[0]); setTrkTahun(new Date().getFullYear());
    setTrkWoType(TRACKING_WO_TYPES[0]); setTrkBulan(""); setTrkBatch(""); setTrkJumlahWO("");
    setTrkAmount(""); setTrkNilaiAsianet(""); setTrkStatus("Waiting Submit"); setTrkTanggal("");
    setTrkPic(""); setTrkRemark(""); setTrkActionPlan(""); setTrkNote("");
    setTrkProject(""); setTrkVendor(""); setTrkErrors({});
  };

  const validateTracking = () => {
    const errs = {};
    if (!trkRegion.trim()) errs.region = "Region wajib diisi";
    if (!trkTahun) errs.tahun = "Tahun wajib diisi";
    if (!trkWoType) errs.woType = "Jenis WO wajib dipilih";
    if (!trkStatus) errs.status = "Status wajib dipilih";
    if (!trkProject) errs.project = "Project wajib dipilih";
    if (!trkVendor) errs.vendor = "Vendor wajib dipilih";
    setTrkErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitTracking = async (e) => {
    e.preventDefault();
    if (!validateTracking()) return;
    setTrkSubmitting(true);
    const url = trkEditId ? `${TRACK_API}/tracking/${trkEditId}` : `${TRACK_API}/tracking`;
    const method = trkEditId ? "PUT" : "POST";
    const bodyData = {
      region: trkRegion, tahun: Number(trkTahun), woType: trkWoType, bulan: trkBulan,
      batch: trkBatch === "" ? null : Number(trkBatch), jumlahWO: Number(trkJumlahWO) || 0,
      amount: Number(trkAmount) || 0, nilaiAsianet: Number(trkNilaiAsianet) || 0, status: trkStatus,
      tanggal: trkTanggal || null, pic: trkPic, remark: trkRemark, actionPlan: trkActionPlan, note: trkNote,
      project: trkProject, vendor: trkVendor,
    };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 200 || res.status === 201) {
        notify(trkEditId ? "Data tracking berhasil diperbarui" : "Data tracking berhasil ditambahkan");
        resetFormTracking();
        muatSemuaData(true);
      } else {
        notify(resData.message || "Gagal memproses data tracking", "error");
      }
    } catch {
      notify("Gagal memproses aksi ke server", "error");
    } finally {
      setTrkSubmitting(false);
    }
  };

  const pemicuEditTracking = (t) => {
    setTrkEditId(t._id); setTrkRegion(t.region); setTrkTahun(t.tahun); setTrkWoType(t.woType);
    setTrkBulan(t.bulan || ""); setTrkBatch(t.batch ?? ""); setTrkJumlahWO(t.jumlahWO ?? "");
    setTrkAmount(t.amount ?? ""); setTrkNilaiAsianet(t.nilaiAsianet ?? ""); setTrkStatus(t.status);
    setTrkTanggal(t.tanggal ? new Date(t.tanggal).toISOString().slice(0, 10) : "");
    setTrkPic(t.pic || ""); setTrkRemark(t.remark || ""); setTrkActionPlan(t.actionPlan || ""); setTrkNote(t.note || "");
    setTrkProject(t.project || ""); setTrkVendor(t.vendor || "");
    setTrkErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapusTracking = async () => {
    if (!trkDeleteTarget) return;
    try {
      const res = await fetch(`${TRACK_API}/tracking/${trkDeleteTarget._id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        notify("Data tracking berhasil dihapus");
        if (trkEditId === trkDeleteTarget._id) resetFormTracking();
        muatSemuaData(true);
      } else {
        notify("Gagal menghapus data tracking", "error");
      }
    } catch {
      notify("Gagal menghapus data tracking", "error");
    } finally {
      setTrkDeleteTarget(null);
    }
  };

  const filteredTracking = useMemo(() => {
    const q = trkSearch.trim().toLowerCase();
    return trackingList.filter(t => {
      const matchQ = !q || t.region?.toLowerCase().includes(q) || t.woType?.toLowerCase().includes(q) ||
        t.pic?.toLowerCase().includes(q) || t.remark?.toLowerCase().includes(q);
      const matchRegion = trkRegionFilter === "semua" || t.region === trkRegionFilter;
      const matchStatus = trkStatusFilter === "semua" || t.status === trkStatusFilter;
      const matchWoType = trkWoTypeFilter === "semua" || t.woType === trkWoTypeFilter;
      return matchQ && matchRegion && matchStatus && matchWoType;
    });
  }, [trackingList, trkSearch, trkRegionFilter, trkStatusFilter, trkWoTypeFilter]);
  const totalPagesTrk = Math.max(1, Math.ceil(filteredTracking.length / pageSizeTrk));
  const pagedTrk = filteredTracking.slice((pageTrk - 1) * pageSizeTrk, pageTrk * pageSizeTrk);
  useEffect(() => { setPageTrk(1); }, [trkSearch, trkRegionFilter, trkStatusFilter, trkWoTypeFilter]);

  // Rekap per Region x Status, dihitung langsung di frontend dari data yang sudah ke-fetch
  // (setara endpoint /api/tracking/summary di backend, tapi tanpa round-trip tambahan).
  const trackingRekap = useMemo(() => {
    const regionMap = {};
    trackingList.forEach(t => {
      if (!regionMap[t.region]) {
        regionMap[t.region] = { region: t.region, perStatus: Object.fromEntries(TRACKING_STATUS.map(s => [s, { jumlahWO: 0, nilaiAsianet: 0, count: 0 }])) };
      }
      const bucket = regionMap[t.region].perStatus[t.status];
      if (bucket) { bucket.jumlahWO += t.jumlahWO || 0; bucket.nilaiAsianet += t.nilaiAsianet || 0; bucket.count += 1; }
    });
    const perRegion = Object.values(regionMap).sort((a, b) => a.region.localeCompare(b.region));
    const grandTotal = Object.fromEntries(TRACKING_STATUS.map(s => [s, { jumlahWO: 0, nilaiAsianet: 0, count: 0 }]));
    perRegion.forEach(r => TRACKING_STATUS.forEach(s => {
      grandTotal[s].jumlahWO += r.perStatus[s].jumlahWO;
      grandTotal[s].nilaiAsianet += r.perStatus[s].nilaiAsianet;
      grandTotal[s].count += r.perStatus[s].count;
    }));
    return { perRegion, grandTotal };
  }, [trackingList]);

  // Ekspor Excel: Sheet "Data Tracking" (detail sesuai filter aktif) + Sheet "Rekap" (pivot Region x Status, mirip file sumber)
  const eksporExcelTracking = () => {
    if (typeof XLSX === "undefined") { notify("Modul export Excel gagal dimuat, cek koneksi internet.", "error"); return; }
    if (filteredTracking.length === 0) { notify("Tidak ada data tracking untuk diekspor.", "error"); return; }

    const wb = XLSX.utils.book_new();

    const wsData = XLSX.utils.json_to_sheet(filteredTracking.map(t => ({
      Region: t.region, Tahun: t.tahun, "WO Type": t.woType, Bulan: t.bulan || "-",
      Batch: t.batch ?? "-", "Jumlah WO": t.jumlahWO || 0, Amount: t.amount || 0, "Nilai Asianet": t.nilaiAsianet || 0,
      Status: t.status, Tanggal: t.tanggal ? new Date(t.tanggal).toLocaleDateString("id-ID") : "-",
      PIC: t.pic || "-", Remark: t.remark || "-", "Action Plan": t.actionPlan || "-", Note: t.note || "-",
    })));
    wsData["!cols"] = [{ wch: 14 }, { wch: 7 }, { wch: 14 }, { wch: 10 }, { wch: 7 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 10 }, { wch: 28 }, { wch: 24 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsData, "Data Tracking");

    const rekapRows = [];
    trackingRekap.perRegion.forEach(r => {
      const row = { Region: r.region };
      TRACKING_STATUS.forEach(s => { row[`${s} (Jml WO)`] = r.perStatus[s].jumlahWO; row[`${s} (Nilai)`] = r.perStatus[s].nilaiAsianet; });
      rekapRows.push(row);
    });
    const totalRow = { Region: "GRAND TOTAL" };
    TRACKING_STATUS.forEach(s => { totalRow[`${s} (Jml WO)`] = trackingRekap.grandTotal[s].jumlahWO; totalRow[`${s} (Nilai)`] = trackingRekap.grandTotal[s].nilaiAsianet; });
    rekapRows.push(totalRow);
    const wsRekap = XLSX.utils.json_to_sheet(rekapRows);
    wsRekap["!cols"] = [{ wch: 16 }, ...TRACKING_STATUS.flatMap(() => [{ wch: 16 }, { wch: 18 }])];
    XLSX.utils.book_append_sheet(wb, wsRekap, "Rekap");

    const namaFile = `Tracking-BAST-SATNET-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, namaFile);
    notify("Laporan Tracking Excel berhasil diunduh (Data Tracking, Rekap)");
  };

  const NAV = [
    { key: "dashboard", label: "Dashboard Utama", icon: IconHome },
    { key: "crud", label: "Master Data Karyawan", icon: IconUsers, children: [{ key: "salary", label: "Salary" }] },
    { key: "log", label: "Log Absensi", icon: IconClock },
    { key: "keuangan", label: "Keuangan", icon: IconWallet },
    { key: "invoice", label: "Invoice", icon: IconInvoice },
    { key: "tracking", label: "Tracking BAST", icon: IconTracking },
    { key: "kasbon", label: "Kasbon & Cuti", icon: IconWallet },
    { key: "material", label: "Pemakaian Material", icon: IconBox },
  ].filter(item => canAccess(session.role, item.key));

  // ==================== HANDLER: KASBON & PENGAJUAN CUTI/IZIN/SAKIT ====================
  const handleKeputusanKasbon = async (item, status) => {
    let catatan_admin = "";
    if (status === "Ditolak") {
      catatan_admin = window.prompt("Alasan penolakan kasbon (opsional):", "") || "";
    }
    try {
      const res = await fetch(`${TRACK_API}/kasbon/${item._id}/keputusan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status, catatan_admin }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify(resData.message || "Keputusan kasbon tersimpan"); muatSemuaData(true); }
      else notify(resData.message || "Gagal memproses keputusan kasbon", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
  };

  const handleTandaiLunasKasbon = async (item) => {
    // PENTING: tombol ini KHUSUS untuk kasbon yang dibayar/dilunasi karyawan secara CASH di luar sistem gajian.
    // Kalau ditandai lunas di sini, kasbon ini TIDAK akan lagi ikut dipotong otomatis di menu Salary saat gajian,
    // karena sistem menganggapnya sudah selesai. Kalau kamu mau kasbon ini otomatis memotong gaji bulan ini,
    // JANGAN tekan tombol ini — biarkan saja, nanti otomatis kepotong & ke-lunas-kan sendiri saat kamu tekan
    // "Tandai Sudah Dibayar" di menu Salary -> Pembayaran Gaji Bulanan.
    const yakin = window.confirm(
      `Tandai kasbon ${item.nama} (${fmtRupiah(item.jumlah)}) sebagai LUNAS?\n\n` +
      `Gunakan ini HANYA jika karyawan sudah membayar/mengembalikan kasbon ini secara cash di luar potongan gaji.\n\n` +
      `Setelah ditandai lunas di sini, kasbon ini TIDAK akan lagi otomatis memotong gaji karyawan tsb di menu Salary. ` +
      `Kalau kamu justru ingin kasbon ini dipotong dari gaji bulan ini, JANGAN tekan OK — biarkan saja, nanti akan otomatis lunas sendiri saat kamu proses pembayaran gaji di menu Salary.`
    );
    if (!yakin) return;
    try {
      const res = await fetch(`${TRACK_API}/kasbon/${item._id}/lunas`, { method: "PUT", headers: authHeaders() });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify("Kasbon ditandai lunas (cash, di luar potongan gaji)"); muatSemuaData(true); }
      else notify(resData.message || "Gagal menandai lunas", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
  };

  // ==================== HANDLER: MODUL SALARY ====================
  const muatSalary = useCallback(async () => {
    if (!canAccess(session.role, "salary")) return;
    setSalaryLoading(true);
    try {
      const res = await fetch(`${TRACK_API}/salary`, { headers: authHeaders() });
      const data = await res.json();
      setSalaryList(Array.isArray(data) ? data : []);
    } catch {
      notify("Gagal memuat data master gaji", "error");
    } finally {
      setSalaryLoading(false);
    }
  }, [session, authHeaders, notify]);

  const muatSalaryPayment = useCallback(async (periode) => {
    if (!canAccess(session.role, "salary")) return;
    setSalaryPaymentLoading(true);
    try {
      const res = await fetch(`${TRACK_API}/salary/payment/${periode}`, { headers: authHeaders() });
      const data = await res.json();
      setSalaryPaymentList(Array.isArray(data) ? data : []);
    } catch {
      notify("Gagal memuat ringkasan gaji periode ini", "error");
    } finally {
      setSalaryPaymentLoading(false);
    }
  }, [session, authHeaders, notify]);

  // Muat data begitu masuk menu Salary, dan muat ulang ringkasan tiap ganti periode
  useEffect(() => {
    if (currentMenu === "salary") { muatSalary(); muatSalaryPayment(salaryPeriode); }
  }, [currentMenu]);
  useEffect(() => {
    if (currentMenu === "salary") muatSalaryPayment(salaryPeriode);
  }, [salaryPeriode]);

  const bukaEditSalary = (row) => {
    setSalaryEditTarget(row);
    setSalaryEditGajiPokok(String(row.gaji_pokok || ""));
    setSalaryEditLimitKasbon(String(row.limit_kasbon || ""));
    setSalaryFormErrors({});
  };

  const handleSimpanSalary = async (e) => {
    e.preventDefault();
    if (!salaryEditTarget) return;
    const errors = {};
    if (salaryEditGajiPokok === "" || Number(salaryEditGajiPokok) < 0) errors.gaji_pokok = "Gaji pokok wajib diisi, tidak boleh negatif";
    if (salaryEditLimitKasbon !== "" && Number(salaryEditLimitKasbon) < 0) errors.limit_kasbon = "Limit kasbon tidak boleh negatif";
    setSalaryFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSalarySubmitting(true);
    try {
      const res = await fetch(`${TRACK_API}/salary/${salaryEditTarget.karyawan_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          gaji_pokok: Number(salaryEditGajiPokok),
          limit_kasbon: salaryEditLimitKasbon === "" ? null : Number(salaryEditLimitKasbon),
        }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) {
        notify(resData.message || "Gaji & limit kasbon berhasil disimpan");
        setSalaryEditTarget(null);
        muatSalary();
        if (currentMenu === "salary") muatSalaryPayment(salaryPeriode);
      } else {
        notify(resData.message || "Gagal menyimpan data gaji", "error");
      }
    } catch {
      notify("Gagal terhubung ke server", "error");
    } finally {
      setSalarySubmitting(false);
    }
  };

  const handleTandaiDibayarSalary = async (row) => {
    if (!window.confirm(`Tandai gaji ${row.nama} periode ${salaryPeriode} sebagai Sudah Dibayar?\nTotal transfer: ${fmtRupiah(row.total_dibayar)}`)) return;
    setBayarSubmittingId(row.karyawan_id);
    try {
      const res = await fetch(`${TRACK_API}/salary/payment/${row.karyawan_id}/bayar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ periode: salaryPeriode }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify(resData.message || "Gaji ditandai sudah dibayar"); muatSalaryPayment(salaryPeriode); muatSalary(); }
      else notify(resData.message || "Gagal menandai gaji sudah dibayar", "error");
    } catch {
      notify("Gagal terhubung ke server", "error");
    } finally {
      setBayarSubmittingId(null);
    }
  };

  const filteredSalary = useMemo(() => {
    const q = searchSalary.trim().toLowerCase();
    if (!q) return salaryList;
    return salaryList.filter(s => s.nama?.toLowerCase().includes(q) || s.karyawan_id?.toLowerCase().includes(q));
  }, [salaryList, searchSalary]);
  const totalPagesSalary = Math.max(1, Math.ceil(filteredSalary.length / PAGE_SIZE_SAL));
  const pagedSalary = filteredSalary.slice((pageSalary - 1) * PAGE_SIZE_SAL, pageSalary * PAGE_SIZE_SAL);
  useEffect(() => { setPageSalary(1); }, [searchSalary]);

  // Gabungkan data ringkasan pembayaran periode terpilih dengan urutan/pencarian yang sama seperti master gaji
  const salaryPaymentMap = useMemo(() => {
    const map = {};
    salaryPaymentList.forEach(p => { map[p.karyawan_id] = p; });
    return map;
  }, [salaryPaymentList]);
  const totalTransferBulanIni = useMemo(
    () => salaryPaymentList.reduce((a, p) => a + (p.total_dibayar || 0), 0),
    [salaryPaymentList]
  );

  const handleKeputusanPengajuan = async (item, status) => {
    let catatan_admin = "";
    if (status === "Ditolak") {
      catatan_admin = window.prompt(`Alasan penolakan ${item.jenis.toLowerCase()} (opsional):`, "") || "";
    }
    try {
      const res = await fetch(`${TRACK_API}/pengajuan/${item._id}/keputusan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status, catatan_admin }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify(resData.message || "Keputusan tersimpan"); muatSemuaData(true); }
      else notify(resData.message || "Gagal memproses keputusan", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
  };

  // ==================== MODUL MATERIAL: handlers ====================
  // Peta cepat material_id -> dokumen material, untuk lookup nama/stok saat render tabel/form
  const materialMap = useMemo(() => {
    const map = {};
    materialList.forEach(m => { map[m._id] = m; });
    return map;
  }, [materialList]);
  const resetFormMaterial = () => {
    setMatEditId(null); setMatKategori("Kabel"); setMatNamaPilihan("50"); setMatNama("50 M"); setMatSatuan("Roll");
    setMatSnOnt(""); setMatFormErrors({});
  };
  // Ganti kategori -> reset preset & satuan default yang relevan buat kategori itu
  const handleMatKategoriChange = (val) => {
    setMatKategori(val);
    setMatSnOnt("");
    if (val === "Kabel") { setMatNamaPilihan("50"); setMatNama("50 M"); setMatSatuan("Roll"); }
    else if (val === "ONT") { setMatNamaPilihan("ZTE"); setMatNama("ZTE"); setMatSatuan("Unit"); }
    else { setMatNamaPilihan(""); setMatNama(""); setMatSatuan("Roll"); }
  };
  // Ganti pilihan dropdown Jenis Kabel / Merek ONT -> otomatis isi Nama, kecuali pilih "Lainnya"
  const handleMatNamaPilihanChange = (val) => {
    setMatNamaPilihan(val);
    if (val === "Lainnya") { setMatNama(""); return; }
    if (matKategori === "Kabel") setMatNama(`${val} M`);
    else if (matKategori === "ONT") setMatNama(val);
  };
  const validateMaterial = () => {
    const errs = {};
    if (!matNama.trim()) errs.nama = matKategori === "Kabel" ? "Jenis kabel wajib dipilih/diisi" : matKategori === "ONT" ? "Merek/jenis ONT wajib dipilih/diisi" : "Nama/jenis material wajib diisi";
    setMatFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmitMaterial = async (e) => {
    e.preventDefault();
    if (!validateMaterial()) return;
    setMatSubmitting(true);
    const url = matEditId ? `${MATERIAL_API}/material/${matEditId}` : `${MATERIAL_API}/material`;
    const method = matEditId ? "PUT" : "POST";
    const bodyData = { kategori: matKategori, nama: matNama, satuan: matSatuan };
    if (!matEditId && matKategori === "ONT" && matSnOnt.trim()) bodyData.sn_ont = matSnOnt.trim();
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 200 || res.status === 201) {
        notify(matEditId ? "Material berhasil diperbarui" : "Material baru berhasil ditambahkan");
        resetFormMaterial(); muatSemuaData(true);
      } else notify(resData.message || "Gagal menyimpan material", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
    finally { setMatSubmitting(false); }
  };
  const pemicuEditMaterial = (m) => {
    setMatEditId(m._id); setMatKategori(m.kategori); setMatNama(m.nama); setMatSatuan(m.satuan); setMatSnOnt("");
    if (m.kategori === "Kabel") {
      const angka = String(m.nama || "").replace(/\s*M$/i, "").trim();
      setMatNamaPilihan(KABEL_METER_PRESETS.map(String).includes(angka) ? angka : "Lainnya");
    } else if (m.kategori === "ONT") {
      setMatNamaPilihan(ONT_MEREK_PRESETS.includes(m.nama) ? m.nama : "Lainnya");
    } else {
      setMatNamaPilihan("");
    }
    setMatFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const hapusMaterial = async () => {
    if (!matDeleteTarget) return;
    try {
      const res = await fetch(`${MATERIAL_API}/material/${matDeleteTarget._id}`, { method: "DELETE", headers: authHeaders() });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify("Material berhasil dihapus"); muatSemuaData(true); }
      else notify(resData.message || "Gagal menghapus material", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
    finally { setMatDeleteTarget(null); }
  };

  const resetFormPemakaian = () => {
    setPmkEditId(null); setPmkTanggal(new Date().toISOString().slice(0, 10)); setPmkTeknisiId(""); setPmkNamaTeam("");
    setPmkMerekPilihan("ZTE"); setPmkMerekModem("ZTE"); setPmkSnOnt(""); setPmkKabelId("");
    setPmkJumlahOnt(1); setPmkSnOntList([""]); setPmkKabelRows([{ kabel_id: "", jumlah: 1 }]);
    setPmkStatus("Idle"); setPmkReturnCatatan("");
    setPmkProject(""); setPmkRegion(""); setPmkVendor("");
    setPmkFormErrors({});
  };
  const handlePmkMerekChange = (val) => {
    setPmkMerekPilihan(val);
    if (val !== "Lainnya") setPmkMerekModem(val); else setPmkMerekModem("");
  };
  const handlePmkJumlahOntChange = (val) => {
    const n = Math.max(0, Math.min(50, Number(val) || 0));
    setPmkJumlahOnt(n);
    setPmkSnOntList(prev => {
      const arr = prev.slice(0, n);
      while (arr.length < n) arr.push("");
      return arr;
    });
  };
  const updatePmkSnOntAt = (idx, val) => {
    setPmkSnOntList(prev => prev.map((v, i) => i === idx ? val : v));
  };
  const addPmkKabelRow = () => setPmkKabelRows(prev => [...prev, { kabel_id: "", jumlah: 1 }]);
  const removePmkKabelRow = (idx) => setPmkKabelRows(prev => prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx));
  const updatePmkKabelRow = (idx, field, val) => {
    setPmkKabelRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };
  // Daftar SN ONT yang sudah terdaftar di Master Material (kategori ONT), dipakai sebagai
  // saran/autocomplete di field SN ONT — tetap boleh diisi manual/bebas.
  const snOntSuggestions = useMemo(() => {
    const set = new Set();
    materialList.forEach(m => { if (m.kategori === "ONT" && Array.isArray(m.sn_list)) m.sn_list.forEach(sn => sn && set.add(sn)); });
    return [...set];
  }, [materialList]);
  const kabelMaterialOptions = useMemo(() => materialList.filter(m => m.kategori === "Kabel"), [materialList]);

  const validatePemakaian = () => {
    const errs = {};
    if (!pmkNamaTeam.trim()) errs.nama_team = "Nama team wajib diisi";
    if (!pmkKabelId) errs.kabel_id = "Jenis kabel wajib dipilih";
    if (!pmkProject) errs.project = "Project wajib dipilih";
    if (!pmkRegion) errs.region = "Region wajib dipilih";
    if (!pmkVendor) errs.vendor = "Vendor wajib dipilih";
    setPmkFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const validatePemakaianBatch = () => {
    const errs = {};
    if (!pmkNamaTeam.trim()) errs.nama_team = "Nama team wajib diisi";
    if (!pmkProject) errs.project = "Project wajib dipilih";
    if (!pmkRegion) errs.region = "Region wajib dipilih";
    if (!pmkVendor) errs.vendor = "Vendor wajib dipilih";
    const kabelValid = pmkKabelRows.filter(r => r.kabel_id);
    if (kabelValid.length === 0) {
      errs.kabel = "Minimal 1 jenis kabel wajib dipilih";
    } else {
      const totalKabelUnit = kabelValid.reduce((a, r) => a + Math.max(1, Number(r.jumlah) || 1), 0);
      if (pmkJumlahOnt > 0 && totalKabelUnit !== pmkJumlahOnt) {
        errs.kabel = `Total unit kabel (${totalKabelUnit}) harus sama dengan jumlah ONT (${pmkJumlahOnt})`;
      }
    }
    setPmkFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmitPemakaian = async (e) => {
    e.preventDefault();
    setPmkSubmitting(true);
    try {
      if (pmkEditId) {
        // Mode EDIT: tetap 1 baris, pakai endpoint lama.
        if (!validatePemakaian()) { setPmkSubmitting(false); return; }
        const bodyData = {
          tanggal_pengambilan: pmkTanggal, teknisi_id: pmkTeknisiId, nama_team: pmkNamaTeam,
          merek_modem: pmkMerekModem, sn_ont: pmkSnOnt, kabel_id: pmkKabelId, status: pmkStatus, return_catatan: pmkReturnCatatan,
          project: pmkProject, region: pmkRegion, vendor: pmkVendor,
        };
        const res = await fetch(`${MATERIAL_API}/pemakaian-material/${pmkEditId}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
        const resData = await res.json().catch(() => ({}));
        if (res.status === 200) { notify("Log pemakaian berhasil diperbarui"); resetFormPemakaian(); muatSemuaData(true); }
        else notify(resData.message || "Gagal menyimpan log pemakaian", "error");
      } else {
        // Mode TAMBAH: bisa banyak unit ONT sekaligus banyak jenis kabel dalam 1x input.
        if (!validatePemakaianBatch()) { setPmkSubmitting(false); return; }
        const bodyData = {
          tanggal_pengambilan: pmkTanggal, teknisi_id: pmkTeknisiId, nama_team: pmkNamaTeam,
          merek_modem: pmkMerekModem, status: pmkStatus, return_catatan: pmkReturnCatatan,
          project: pmkProject, region: pmkRegion, vendor: pmkVendor,
          ont_list: pmkSnOntList,
          kabel_list: pmkKabelRows.filter(r => r.kabel_id).map(r => ({ kabel_id: r.kabel_id, jumlah: Math.max(1, Number(r.jumlah) || 1) })),
        };
        const res = await fetch(`${MATERIAL_API}/pemakaian-material/batch`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
        const resData = await res.json().catch(() => ({}));
        if (res.status === 201) { notify(resData.message || "Log pemakaian berhasil disimpan"); resetFormPemakaian(); muatSemuaData(true); }
        else notify(resData.message || "Gagal menyimpan log pemakaian", "error");
      }
    } catch { notify("Gagal terhubung ke server", "error"); }
    finally { setPmkSubmitting(false); }
  };
  const pemicuEditPemakaian = (l) => {
    setPmkEditId(l._id); setPmkTanggal(l.tanggal_pengambilan ? l.tanggal_pengambilan.slice(0, 10) : "");
    setPmkTeknisiId(l.teknisi_id || ""); setPmkNamaTeam(l.nama_team);
    setPmkMerekModem(l.merek_modem || ""); setPmkMerekPilihan(ONT_MEREK_PRESETS.includes(l.merek_modem) ? l.merek_modem : (l.merek_modem ? "Lainnya" : "ZTE"));
    setPmkSnOnt(l.sn_ont || ""); setPmkKabelId(String(l.kabel_id)); setPmkStatus(l.status); setPmkReturnCatatan(l.return_catatan || "");
    setPmkProject(l.project || ""); setPmkRegion(l.region || ""); setPmkVendor(l.vendor || "");
    setPmkFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const hapusPemakaian = async () => {
    if (!pmkDeleteTarget) return;
    try {
      const res = await fetch(`${MATERIAL_API}/pemakaian-material/${pmkDeleteTarget._id}`, { method: "DELETE", headers: authHeaders() });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify("Log pemakaian berhasil dihapus & stok disesuaikan"); muatSemuaData(true); }
      else notify(resData.message || "Gagal menghapus log pemakaian", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
    finally { setPmkDeleteTarget(null); }
  };

  const resetFormStok = () => {
    setStkMaterialId(""); setStkTipe("Penambahan"); setStkJumlah(""); setStkTeknisiId(""); setStkTeknisiNama("");
    setStkKeterangan(""); setStkSnOntList([]); setStkFormErrors({});
  };
  const validateStok = () => {
    const errs = {};
    if (!stkMaterialId) errs.material_id = "Material wajib dipilih";
    if (!stkJumlah || Number(stkJumlah) <= 0) errs.jumlah = "Jumlah harus lebih dari 0";
    if (stkTipe === "Pengembalian" && (!stkTeknisiId.trim() || !stkTeknisiNama.trim())) errs.teknisi = "Pengembalian wajib mencantumkan teknisi asal barang";
    setStkFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const stkMaterialTerpilih = materialMap[stkMaterialId];
  // Kalau material yang dipilih kategori ONT & tipe Penambahan, otomatis siapkan kolom SN ONT
  // sejumlah "Jumlah" yang diisi, biar penulisan rapi & per-unit tercatat SN-nya (opsional).
  const jumlahSnOntDibutuhkan = (stkTipe === "Penambahan" && stkMaterialTerpilih?.kategori === "ONT") ? Math.max(0, Math.min(50, Number(stkJumlah) || 0)) : 0;
  useEffect(() => {
    setStkSnOntList(prev => {
      if (prev.length === jumlahSnOntDibutuhkan) return prev;
      const arr = prev.slice(0, jumlahSnOntDibutuhkan);
      while (arr.length < jumlahSnOntDibutuhkan) arr.push("");
      return arr;
    });
  }, [jumlahSnOntDibutuhkan]);
  const updateStkSnOntAt = (idx, val) => setStkSnOntList(prev => prev.map((v, i) => i === idx ? val : v));
  const handleSubmitStok = async (e) => {
    e.preventDefault();
    if (!validateStok()) return;
    setStkSubmitting(true);
    const bodyData = { material_id: stkMaterialId, tipe: stkTipe, jumlah: stkJumlah, teknisi_id: stkTeknisiId, teknisi_nama: stkTeknisiNama, keterangan: stkKeterangan };
    if (jumlahSnOntDibutuhkan > 0) bodyData.sn_list = stkSnOntList;
    try {
      const res = await fetch(`${MATERIAL_API}/material/stok`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(bodyData) });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 201) {
        notify(resData.message || "Mutasi stok berhasil dicatat");
        resetFormStok(); muatSemuaData(true);
      } else notify(resData.message || "Gagal mencatat mutasi stok", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
    finally { setStkSubmitting(false); }
  };

  const muatReportMaterial = useCallback(async () => {
    setReportLoading(true);
    try {
      const qs = new URLSearchParams();
      if (reportDari) qs.set("dari", reportDari);
      if (reportSampai) qs.set("sampai", reportSampai);
      const res = await fetch(`${MATERIAL_API}/material/report?${qs.toString()}`, { headers: authHeaders() });
      const data = await res.json();
      setMaterialReport({ perMaterial: Array.isArray(data.perMaterial) ? data.perMaterial : [], perTeam: Array.isArray(data.perTeam) ? data.perTeam : [] });
    } catch { notify("Gagal memuat laporan material", "error"); }
    finally { setReportLoading(false); }
  }, [reportDari, reportSampai, authHeaders, notify]);

  // Ekspor Excel Laporan Material: Sheet "Ringkasan Material" (rekap per jenis, replika tabel
  // Excel asli Kabel|Stok Awal|Idle|Terpakai) + "Log Pemakaian" (detail sesuai filter tanggal aktif)
  // + "Pivot Team x Kabel" (matriks jumlah unit Terpakai per teknisi per jenis kabel — enak dibaca Owner)
  const eksporExcelMaterial = () => {
    if (typeof XLSX === "undefined") { notify("Modul export Excel gagal dimuat, cek koneksi internet.", "error"); return; }
    if (materialReport.perMaterial.length === 0) { notify("Klik \"Tampilkan Laporan\" dulu sebelum ekspor.", "error"); return; }

    const dariMs = reportDari ? new Date(reportDari).getTime() : null;
    const sampaiMs = reportSampai ? new Date(reportSampai + "T23:59:59").getTime() : null;
    const logTerfilter = pemakaianList.filter(p => {
      const t = new Date(p.tanggal_pengambilan).getTime();
      if (dariMs && t < dariMs) return false;
      if (sampaiMs && t > sampaiMs) return false;
      return true;
    });

    const wb = XLSX.utils.book_new();

    // --- Sheet 1: Ringkasan Material (persis tabel Kabel | Stok Awal | Idle | Terpakai di Excel asli) ---
    const ringkasanRows = materialReport.perMaterial.map(r => ({
      Kategori: r.kategori, Material: r.nama, Satuan: r.satuan,
      "Stok Awal": r.stock_awal, Idle: r.total_idle_belum_terpakai, Terpakai: r.total_terpakai,
      Ditambah: r.total_ditambah, Dikembalikan: r.total_dikembalikan, "Stok Terkini": r.stock_terkini,
    }));
    const totalRow = { Kategori: "TOTAL", Material: "", Satuan: "",
      "Stok Awal": ringkasanRows.reduce((a, r) => a + r["Stok Awal"], 0),
      Idle: ringkasanRows.reduce((a, r) => a + r.Idle, 0),
      Terpakai: ringkasanRows.reduce((a, r) => a + r.Terpakai, 0),
      Ditambah: ringkasanRows.reduce((a, r) => a + r.Ditambah, 0),
      Dikembalikan: ringkasanRows.reduce((a, r) => a + r.Dikembalikan, 0),
      "Stok Terkini": ringkasanRows.reduce((a, r) => a + r["Stok Terkini"], 0),
    };
    const wsRingkasan = XLSX.utils.json_to_sheet([...ringkasanRows, totalRow]);
    wsRingkasan["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 13 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsRingkasan, "Ringkasan Material");

    // --- Sheet 2: Log Pemakaian (detail mentah, sesuai filter tanggal aktif di form Laporan) ---
    const wsLog = XLSX.utils.json_to_sheet(logTerfilter.map(p => ({
      Tanggal: new Date(p.tanggal_pengambilan).toLocaleDateString("id-ID"),
      Team: p.nama_team, Project: p.project || "-", Region: p.region || "-", Vendor: p.vendor || "-",
      "Merek Modem": p.merek_modem || "-", "SN ONT": p.sn_ont || "-",
      Kabel: p.kabel_nama, Status: p.status, Return: p.return_catatan || "-",
    })));
    wsLog["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 16 }, { wch: 9 }, { wch: 10 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsLog, "Log Pemakaian");

    // --- Sheet 3: Pivot Team x Kabel (jumlah unit berstatus "Terpakai") ---
    const teamSet = [...new Set(logTerfilter.filter(p => p.status === "Terpakai").map(p => p.nama_team))].sort();
    const kabelSet = [...new Set(materialList.map(m => m.nama))];
    const pivot = {};
    teamSet.forEach(tm => { pivot[tm] = {}; kabelSet.forEach(k => pivot[tm][k] = 0); });
    logTerfilter.filter(p => p.status === "Terpakai").forEach(p => {
      if (!pivot[p.nama_team]) pivot[p.nama_team] = {};
      pivot[p.nama_team][p.kabel_nama] = (pivot[p.nama_team][p.kabel_nama] || 0) + 1;
    });
    const pivotRows = teamSet.map(tm => {
      const row = { "Team / Teknisi": tm };
      kabelSet.forEach(k => row[k] = pivot[tm][k] || 0);
      row["TOTAL"] = kabelSet.reduce((a, k) => a + (pivot[tm][k] || 0), 0);
      return row;
    });
    const rowTotalPivot = { "Team / Teknisi": "TOTAL" };
    kabelSet.forEach(k => rowTotalPivot[k] = teamSet.reduce((a, tm) => a + (pivot[tm][k] || 0), 0));
    rowTotalPivot["TOTAL"] = pivotRows.reduce((a, r) => a + r["TOTAL"], 0);
    pivotRows.push(rowTotalPivot);
    const wsPivot = XLSX.utils.json_to_sheet(pivotRows);
    wsPivot["!cols"] = [{ wch: 16 }, ...kabelSet.map(() => ({ wch: 10 })), { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsPivot, "Pivot Team x Kabel");

    const namaFile = `Laporan-Material-SATNET-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, namaFile);
    notify("Laporan Excel material berhasil diunduh (Ringkasan, Log, Pivot)");
  };

  useEffect(() => {
    if (currentMenu === "material" && materialSubTab === "Laporan") muatReportMaterial();
  }, [currentMenu, materialSubTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredMaterial = useMemo(() => {
    const q = searchMaterial.trim().toLowerCase();
    if (!q) return materialList;
    return materialList.filter(m => m.nama.toLowerCase().includes(q) || m.kategori.toLowerCase().includes(q));
  }, [materialList, searchMaterial]);
  const totalPagesMaterial = Math.max(1, Math.ceil(filteredMaterial.length / PAGE_SIZE_MAT));
  const pagedMaterial = filteredMaterial.slice((pageMaterial - 1) * PAGE_SIZE_MAT, pageMaterial * PAGE_SIZE_MAT);

  const filteredPemakaian = useMemo(() => {
    const q = searchPemakaian.trim().toLowerCase();
    return pemakaianList.filter(l => {
      const matchQ = !q || l.nama_team.toLowerCase().includes(q) || (l.sn_ont || "").toLowerCase().includes(q) || (l.merek_modem || "").toLowerCase().includes(q);
      const matchStatus = pemakaianStatusFilter === "semua" || l.status === pemakaianStatusFilter;
      return matchQ && matchStatus;
    });
  }, [pemakaianList, searchPemakaian, pemakaianStatusFilter]);
  const totalPagesPemakaian = Math.max(1, Math.ceil(filteredPemakaian.length / PAGE_SIZE_PMK));
  const pagedPemakaian = filteredPemakaian.slice((pagePemakaian - 1) * PAGE_SIZE_PMK, pagePemakaian * PAGE_SIZE_PMK);

  const totalPagesStok = Math.max(1, Math.ceil(stokLogList.length / PAGE_SIZE_STK));
  const pagedStok = stokLogList.slice((pageStok - 1) * PAGE_SIZE_STK, pageStok * PAGE_SIZE_STK);

  // ==================== KARYAWAN: ubah status Aktif / Non Aktif (khusus hrd & owner) ====================
  // Klik badge status HANYA membuka dialog konfirmasi (setStatusUbahTarget); proses ubah status
  // yang sesungguhnya baru jalan lewat konfirmasiUbahStatusKaryawan setelah owner menekan "Ya, Ubah".
  // Ini penting terutama untuk Aktif -> Non Aktif, karena begitu Non Aktif karyawan langsung
  // kehilangan akses login absensi & Portal Admin.
  const [statusUbahLoadingId, setStatusUbahLoadingId] = useState(null);
  const konfirmasiUbahStatusKaryawan = async () => {
    const k = statusUbahTarget;
    if (!k) return;
    const statusBaru = k.status === "Non Aktif" ? "Aktif" : "Non Aktif";
    setStatusUbahLoadingId(k._id);
    try {
      const res = await fetch(`${API}/karyawan/${k._id}/status`, {
        method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ status: statusBaru }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) { notify(resData.message || `Status diubah menjadi ${statusBaru}`); muatSemuaData(true); }
      else notify(resData.message || "Gagal mengubah status karyawan", "error");
    } catch { notify("Gagal terhubung ke server", "error"); }
    finally { setStatusUbahLoadingId(null); setStatusUbahTarget(null); }
  };

  const kasbonPending = kasbonList.filter(k => k.status === "Pending").length;
  const pengajuanPending = pengajuanCISList.filter(p => p.status === "Pending").length;

  // Filter pencarian + status untuk tabel Kasbon
  const filteredKasbonList = useMemo(() => {
    const q = searchKasbon.trim().toLowerCase();
    return kasbonList.filter(k => {
      const matchQ = !q || k.nama?.toLowerCase().includes(q) || k.karyawan_id?.toLowerCase().includes(q);
      const matchStatus = kasbonStatusFilter === "semua" || k.status === kasbonStatusFilter;
      return matchQ && matchStatus;
    });
  }, [kasbonList, searchKasbon, kasbonStatusFilter]);

  // Filter pencarian + status untuk tabel Cuti/Izin/Sakit
  const filteredPengajuanCISList = useMemo(() => {
    const q = searchPengajuanCIS.trim().toLowerCase();
    return pengajuanCISList.filter(p => {
      const matchQ = !q || p.nama?.toLowerCase().includes(q) || p.karyawan_id?.toLowerCase().includes(q);
      const matchStatus = pengajuanCISStatusFilter === "semua" || p.status === pengajuanCISStatusFilter;
      return matchQ && matchStatus;
    });
  }, [pengajuanCISList, searchPengajuanCIS, pengajuanCISStatusFilter]);

  // Pagination untuk tabel Kasbon & Cuti/Izin/Sakit, supaya tidak scroll panjang ke bawah.
  const totalPagesKasbon = Math.max(1, Math.ceil(filteredKasbonList.length / pageSizeKasbon));
  const pageKasbonAman = Math.min(pageKasbon, totalPagesKasbon);
  const pagedKasbon = filteredKasbonList.slice((pageKasbonAman - 1) * pageSizeKasbon, pageKasbonAman * pageSizeKasbon);
  const totalPagesPengajuanCIS = Math.max(1, Math.ceil(filteredPengajuanCISList.length / pageSizePengajuanCIS));
  const pagePengajuanCISAman = Math.min(pagePengajuanCIS, totalPagesPengajuanCIS);
  const pagedPengajuanCIS = filteredPengajuanCISList.slice((pagePengajuanCISAman - 1) * pageSizePengajuanCIS, pagePengajuanCISAman * pageSizePengajuanCIS);
  useEffect(() => { setPageKasbon(1); }, [searchKasbon, kasbonStatusFilter]);
  useEffect(() => { setPagePengajuanCIS(1); }, [searchPengajuanCIS, pengajuanCISStatusFilter]);

  // Gabungan notifikasi pengajuan yang masih Pending (kasbon + cuti/izin/sakit), terbaru duluan
  const notifPendingList = useMemo(() => {
    const dariKasbon = kasbonList.filter(k => k.status === "Pending").map(k => ({
      id: `kasbon-${k._id}`, tipe: "Kasbon", nama: k.nama, karyawan_id: k.karyawan_id,
      keterangan: `Mengajukan kasbon ${fmtRupiah(k.jumlah)}`, tanggal: k.tanggal_pengajuan, sub: "Kasbon",
    }));
    const dariPengajuan = pengajuanCISList.filter(p => p.status === "Pending").map(p => ({
      id: `pengajuan-${p._id}`, tipe: p.jenis, nama: p.nama, karyawan_id: p.karyawan_id,
      keterangan: `Mengajukan ${p.jenis}`, tanggal: p.tanggal_pengajuan, sub: "Pengajuan",
    }));
    return [...dariKasbon, ...dariPengajuan].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [kasbonList, pengajuanCISList]);
  const notifPendingTotal = notifPendingList.length;

  // Deteksi pengajuan Pending BARU yang belum pernah muncul sebelumnya -> munculkan toast otomatis,
  // supaya Owner langsung sadar walau belum sempat buka menu Kasbon & Cuti.
  useEffect(() => {
    if (!canAccess(session.role, "kasbon")) return;
    if (notifSeenIdsRef.current === null) {
      // load pertama kali: catat saja id yang sudah ada, jangan langsung toast semua backlog lama
      notifSeenIdsRef.current = new Set(notifPendingList.map(n => n.id));
      return;
    }
    const belumPernahMuncul = notifPendingList.filter(n => !notifSeenIdsRef.current.has(n.id));
    belumPernahMuncul.forEach(n => {
      notify(`Pengajuan baru: ${n.nama} — ${n.keterangan}`, "info");
      notifSeenIdsRef.current.add(n.id);
    });
  }, [notifPendingList, session.role, notify]);

  return (
    <div className="min-h-screen flex flex-col">
      <ToastStack toasts={toasts} dismiss={dismissToast} />
      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus data karyawan?"
        description={deleteTarget ? `"${deleteTarget.nama}" (${deleteTarget.karyawan_id}) akan dihapus permanen dan tidak bisa dikembalikan.` : ""}
        onConfirm={hapusKaryawan}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!finDeleteTarget}
        title="Hapus transaksi keuangan?"
        description={finDeleteTarget ? `Transaksi "${finDeleteTarget.kategori}" senilai ${fmtRupiah(finDeleteTarget.jumlah)} akan dihapus permanen.` : ""}
        onConfirm={hapusTransaksi}
        onCancel={() => setFinDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!trkDeleteTarget}
        title="Hapus data tracking?"
        description={trkDeleteTarget ? `Data tracking "${trkDeleteTarget.region} - ${trkDeleteTarget.woType}" akan dihapus permanen.` : ""}
        onConfirm={hapusTracking}
        onCancel={() => setTrkDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!invDeleteTarget}
        title="Hapus invoice?"
        description={invDeleteTarget ? `Invoice "${invDeleteTarget.nomor}" untuk "${invDeleteTarget.bill_nama}" akan dihapus permanen.` : ""}
        onConfirm={hapusInvoice}
        onCancel={() => setInvDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!matDeleteTarget}
        title="Hapus jenis material?"
        description={matDeleteTarget ? `Material "${matDeleteTarget.nama}" akan dihapus permanen dari master data.` : ""}
        onConfirm={hapusMaterial}
        onCancel={() => setMatDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!pmkDeleteTarget}
        title="Hapus log pemakaian material?"
        description={pmkDeleteTarget ? `Baris log "${pmkDeleteTarget.nama_team} - ${pmkDeleteTarget.kabel_nama}" akan dihapus & stok disesuaikan kembali.` : ""}
        onConfirm={hapusPemakaian}
        onCancel={() => setPmkDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!statusUbahTarget}
        title={statusUbahTarget?.status === "Non Aktif" ? "Aktifkan kembali karyawan ini?" : "Non-aktifkan karyawan ini?"}
        description={statusUbahTarget ? (
          statusUbahTarget.status === "Non Aktif"
            ? `"${statusUbahTarget.nama}" (${statusUbahTarget.karyawan_id}) akan diaktifkan kembali dan bisa login ke absensi & Portal Admin seperti biasa.`
            : `"${statusUbahTarget.nama}" (${statusUbahTarget.karyawan_id}) akan ditandai Non Aktif. Karyawan ini TIDAK akan bisa lagi login ke aplikasi absensi maupun Portal Admin sampai diaktifkan kembali.`
        ) : ""}
        confirmLabel={statusUbahTarget?.status === "Non Aktif" ? "Ya, Aktifkan" : "Ya, Non-aktifkan"}
        danger={statusUbahTarget?.status !== "Non Aktif"}
        onConfirm={konfirmasiUbahStatusKaryawan}
        onCancel={() => setStatusUbahTarget(null)}
      />
      <ConfirmModal
        open={logoutConfirmOpen}
        title="Yakin ingin keluar?"
        description="Kamu akan keluar dari Portal Admin dan perlu login kembali untuk mengakses halaman ini."
        confirmLabel="Ya, Keluar"
        onConfirm={() => { setLogoutConfirmOpen(false); onLogout(); }}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
      <PhotoModal data={fotoPreview} onClose={() => setFotoPreview(null)} />
      <InvoicePrintView invoice={invPrintTarget} />

      {/* TOP BAR */}
      <header className="app-header text-white px-4 sm:px-6 py-3.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setSidebarOpen(s => !s)}><IconMenu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-display tracking-tight">SETNET</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide" style={{ background: "var(--brand-grad)" }}>Portal Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-white/60">
            <span className={`w-2 h-2 rounded-full ${online ? "signal-live" : ""}`} style={{ background: online ? "#34D399" : "#F87171" }} />
            {online ? "Server tersambung" : "Server terputus"}
            {lastSync && <span className="font-mono text-white/40 ml-1">· {lastSync.toLocaleTimeString("id-ID")}</span>}
          </div>
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/15 bg-white/5">{roleInfo(session.role).label} · {session.nama}</span>
          {canAccess(session.role, "kasbon") && (
            <div className="relative">
              <button onClick={() => setNotifOpen(o => !o)} className="relative p-2 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white" title="Notifikasi pengajuan">
                <IconBell className="w-5 h-5" />
                {notifPendingTotal > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center text-white ${notifOpen ? "" : "signal-live"}`} style={{ background: "var(--red)" }}>
                    {notifPendingTotal > 9 ? "9+" : notifPendingTotal}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-[95]" onClick={() => setNotifOpen(false)} />
                  <div className="modal-in fixed top-16 left-3 right-3 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-80 bg-white rounded-2xl border shadow-xl z-[96] overflow-hidden text-left" style={{ borderColor: "var(--border)" }}>
                    <div className="p-3.5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs font-bold" style={{ color: "var(--ink)" }}>Pengajuan Menunggu Persetujuan</p>
                      {notifPendingTotal > 0 && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>{notifPendingTotal}</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
                      {notifPendingList.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Tidak ada pengajuan yang menunggu</p>
                        </div>
                      ) : (
                        notifPendingList.slice(0, 8).map(n => (
                          <button key={n.id} onClick={() => { setCurrentMenu("kasbon"); setKasbonSubTab(n.sub); setNotifOpen(false); }}
                            className="w-full text-left p-3.5 flex items-start gap-2.5 hover:bg-gray-50 transition">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>
                              <IconWallet className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate" style={{ color: "var(--ink)" }}>{n.nama}</p>
                              <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{n.keterangan}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{n.tanggal ? new Date(n.tanggal).toLocaleString("id-ID") : ""}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    {notifPendingList.length > 0 && (
                      <button onClick={() => { setCurrentMenu("kasbon"); setNotifOpen(false); }}
                        className="w-full p-2.5 text-center text-[11px] font-bold border-t hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }}>
                        Lihat semua di Kasbon & Cuti →
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <button onClick={() => setLogoutConfirmOpen(true)} className="text-white/70 hover:text-white flex items-center gap-1.5 text-xs font-semibold"><IconLogout className="w-4 h-4" /><span className="hidden sm:inline">Keluar</span></button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        {/* SIDEBAR — mode penuh (label terlihat) atau rail/icon-only (toggle via tombol panah) */}
        <aside className={`sidebar-rail ${sidebarCollapsed ? "sidebar-collapsed lg:w-[76px] w-64" : "w-64"} text-white p-3 flex flex-col gap-1 shrink-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ top: 0, paddingTop: "1rem" }}>
          <div className={`flex items-center mb-2 ${sidebarCollapsed ? "lg:justify-center justify-between px-1" : "justify-between px-1"}`}>
            <p className="sidebar-label text-[10px] font-bold text-white/35 uppercase tracking-widest">Menu Utama</p>
            <button onClick={toggleSidebarCollapsed} title={sidebarCollapsed ? "Buka menu" : "Ciutkan menu"}
              className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition">
              <IconChevronsLeft className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
          {NAV.map(item => {
            const Ico = item.icon; const active = currentMenu === item.key;
            const children = (item.children || []).filter(c => canAccess(session.role, c.key));
            const hasChildren = children.length > 0;
            const childActive = hasChildren && children.some(c => c.key === currentMenu);
            const isExpanded = hasChildren && (expandedNav[item.key] ?? childActive);
            return (
              <div key={item.key}>
                <button onClick={() => {
                  setCurrentMenu(item.key); setSidebarOpen(false);
                  if (hasChildren) setExpandedNav(e => ({ ...e, [item.key]: !isExpanded }));
                }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`nav-item ${active ? "is-active" : ""} w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2.5 ${sidebarCollapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "text-white" : "text-white/55 hover:bg-white/5 hover:text-white/80"}`}>
                  <Ico className="w-4 h-4 shrink-0" />
                  <span className="sidebar-label flex-1">{item.label}</span>
                  {hasChildren && (
                    <span className="sidebar-label shrink-0">
                      {isExpanded ? <IconChevronUp className="w-3.5 h-3.5" /> : <IconChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  )}
                  {sidebarCollapsed && <span className="nav-tooltip">{item.label}</span>}
                </button>
                {hasChildren && isExpanded && (
                  <div className="sidebar-label flex flex-col gap-0.5 mt-0.5 mb-1 pl-4">
                    {children.map(c => {
                      const subActive = currentMenu === c.key;
                      return (
                        <button key={c.key} onClick={() => { setCurrentMenu(c.key); setSidebarOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition ${subActive ? "text-white bg-white/10" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}>
                          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "currentColor" }} />
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className={`mt-auto pt-4 border-t border-white/10 text-center text-[10px] text-white/30 font-mono sidebar-label`}>SETNET Apps v2.1 &copy; 2026</div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white border animate-pulse" style={{ borderColor: "var(--border)" }} />)}
            </div>
          ) : (
            <>
              {currentMenu === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h1 className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>Ringkasan Dashboard</h1>
                      <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Pantauan performa tim &amp; aktivitas hari ini secara real-time</p>
                    </div>
                    <button onClick={() => muatSemuaData()} className="text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto" style={{ background: "var(--brand)" }}>
                      <IconRefresh className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>

                  {/* ===== 1. RINGKASAN ABSENSI HARI INI ===== */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Ringkasan Absensi Hari Ini</h2>
                      <span className="text-[11px] font-mono" style={{ color: "var(--ink-soft)" }}>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <StatCard label="Total Karyawan" value={karyawanList.length} unit="orang" tone="brand" icon={<IconUsers className="w-5 h-5" />} />
                      <StatCard label="Sudah Hadir" value={hadirHariIniCount} unit="orang" tone="green" icon={<IconCheck className="w-5 h-5" />} />
                      <StatCard label="Belum Absen" value={belumAbsenCount} unit="orang" tone="amber" icon={<IconAlert className="w-5 h-5" />} />
                      <StatCard label="Absen Pulang" value={pulangHariIni.length} unit="tap" tone="amber" icon={<IconClock className="w-5 h-5" />} />
                      <StatCard label="Tingkat Kehadiran" value={kehadiranHariIniPct} unit="%" tone="brand" icon={<IconTrendUp className="w-5 h-5" />} />
                    </div>
                  </div>

                  {/* ===== 1b. RINGKASAN MATERIAL ===== */}
                  {materialStatsDash && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Ringkasan Material</h2>
                        <button onClick={() => setCurrentMenu("material")} className="text-[11px] font-semibold" style={{ color: "var(--brand)" }}>Lihat detail →</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard label="Stok Awal" value={materialStatsDash.stokAwal} unit="unit" tone="brand" icon={<IconBox className="w-5 h-5" />} />
                        <StatCard label="Terpakai" value={materialStatsDash.terpakai} unit="unit" tone="amber" icon={<IconAlert className="w-5 h-5" />} />
                        <StatCard label="Sisa Stok" value={materialStatsDash.sisaStok} unit="unit" tone="green" icon={<IconCheck className="w-5 h-5" />} />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ===== 2. GRAFIK KEHADIRAN 7 HARI TERAKHIR ===== */}
                    <div className="elev-card lg:col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
                      <h3 className="text-sm font-bold mb-1" style={{ color: "var(--ink)" }}>Grafik Kehadiran 7 Hari Terakhir</h3>
                      <p className="text-[11px] mb-5" style={{ color: "var(--ink-soft)" }}>Jumlah karyawan absen masuk per hari</p>
                      <div className="flex items-end justify-between gap-2 h-40">
                        {kehadiran7Hari.map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                            <span className="text-[11px] font-bold font-mono" style={{ color: h.isToday ? "var(--brand-dark)" : "var(--ink-soft)" }}>{h.count}</span>
                            <div className="w-full rounded-t-lg transition-all" style={{
                              height: `${Math.max((h.count / maxKehadiran7Hari) * 100, h.count > 0 ? 6 : 2)}%`,
                              background: h.isToday ? "var(--brand)" : "var(--brand-soft)",
                              minHeight: 4,
                            }} />
                            <span className="text-[10px] font-semibold uppercase" style={{ color: h.isToday ? "var(--brand-dark)" : "var(--ink-soft)" }}>{h.label}</span>
                            <span className="text-[9px] font-mono" style={{ color: "var(--ink-soft)" }}>{h.tanggal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ===== 5. KARYAWAN ULANG TAHUN HARI INI ===== */}
                    <div className="elev-card bg-white rounded-2xl border flex flex-col" style={{ borderColor: "var(--border)" }}>
                      <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
                        <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Employee Birthday</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}>{ulangTahunHariIni.length}</span>
                      </div>
                      {ulangTahunHariIni.length === 0 ? (
                        <EmptyState title="Tidak ada yang ulang tahun" subtitle="Belum ada karyawan yang berulang tahun hari ini." icon={<IconCheck className="w-5 h-5" />} />
                      ) : (
                        <ul className="divide-y overflow-y-auto" style={{ borderColor: "var(--border)", maxHeight: 260 }}>
                          {ulangTahunHariIni.map(k => (
                            <li key={k._id} className="p-3.5 flex items-center gap-3">
                              <Avatar name={k.nama} size={30} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate" style={{ color: "var(--ink)" }}>{k.nama}</p>
                                <p className="text-[10px] font-mono" style={{ color: "var(--ink-soft)" }}>{new Date(k.tanggal_lahir).toLocaleDateString("id-ID", { day: "2-digit", month: "long" })}</p>
                              </div>
                              <span className="px-2 py-1 rounded-full font-bold text-[9px] uppercase text-right shrink-0" style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}>{k.usia} th</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {(trackingStatsDash || financeStatsDash) && (
                    <div className={`grid grid-cols-1 ${trackingStatsDash && financeStatsDash ? "lg:grid-cols-2" : ""} gap-6`}>
                      {/* ===== 3. STATISTIK TRACKING BAST ===== */}
                      {trackingStatsDash && (
                        <div className="elev-card bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Statistik Tracking BAST</h3>
                            <button onClick={() => setCurrentMenu("tracking")} className="text-[11px] font-semibold" style={{ color: "var(--brand)" }}>Lihat detail →</button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {TRACKING_STATUS.map(s => {
                              const tone = trackingStatusTone(s);
                              return (
                                <div key={s} className="rounded-xl p-3" style={{ background: tone.bg }}>
                                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: tone.fg }}>{s}</p>
                                  <p className="text-xl font-bold font-display mt-1" style={{ color: tone.fg }}>{trackingStatsDash.perStatus[s] || 0} <span className="text-[11px] font-medium">dok</span></p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-4 pt-4 border-t text-xs" style={{ borderColor: "var(--border)" }}>
                            <span style={{ color: "var(--ink-soft)" }}>Total {trackingStatsDash.totalDokumen} dokumen · {trackingStatsDash.totalWO} WO</span>
                            <span className="font-bold" style={{ color: "var(--ink)" }}>{fmtRupiah(trackingStatsDash.totalNilai)}</span>
                          </div>
                        </div>
                      )}

                      {/* ===== 4. RINGKASAN FINANCE ===== */}
                      {financeStatsDash && (
                        <div className="elev-card bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Ringkasan Finance</h3>
                            <button onClick={() => setCurrentMenu("keuangan")} className="text-[11px] font-semibold" style={{ color: "var(--brand)" }}>Lihat detail →</button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl p-3" style={{ background: "var(--green-soft)" }}>
                              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--green)" }}>Uang Masuk</p>
                              <p className="text-sm font-bold font-display mt-1" style={{ color: "var(--green)" }}>{fmtRupiah(financeStatsDash.masuk)}</p>
                            </div>
                            <div className="rounded-xl p-3" style={{ background: "var(--amber-soft)" }}>
                              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--amber)" }}>Uang Keluar</p>
                              <p className="text-sm font-bold font-display mt-1" style={{ color: "var(--amber)" }}>{fmtRupiah(financeStatsDash.keluar)}</p>
                            </div>
                            <div className="rounded-xl p-3" style={{ background: "var(--brand-soft)" }}>
                              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--brand-dark)" }}>Saldo</p>
                              <p className="text-sm font-bold font-display mt-1" style={{ color: "var(--brand-dark)" }}>{fmtRupiah(financeStatsDash.saldo)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="elev-card bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
                      <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Karyawan Terlambat Hari Ini</h3>
                      <button onClick={() => setCurrentMenu("log")} className="text-[11px] font-semibold" style={{ color: "var(--brand)" }}>Lihat semua log →</button>
                    </div>
                    {terlambatHariIni.length === 0 ? (
                      <EmptyState title="Tidak ada yang terlambat" subtitle="Semua karyawan absen masuk tepat waktu hari ini." icon={<IconCheck className="w-5 h-5" />} />
                    ) : (
                      <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {terlambatHariIni.map(a => (
                          <li key={a._id} className="p-3.5 flex items-center gap-3">
                            <Avatar name={a.nama} size={32} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate" style={{ color: "var(--ink)" }}>{a.nama}</p>
                              <p className="text-[11px] font-mono" style={{ color: "var(--ink-soft)" }}>{new Date(a.waktu_absen).toLocaleString("id-ID")} WIB</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>{a.keterangan.replace("Terlambat ", "")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {currentMenu === "crud" && canAccess(session.role, "crud") && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>Master Data Karyawan</h1>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Profil lengkap seluruh anggota tim: identitas, NIK KTP, jabatan, cabang, dan hak akses</p>
                  </div>

                  {/* RINGKASAN KARYAWAN */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Total Karyawan" value={karyawanSummary.total} unit="orang" tone="brand" icon={<IconUsers className="w-5 h-5" />} />
                    <StatCard label="Aktif" value={karyawanSummary.aktif} unit="orang" tone="green" icon={<IconCheck className="w-5 h-5" />} />
                    <StatCard label="Non Aktif" value={karyawanSummary.nonAktif} unit="orang" tone="amber" icon={<IconAlert className="w-5 h-5" />} />
                    <StatCard label="Owner" value={karyawanSummary.ownerCount} unit="akun" tone="brand" icon={<IconUsers className="w-5 h-5" />} />
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* FORM */}
                  <div className="bg-white p-5 rounded-2xl border h-fit lg:sticky lg:top-6" style={{ borderColor: "var(--border)" }}>
                    <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>{isEditing ? "Edit Data Karyawan" : "Tambah Anggota Baru"}</h2>
                    <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>{isEditing ? "Perbarui profil karyawan terpilih" : "Daftarkan akun karyawan baru"}</p>

                    <form onSubmit={handleSubmitKaryawan} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>ID Karyawan</label>
                        <input type="text" placeholder="Contoh: K001" value={karyawanId} onChange={e => setKaryawanId(e.target.value)} disabled={isEditing}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium disabled:bg-gray-50 disabled:text-gray-400"
                          style={{ borderColor: formErrors.karyawanId ? "var(--red)" : "var(--border)" }} />
                        {formErrors.karyawanId && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{formErrors.karyawanId}</p>}
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Nama Lengkap</label>
                        <input type="text" placeholder="Nama karyawan" value={namaKaryawan} onChange={e => setNamaKaryawan(e.target.value)}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: formErrors.nama ? "var(--red)" : "var(--border)" }} />
                        {formErrors.nama && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{formErrors.nama}</p>}
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>NIK KTP</label>
                        <input type="text" inputMode="numeric" maxLength="16" placeholder="16 digit sesuai KTP" value={nikKaryawan} onChange={e => setNikKaryawan(e.target.value.replace(/\D/g, ""))}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: formErrors.nik ? "var(--red)" : "var(--border)" }} />
                        {formErrors.nik && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{formErrors.nik}</p>}
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tanggal Lahir</label>
                        <input type="date" value={tanggalLahirKaryawan} onChange={e => setTanggalLahirKaryawan(e.target.value)}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                        <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>Dipakai untuk menampilkan ucapan ulang tahun di Dashboard.</p>
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>No. Telepon</label>
                        <input type="tel" inputMode="tel" placeholder="Contoh: 081234567890" value={noTelpKaryawan} onChange={e => setNoTelpKaryawan(e.target.value.replace(/[^\d+\s-]/g, ""))}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: formErrors.noTelp ? "var(--red)" : "var(--border)" }} />
                        {formErrors.noTelp && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{formErrors.noTelp}</p>}
                      </div>
                      {!isEditing && (
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Kata Sandi Akun</label>
                          <div className="relative">
                            <input type={showPassword ? "text" : "password"} placeholder="Password login HP" value={passwordKaryawan} onChange={e => setPasswordKaryawan(e.target.value)}
                              className="w-full p-2.5 pr-9 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: formErrors.password ? "var(--red)" : "var(--border)" }} />
                            <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                            </button>
                          </div>
                          {formErrors.password && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{formErrors.password}</p>}
                        </div>
                      )}
                      {isEditing && (
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Reset Password (opsional)</label>
                          <div className="relative">
                            <input type={showPassword ? "text" : "password"} placeholder="Kosongkan jika tidak diubah" value={passwordKaryawan === "********" ? "" : passwordKaryawan}
                              onChange={e => setPasswordKaryawan(e.target.value)}
                              className="w-full p-2.5 pr-9 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                            <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                            </button>
                          </div>
                          <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>Isi kolom ini hanya jika ingin mengganti password karyawan.</p>
                        </div>
                      )}
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tingkatan Hak Akses</label>
                        <select value={roleKaryawan} onChange={e => setRoleKaryawan(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                          <option value="teknisi">Teknisi (Hanya Aplikasi Absensi)</option>
                          <option value="admin">Staf Admin (Kelola Karyawan & Log)</option>
                          <option value="gudang">Staf Gudang (Lihat Dashboard & Log)</option>
                          <option value="finance">Staf Finance (Modul Keuangan)</option>
                          <option value="owner">Owner (Akses Penuh)</option>
                        </select>
                        <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>Teknisi hanya bisa login ke aplikasi absensi HP, tidak bisa masuk Portal Admin ini.</p>
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Cabang</label>
                        <input type="text" placeholder="Contoh: Bandung" value={cabangKaryawan} onChange={e => setCabangKaryawan(e.target.value)}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Alamat Domisili</label>
                        <textarea placeholder="Tulis alamat detail..." rows="3" value={alamatKaryawan} onChange={e => setAlamatKaryawan(e.target.value)}
                          className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium resize-none" style={{ borderColor: "var(--border)" }}></textarea>
                      </div>
                      <div className="pt-1 flex gap-2">
                        <button type="submit" disabled={submitting} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                          {submitting ? "Memproses..." : isEditing ? "Update Data" : "Daftarkan User"}
                        </button>
                        {isEditing && (
                          <button type="button" onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* TABLE */}
                  <div className="elev-card lg:col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                    <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Database Karyawan</h3>
                        <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredKaryawan.length} dari {karyawanList.length} karyawan</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input value={searchKaryawan} onChange={e => setSearchKaryawan(e.target.value)} placeholder="Cari nama / ID / role"
                            className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-52" style={{ borderColor: "var(--border)" }} />
                        </div>
                        <select value={roleFilterKaryawan} onChange={e => setRoleFilterKaryawan(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                          <option value="semua">Semua Role</option>
                          <option value="teknisi">Teknisi</option>
                          <option value="admin">Staf Admin</option>
                          <option value="gudang">Staf Gudang</option>
                          <option value="finance">Staf Finance</option>
                          <option value="owner">Owner</option>
                        </select>
                        <select value={statusFilterKaryawan} onChange={e => setStatusFilterKaryawan(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                          <option value="semua">Semua Status</option>
                          <option value="Aktif">Aktif</option>
                          <option value="Non Aktif">Non Aktif</option>
                        </select>
                        <button onClick={() => downloadCsv("karyawan.csv", toCsv(filteredKaryawan, [
                          { label: "ID", get: r => r.karyawan_id }, { label: "Nama", get: r => r.nama },
                          { label: "NIK KTP", get: r => r.nik || "" }, { label: "Tanggal Lahir", get: r => r.tanggal_lahir || "" }, { label: "No Telepon", get: r => r.no_telp || "" }, { label: "Role", get: r => r.role },
                          { label: "Cabang", get: r => r.cabang || "" }, { label: "Alamat", get: r => r.alamat || "" }, { label: "Status", get: r => statusInfo(r.status).label },
                        ]))} className="p-2 border rounded-xl hover:bg-gray-50 shrink-0" style={{ borderColor: "var(--border)" }} title="Ekspor CSV">
                          <IconDownload className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} />
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[900px]">
                        <thead>
                          <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                            <th className="p-4">Karyawan</th>
                            <th className="p-4">NIK KTP</th>
                            <th className="p-4">No. Telepon</th>
                            <SortHeader label="Role" field="role" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                            <th className="p-4">Cabang</th>
                            <th className="p-4">Alamat</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center w-24">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                          {pagedKaryawan.length === 0 ? (
                            <tr><td colSpan="8"><EmptyState title={(searchKaryawan || roleFilterKaryawan !== "semua" || statusFilterKaryawan !== "semua") ? "Tidak ditemukan" : "Belum ada data user"} subtitle={(searchKaryawan || roleFilterKaryawan !== "semua" || statusFilterKaryawan !== "semua") ? "Coba ubah kata kunci atau filter." : "Tambahkan anggota baru lewat formulir di samping."} icon={<IconUsers className="w-5 h-5" />} /></td></tr>
                          ) : (
                            pagedKaryawan.map(k => (
                              <tr key={k._id} className="hover:bg-gray-50/60 transition">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <Avatar name={k.nama} size={32} />
                                    <div>
                                      <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{k.nama}</p>
                                      <p className="font-mono text-[10px]" style={{ color: "var(--ink-soft)" }}>{k.karyawan_id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 font-mono" style={{ color: "var(--ink-soft)" }}>{k.nik || "—"}</td>
                                <td className="p-3.5 font-mono" style={{ color: "var(--ink-soft)" }}>{k.no_telp || "—"}</td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide"
                                    style={{ background: roleInfo(k.role).badgeBg, color: roleInfo(k.role).badgeFg }}>{roleInfo(k.role).label}</span>
                                </td>
                                <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{k.cabang || "—"}</td>
                                <td className="p-3.5 truncate max-w-[160px]" style={{ color: "var(--ink-soft)" }}>{k.alamat || "—"}</td>
                                <td className="p-3.5 text-center">
                                  {isOwnerLike(session.role) ? (
                                    <button onClick={() => setStatusUbahTarget(k)} disabled={statusUbahLoadingId === k._id}
                                      className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide disabled:opacity-50"
                                      style={{ background: statusInfo(k.status).bg, color: statusInfo(k.status).fg }}
                                      title="Klik untuk ubah status">
                                      {statusUbahLoadingId === k._id ? "..." : statusInfo(k.status).label}
                                    </button>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
                                      style={{ background: statusInfo(k.status).bg, color: statusInfo(k.status).fg }}>{statusInfo(k.status).label}</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button onClick={() => pemicuEdit(k)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit"><IconEdit className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => setDeleteTarget(k)} className="p-1.5 rounded-lg border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }} title="Hapus"><IconTrash className="w-3.5 h-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Pagination page={pageKaryawan} setPage={setPageKaryawan} totalPages={totalPagesKaryawan} totalItems={filteredKaryawan.length} pageSize={PAGE_SIZE_K} />
                  </div>
                </div>
                </div>
              )}

              {currentMenu === "salary" && canAccess(session.role, "salary") && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>Salary Karyawan</h1>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Atur gaji pokok & limit kasbon per karyawan, serta tandai gaji yang sudah ditransfer tiap bulan</p>
                  </div>

                  {/* MASTER GAJI POKOK & LIMIT KASBON */}
                  <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                    <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Gaji Pokok & Limit Kasbon</h3>
                        <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredSalary.length} dari {salaryList.length} karyawan</p>
                      </div>
                      <div className="relative">
                        <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={searchSalary} onChange={e => setSearchSalary(e.target.value)} placeholder="Cari nama / ID"
                          className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-56" style={{ borderColor: "var(--border)" }} />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[760px]">
                        <thead>
                          <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                            <th className="p-4">Karyawan</th>
                            <th className="p-4 text-right">Gaji Pokok</th>
                            <th className="p-4 text-right">Limit Kasbon</th>
                            <th className="p-4 text-right">Kasbon Belum Lunas</th>
                            <th className="p-4 text-right">Total Harus Dibayar</th>
                            <th className="p-4 text-center w-20">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                          {salaryLoading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-xs" style={{ color: "var(--ink-soft)" }}>Memuat data...</td></tr>
                          ) : pagedSalary.length === 0 ? (
                            <tr><td colSpan="6"><EmptyState title={searchSalary ? "Tidak ditemukan" : "Belum ada data karyawan"} subtitle={searchSalary ? "Coba kata kunci lain." : "Tambahkan karyawan lewat Master Data Karyawan."} icon={<IconWallet className="w-5 h-5" />} /></td></tr>
                          ) : (
                            pagedSalary.map(s => (
                              <tr key={s.karyawan_id} className="hover:bg-gray-50/60 transition">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <Avatar name={s.nama} size={32} />
                                    <div>
                                      <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{s.nama}</p>
                                      <p className="font-mono text-[10px]" style={{ color: "var(--ink-soft)" }}>{s.karyawan_id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 text-right font-bold font-mono" style={{ color: "var(--ink)" }}>{fmtRupiah(s.gaji_pokok)}</td>
                                <td className="p-3.5 text-right font-mono" style={{ color: "var(--ink-soft)" }}>{fmtRupiah(s.limit_kasbon)}</td>
                                <td className="p-3.5 text-right font-mono" style={{ color: s.kasbon_belum_lunas > 0 ? "var(--amber)" : "var(--ink-soft)" }}>{fmtRupiah(s.kasbon_belum_lunas)}</td>
                                <td className="p-3.5 text-right font-bold font-mono" style={{ color: "var(--green)" }}>{fmtRupiah(s.total_harus_dibayar)}</td>
                                <td className="p-3.5 text-center">
                                  <button onClick={() => bukaEditSalary(s)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit Gaji & Limit Kasbon"><IconEdit className="w-3.5 h-3.5" /></button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Pagination page={pageSalary} setPage={setPageSalary} totalPages={totalPagesSalary} totalItems={filteredSalary.length} pageSize={PAGE_SIZE_SAL} />
                  </div>

                  {/* PEMBAYARAN GAJI PER PERIODE (BULANAN) */}
                  <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                    <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Pembayaran Gaji Bulanan</h3>
                        <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>Total transfer periode ini: <b style={{ color: "var(--ink)" }}>{fmtRupiah(totalTransferBulanIni)}</b></p>
                      </div>
                      <input type="month" value={salaryPeriode} onChange={e => setSalaryPeriode(e.target.value)}
                        className="px-3 py-2 border rounded-xl text-xs font-semibold outline-none bg-white" style={{ borderColor: "var(--border)" }} />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[760px]">
                        <thead>
                          <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                            <th className="p-4">Karyawan</th>
                            <th className="p-4 text-right">Gaji Pokok</th>
                            <th className="p-4 text-right">Potongan Kasbon</th>
                            <th className="p-4 text-right">Total Ditransfer</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center w-44">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                          {salaryPaymentLoading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-xs" style={{ color: "var(--ink-soft)" }}>Memuat data...</td></tr>
                          ) : salaryPaymentList.length === 0 ? (
                            <tr><td colSpan="6"><EmptyState title="Belum ada karyawan aktif" subtitle="Data akan muncul otomatis untuk karyawan berstatus Aktif." icon={<IconWallet className="w-5 h-5" />} /></td></tr>
                          ) : (
                            salaryPaymentList.map(p => (
                              <tr key={p.karyawan_id} className="hover:bg-gray-50/60 transition align-top">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <Avatar name={p.nama} size={32} />
                                    <div>
                                      <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{p.nama}</p>
                                      <p className="font-mono text-[10px]" style={{ color: "var(--ink-soft)" }}>{p.karyawan_id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 text-right font-mono" style={{ color: "var(--ink-soft)" }}>{fmtRupiah(p.gaji_pokok)}</td>
                                <td className="p-3.5 text-right font-mono" style={{ color: p.total_kasbon_dipotong > 0 ? "var(--red)" : "var(--ink-soft)" }}>
                                  {p.total_kasbon_dipotong > 0 ? `- ${fmtRupiah(p.total_kasbon_dipotong)}` : fmtRupiah(0)}
                                </td>
                                <td className="p-3.5 text-right font-bold font-mono" style={{ color: "var(--ink)" }}>{fmtRupiah(p.total_dibayar)}</td>
                                <td className="p-3.5 text-center">
                                  <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
                                    style={{ background: p.status === "Sudah Dibayar" ? "var(--green-soft)" : "var(--amber-soft)", color: p.status === "Sudah Dibayar" ? "var(--green)" : "var(--amber)" }}>{p.status}</span>
                                  {p.status === "Sudah Dibayar" && p.tanggal_dibayar && (
                                    <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>{new Date(p.tanggal_dibayar).toLocaleDateString("id-ID")}</p>
                                  )}
                                </td>
                                <td className="p-3.5 text-center">
                                  {p.status === "Sudah Dibayar" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: "var(--green)" }}><IconCheck className="w-3.5 h-3.5" /> Lunas dibayar</span>
                                  ) : (
                                    <button onClick={() => handleTandaiDibayarSalary(p)} disabled={bayarSubmittingId === p.karyawan_id}
                                      className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase disabled:opacity-50" style={{ background: "var(--green-soft)", color: "var(--green)" }}>
                                      {bayarSubmittingId === p.karyawan_id ? "..." : "Tandai Sudah Dibayar"}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MODAL EDIT GAJI POKOK & LIMIT KASBON */}
                  {salaryEditTarget && (
                    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: "rgba(11,18,32,.45)" }} onClick={() => setSalaryEditTarget(null)}>
                      <div className="modal-in bg-white rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold font-display text-base" style={{ color: "var(--ink)" }}>Edit Gaji & Limit Kasbon</h3>
                          <button onClick={() => setSalaryEditTarget(null)} className="p-1 rounded-lg hover:bg-gray-100"><IconX className="w-4 h-4" style={{ color: "var(--ink-soft)" }} /></button>
                        </div>
                        <p className="text-xs mb-4" style={{ color: "var(--ink-soft)" }}>{salaryEditTarget.nama} · <span className="font-mono">{salaryEditTarget.karyawan_id}</span></p>
                        <form onSubmit={handleSimpanSalary} className="space-y-3.5 text-xs">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Gaji Pokok</label>
                            <input type="number" min="0" placeholder="Contoh: 4500000" value={salaryEditGajiPokok} onChange={e => setSalaryEditGajiPokok(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: salaryFormErrors.gaji_pokok ? "var(--red)" : "var(--border)" }} />
                            {salaryFormErrors.gaji_pokok && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{salaryFormErrors.gaji_pokok}</p>}
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Limit Kasbon</label>
                            <input type="number" min="0" placeholder="Contoh: 1500000" value={salaryEditLimitKasbon} onChange={e => setSalaryEditLimitKasbon(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: salaryFormErrors.limit_kasbon ? "var(--red)" : "var(--border)" }} />
                            {salaryFormErrors.limit_kasbon && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{salaryFormErrors.limit_kasbon}</p>}
                            <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>Diatur manual per karyawan, tidak lagi berdasarkan role. Kosongkan untuk pakai limit default sistem.</p>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button type="button" onClick={() => setSalaryEditTarget(null)} className="flex-1 py-2.5 rounded-xl border font-semibold text-xs hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>Batal</button>
                            <button type="submit" disabled={salarySubmitting} className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-white disabled:opacity-60" style={{ background: "var(--brand)" }}>
                              {salarySubmitting ? "Menyimpan..." : "Simpan"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentMenu === "log" && canAccess(session.role, "log") && (
                <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <div className="p-4 border-b flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Log Riwayat Absensi</h3>
                      <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredLog.length} dari {rekapAbsen.length} catatan</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={searchLog} onChange={e => setSearchLog(e.target.value)} placeholder="Cari nama / ID"
                          className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-44" style={{ borderColor: "var(--border)" }} />
                      </div>
                      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                        <option value="semua">Semua Status</option>
                        <option value="tepat">Tepat Waktu</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="belum_checkout">Belum Checkout</option>
                      </select>
                      <button onClick={() => muatSemuaData()} className="p-2 border rounded-xl hover:bg-gray-50" style={{ borderColor: "var(--border)" }} title="Muat ulang"><IconRefresh className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} /></button>
                      <button onClick={() => downloadCsv("log-absensi.csv", toCsv(filteredLog, [
                        { label: "ID", get: r => r.karyawan_id }, { label: "Nama", get: r => r.nama },
                        { label: "Jabatan", get: r => roleInfo(karyawanMap[r.karyawan_id]?.role).label }, { label: "Cabang", get: r => karyawanMap[r.karyawan_id]?.cabang || "" },
                        { label: "Jadwal", get: r => r.shift || "Shift 1" },
                        { label: "Checkin", get: r => r.masuk ? new Date(r.masuk.waktu_absen).toLocaleString("id-ID") : "-" },
                        { label: "Checkout", get: r => r.pulang ? new Date(r.pulang.waktu_absen).toLocaleString("id-ID") : "-" },
                        { label: "Telat", get: r => (r.masuk?.keterangan && r.masuk.keterangan !== "Normal") ? r.masuk.keterangan : "-" },
                        { label: "Lokasi Absen Masuk", get: r => r.masuk?.lokasi?.alamat || (r.masuk?.lokasi?.latitude != null ? `${r.masuk.lokasi.latitude}, ${r.masuk.lokasi.longitude}` : "-") },
                      ]))} className="p-2 border rounded-xl hover:bg-gray-50" style={{ borderColor: "var(--border)" }} title="Ekspor CSV"><IconDownload className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} /></button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[1080px]">
                      <thead>
                        <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                          <th className="p-4 w-10">No</th>
                          <th className="p-4">Karyawan</th>
                          <th className="p-4">Jabatan</th>
                          <th className="p-4">Cabang</th>
                          <th className="p-4">Jadwal</th>
                          <th className="p-4">Checkin</th>
                          <th className="p-4">Checkout</th>
                          <th className="p-4">Telat</th>
                          <th className="p-4">Lokasi</th>
                          <th className="p-4 text-center">Foto In</th>
                          <th className="p-4 text-center">Foto Out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {pagedLog.length === 0 ? (
                          <tr><td colSpan="11"><EmptyState title={searchLog || statusFilter !== "semua" ? "Tidak ditemukan" : "Belum ada catatan"} subtitle={searchLog || statusFilter !== "semua" ? "Coba ubah filter pencarian." : "Log absensi masuk/pulang akan tampil di sini."} icon={<IconClock className="w-5 h-5" />} /></td></tr>
                        ) : (
                          pagedLog.map((g, idx) => {
                            const km = karyawanMap[g.karyawan_id];
                            const telat = g.masuk?.keterangan && g.masuk.keterangan !== "Normal";
                            return (
                              <tr key={g.key} className="hover:bg-gray-50/60 transition">
                                <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{(pageLog - 1) * PAGE_SIZE_L + idx + 1}</td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <Avatar name={g.nama} size={32} />
                                    <div>
                                      <p className="font-bold text-sm whitespace-nowrap" style={{ color: "var(--ink)" }}>{g.nama}</p>
                                      <p className="font-mono text-[10px]" style={{ color: "var(--ink-soft)" }}>{g.karyawan_id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide whitespace-nowrap"
                                    style={{ background: roleInfo(km?.role).badgeBg, color: roleInfo(km?.role).badgeFg }}>{roleInfo(km?.role).label}</span>
                                </td>
                                <td className="p-3.5 whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{km?.cabang || "—"}</td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap" style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}>{g.shift}</span>
                                </td>
                                <td className="p-3.5 font-mono whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{g.masuk ? new Date(g.masuk.waktu_absen).toLocaleString("id-ID") : "-"}</td>
                                <td className="p-3.5 font-mono whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{g.pulang ? new Date(g.pulang.waktu_absen).toLocaleString("id-ID") : "-"}</td>
                                <td className="p-3.5">
                                  {telat ? (
                                    <span className="font-semibold text-[11px] px-2 py-0.5 rounded whitespace-nowrap" style={{ color: "var(--red)", background: "var(--red-soft)" }}>{g.masuk.keterangan}</span>
                                  ) : (
                                    <span className="font-semibold text-[11px]" style={{ color: g.masuk ? "var(--green)" : "var(--ink-soft)" }}>{g.masuk ? "Tepat Waktu" : "-"}</span>
                                  )}
                                </td>
                                <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>
                                  {g.masuk?.lokasi?.latitude != null ? (
                                    <a href={`https://www.google.com/maps?q=${g.masuk.lokasi.latitude},${g.masuk.lokasi.longitude}`} target="_blank" rel="noreferrer"
                                      className="text-[10px] font-semibold underline hover:no-underline" style={{ color: "var(--brand-dark)" }} title={g.masuk.lokasi.alamat || `${g.masuk.lokasi.latitude}, ${g.masuk.lokasi.longitude}`}>
                                      {g.masuk.lokasi.alamat ? (g.masuk.lokasi.alamat.length > 28 ? g.masuk.lokasi.alamat.slice(0, 28) + "…" : g.masuk.lokasi.alamat) : "Lihat Peta"}
                                    </a>
                                  ) : <span>—</span>}
                                </td>
                                <td className="p-3.5 text-center">
                                  {g.masuk ? (
                                    <button onClick={() => setFotoPreview({ nama: g.nama, label: "Foto Checkin", waktu: new Date(g.masuk.waktu_absen).toLocaleTimeString("id-ID"), foto: g.masuk.foto })}
                                      className="p-1.5 rounded-lg" style={{ background: "var(--green-soft)", color: "var(--green)" }} title="Lihat foto checkin"><IconEye className="w-3.5 h-3.5" /></button>
                                  ) : <span style={{ color: "var(--ink-soft)" }}>-</span>}
                                </td>
                                <td className="p-3.5 text-center">
                                  {g.pulang ? (
                                    <button onClick={() => setFotoPreview({ nama: g.nama, label: "Foto Checkout", waktu: new Date(g.pulang.waktu_absen).toLocaleTimeString("id-ID"), foto: g.pulang.foto })}
                                      className="p-1.5 rounded-lg" style={{ background: "var(--amber-soft)", color: "var(--amber)" }} title="Lihat foto checkout"><IconEye className="w-3.5 h-3.5" /></button>
                                  ) : <span style={{ color: "var(--ink-soft)" }}>-</span>}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={pageLog} setPage={setPageLog} totalPages={totalPagesLog} totalItems={filteredLog.length} pageSize={PAGE_SIZE_L} />
                </div>
              )}

              {currentMenu === "keuangan" && canAccess(session.role, "keuangan") && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h1 className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>Modul Keuangan</h1>
                      <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Catatan uang masuk & keluar, laporan, dan ekspor Excel untuk Owner</p>
                    </div>
                    <button onClick={eksporExcelKeuangan} className="text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto" style={{ background: "var(--green)" }}>
                      <IconFileExcel className="w-3.5 h-3.5" /> Ekspor ke Excel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Total Uang Masuk" value={fmtRupiah(finTotalMasuk)} unit="" tone="green" icon={<IconTrendUp className="w-5 h-5" />} />
                    <StatCard label="Total Uang Keluar" value={fmtRupiah(finTotalKeluar)} unit="" tone="amber" icon={<IconTrendDown className="w-5 h-5" />} />
                    <StatCard label="Saldo Bersih" value={fmtRupiah(finSaldo)} unit="" tone="brand" icon={<IconWallet className="w-5 h-5" />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* FORM TRANSAKSI */}
                    <div className="bg-white p-5 rounded-2xl border h-fit lg:sticky lg:top-6" style={{ borderColor: "var(--border)" }}>
                      <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>{finEditId ? "Edit Transaksi" : "Catat Transaksi Baru"}</h2>
                      <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>{finEditId ? "Perbarui data transaksi terpilih" : "Input uang masuk atau keluar"}</p>

                      <form onSubmit={handleSubmitFinance} className="space-y-3.5 text-xs">
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tipe Transaksi</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => { setFinTipe("Masuk"); setFinKategori(""); }}
                              className={`py-2 rounded-xl text-xs font-bold border transition ${finTipe === "Masuk" ? "text-white border-transparent" : "bg-white"}`}
                              style={finTipe === "Masuk" ? { background: "var(--green)" } : { borderColor: "var(--border)", color: "var(--ink-soft)" }}>Uang Masuk</button>
                            <button type="button" onClick={() => { setFinTipe("Keluar"); setFinKategori(""); }}
                              className={`py-2 rounded-xl text-xs font-bold border transition ${finTipe === "Keluar" ? "text-white border-transparent" : "bg-white"}`}
                              style={finTipe === "Keluar" ? { background: "var(--amber)" } : { borderColor: "var(--border)", color: "var(--ink-soft)" }}>Uang Keluar</button>
                          </div>
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tanggal</label>
                          <input type="date" value={finTanggal} onChange={e => setFinTanggal(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: finErrors.tanggal ? "var(--red)" : "var(--border)" }} />
                          {finErrors.tanggal && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{finErrors.tanggal}</p>}
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Kategori</label>
                          <input list="kategori-list" value={finKategori} onChange={e => setFinKategori(e.target.value)} placeholder="Pilih atau ketik kategori"
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: finErrors.kategori ? "var(--red)" : "var(--border)" }} />
                          <datalist id="kategori-list">
                            {(finTipe === "Masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR).map(k => <option key={k} value={k} />)}
                          </datalist>
                          {finErrors.kategori && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{finErrors.kategori}</p>}
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jumlah (Rp)</label>
                          <input type="number" min="0" step="1000" placeholder="0" value={finJumlah} onChange={e => setFinJumlah(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: finErrors.jumlah ? "var(--red)" : "var(--border)" }} />
                          {finErrors.jumlah && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{finErrors.jumlah}</p>}
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Metode</label>
                          <select value={finMetode} onChange={e => setFinMetode(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                            <option>Transfer</option>
                            <option>Cash</option>
                            <option>QRIS</option>
                            <option>Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Keterangan</label>
                          <textarea placeholder="Catatan tambahan..." rows="2" value={finKeterangan} onChange={e => setFinKeterangan(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium resize-none" style={{ borderColor: "var(--border)" }}></textarea>
                        </div>
                        <div className="pt-1 flex gap-2">
                          <button type="submit" disabled={finSubmitting} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                            {finSubmitting ? "Memproses..." : finEditId ? "Update Transaksi" : "Simpan Transaksi"}
                          </button>
                          {finEditId && (
                            <button type="button" onClick={resetFormFinance} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* TABEL TRANSAKSI */}
                    <div className="elev-card lg:col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="p-4 border-b flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Riwayat Transaksi</h3>
                            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredTransaksi.length} dari {transaksiList.length} transaksi</p>
                          </div>
                          <div className="relative">
                            <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={finSearch} onChange={e => setFinSearch(e.target.value)} placeholder="Cari kategori / keterangan"
                              className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-52" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-2">
                            <select value={finTipeFilter} onChange={e => setFinTipeFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                              <option value="semua">Semua Tipe</option>
                              <option value="Masuk">Uang Masuk</option>
                              <option value="Keluar">Uang Keluar</option>
                            </select>
                            <input type="date" value={finDari} onChange={e => setFinDari(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none" style={{ borderColor: "var(--border)" }} />
                            <span className="self-center text-[11px]" style={{ color: "var(--ink-soft)" }}>s/d</span>
                            <input type="date" value={finSampai} onChange={e => setFinSampai(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <button onClick={eksporExcelKeuangan} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-sm" style={{ background: "var(--green)" }}>
                            <IconFileExcel className="w-3.5 h-3.5" /> Ekspor ke Excel
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[680px]">
                          <thead>
                            <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                              <th className="p-4">Tanggal</th>
                              <th className="p-4">Kategori</th>
                              <th className="p-4 text-center">Tipe</th>
                              <th className="p-4 text-right">Jumlah</th>
                              <th className="p-4">Metode</th>
                              <th className="p-4 text-center w-20">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                            {pagedFin.length === 0 ? (
                              <tr><td colSpan="6"><EmptyState title={finSearch || finTipeFilter !== "semua" ? "Tidak ditemukan" : "Belum ada transaksi"} subtitle={finSearch || finTipeFilter !== "semua" ? "Coba ubah filter pencarian." : "Catat transaksi pertama lewat formulir di samping."} icon={<IconWallet className="w-5 h-5" />} /></td></tr>
                            ) : (
                              pagedFin.map(t => (
                                <tr key={t._id} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5 font-mono" style={{ color: "var(--ink-soft)" }}>{new Date(t.tanggal).toLocaleDateString("id-ID")}</td>
                                  <td className="p-3.5">
                                    <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{t.kategori}</p>
                                    {t.keterangan && <p className="text-[10px] truncate max-w-[220px]" style={{ color: "var(--ink-soft)" }}>{t.keterangan}</p>}
                                  </td>
                                  <td className="p-3.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
                                      style={{ background: t.tipe === "Masuk" ? "var(--green-soft)" : "var(--amber-soft)", color: t.tipe === "Masuk" ? "var(--green)" : "var(--amber)" }}>{t.tipe}</span>
                                  </td>
                                  <td className="p-3.5 text-right font-bold font-mono" style={{ color: t.tipe === "Masuk" ? "var(--green)" : "var(--red)" }}>
                                    {t.tipe === "Masuk" ? "+" : "-"} {fmtRupiah(t.jumlah)}
                                  </td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{t.metode || "-"}</td>
                                  <td className="p-3.5">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button onClick={() => pemicuEditFinance(t)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit"><IconEdit className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => setFinDeleteTarget(t)} className="p-1.5 rounded-lg border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }} title="Hapus"><IconTrash className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination page={pageFin} setPage={setPageFin} totalPages={totalPagesFin} totalItems={filteredTransaksi.length}
                        pageSize={pageSizeFin} pageSizeOptions={[10, 20, 50, 100]}
                        onPageSizeChange={(n) => { setPageSizeFin(n); setPageFin(1); }} />
                    </div>
                  </div>
                </div>
              )}

              {currentMenu === "tracking" && canAccess(session.role, "tracking") && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h1 className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>Tracking BAST</h1>
                      <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Monitoring dokumen BAST per region & jenis WO — Waiting Submit → Waiting BAST Final → BAST Final</p>
                    </div>
                    <button onClick={eksporExcelTracking} className="text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto" style={{ background: "var(--green)" }}>
                      <IconFileExcel className="w-3.5 h-3.5" /> Ekspor ke Excel
                    </button>
                  </div>

                  {/* STAT CARDS PER STATUS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TRACKING_STATUS.map(s => {
                      const tone = trackingStatusTone(s);
                      return (
                        <div key={s} className="bg-white p-5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: tone.bg, color: tone.fg }}>{s}</span>
                            <span className="text-xs font-mono font-bold" style={{ color: "var(--ink-soft)" }}>{trackingRekap.grandTotal[s]?.count || 0} entri</span>
                          </div>
                          <p className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>{fmtRupiah(trackingRekap.grandTotal[s]?.nilaiAsianet || 0)}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{trackingRekap.grandTotal[s]?.jumlahWO || 0} WO/Tiket</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* REKAP PER REGION X STATUS */}
                  <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                    <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                      <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Rekap per Region</h3>
                      <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>Jumlah WO & total nilai Asianet, dipecah per tahap status</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[720px]">
                        <thead>
                          <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                            <th className="p-3.5" rowSpan="2">Region</th>
                            {TRACKING_STATUS.map(s => <th key={s} className="p-3.5 text-center border-l" style={{ borderColor: "var(--border)" }} colSpan="2">{s}</th>)}
                          </tr>
                          <tr className="border-b font-bold uppercase tracking-wider text-[10px]" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                            {TRACKING_STATUS.map(s => (
                              <React.Fragment key={s}>
                                <th className="p-2.5 text-center border-l" style={{ borderColor: "var(--border)" }}>Jml WO</th>
                                <th className="p-2.5 text-center">Nilai</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                          {trackingRekap.perRegion.length === 0 ? (
                            <tr><td colSpan={1 + TRACKING_STATUS.length * 2}><EmptyState title="Belum ada data tracking" subtitle="Tambahkan data pertama lewat formulir di bawah." icon={<IconTracking className="w-5 h-5" />} /></td></tr>
                          ) : (
                            <>
                              {trackingRekap.perRegion.map(r => (
                                <tr key={r.region} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5 font-bold" style={{ color: "var(--ink)" }}>{r.region}</td>
                                  {TRACKING_STATUS.map(s => (
                                    <React.Fragment key={s}>
                                      <td className="p-3.5 text-center border-l font-mono" style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}>{r.perStatus[s].jumlahWO}</td>
                                      <td className="p-3.5 text-center font-mono font-semibold" style={{ color: "var(--ink)" }}>{fmtRupiah(r.perStatus[s].nilaiAsianet)}</td>
                                    </React.Fragment>
                                  ))}
                                </tr>
                              ))}
                              <tr className="font-bold" style={{ background: "var(--canvas)" }}>
                                <td className="p-3.5" style={{ color: "var(--ink)" }}>GRAND TOTAL</td>
                                {TRACKING_STATUS.map(s => (
                                  <React.Fragment key={s}>
                                    <td className="p-3.5 text-center border-l font-mono" style={{ borderColor: "var(--border)", color: "var(--ink)" }}>{trackingRekap.grandTotal[s].jumlahWO}</td>
                                    <td className="p-3.5 text-center font-mono" style={{ color: "var(--brand-dark)" }}>{fmtRupiah(trackingRekap.grandTotal[s].nilaiAsianet)}</td>
                                  </React.Fragment>
                                ))}
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* FORM TRACKING */}
                    <div className="bg-white p-5 rounded-2xl border h-fit lg:sticky lg:top-6" style={{ borderColor: "var(--border)" }}>
                      <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>{trkEditId ? "Edit Data Tracking" : "Tambah Data Tracking"}</h2>
                      <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>{trkEditId ? "Perbarui data terpilih" : "Input dokumen BAST baru"}</p>

                      <form onSubmit={handleSubmitTracking} className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Region</label>
                            <input list="region-list" value={trkRegion} onChange={e => setTrkRegion(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: trkErrors.region ? "var(--red)" : "var(--border)" }} />
                            <datalist id="region-list">{TRACKING_REGIONS.map(r => <option key={r} value={r} />)}</datalist>
                            {trkErrors.region && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{trkErrors.region}</p>}
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tahun</label>
                            <input type="number" value={trkTahun} onChange={e => setTrkTahun(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: trkErrors.tahun ? "var(--red)" : "var(--border)" }} />
                          </div>
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jenis WO</label>
                          <select value={trkWoType} onChange={e => setTrkWoType(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                            {TRACKING_WO_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Project</label>
                            <select value={trkProject} onChange={e => setTrkProject(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: trkErrors.project ? "var(--red)" : "var(--border)" }}>
                              <option value="">— Pilih —</option>
                              {PROJECT_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {trkErrors.project && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{trkErrors.project}</p>}
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Vendor</label>
                            <select value={trkVendor} onChange={e => setTrkVendor(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: trkErrors.vendor ? "var(--red)" : "var(--border)" }}>
                              <option value="">— Pilih —</option>
                              {VENDOR_PRESETS.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                            {trkErrors.vendor && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{trkErrors.vendor}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Bulan</label>
                            <select value={trkBulan} onChange={e => setTrkBulan(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                              <option value="">-</option>
                              {TRACKING_BULAN.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Batch</label>
                            <input type="number" placeholder="-" value={trkBatch} onChange={e => setTrkBatch(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jumlah WO</label>
                            <input type="number" min="0" placeholder="0" value={trkJumlahWO} onChange={e => setTrkJumlahWO(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Status</label>
                            <select value={trkStatus} onChange={e => setTrkStatus(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                              {TRACKING_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Amount (Rp)</label>
                            <input type="number" min="0" placeholder="0" value={trkAmount} onChange={e => setTrkAmount(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Nilai Asianet (Rp)</label>
                            <input type="number" min="0" placeholder="0" value={trkNilaiAsianet} onChange={e => setTrkNilaiAsianet(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tanggal</label>
                            <input type="date" value={trkTanggal} onChange={e => setTrkTanggal(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>PIC</label>
                            <input type="text" placeholder="Nama PIC" value={trkPic} onChange={e => setTrkPic(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Remark</label>
                          <input type="text" placeholder="ex: Done Invoice ..." value={trkRemark} onChange={e => setTrkRemark(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Action Plan</label>
                          <input type="text" placeholder="ex: Estimasi Rekon ..." value={trkActionPlan} onChange={e => setTrkActionPlan(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Note</label>
                          <textarea placeholder="Catatan tambahan..." rows="2" value={trkNote} onChange={e => setTrkNote(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium resize-none" style={{ borderColor: "var(--border)" }}></textarea>
                        </div>
                        <div className="pt-1 flex gap-2">
                          <button type="submit" disabled={trkSubmitting} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                            {trkSubmitting ? "Memproses..." : trkEditId ? "Update Data" : "Simpan Data"}
                          </button>
                          {trkEditId && (
                            <button type="button" onClick={resetFormTracking} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* TABEL DATA TRACKING */}
                    <div className="elev-card lg:col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="p-4 border-b flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Daftar Data Tracking</h3>
                            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredTracking.length} dari {trackingList.length} data</p>
                          </div>
                          <div className="relative">
                            <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={trkSearch} onChange={e => setTrkSearch(e.target.value)} placeholder="Cari region / WO / PIC"
                              className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-52" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <select value={trkRegionFilter} onChange={e => setTrkRegionFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="semua">Semua Region</option>
                            {[...new Set([...TRACKING_REGIONS, ...trackingList.map(t => t.region)])].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <select value={trkStatusFilter} onChange={e => setTrkStatusFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="semua">Semua Status</option>
                            {TRACKING_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <select value={trkWoTypeFilter} onChange={e => setTrkWoTypeFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="semua">Semua Jenis WO</option>
                            {TRACKING_WO_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[980px]">
                          <thead>
                            <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                              <th className="p-4">Region / WO</th>
                              <th className="p-4">Project</th>
                              <th className="p-4">Vendor</th>
                              <th className="p-4">Bulan / Batch</th>
                              <th className="p-4 text-right">Nilai Asianet</th>
                              <th className="p-4 text-center">Status</th>
                              <th className="p-4">PIC</th>
                              <th className="p-4 text-center w-20">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                            {pagedTrk.length === 0 ? (
                              <tr><td colSpan="8"><EmptyState title={trkSearch || trkRegionFilter !== "semua" || trkStatusFilter !== "semua" || trkWoTypeFilter !== "semua" ? "Tidak ditemukan" : "Belum ada data tracking"} subtitle={trkSearch || trkRegionFilter !== "semua" ? "Coba ubah filter pencarian." : "Tambahkan data pertama lewat formulir di samping."} icon={<IconTracking className="w-5 h-5" />} /></td></tr>
                            ) : (
                              pagedTrk.map(t => {
                                const tone = trackingStatusTone(t.status);
                                return (
                                  <tr key={t._id} className="hover:bg-gray-50/60 transition">
                                    <td className="p-3.5">
                                      <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{t.region}</p>
                                      <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{t.woType} · {t.tahun}</p>
                                    </td>
                                    <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{t.project || "-"}</td>
                                    <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{t.vendor || "-"}</td>
                                    <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{t.bulan || "-"} {t.batch != null ? `· Batch ${t.batch}` : ""}</td>
                                    <td className="p-3.5 text-right font-bold font-mono" style={{ color: "var(--ink)" }}>{fmtRupiah(t.nilaiAsianet)}</td>
                                    <td className="p-3.5 text-center">
                                      <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide" style={{ background: tone.bg, color: tone.fg }}>{t.status}</span>
                                    </td>
                                    <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{t.pic || "-"}</td>
                                    <td className="p-3.5">
                                      <div className="flex items-center justify-center gap-1.5">
                                        {t.status === "BAST Final" && (
                                          <button onClick={() => pemicuBuatInvoiceDariTracking(t)} className="p-1.5 rounded-lg border hover:bg-green-50" style={{ borderColor: "var(--border)", color: "var(--green)" }} title="Buat Invoice"><IconPlus className="w-3.5 h-3.5" /></button>
                                        )}
                                        <button onClick={() => pemicuEditTracking(t)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit"><IconEdit className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setTrkDeleteTarget(t)} className="p-1.5 rounded-lg border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }} title="Hapus"><IconTrash className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination page={pageTrk} setPage={setPageTrk} totalPages={totalPagesTrk} totalItems={filteredTracking.length}
                        pageSize={pageSizeTrk} pageSizeOptions={[10, 20, 50, 100]}
                        onPageSizeChange={(n) => { setPageSizeTrk(n); setPageTrk(1); }} />
                    </div>
                  </div>
                </div>
              )}

              {currentMenu === "kasbon" && canAccess(session.role, "kasbon") && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold font-display" style={{ color: "var(--ink)" }}>Kasbon & Cuti/Izin/Sakit</h1>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Persetujuan pengajuan karyawan — khusus Owner</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-w-xs">
                    <button onClick={() => { setKasbonSubTab("Kasbon"); setPageKasbon(1); }}
                      className="py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5"
                      style={kasbonSubTab === "Kasbon" ? { background: "var(--brand)", color: "#fff", borderColor: "var(--brand)" } : { borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                      Kasbon {kasbonPending > 0 && <span className="px-1.5 rounded-full text-[10px] font-black" style={{ background: kasbonSubTab === "Kasbon" ? "rgba(255,255,255,.25)" : "var(--amber-soft)", color: kasbonSubTab === "Kasbon" ? "#fff" : "var(--amber)" }}>{kasbonPending}</span>}
                    </button>
                    <button onClick={() => { setKasbonSubTab("Pengajuan"); setPagePengajuanCIS(1); }}
                      className="py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5"
                      style={kasbonSubTab === "Pengajuan" ? { background: "var(--brand)", color: "#fff", borderColor: "var(--brand)" } : { borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                      Cuti/Izin/Sakit {pengajuanPending > 0 && <span className="px-1.5 rounded-full text-[10px] font-black" style={{ background: kasbonSubTab === "Pengajuan" ? "rgba(255,255,255,.25)" : "var(--amber-soft)", color: kasbonSubTab === "Pengajuan" ? "#fff" : "var(--amber)" }}>{pengajuanPending}</span>}
                    </button>
                  </div>

                  {kasbonSubTab === "Kasbon" ? (
                    <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Daftar Pengajuan Kasbon</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredKasbonList.length} dari {kasbonList.length} pengajuan</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="relative">
                            <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={searchKasbon} onChange={e => setSearchKasbon(e.target.value)} placeholder="Cari nama / ID"
                              className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-44" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <select value={kasbonStatusFilter} onChange={e => setKasbonStatusFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="semua">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Ditolak">Ditolak</option>
                          </select>
                        <button onClick={() => downloadCsv("kasbon.csv", toCsv(filteredKasbonList, [
                          { label: "ID Karyawan", get: r => r.karyawan_id },
                          { label: "Nama", get: r => r.nama },
                          { label: "Jumlah", get: r => r.jumlah },
                          { label: "Region", get: r => r.region || "" },
                          { label: "Vendor", get: r => r.vendor || "" },
                          { label: "Alasan", get: r => r.alasan || "" },
                          { label: "Metode Pembayaran", get: r => r.metode_pembayaran || "" },
                          { label: "Penyedia Pembayaran", get: r => r.penyedia_pembayaran || "" },
                          { label: "No Rekening", get: r => r.no_rekening || "" },
                          { label: "Tanggal Pengajuan", get: r => r.tanggal_pengajuan ? new Date(r.tanggal_pengajuan).toLocaleDateString("id-ID") : "" },
                          { label: "Status", get: r => r.status },
                          { label: "Status Lunas", get: r => r.status === "Disetujui" ? (r.lunas ? "Lunas" : "Belum Lunas") : "-" },
                          { label: "Catatan Admin", get: r => r.catatan_admin || "" },
                        ]))} className="flex items-center gap-1.5 px-3 py-2 border rounded-xl hover:bg-gray-50 text-xs font-semibold shrink-0" style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                          <IconDownload className="w-3.5 h-3.5" /> Ekspor Excel
                        </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                              <th className="p-3.5 text-left w-10">No</th>
                              <th className="p-3.5 text-left">Karyawan</th>
                              <th className="p-3.5 text-right">Jumlah</th>
                              <th className="p-3.5 text-left">Region / Vendor</th>
                              <th className="p-3.5 text-left">Alasan</th>
                              <th className="p-3.5 text-left">Pembayaran</th>
                              <th className="p-3.5 text-center">Tanggal</th>
                              <th className="p-3.5 text-center">Status</th>
                              <th className="p-3.5 text-center w-48">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                            {filteredKasbonList.length === 0 ? (
                              <tr><td colSpan="9"><EmptyState title={(searchKasbon || kasbonStatusFilter !== "semua") ? "Tidak ditemukan" : "Belum ada pengajuan kasbon"} subtitle={(searchKasbon || kasbonStatusFilter !== "semua") ? "Coba ubah kata kunci atau filter." : "Pengajuan dari karyawan akan muncul di sini."} icon={<IconWallet className="w-5 h-5" />} /></td></tr>
                            ) : pagedKasbon.map((k, idx) => {
                              const tone = keputusanStatusTone(k.status);
                              return (
                                <tr key={k._id} className="hover:bg-gray-50/60 transition align-top">
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{(pageKasbonAman - 1) * pageSizeKasbon + idx + 1}</td>
                                  <td className="p-3.5">
                                    <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{k.nama}</p>
                                    <p className="text-[10px] font-mono" style={{ color: "var(--ink-soft)" }}>{k.karyawan_id}</p>
                                  </td>
                                  <td className="p-3.5 text-right font-bold font-mono" style={{ color: "var(--ink)" }}>{fmtRupiah(k.jumlah)}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>
                                    <p>{k.region || "-"}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{k.vendor || "-"}</p>
                                  </td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{k.alasan || "-"}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>
                                    <p className="font-semibold">{k.metode_pembayaran || "-"}{k.penyedia_pembayaran ? ` - ${k.penyedia_pembayaran}` : ""}</p>
                                    <p className="text-[10px] font-mono">{k.no_rekening || "-"}</p>
                                  </td>
                                  <td className="p-3.5 text-center" style={{ color: "var(--ink-soft)" }}>{new Date(k.tanggal_pengajuan).toLocaleDateString("id-ID")}</td>
                                  <td className="p-3.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide" style={{ background: tone.bg, color: tone.fg }}>{k.status}</span>
                                    {k.status === "Disetujui" && <p className="text-[10px] mt-1 font-bold" style={{ color: k.lunas ? "var(--green)" : "var(--amber)" }}>{k.lunas ? "✔ Lunas" : "Belum lunas"}</p>}
                                    {k.status === "Disetujui" && !k.lunas && <p className="text-[10px] mt-0.5 max-w-[160px] mx-auto" style={{ color: "var(--ink-soft)" }}>Otomatis potong gaji bulan ini</p>}
                                    {k.status === "Ditolak" && k.catatan_admin && <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>{k.catatan_admin}</p>}
                                  </td>
                                  <td className="p-3.5">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {k.status === "Pending" && session.role === "owner" && (
                                        <>
                                          <button onClick={() => handleKeputusanKasbon(k, "Disetujui")} className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase" style={{ background: "var(--green-soft)", color: "var(--green)" }}>ACC</button>
                                          <button onClick={() => handleKeputusanKasbon(k, "Ditolak")} className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase" style={{ background: "var(--red-soft)", color: "var(--red)" }}>Tolak</button>
                                        </>
                                      )}
                                      {k.status === "Pending" && session.role !== "owner" && (
                                        <span className="text-[10px] italic" style={{ color: "var(--ink-soft)" }}>Menunggu approval Owner</span>
                                      )}
                                      {k.status === "Disetujui" && !k.lunas && (
                                        <button onClick={() => handleTandaiLunasKasbon(k)} title="Khusus jika karyawan bayar cash di luar potongan gaji" className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase border" style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}>Tandai Lunas (Cash)</button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination page={pageKasbonAman} setPage={setPageKasbon} totalPages={totalPagesKasbon} totalItems={kasbonList.length}
                        pageSize={pageSizeKasbon} pageSizeOptions={PAGE_SIZE_OPTIONS_KASBON}
                        onPageSizeChange={(n) => { setPageSizeKasbon(n); setPageKasbon(1); }} />
                    </div>
                  ) : (
                    <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Daftar Pengajuan Cuti/Izin/Sakit</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredPengajuanCISList.length} dari {pengajuanCISList.length} pengajuan</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="relative">
                            <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={searchPengajuanCIS} onChange={e => setSearchPengajuanCIS(e.target.value)} placeholder="Cari nama / ID"
                              className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-44" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <select value={pengajuanCISStatusFilter} onChange={e => setPengajuanCISStatusFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="semua">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Ditolak">Ditolak</option>
                          </select>
                        <button onClick={() => downloadCsv("cuti-izin-sakit.csv", toCsv(filteredPengajuanCISList, [
                          { label: "ID Karyawan", get: r => r.karyawan_id },
                          { label: "Nama", get: r => r.nama },
                          { label: "Jenis", get: r => r.jenis },
                          { label: "Tanggal Mulai", get: r => r.tanggal_mulai ? new Date(r.tanggal_mulai).toLocaleDateString("id-ID") : "" },
                          { label: "Tanggal Selesai", get: r => r.tanggal_selesai ? new Date(r.tanggal_selesai).toLocaleDateString("id-ID") : "" },
                          { label: "Alasan", get: r => r.alasan || "" },
                          { label: "Status", get: r => r.status },
                          { label: "Catatan Admin", get: r => r.catatan_admin || "" },
                          { label: "Tanggal Pengajuan", get: r => r.tanggal_pengajuan ? new Date(r.tanggal_pengajuan).toLocaleDateString("id-ID") : "" },
                        ]))} className="flex items-center gap-1.5 px-3 py-2 border rounded-xl hover:bg-gray-50 text-xs font-semibold shrink-0" style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                          <IconDownload className="w-3.5 h-3.5" /> Ekspor Excel
                        </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                              <th className="p-3.5 text-left w-10">No</th>
                              <th className="p-3.5 text-left">Karyawan</th>
                              <th className="p-3.5 text-center">Jenis</th>
                              <th className="p-3.5 text-center">Periode</th>
                              <th className="p-3.5 text-left">Alasan</th>
                              <th className="p-3.5 text-center">Status</th>
                              <th className="p-3.5 text-center w-40">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                            {filteredPengajuanCISList.length === 0 ? (
                              <tr><td colSpan="7"><EmptyState title={(searchPengajuanCIS || pengajuanCISStatusFilter !== "semua") ? "Tidak ditemukan" : "Belum ada pengajuan"} subtitle={(searchPengajuanCIS || pengajuanCISStatusFilter !== "semua") ? "Coba ubah kata kunci atau filter." : "Pengajuan cuti/izin/sakit dari karyawan akan muncul di sini."} icon={<IconClock className="w-5 h-5" />} /></td></tr>
                            ) : pagedPengajuanCIS.map((p, idx) => {
                              const tone = keputusanStatusTone(p.status);
                              return (
                                <tr key={p._id} className="hover:bg-gray-50/60 transition align-top">
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{(pagePengajuanCISAman - 1) * pageSizePengajuanCIS + idx + 1}</td>
                                  <td className="p-3.5">
                                    <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{p.nama}</p>
                                    <p className="text-[10px] font-mono" style={{ color: "var(--ink-soft)" }}>{p.karyawan_id}</p>
                                  </td>
                                  <td className="p-3.5 text-center font-bold" style={{ color: "var(--ink)" }}>{p.jenis}</td>
                                  <td className="p-3.5 text-center" style={{ color: "var(--ink-soft)" }}>
                                    {new Date(p.tanggal_mulai).toLocaleDateString("id-ID")} – {new Date(p.tanggal_selesai).toLocaleDateString("id-ID")}
                                  </td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{p.alasan || "-"}</td>
                                  <td className="p-3.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide" style={{ background: tone.bg, color: tone.fg }}>{p.status}</span>
                                    {p.status === "Ditolak" && p.catatan_admin && <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>{p.catatan_admin}</p>}
                                  </td>
                                  <td className="p-3.5">
                                    {p.status === "Pending" && (
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button onClick={() => handleKeputusanPengajuan(p, "Disetujui")} className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase" style={{ background: "var(--green-soft)", color: "var(--green)" }}>ACC</button>
                                        <button onClick={() => handleKeputusanPengajuan(p, "Ditolak")} className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase" style={{ background: "var(--red-soft)", color: "var(--red)" }}>Tolak</button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination page={pagePengajuanCISAman} setPage={setPagePengajuanCIS} totalPages={totalPagesPengajuanCIS} totalItems={pengajuanCISList.length}
                        pageSize={pageSizePengajuanCIS} pageSizeOptions={PAGE_SIZE_OPTIONS_KASBON}
                        onPageSizeChange={(n) => { setPageSizePengajuanCIS(n); setPagePengajuanCIS(1); }} />
                    </div>
                  )}
                </div>
              )}

              {currentMenu === "material" && canAccess(session.role, "material") && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold font-display" style={{ color: "var(--ink)" }}>Pemakaian Material oleh Teknisi</h1>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                      Master jenis material, log pemakaian per teknisi, stok masuk/dikembalikan, dan laporan rekap
                      {!canManageMaterial(session.role) && " (mode lihat saja)"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl">
                    {[
                      { key: "Master", label: "Master Material" },
                      { key: "Pemakaian", label: "Pemakaian Teknisi" },
                      { key: "Stok", label: "Stok Masuk/Kembali" },
                      { key: "Laporan", label: "Laporan" },
                    ].map(tab => (
                      <button key={tab.key} onClick={() => setMaterialSubTab(tab.key)}
                        className="py-2.5 rounded-xl text-xs font-bold border transition"
                        style={materialSubTab === tab.key ? { background: "var(--brand)", color: "#fff", borderColor: "var(--brand)" } : { borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Daftar saran SN ONT (dari Master Material + histori) — dipakai bareng oleh tab Pemakaian & Stok */}
                  <datalist id="sn-ont-datalist">
                    {snOntSuggestions.map(sn => <option key={sn} value={sn} />)}
                  </datalist>

                  {/* ---------------- MASTER MATERIAL ---------------- */}
                  {materialSubTab === "Master" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {canManageMaterial(session.role) && (
                        <div className="bg-white p-5 rounded-2xl border h-fit lg:sticky lg:top-6" style={{ borderColor: "var(--border)" }}>
                          <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>{matEditId ? "Edit Material" : "Tambah Jenis Material"}</h2>
                          <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>{matEditId ? "Perbarui data material terpilih" : "Contoh: Kabel 100 M, Kabel 150 M, ONT ZTE"}</p>
                          <form onSubmit={handleSubmitMaterial} className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Kategori</label>
                              <select value={matKategori} onChange={e => handleMatKategoriChange(e.target.value)} disabled={!!matEditId} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white disabled:opacity-60" style={{ borderColor: "var(--border)" }}>
                                <option value="Kabel">Kabel</option>
                                <option value="ONT">ONT</option>
                                <option value="Lainnya">Lainnya</option>
                              </select>
                            </div>

                            {matKategori === "Kabel" && (
                              <div>
                                <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jenis Kabel</label>
                                <select value={matNamaPilihan} onChange={e => handleMatNamaPilihanChange(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: matFormErrors.nama ? "var(--red)" : "var(--border)" }}>
                                  {KABEL_METER_PRESETS.map(n => <option key={n} value={String(n)}>{n} M</option>)}
                                  <option value="Lainnya">Lainnya...</option>
                                </select>
                                {matNamaPilihan === "Lainnya" && (
                                  <input type="text" placeholder="Contoh: 300 M" value={matNama} onChange={e => setMatNama(e.target.value)} autoFocus
                                    className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium mt-2" style={{ borderColor: matFormErrors.nama ? "var(--red)" : "var(--border)" }} />
                                )}
                                {matFormErrors.nama && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{matFormErrors.nama}</p>}
                              </div>
                            )}

                            {matKategori === "ONT" && (
                              <>
                                <div>
                                  <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jenis / Merek ONT</label>
                                  <select value={matNamaPilihan} onChange={e => handleMatNamaPilihanChange(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: matFormErrors.nama ? "var(--red)" : "var(--border)" }}>
                                    {ONT_MEREK_PRESETS.map(m => <option key={m} value={m}>{m}</option>)}
                                    <option value="Lainnya">Lainnya...</option>
                                  </select>
                                  {matNamaPilihan === "Lainnya" && (
                                    <input type="text" placeholder="Contoh: Fiberhome" value={matNama} onChange={e => setMatNama(e.target.value)} autoFocus
                                      className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium mt-2" style={{ borderColor: matFormErrors.nama ? "var(--red)" : "var(--border)" }} />
                                  )}
                                  {matFormErrors.nama && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{matFormErrors.nama}</p>}
                                </div>
                                {!matEditId && (
                                  <div>
                                    <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>SN ONT (opsional)</label>
                                    <input type="text" placeholder="Boleh dikosongkan" value={matSnOnt} onChange={e => setMatSnOnt(e.target.value)}
                                      className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: "var(--border)" }} />
                                    <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>SN ini nanti muncul sebagai pilihan di form Pemakaian Teknisi.</p>
                                  </div>
                                )}
                              </>
                            )}

                            {matKategori === "Lainnya" && (
                              <div>
                                <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Nama / Jenis</label>
                                <input type="text" placeholder="Nama material" value={matNama} onChange={e => setMatNama(e.target.value)}
                                  className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: matFormErrors.nama ? "var(--red)" : "var(--border)" }} />
                                {matFormErrors.nama && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{matFormErrors.nama}</p>}
                              </div>
                            )}

                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Satuan</label>
                              {matKategori === "Kabel" ? (
                                <select value={matSatuan} onChange={e => setMatSatuan(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                                  <option value="Roll">Roll</option>
                                  <option value="Meter">Meter</option>
                                </select>
                              ) : matKategori === "ONT" ? (
                                <select value="Unit" disabled className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-gray-50 opacity-70" style={{ borderColor: "var(--border)" }}>
                                  <option value="Unit">Unit</option>
                                </select>
                              ) : (
                                <input type="text" placeholder="Roll / Meter / Pcs / Box" value={matSatuan} onChange={e => setMatSatuan(e.target.value)}
                                  className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                              )}
                            </div>

                            <p className="text-[10px] italic" style={{ color: "var(--ink-soft)" }}>Stok diisi lewat tab "Stok Masuk/Kembali", bukan di sini.</p>

                            <div className="pt-1 flex gap-2">
                              <button type="submit" disabled={matSubmitting} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                                {matSubmitting ? "Memproses..." : matEditId ? "Update Material" : "Tambah Material"}
                              </button>
                              {matEditId && <button type="button" onClick={resetFormMaterial} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>}
                            </div>
                          </form>
                        </div>
                      )}
                      <div className={canManageMaterial(session.role) ? "elev-card lg:col-span-2 bg-white rounded-2xl border overflow-hidden" : "elev-card lg:col-span-3 bg-white rounded-2xl border overflow-hidden"} style={{ borderColor: "var(--border)" }}>
                        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Master Data Material</h3>
                            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredMaterial.length} dari {materialList.length} jenis material</p>
                          </div>
                          <div className="relative">
                            <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={searchMaterial} onChange={e => setSearchMaterial(e.target.value)} placeholder="Cari nama / kategori"
                              className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-52" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs min-w-[720px]">
                            <thead>
                              <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Satuan</th>
                                <th className="p-4 text-right">Stok Awal</th>
                                <th className="p-4 text-right">Stok Terkini</th>
                                {canManageMaterial(session.role) && <th className="p-4 text-center w-24">Aksi</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                              {pagedMaterial.length === 0 ? (
                                <tr><td colSpan={canManageMaterial(session.role) ? 6 : 5}><EmptyState title="Belum ada material" subtitle="Tambahkan jenis material pertama lewat formulir di samping." icon={<IconBox className="w-5 h-5" />} /></td></tr>
                              ) : pagedMaterial.map(m => (
                                <tr key={m._id} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{m.kategori}</td>
                                  <td className="p-3.5 font-bold" style={{ color: "var(--ink)" }}>{m.nama}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{m.satuan}</td>
                                  <td className="p-3.5 text-right font-mono" style={{ color: "var(--ink-soft)" }}>{m.stock_awal}</td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: m.stock <= 0 ? "var(--red)" : "var(--ink)" }}>{m.stock}</td>
                                  {canManageMaterial(session.role) && (
                                    <td className="p-3.5">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button onClick={() => pemicuEditMaterial(m)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit"><IconEdit className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setMatDeleteTarget(m)} className="p-1.5 rounded-lg border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }} title="Hapus"><IconTrash className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Pagination page={pageMaterial} setPage={setPageMaterial} totalPages={totalPagesMaterial} totalItems={filteredMaterial.length} pageSize={PAGE_SIZE_MAT} />
                      </div>
                    </div>
                  )}

                  {/* ---------------- PEMAKAIAN TEKNISI ---------------- */}
                  {materialSubTab === "Pemakaian" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {canManageMaterial(session.role) && (
                        <div className="bg-white p-5 rounded-2xl border h-fit lg:sticky lg:top-6" style={{ borderColor: "var(--border)" }}>
                          <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>{pmkEditId ? "Edit Log Pemakaian" : "Tambah Log Pemakaian"}</h2>
                          <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>{pmkEditId ? "Edit 1 baris log terpilih" : "Bisa input beberapa unit ONT & beberapa jenis kabel sekaligus"}</p>
                          <form onSubmit={handleSubmitPemakaian} className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tanggal Pengambilan</label>
                              <input type="date" value={pmkTanggal} onChange={e => setPmkTanggal(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Nama Team / Teknisi</label>
                              <input type="text" placeholder="Nama team" value={pmkNamaTeam} onChange={e => setPmkNamaTeam(e.target.value)}
                                className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: pmkFormErrors.nama_team ? "var(--red)" : "var(--border)" }} />
                              {pmkFormErrors.nama_team && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{pmkFormErrors.nama_team}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Project</label>
                                <select value={pmkProject} onChange={e => setPmkProject(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: pmkFormErrors.project ? "var(--red)" : "var(--border)" }}>
                                  <option value="">— Pilih —</option>
                                  {PROJECT_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                {pmkFormErrors.project && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{pmkFormErrors.project}</p>}
                              </div>
                              <div>
                                <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Region</label>
                                <select value={pmkRegion} onChange={e => setPmkRegion(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: pmkFormErrors.region ? "var(--red)" : "var(--border)" }}>
                                  <option value="">— Pilih —</option>
                                  {REGION_PRESETS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                {pmkFormErrors.region && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{pmkFormErrors.region}</p>}
                              </div>
                              <div>
                                <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Vendor</label>
                                <select value={pmkVendor} onChange={e => setPmkVendor(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: pmkFormErrors.vendor ? "var(--red)" : "var(--border)" }}>
                                  <option value="">— Pilih —</option>
                                  {VENDOR_PRESETS.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                {pmkFormErrors.vendor && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{pmkFormErrors.vendor}</p>}
                              </div>
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Merek Modem</label>
                              <select value={pmkMerekPilihan} onChange={e => handlePmkMerekChange(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                                {ONT_MEREK_PRESETS.map(m => <option key={m} value={m}>{m}</option>)}
                                <option value="Lainnya">Lainnya...</option>
                              </select>
                              {pmkMerekPilihan === "Lainnya" && (
                                <input type="text" placeholder="Merek modem lain" value={pmkMerekModem} onChange={e => setPmkMerekModem(e.target.value)}
                                  className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium mt-2" style={{ borderColor: "var(--border)" }} />
                              )}
                            </div>

                            {pmkEditId ? (
                              <>
                                <div>
                                  <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>SN ONT</label>
                                  <input type="text" list="sn-ont-datalist" placeholder="Serial number (opsional)" value={pmkSnOnt} onChange={e => setPmkSnOnt(e.target.value)}
                                    className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: "var(--border)" }} />
                                </div>
                                <div>
                                  <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jenis Kabel</label>
                                  <select value={pmkKabelId} onChange={e => setPmkKabelId(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: pmkFormErrors.kabel_id ? "var(--red)" : "var(--border)" }}>
                                    <option value="">— Pilih jenis kabel —</option>
                                    {kabelMaterialOptions.map(m => <option key={m._id} value={m._id}>{m.nama} (stok: {m.stock})</option>)}
                                  </select>
                                  {pmkFormErrors.kabel_id && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{pmkFormErrors.kabel_id}</p>}
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jumlah ONT</label>
                                  <input type="number" min="0" max="50" value={pmkJumlahOnt} onChange={e => handlePmkJumlahOntChange(e.target.value)}
                                    className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                                </div>
                                {pmkSnOntList.length > 0 && (
                                  <div className="space-y-2">
                                    <label className="block font-bold uppercase text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>SN ONT ({pmkSnOntList.length} unit, opsional)</label>
                                    {pmkSnOntList.map((sn, idx) => (
                                      <input key={idx} type="text" list="sn-ont-datalist" placeholder={`SN ONT unit #${idx + 1}`} value={sn} onChange={e => updatePmkSnOntAt(idx, e.target.value)}
                                        className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: "var(--border)" }} />
                                    ))}
                                  </div>
                                )}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="block font-bold uppercase text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Kabel Digunakan</label>
                                    <button type="button" onClick={addPmkKabelRow} className="text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }}>
                                      <IconPlus className="w-3 h-3" /> Tambah Kabel
                                    </button>
                                  </div>
                                  {pmkKabelRows.map((row, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                      <select value={row.kabel_id} onChange={e => updatePmkKabelRow(idx, "kabel_id", e.target.value)} className="flex-1 p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                                        <option value="">— Pilih jenis kabel —</option>
                                        {kabelMaterialOptions.map(m => <option key={m._id} value={m._id}>{m.nama} (stok: {m.stock})</option>)}
                                      </select>
                                      <input type="number" min="1" value={row.jumlah} onChange={e => updatePmkKabelRow(idx, "jumlah", e.target.value)}
                                        className="w-16 p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                                      {pmkKabelRows.length > 1 && (
                                        <button type="button" onClick={() => removePmkKabelRow(idx)} className="p-2.5 rounded-xl border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }}>
                                          <IconX className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  {pmkFormErrors.kabel && <p className="text-[10px] font-semibold" style={{ color: "var(--red)" }}>{pmkFormErrors.kabel}</p>}
                                </div>
                              </>
                            )}

                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Status</label>
                              <select value={pmkStatus} onChange={e => setPmkStatus(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                                <option value="Idle">Idle (belum kurangi stok)</option>
                                <option value="Terpakai">Terpakai (kurangi stok)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Catatan Return</label>
                              <input type="text" placeholder="Contoh: 100 M DI IKR" value={pmkReturnCatatan} onChange={e => setPmkReturnCatatan(e.target.value)}
                                className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <div className="pt-1 flex gap-2">
                              <button type="submit" disabled={pmkSubmitting} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                                {pmkSubmitting ? "Memproses..." : pmkEditId ? "Update Log" : "Simpan Log"}
                              </button>
                              {pmkEditId && <button type="button" onClick={resetFormPemakaian} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>}
                            </div>
                          </form>
                        </div>
                      )}
                      <div className={canManageMaterial(session.role) ? "elev-card lg:col-span-2 bg-white rounded-2xl border overflow-hidden" : "elev-card lg:col-span-3 bg-white rounded-2xl border overflow-hidden"} style={{ borderColor: "var(--border)" }}>
                        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: "var(--border)" }}>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Log Pemakaian per Teknisi</h3>
                            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredPemakaian.length} dari {pemakaianList.length} baris</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className="relative">
                              <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input value={searchPemakaian} onChange={e => setSearchPemakaian(e.target.value)} placeholder="Cari team / SN / modem"
                                className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-44" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <select value={pemakaianStatusFilter} onChange={e => setPemakaianStatusFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                              <option value="semua">Semua Status</option>
                              <option value="Terpakai">Terpakai</option>
                              <option value="Idle">Idle</option>
                            </select>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs min-w-[1080px]">
                            <thead>
                              <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Team</th>
                                <th className="p-4">Project</th>
                                <th className="p-4">Region</th>
                                <th className="p-4">Vendor</th>
                                <th className="p-4">Modem / SN</th>
                                <th className="p-4">Kabel</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4">Return</th>
                                {canManageMaterial(session.role) && <th className="p-4 text-center w-24">Aksi</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                              {pagedPemakaian.length === 0 ? (
                                <tr><td colSpan={canManageMaterial(session.role) ? 10 : 9}><EmptyState title="Belum ada log pemakaian" subtitle="Tambahkan baris pertama lewat formulir di samping." icon={<IconCable className="w-5 h-5" />} /></td></tr>
                              ) : pagedPemakaian.map(l => (
                                <tr key={l._id} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{new Date(l.tanggal_pengambilan).toLocaleDateString("id-ID")}</td>
                                  <td className="p-3.5 font-bold" style={{ color: "var(--ink)" }}>{l.nama_team}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{l.project || "—"}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{l.region || "—"}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{l.vendor || "—"}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>
                                    <p>{l.merek_modem || "—"}</p>
                                    <p className="font-mono text-[10px]">{l.sn_ont || "—"}</p>
                                  </td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{l.kabel_nama}</td>
                                  <td className="p-3.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
                                      style={{ background: l.status === "Terpakai" ? "var(--green-soft)" : "var(--amber-soft)", color: l.status === "Terpakai" ? "var(--green)" : "var(--amber)" }}>{l.status}</span>
                                  </td>
                                  <td className="p-3.5 truncate max-w-[140px]" style={{ color: "var(--ink-soft)" }}>{l.return_catatan || "—"}</td>
                                  {canManageMaterial(session.role) && (
                                    <td className="p-3.5">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button onClick={() => pemicuEditPemakaian(l)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit"><IconEdit className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setPmkDeleteTarget(l)} className="p-1.5 rounded-lg border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }} title="Hapus"><IconTrash className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Pagination page={pagePemakaian} setPage={setPagePemakaian} totalPages={totalPagesPemakaian} totalItems={filteredPemakaian.length} pageSize={PAGE_SIZE_PMK} />
                      </div>
                    </div>
                  )}

                  {/* ---------------- STOK MASUK / DIKEMBALIKAN ---------------- */}
                  {materialSubTab === "Stok" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {canManageMaterial(session.role) && (
                        <div className="bg-white p-5 rounded-2xl border h-fit lg:sticky lg:top-6" style={{ borderColor: "var(--border)" }}>
                          <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>Catat Mutasi Stok</h2>
                          <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>Restock baru masuk, atau sisa kabel resmi dikembalikan teknisi</p>
                          <form onSubmit={handleSubmitStok} className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Material</label>
                              <select value={stkMaterialId} onChange={e => setStkMaterialId(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: stkFormErrors.material_id ? "var(--red)" : "var(--border)" }}>
                                <option value="">— Pilih material —</option>
                                {materialList.map(m => <option key={m._id} value={m._id}>{m.kategori} · {m.nama} (stok: {m.stock})</option>)}
                              </select>
                              {stkFormErrors.material_id && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{stkFormErrors.material_id}</p>}
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tipe</label>
                              <select value={stkTipe} onChange={e => setStkTipe(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                                <option value="Penambahan">Penambahan (restock masuk)</option>
                                <option value="Pengembalian">Pengembalian (dari teknisi)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Jumlah</label>
                              <input type="number" min="1" placeholder="0" value={stkJumlah} onChange={e => setStkJumlah(e.target.value)}
                                className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: stkFormErrors.jumlah ? "var(--red)" : "var(--border)" }} />
                              {stkFormErrors.jumlah && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{stkFormErrors.jumlah}</p>}
                            </div>
                            {jumlahSnOntDibutuhkan > 0 && (
                              <div className="space-y-2">
                                <label className="block font-bold uppercase text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>SN ONT ({jumlahSnOntDibutuhkan} unit, opsional)</label>
                                {stkSnOntList.map((sn, idx) => (
                                  <input key={idx} type="text" list="sn-ont-datalist" placeholder={`SN ONT unit #${idx + 1}`} value={sn} onChange={e => updateStkSnOntAt(idx, e.target.value)}
                                    className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: "var(--border)" }} />
                                ))}
                              </div>
                            )}
                            {stkTipe === "Pengembalian" && (
                              <>
                                <div>
                                  <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>ID Teknisi Asal</label>
                                  <input type="text" placeholder="Contoh: K001" value={stkTeknisiId} onChange={e => setStkTeknisiId(e.target.value)}
                                    className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: stkFormErrors.teknisi ? "var(--red)" : "var(--border)" }} />
                                </div>
                                <div>
                                  <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Nama Teknisi Asal</label>
                                  <input type="text" placeholder="Nama teknisi" value={stkTeknisiNama} onChange={e => setStkTeknisiNama(e.target.value)}
                                    className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: stkFormErrors.teknisi ? "var(--red)" : "var(--border)" }} />
                                  {stkFormErrors.teknisi && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{stkFormErrors.teknisi}</p>}
                                </div>
                              </>
                            )}
                            <div>
                              <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Keterangan</label>
                              <textarea rows="2" placeholder="Catatan opsional" value={stkKeterangan} onChange={e => setStkKeterangan(e.target.value)}
                                className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium resize-none" style={{ borderColor: "var(--border)" }}></textarea>
                            </div>
                            <div className="pt-1">
                              <button type="submit" disabled={stkSubmitting} className="w-full text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                                {stkSubmitting ? "Memproses..." : "Catat Mutasi Stok"}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                      <div className={canManageMaterial(session.role) ? "elev-card lg:col-span-2 bg-white rounded-2xl border overflow-hidden" : "elev-card lg:col-span-3 bg-white rounded-2xl border overflow-hidden"} style={{ borderColor: "var(--border)" }}>
                        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                          <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Riwayat Mutasi Stok</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{stokLogList.length} catatan penambahan / pengembalian</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                            <thead>
                              <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Material</th>
                                <th className="p-4 text-center">Tipe</th>
                                <th className="p-4 text-right">Jumlah</th>
                                <th className="p-4">Teknisi</th>
                                <th className="p-4">Keterangan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                              {pagedStok.length === 0 ? (
                                <tr><td colSpan="6"><EmptyState title="Belum ada mutasi stok" subtitle="Catat penambahan atau pengembalian lewat formulir di samping." icon={<IconBox className="w-5 h-5" />} /></td></tr>
                              ) : pagedStok.map(l => (
                                <tr key={l._id} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{new Date(l.tanggal).toLocaleDateString("id-ID")}</td>
                                  <td className="p-3.5 font-bold" style={{ color: "var(--ink)" }}>{l.material_nama}</td>
                                  <td className="p-3.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
                                      style={{ background: l.tipe === "Penambahan" ? "var(--green-soft)" : "var(--brand-soft)", color: l.tipe === "Penambahan" ? "var(--green)" : "var(--brand-dark)" }}>{l.tipe}</span>
                                  </td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: "var(--ink)" }}>+{l.jumlah}</td>
                                  <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{l.teknisi_nama || "—"}</td>
                                  <td className="p-3.5 truncate max-w-[160px]" style={{ color: "var(--ink-soft)" }}>{l.keterangan || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Pagination page={pageStok} setPage={setPageStok} totalPages={totalPagesStok} totalItems={stokLogList.length} pageSize={PAGE_SIZE_STK} />
                      </div>
                    </div>
                  )}

                  {/* ---------------- LAPORAN ---------------- */}
                  {materialSubTab === "Laporan" && (
                    <div className="space-y-5">
                      <div className="bg-white p-4 rounded-2xl border flex flex-wrap items-end gap-3" style={{ borderColor: "var(--border)" }}>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Dari Tanggal</label>
                          <input type="date" value={reportDari} onChange={e => setReportDari(e.target.value)} className="p-2.5 border rounded-xl outline-none text-xs font-medium" style={{ borderColor: "var(--border)" }} />
                        </div>
                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Sampai Tanggal</label>
                          <input type="date" value={reportSampai} onChange={e => setReportSampai(e.target.value)} className="p-2.5 border rounded-xl outline-none text-xs font-medium" style={{ borderColor: "var(--border)" }} />
                        </div>
                        <button onClick={muatReportMaterial} disabled={reportLoading} className="px-4 py-2.5 rounded-xl text-white font-bold text-xs disabled:opacity-60" style={{ background: "var(--brand)" }}>
                          {reportLoading ? "Memuat..." : "Tampilkan Laporan"}
                        </button>
                        <button onClick={() => downloadCsv("laporan-material.csv", toCsv(materialReport.perMaterial, [
                          { label: "Kategori", get: r => r.kategori }, { label: "Nama", get: r => r.nama }, { label: "Satuan", get: r => r.satuan },
                          { label: "Stok Awal", get: r => r.stock_awal }, { label: "Total Terpakai", get: r => r.total_terpakai },
                          { label: "Total Idle", get: r => r.total_idle_belum_terpakai }, { label: "Total Ditambah", get: r => r.total_ditambah },
                          { label: "Total Dikembalikan", get: r => r.total_dikembalikan }, { label: "Stok Terkini", get: r => r.stock_terkini },
                        ]))} className="p-2.5 border rounded-xl hover:bg-gray-50" style={{ borderColor: "var(--border)" }} title="Ekspor CSV"><IconDownload className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} /></button>
                        <button onClick={eksporExcelMaterial} className="text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm flex items-center gap-1.5" style={{ background: "var(--green)" }}>
                          <IconFileExcel className="w-3.5 h-3.5" /> Ekspor ke Excel (Pivot)
                        </button>
                      </div>

                      <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                          <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Rekap per Material</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>Stok awal, dipakai, ditambah, dikembalikan, dan stok terkini</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs min-w-[860px]">
                            <thead>
                              <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                                <th className="p-4">Material</th>
                                <th className="p-4 text-right">Stok Awal</th>
                                <th className="p-4 text-right">Terpakai</th>
                                <th className="p-4 text-right">Idle</th>
                                <th className="p-4 text-right">Ditambah</th>
                                <th className="p-4 text-right">Dikembalikan</th>
                                <th className="p-4 text-right">Stok Terkini</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                              {materialReport.perMaterial.length === 0 ? (
                                <tr><td colSpan="7"><EmptyState title="Belum ada data laporan" subtitle="Klik Tampilkan Laporan untuk memuat rekap." icon={<IconReport className="w-5 h-5" />} /></td></tr>
                              ) : materialReport.perMaterial.map(r => (
                                <tr key={r.material_id} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5">
                                    <p className="font-bold" style={{ color: "var(--ink)" }}>{r.nama}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{r.kategori} · {r.satuan}</p>
                                  </td>
                                  <td className="p-3.5 text-right font-mono" style={{ color: "var(--ink-soft)" }}>{r.stock_awal}</td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: "var(--red)" }}>-{r.total_terpakai}</td>
                                  <td className="p-3.5 text-right font-mono" style={{ color: "var(--amber)" }}>{r.total_idle_belum_terpakai}</td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: "var(--green)" }}>+{r.total_ditambah}</td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: "var(--green)" }}>+{r.total_dikembalikan}</td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: "var(--ink)" }}>{r.stock_terkini}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="elev-card bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                          <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Rekap per Teknisi/Team</h3>
                          <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>Total unit ONT + kabel berstatus "Terpakai"</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs min-w-[420px]">
                            <thead>
                              <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                                <th className="p-4">Team / Teknisi</th>
                                <th className="p-4 text-right">Total Unit Terpakai</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                              {materialReport.perTeam.length === 0 ? (
                                <tr><td colSpan="2"><EmptyState title="Belum ada data" subtitle="Rekap per team akan tampil setelah laporan dimuat." icon={<IconUsers className="w-5 h-5" />} /></td></tr>
                              ) : materialReport.perTeam.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50/60 transition">
                                  <td className="p-3.5 font-bold" style={{ color: "var(--ink)" }}>{t.nama_team}</td>
                                  <td className="p-3.5 text-right font-mono font-bold" style={{ color: "var(--ink)" }}>{t.total_unit_terpakai}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentMenu === "invoice" && canAccess(session.role, "invoice") && (
                <div className="space-y-6 no-print">
                  <div>
                    <h1 className="text-2xl font-bold font-display" style={{ color: "var(--ink)" }}>Invoice / Penagihan</h1>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Buat, kelola, dan cetak invoice penagihan untuk pelanggan</p>
                  </div>

                  {(() => {
                    const jumlahMenunggu = canAccess(session.role, "tracking")
                      ? trackingList.filter(t => t.status === "BAST Final").length
                      : trackingNotifFinance.jumlah;
                    if (!jumlahMenunggu) return null;
                    return (
                      <div className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between" style={{ background: "var(--amber-soft)", borderColor: "var(--amber-soft)" }}>
                        <div className="flex items-center gap-2.5">
                          <IconAlert className="w-4 h-4 flex-shrink-0" style={{ color: "var(--amber)" }} />
                          <p className="text-xs font-bold" style={{ color: "var(--amber)" }}>
                            {jumlahMenunggu} dokumen BAST Final dari Tracking BAST menunggu dibuatkan Invoice
                          </p>
                        </div>
                        {canAccess(session.role, "tracking") && (
                          <button onClick={() => setCurrentMenu("tracking")} className="text-[11px] font-bold underline text-left sm:text-right" style={{ color: "var(--amber)" }}>
                            Lihat di Tracking BAST →
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* ===== FORM INVOICE ===== */}
                    <div className="xl:col-span-2 bg-white p-5 rounded-2xl border h-fit xl:sticky xl:top-6" style={{ borderColor: "var(--border)" }}>
                      <h2 className="text-base font-bold font-display" style={{ color: "var(--ink)" }}>{invEditId ? "Edit Invoice" : "Buat Invoice Baru"}</h2>
                      <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--ink-soft)" }}>{invEditId ? "Perbarui data invoice terpilih" : "Isi data penagihan untuk pelanggan"}</p>

                      <form onSubmit={handleSubmitInvoice} className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Invoice No</label>
                            <input type="text" value={invNomor} onChange={e => setInvNomor(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: invErrors.nomor ? "var(--red)" : "var(--border)" }} />
                            {invErrors.nomor && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{invErrors.nomor}</p>}
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Tanggal</label>
                            <input type="date" value={invTanggal} onChange={e => setInvTanggal(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: invErrors.tanggal ? "var(--red)" : "var(--border)" }} />
                            {invErrors.tanggal && <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--red)" }}>{invErrors.tanggal}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>P.O. Number</label>
                            <input type="text" value={invPoNumber} onChange={e => setInvPoNumber(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <div>
                            <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Payment Due Date</label>
                            <input type="date" value={invJatuhTempo} onChange={e => setInvJatuhTempo(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>

                        <div className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                          <p className="font-bold uppercase text-[10px] tracking-wide mt-3 mb-1" style={{ color: "var(--brand-dark)" }}>Bill To (Penerima Tagihan)</p>
                          <input type="text" placeholder="Nama perusahaan / pelanggan" value={invBillNama} onChange={e => setInvBillNama(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium mb-2" style={{ borderColor: invErrors.billNama ? "var(--red)" : "var(--border)" }} />
                          {invErrors.billNama && <p className="text-[10px] font-semibold mb-2 -mt-1" style={{ color: "var(--red)" }}>{invErrors.billNama}</p>}
                          <textarea placeholder="Alamat lengkap penagihan..." rows="2" value={invBillAlamat} onChange={e => setInvBillAlamat(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium resize-none" style={{ borderColor: "var(--border)" }}></textarea>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={invShipSama} onChange={e => setInvShipSama(e.target.checked)} className="w-3.5 h-3.5" />
                            <span className="font-bold uppercase text-[10px] tracking-wide" style={{ color: "var(--brand-dark)" }}>Ship To sama dengan Bill To</span>
                          </label>
                          {!invShipSama && (
                            <div className="mt-2 space-y-2">
                              <input type="text" placeholder="Nama penerima barang/jasa" value={invShipNama} onChange={e => setInvShipNama(e.target.value)}
                                className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                              <textarea placeholder="Alamat pengiriman..." rows="2" value={invShipAlamat} onChange={e => setInvShipAlamat(e.target.value)}
                                className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium resize-none" style={{ borderColor: "var(--border)" }}></textarea>
                            </div>
                          )}
                        </div>

                        <div className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                          <div className="flex items-center justify-between mt-3 mb-1.5">
                            <p className="font-bold uppercase text-[10px] tracking-wide" style={{ color: "var(--brand-dark)" }}>Item Penagihan</p>
                            <button type="button" onClick={tambahItemInvoice} className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}>
                              <IconPlus className="w-3 h-3" /> Tambah Item
                            </button>
                          </div>
                          {invErrors.items && <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--red)" }}>{invErrors.items}</p>}
                          <div className="space-y-2.5">
                            {invItems.map((it, i) => (
                              <div key={it.id} className="p-2.5 rounded-xl border space-y-1.5" style={{ borderColor: "var(--border)", background: "var(--canvas)" }}>
                                <div className="flex items-start gap-1.5">
                                  <textarea placeholder={`Deskripsi item ${i + 1}...`} rows="2" value={it.deskripsi} onChange={e => updateItemInvoice(it.id, "deskripsi", e.target.value)}
                                    className="flex-1 p-2 border rounded-lg outline-none text-xs font-medium resize-none bg-white" style={{ borderColor: "var(--border)" }}></textarea>
                                  {invItems.length > 1 && (
                                    <button type="button" onClick={() => hapusItemInvoice(it.id)} className="p-1.5 rounded-lg border hover:bg-red-50 shrink-0" style={{ borderColor: "var(--border)", color: "var(--red)" }}>
                                      <IconTrash className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <input type="number" min="0" step="1" placeholder="Qty" value={it.qty} onChange={e => updateItemInvoice(it.id, "qty", e.target.value)}
                                    className="p-2 border rounded-lg outline-none text-xs font-medium bg-white" style={{ borderColor: "var(--border)" }} />
                                  <input type="number" min="0" step="1000" placeholder="Unit Price" value={it.hargaSatuan} onChange={e => updateItemInvoice(it.id, "hargaSatuan", e.target.value)}
                                    className="p-2 border rounded-lg outline-none text-xs font-medium bg-white" style={{ borderColor: "var(--border)" }} />
                                </div>
                                <p className="text-[10px] text-right font-mono font-bold" style={{ color: "var(--ink-soft)" }}>
                                  = {fmtRupiah(Number(it.hargaSatuan) || 0)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                          <p className="font-bold uppercase text-[10px] tracking-wide mt-3 mb-1.5" style={{ color: "var(--brand-dark)" }}>Penyesuaian</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] mb-1" style={{ color: "var(--ink-soft)" }}>Pinalty</label>
                              <input type="number" min="0" step="1000" value={invPinalty} onChange={e => setInvPinalty(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none text-xs font-medium" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <div>
                              <label className="block text-[10px] mb-1" style={{ color: "var(--ink-soft)" }}>Less: Deposit</label>
                              <input type="number" min="0" step="1000" value={invLessDeposit} onChange={e => setInvLessDeposit(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none text-xs font-medium" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <div>
                              <label className="block text-[10px] mb-1" style={{ color: "var(--ink-soft)" }}>Denda Setelah PPN</label>
                              <input type="number" min="0" step="1000" value={invDendaSetelahPpn} onChange={e => setInvDendaSetelahPpn(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none text-xs font-medium" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <div>
                              <label className="block text-[10px] mb-1" style={{ color: "var(--ink-soft)" }}>Pungutan PPN</label>
                              <input type="number" min="0" step="1000" value={invPungutanPpn} onChange={e => setInvPungutanPpn(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none text-xs font-medium" style={{ borderColor: "var(--border)" }} />
                            </div>
                          </div>
                        </div>

                        {/* Ringkasan otomatis */}
                        <div className="p-3 rounded-xl space-y-1 text-[11px]" style={{ background: "var(--brand-soft)" }}>
                          <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Harga Jual</span><b style={{ color: "var(--ink)" }}>{fmtRupiah(invTotals.hargaJual)}</b></div>
                          <div className="flex justify-between pt-1 border-t" style={{ borderColor: "rgba(11,81,72,.15)" }}><span className="font-bold" style={{ color: "var(--brand-dark)" }}>Balance Due</span><b style={{ color: "var(--brand-dark)" }}>{fmtRupiah(invTotals.balanceDue)}</b></div>
                        </div>

                        <div>
                          <label className="block font-bold uppercase mb-1 text-[10px] tracking-wide" style={{ color: "var(--ink-soft)" }}>Status Pembayaran</label>
                          <select value={invStatus} onChange={e => setInvStatus(e.target.value)} className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="Belum Dibayar">Belum Dibayar</option>
                            <option value="Lunas">Lunas</option>
                          </select>
                        </div>

                        <div className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                          <p className="font-bold uppercase text-[10px] tracking-wide mt-3 mb-1.5" style={{ color: "var(--brand-dark)" }}>Rekening Transfer (tampil di cetak invoice)</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            <input type="text" placeholder="Nama Bank & Cabang" value={invRekBank} onChange={e => setInvRekBank(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                            <input type="text" placeholder="No. Rekening" value={invRekNomor} onChange={e => setInvRekNomor(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium font-mono" style={{ borderColor: "var(--border)" }} />
                          </div>
                          <input type="text" placeholder="Kota" value={invRekKota} onChange={e => setInvRekKota(e.target.value)}
                            className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium mt-2.5" style={{ borderColor: "var(--border)" }} />
                        </div>

                        <div className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                          <p className="font-bold uppercase text-[10px] tracking-wide mt-3 mb-1.5" style={{ color: "var(--brand-dark)" }}>Penandatangan Invoice</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            <input type="text" placeholder="Nama penandatangan" value={invTtdNama} onChange={e => setInvTtdNama(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                            <input type="text" placeholder="Jabatan (ex: Direktur)" value={invTtdJabatan} onChange={e => setInvTtdJabatan(e.target.value)}
                              className="w-full p-2.5 border rounded-xl outline-none text-sm font-medium" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>

                        <div className="pt-1 flex gap-2">
                          <button type="submit" disabled={invSubmitting} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60" style={{ background: "var(--brand)" }}>
                            {invSubmitting ? "Memproses..." : invEditId ? "Update Invoice" : "Simpan Invoice"}
                          </button>
                          {invEditId && (
                            <button type="button" onClick={resetFormInvoice} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* ===== DAFTAR INVOICE ===== */}
                    <div className="xl:col-span-3 bg-white rounded-2xl border overflow-hidden h-fit" style={{ borderColor: "var(--border)" }}>
                      <div className="p-4 border-b flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>Daftar Invoice</h3>
                            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{filteredInvoice.length} dari {invoiceList.length} invoice</p>
                          </div>
                          <div className="relative">
                            <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={invSearch} onChange={e => setInvSearch(e.target.value)} placeholder="Cari No. Invoice / pelanggan / PO"
                              className="pl-8 pr-3 py-2 border rounded-xl text-xs font-medium outline-none w-full sm:w-56" style={{ borderColor: "var(--border)" }} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:items-center sm:justify-between">
                          <select value={invStatusFilter} onChange={e => setInvStatusFilter(e.target.value)} className="border rounded-xl text-xs font-medium px-3 py-2 outline-none bg-white" style={{ borderColor: "var(--border)" }}>
                            <option value="semua">Semua Status</option>
                            <option value="Belum Dibayar">Belum Dibayar</option>
                            <option value="Lunas">Lunas</option>
                          </select>
                          <button onClick={eksporExcelInvoice} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-sm" style={{ background: "var(--green)" }}>
                            <IconFileExcel className="w-3.5 h-3.5" /> Ekspor ke Excel
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                          <thead>
                            <tr className="border-b font-bold uppercase tracking-wider" style={{ background: "var(--canvas)", borderColor: "var(--border)", color: "var(--ink-soft)" }}>
                              <th className="p-4">Invoice No</th>
                              <th className="p-4">Pelanggan</th>
                              <th className="p-4">Tanggal</th>
                              <th className="p-4 text-right">Balance Due</th>
                              <th className="p-4 text-center">Status</th>
                              <th className="p-4 text-center w-28">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                            {pagedInvoice.length === 0 ? (
                              <tr><td colSpan="6"><EmptyState title={invSearch || invStatusFilter !== "semua" ? "Tidak ditemukan" : "Belum ada invoice"} subtitle={invSearch || invStatusFilter !== "semua" ? "Coba ubah filter pencarian." : "Buat invoice pertama lewat formulir di samping."} icon={<IconInvoice className="w-5 h-5" />} /></td></tr>
                            ) : (
                              pagedInvoice.map(inv => {
                                const t = hitungTotalInvoice(inv.items, inv.pinalty, inv.less_deposit, inv.denda_setelah_ppn, inv.pungutan_ppn);
                                return (
                                  <tr key={inv._id} className="hover:bg-gray-50/60 transition">
                                    <td className="p-3.5 font-mono font-bold" style={{ color: "var(--ink)" }}>{inv.nomor}</td>
                                    <td className="p-3.5">
                                      <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{inv.bill_nama}</p>
                                      {inv.po_number && <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>PO: {inv.po_number}</p>}
                                    </td>
                                    <td className="p-3.5" style={{ color: "var(--ink-soft)" }}>{new Date(inv.tanggal).toLocaleDateString("id-ID")}</td>
                                    <td className="p-3.5 text-right font-bold font-mono" style={{ color: "var(--ink)" }}>{fmtRupiah(t.balanceDue)}</td>
                                    <td className="p-3.5 text-center">
                                      <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
                                        style={{ background: inv.status === "Lunas" ? "var(--green-soft)" : "var(--amber-soft)", color: inv.status === "Lunas" ? "var(--green)" : "var(--amber)" }}>{inv.status || "Belum Dibayar"}</span>
                                    </td>
                                    <td className="p-3.5">
                                      <div className="flex items-center justify-center gap-1.5">
                                        {inv.status === "Lunas" && (
                                          inv.dicatat_keuangan ? (
                                            <span className="p-1.5 rounded-lg border flex items-center" style={{ borderColor: "var(--border)", color: "var(--green)" }} title="Sudah tercatat di Keuangan">
                                              <IconCheck className="w-3.5 h-3.5" />
                                            </span>
                                          ) : (
                                            <button onClick={() => catatInvoiceKeKeuangan(inv)} disabled={invCatatSubmitting === inv._id}
                                              className="p-1.5 rounded-lg border hover:bg-green-50 disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--green)" }}
                                              title="Tambahkan pembayaran ke Keuangan">
                                              <IconPlus className="w-3.5 h-3.5" />
                                            </button>
                                          )
                                        )}
                                        <button onClick={() => handleCetakInvoice(inv)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Cetak Invoice"><IconPrinter className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => pemicuEditInvoice(inv)} className="p-1.5 rounded-lg border hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "var(--brand-dark)" }} title="Edit"><IconEdit className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setInvDeleteTarget(inv)} className="p-1.5 rounded-lg border hover:bg-red-50" style={{ borderColor: "var(--border)", color: "var(--red)" }} title="Hapus"><IconTrash className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination page={pageInv} setPage={setPageInv} totalPages={totalPagesInv} totalItems={filteredInvoice.length}
                        pageSize={pageSizeInv} pageSizeOptions={[10, 20, 50, 100]}
                        onPageSizeChange={(n) => { setPageSizeInv(n); setPageInv(1); }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Key localStorage buat nyimpen sesi login — dibaca lagi tiap kali halaman di-refresh/dibuka
// ulang, supaya admin/gudang/owner dll tidak ke-logout otomatis hanya karena refresh browser.
const SESSION_STORAGE_KEY = "setnet_admin_session";

function App() {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const handleLoginSuccess = (karyawan) => {
    try { localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(karyawan)); } catch {}
    setSession(karyawan);
  };
  const handleLogout = () => {
    try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch {}
    setSession(null);
  };

  if (!session) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  return <DashboardAdmin session={session} onLogout={handleLogout} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);