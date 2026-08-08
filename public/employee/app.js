const BASE_URL = '';
const API_BASE = '/api';

// Pilihan untuk form pengajuan Kasbon
const KASBON_REGION_OPTIONS = ["Jakbar", "Jakut", "Jakpus", "Jaksel", "Jaktim", "Bekasi", "Bogor", "Depok", "Bekasi Timur", "Tangerang", "Tangkot", "Bali"];
const KASBON_VENDOR_OPTIONS = ["Quantum", "Satu Visi", "BBB"];
const KASBON_EWALLET_OPTIONS = ["Dana", "OVO", "GoPay", "ShopeePay"];
const KASBON_BANK_OPTIONS = ["BCA", "BRI", "Mandiri", "Seabank", "Jago", "Dll"];

function formatRupiah(angka) {
    return 'Rp' + Number(angka || 0).toLocaleString('id-ID');
}

function sapaanWaktu() {
    const jam = new Date().getHours();
    if (jam < 11) return 'pagi';
    if (jam < 15) return 'siang';
    if (jam < 18) return 'sore';
    return 'malam';
}

// Batas jam Absen Masuk sebelum dianggap Terlambat (harus sama persis dengan backend: src/routes/absen.js)
const BATAS_JAM_MASUK_WIB = 8;
const BATAS_MENIT_MASUK_WIB = 30;
const BATAS_MENIT_TOTAL_MASUK_WIB = (BATAS_JAM_MASUK_WIB * 60) + BATAS_MENIT_MASUK_WIB; // 08:30 WIB = 510 menit

// Helper: ambil jam:menit versi WIB (Asia/Jakarta) SECARA EKSPLISIT, sama seperti di backend.
// Supaya peringatan telat di HP tetap akurat walaupun timezone HP karyawan bukan WIB.
function getJamMenitWIB(date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
    });
    const parts = formatter.formatToParts(date);
    const jam = Number(parts.find(p => p.type === 'hour').value);
    const menit = Number(parts.find(p => p.type === 'minute').value);
    const detik = Number(parts.find(p => p.type === 'second').value);
    return { jam, menit, detik };
}

// Helper: status "apakah SUDAH lewat jam 08:30 WIB sekarang" + berapa menit sudah lewat.
function getStatusBatasMasukWIB(date = new Date()) {
    const { jam, menit } = getJamMenitWIB(date);
    const totalMenitSekarang = (jam * 60) + menit;
    const sudahLewat = totalMenitSekarang > BATAS_MENIT_TOTAL_MASUK_WIB;
    const selisihMenit = sudahLewat ? (totalMenitSekarang - BATAS_MENIT_TOTAL_MASUK_WIB) : 0;
    const jamText = `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}`;
    return { sudahLewat, selisihMenit, jamText };
}

// Helper: string jam:menit:detik WIB berjalan, dipakai untuk jam digital di halaman Absensi.
function getJamBerjalanWIB(date = new Date()) {
    const { jam, menit, detik } = getJamMenitWIB(date);
    return `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;
}

// ==================== ICON SYSTEM ====================
// Set ikon garis (line-icon) sederhana buatan sendiri, dipakai sebagai pengganti emoji
// sebagai sistem ikon utama UI (navigasi, status, aksi). Emoji hanya dipakai sesekali
// di dalam teks/modal, bukan sebagai ikon utama.
function Ic({ children, className = 'w-5 h-5' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className}>
            {children}
        </svg>
    );
}
const IconHome = (p) => <Ic {...p}><path d="M4 11 12 4l8 7" /><path d="M6 9.5V20h4v-6h4v6h4V9.5" /></Ic>;
const IconCamera = (p) => <Ic {...p}><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M8 7l1.4-2.5h5.2L16 7" /><circle cx="12" cy="13.5" r="3.4" /></Ic>;
const IconForm = (p) => <Ic {...p}><rect x="6" y="3.5" width="12" height="17" rx="2" /><path d="M9 3.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5" /><path d="M9 10h6M9 13.5h6M9 17h3" /></Ic>;
const IconHistory = (p) => <Ic {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2" /><path d="M9 2h6" /></Ic>;
const IconBell = (p) => <Ic {...p}><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" /><path d="M10 19a2 2 0 0 0 4 0" /></Ic>;
const IconChevronLeft = (p) => <Ic {...p}><polyline points="15 6 9 12 15 18" /></Ic>;
const IconChevronRight = (p) => <Ic {...p}><polyline points="9 6 15 12 9 18" /></Ic>;
const IconCheckCircle = (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><polyline points="8 12.5 11 15.5 16 9" /></Ic>;
const IconAlertTriangle = (p) => <Ic {...p}><path d="M12 4.2 21.5 20H2.5Z" /><line x1="12" y1="10" x2="12" y2="14.2" /><circle cx="12" cy="17.1" r="0.9" fill="currentColor" stroke="none" /></Ic>;
const IconMapPin = (p) => <Ic {...p}><path d="M12 21s7-6.7 7-11.5A7 7 0 1 0 5 9.5C5 14.3 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></Ic>;
const IconLogOut = (p) => <Ic {...p}><path d="M9 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3" /><polyline points="15 8 19 12 15 16" /><line x1="19" y1="12" x2="9" y2="12" /></Ic>;
const IconClock = (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3.2 1.8" /></Ic>;
const IconX = (p) => <Ic {...p}><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></Ic>;
const IconWallet = (p) => <Ic {...p}><rect x="3" y="6" width="18" height="13" rx="2.2" /><path d="M3 10.5h18" /><circle cx="16.2" cy="14" r="0.9" fill="currentColor" stroke="none" /></Ic>;
const IconCalendarOff = (p) => <Ic {...p}><rect x="3.5" y="4.5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17" /><path d="M8 3v3M16 3v3" /></Ic>;

function StatusBadge({ status }) {
    const map = {
        Pending: 'bg-amber-100 text-amber-700',
        Disetujui: 'bg-green-100 text-green-700',
        Ditolak: 'bg-red-100 text-red-700'
    };
    return <span class={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

// Header kecil dipakai di semua sub-halaman (tombol kembali ke menu utama)
function SubHeader({ title, subtitle, onBack }) {
    return (
        <div class="flex items-center gap-3 mb-4">
            <button onClick={onBack} type="button" aria-label="Kembali" class="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 active:scale-95 active:bg-gray-50 transition">
                <IconChevronLeft className="w-5 h-5" />
            </button>
            <div class="min-w-0">
                <h2 class="text-base font-black text-gray-900 leading-tight">{title}</h2>
                {subtitle && <p class="text-[11px] font-semibold text-gray-400 truncate">{subtitle}</p>}
            </div>
        </div>
    );
}

// ==================== NAVIGASI BAWAH (MOBILE BOTTOM NAV) ====================
const NAV_ITEMS = [
    { key: 'Menu', label: 'Home', Icon: IconHome },
    { key: 'Absensi', label: 'Absensi', Icon: IconCamera },
    { key: 'Form', label: 'Form', Icon: IconForm },
    { key: 'Riwayat', label: 'Riwayat', Icon: IconHistory },
    { key: 'Notifikasi', label: 'Notifikasi', Icon: IconBell },
];

function BottomNav({ tabAktif, onNavigate, notifBelumDibaca }) {
    return (
        <nav
            class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-150 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div class="max-w-2xl mx-auto grid grid-cols-5">
                {NAV_ITEMS.map(item => {
                    const aktif = tabAktif === item.key;
                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => onNavigate(item.key)}
                            aria-label={item.label}
                            aria-current={aktif ? 'page' : undefined}
                            class="relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] active:bg-gray-50 transition"
                        >
                            <span class={`relative flex items-center justify-center ${aktif ? 'text-blue-600' : 'text-gray-400'}`}>
                                <item.Icon className="w-5 h-5" />
                                {item.key === 'Notifikasi' && notifBelumDibaca > 0 && (
                                    <span class="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                                        {notifBelumDibaca > 9 ? '9+' : notifBelumDibaca}
                                    </span>
                                )}
                            </span>
                            <span class={`text-[10px] font-bold ${aktif ? 'text-blue-600' : 'text-gray-400'}`}>{item.label}</span>
                            {aktif && <span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-600" />}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

// ==================== HOME / DASHBOARD ====================
function MenuDashboard({ userSession, onNavigate, onLogout }) {
    const [rekap, setRekap] = React.useState({ hadir: 0, terlambat: 0, cuti: 0, izin: 0 });
    const [hariIni, setHariIni] = React.useState({ masuk: null, pulang: null, keterangan: null });
    const [notifBelumDibaca, setNotifBelumDibaca] = React.useState(0);
    const [statusHariIni, setStatusHariIni] = React.useState(null);
    const now = new Date();

    React.useEffect(() => {
        let batal = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/absen/mine/${userSession.karyawan_id}`);
                const data = await res.json();
                if (batal || !Array.isArray(data)) return;

                const bulanIni = now.getMonth();
                const tahunIni = now.getFullYear();
                const catatanBulanIni = data.filter(item => {
                    const t = new Date(item.waktu_absen || item.tanggal);
                    return t.getMonth() === bulanIni && t.getFullYear() === tahunIni;
                });

                const tanggalMasuk = catatanBulanIni.filter(i => i.status === 'Masuk');
                const hadir = new Set(tanggalMasuk.map(i => new Date(i.waktu_absen || i.tanggal).toDateString())).size;
                const terlambat = tanggalMasuk.filter(i => i.keterangan && i.keterangan !== 'Normal').length;

                setRekap(prev => ({ ...prev, hadir, terlambat }));

                // Catatan hari ini (untuk kartu "Absensi Hari Ini" di Home)
                const hariIniStr = now.toDateString();
                const catatanHariIni = data.filter(item => new Date(item.waktu_absen || item.tanggal).toDateString() === hariIniStr);
                const masuk = catatanHariIni.find(i => i.status === 'Masuk') || null;
                const pulang = catatanHariIni.find(i => i.status === 'Pulang') || null;
                setHariIni({ masuk, pulang, keterangan: masuk ? masuk.keterangan : null });
            } catch (err) { /* diam-diam gagal, rekap tetap 0 */ }
        })();
        return () => { batal = true; };
    }, []);

    // Rekap Cuti & Izin bulan berjalan, dari data pengajuan yang sudah ada (tidak menambah endpoint baru)
    React.useEffect(() => {
        let batal = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/pengajuan/mine/${userSession.karyawan_id}`);
                const data = await res.json();
                if (batal || !Array.isArray(data)) return;
                const bulanIni = now.getMonth();
                const tahunIni = now.getFullYear();
                const diBulanIni = data.filter(p => {
                    const t = new Date(p.tanggal_mulai);
                    return t.getMonth() === bulanIni && t.getFullYear() === tahunIni;
                });
                const cuti = diBulanIni.filter(p => p.jenis === 'Cuti').length;
                const izin = diBulanIni.filter(p => p.jenis === 'Izin').length;
                setRekap(prev => ({ ...prev, cuti, izin }));
            } catch (err) { /* diam-diam gagal */ }
        })();
        return () => { batal = true; };
    }, [userSession.karyawan_id]);

    // Status absen hari ini (dipakai untuk kartu status + CTA utama), sumber sama dengan halaman Absensi
    React.useEffect(() => {
        let batal = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/absen/status-hari-ini/${userSession.karyawan_id}`);
                const data = await res.json();
                if (!batal) setStatusHariIni(data);
            } catch (err) {
                if (!batal) setStatusHariIni({ sudahMasuk: false, sudahPulang: false, shift: null });
            }
        })();
        return () => { batal = true; };
    }, [userSession.karyawan_id]);

    // Ambil jumlah notifikasi (kasbon + cuti/izin/sakit) yang sudah diputuskan Owner/HRD
    // tapi belum dibaca karyawan, untuk badge di ikon lonceng & nav bawah.
    React.useEffect(() => {
        let batal = false;
        (async () => {
            try {
                const [resKasbon, resPengajuan] = await Promise.all([
                    fetch(`${API_BASE}/kasbon/notifikasi/${userSession.karyawan_id}`),
                    fetch(`${API_BASE}/pengajuan/notifikasi/${userSession.karyawan_id}`)
                ]);
                const dataKasbon = await resKasbon.json();
                const dataPengajuan = await resPengajuan.json();
                if (batal) return;
                const belumDibaca =
                    (Array.isArray(dataKasbon) ? dataKasbon.filter(k => !k.notif_dibaca).length : 0) +
                    (Array.isArray(dataPengajuan) ? dataPengajuan.filter(p => !p.notif_dibaca).length : 0);
                setNotifBelumDibaca(belumDibaca);
            } catch (err) { /* diam-diam gagal, badge tetap 0 */ }
        })();
        return () => { batal = true; };
    }, [userSession.karyawan_id]);

    const QUICK_MENU = [
        { key: 'Absensi', label: 'Absensi', Icon: IconCamera, bg: 'bg-blue-50 text-blue-600' },
        { key: 'Form', label: 'Form', Icon: IconForm, bg: 'bg-violet-50 text-violet-600' },
        { key: 'Riwayat', label: 'Riwayat', Icon: IconHistory, bg: 'bg-amber-50 text-amber-600' },
        { key: 'Notifikasi', label: 'Notifikasi', Icon: IconBell, bg: 'bg-rose-50 text-rose-600' },
    ];

    const sudahMasuk = !!(statusHariIni && statusHariIni.sudahMasuk);
    const sudahPulang = !!(statusHariIni && statusHariIni.sudahPulang);
    let statusLabel = 'Belum Absen';
    let statusTone = 'bg-gray-100 text-gray-500';
    if (sudahMasuk && sudahPulang) { statusLabel = 'Absensi Selesai'; statusTone = 'bg-blue-100 text-blue-700'; }
    else if (sudahMasuk) { statusLabel = 'Sudah Absen Masuk'; statusTone = 'bg-green-100 text-green-700'; }
    else if (hariIni.keterangan && hariIni.keterangan !== 'Normal') { statusLabel = 'Terlambat'; statusTone = 'bg-red-100 text-red-700'; }

    let ctaLabel = 'ABSEN MASUK';
    let ctaTone = 'bg-green-600 active:bg-green-700';
    if (sudahMasuk && !sudahPulang) { ctaLabel = 'ABSEN PULANG'; ctaTone = 'bg-amber-500 active:bg-amber-600'; }
    if (sudahMasuk && sudahPulang) { ctaLabel = 'ABSENSI HARI INI SELESAI'; ctaTone = 'bg-gray-300'; }

    const tanggalHariIni = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div class="w-full">
            {/* HEADER */}
            <div class="bg-blue-900 px-5 pt-5 pb-10 rounded-b-3xl shadow-lg relative overflow-hidden">
                <div class="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-blue-800/40"></div>
                <div class="absolute -left-10 top-16 w-28 h-28 rounded-full bg-blue-800/30"></div>
                <div class="relative flex items-center justify-between mb-5">
                    <span class="text-white font-black tracking-wide text-sm">SETNET <span class="text-blue-300 font-bold">Mobile</span></span>
                    <div class="flex items-center gap-2">
                        <button type="button" onClick={() => onNavigate('Notifikasi')} aria-label="Notifikasi" class="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 transition">
                            <IconBell className="w-5 h-5" />
                            {notifBelumDibaca > 0 && (
                                <span class="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 border-2 border-blue-900 text-white text-[9px] font-black flex items-center justify-center">
                                    {notifBelumDibaca > 9 ? '9+' : notifBelumDibaca}
                                </span>
                            )}
                        </button>
                        <button type="button" onClick={onLogout} aria-label="Logout" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 transition">
                            <IconLogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <p class="relative text-blue-200 text-xs font-semibold mb-0.5">Selamat {sapaanWaktu()},</p>
                <h1 class="relative text-white font-black text-xl leading-tight">{userSession.nama}</h1>
                <p class="relative text-blue-200 text-xs font-mono font-bold mt-1">ID: {userSession.karyawan_id}{(userSession.role || userSession.jabatan) ? ` · ${userSession.role || userSession.jabatan}` : ''}</p>
            </div>

            <div class="px-4 -mt-6 relative z-10 space-y-4">
                {/* KARTU ABSENSI HARI INI */}
                <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{tanggalHariIni}</p>
                        <span class={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusTone}`}>{statusLabel}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div class="bg-gray-50 border border-gray-150 rounded-xl p-3">
                            <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Jam Masuk</p>
                            <p class="text-lg font-black text-gray-900 font-mono">{hariIni.masuk ? new Date(hariIni.masuk.waktu_absen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                        </div>
                        <div class="bg-gray-50 border border-gray-150 rounded-xl p-3">
                            <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Jam Pulang</p>
                            <p class="text-lg font-black text-gray-900 font-mono">{hariIni.pulang ? new Date(hariIni.pulang.waktu_absen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                        </div>
                    </div>

                    <p class="text-[10px] text-gray-400 font-semibold mb-3 text-center">Batas Absen Masuk pukul 08:30 WIB</p>

                    <button
                        type="button"
                        onClick={() => onNavigate('Absensi')}
                        disabled={sudahMasuk && sudahPulang}
                        class={`w-full text-white font-extrabold py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 ${ctaTone}`}
                    >
                        <IconCamera className="w-4 h-4" />
                        {ctaLabel}
                    </button>
                </div>

                {/* MENU CEPAT */}
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 class="text-xs font-black text-gray-500 uppercase mb-3 tracking-wide">Menu Cepat</h3>
                    <div class="grid grid-cols-4 gap-2">
                        {QUICK_MENU.map(item => (
                            <button key={item.key} type="button" onClick={() => onNavigate(item.key)} class="flex flex-col items-center gap-1.5 active:opacity-70 transition">
                                <span class={`relative w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg}`}>
                                    <item.Icon className="w-5 h-5" />
                                    {item.key === 'Notifikasi' && notifBelumDibaca > 0 && (
                                        <span class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 border border-white text-white text-[9px] font-black flex items-center justify-center">
                                            {notifBelumDibaca > 9 ? '9+' : notifBelumDibaca}
                                        </span>
                                    )}
                                </span>
                                <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* REKAP BULANAN */}
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-black text-gray-500 uppercase tracking-wide">Rekap Bulan Ini</h3>
                        <button type="button" onClick={() => onNavigate('Riwayat')} class="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                            Lainnya <IconChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <p class="text-[10px] font-bold text-blue-500 uppercase mb-1.5">Kehadiran</p>
                            <p class="text-2xl font-black text-blue-700">{rekap.hadir}</p>
                        </div>
                        <div class="bg-amber-50 border border-amber-100 rounded-xl p-3">
                            <p class="text-[10px] font-bold text-amber-600 uppercase mb-1.5">Terlambat</p>
                            <p class="text-2xl font-black text-amber-700">{rekap.terlambat}</p>
                        </div>
                        <div class="bg-violet-50 border border-violet-100 rounded-xl p-3">
                            <p class="text-[10px] font-bold text-violet-600 uppercase mb-1.5">Cuti</p>
                            <p class="text-2xl font-black text-violet-700">{rekap.cuti}</p>
                        </div>
                        <div class="bg-rose-50 border border-rose-100 rounded-xl p-3">
                            <p class="text-[10px] font-bold text-rose-600 uppercase mb-1.5">Izin</p>
                            <p class="text-2xl font-black text-rose-700">{rekap.izin}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== TAB: RIWAYAT ABSENSI (REKAP PER BULAN, RESET SETIAP BULAN BARU) ====================
function RiwayatAbsensiPanel({ userSession, onBack }) {
    const [semuaData, setSemuaData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [gagal, setGagal] = React.useState(false);
    const sekarang = new Date();
    const [bulanAktif, setBulanAktif] = React.useState(sekarang.getMonth());
    const [tahunAktif, setTahunAktif] = React.useState(sekarang.getFullYear());

    const muatRiwayat = React.useCallback(async () => {
        setLoading(true); setGagal(false);
        try {
            const res = await fetch(`${API_BASE}/absen/mine/${userSession.karyawan_id}`);
            if (!res.ok) throw new Error('Gagal memuat');
            const data = await res.json();
            setSemuaData(Array.isArray(data) ? data : []);
        } catch (err) {
            setGagal(true);
        } finally {
            setLoading(false);
        }
    }, [userSession.karyawan_id]);

    React.useEffect(() => { muatRiwayat(); }, [muatRiwayat]);

    const gantiBulan = (arah) => {
        let b = bulanAktif + arah;
        let t = tahunAktif;
        if (b < 0) { b = 11; t -= 1; }
        if (b > 11) { b = 0; t += 1; }
        setBulanAktif(b);
        setTahunAktif(t);
    };

    // Setiap ganti bulan, rekap otomatis dihitung ulang dari 0 (hanya menghitung data pada bulan & tahun yang aktif)
    const dataBulanIni = semuaData.filter(item => {
        const t = new Date(item.waktu_absen || item.tanggal);
        return t.getMonth() === bulanAktif && t.getFullYear() === tahunAktif;
    });

    const perTanggal = {};
    dataBulanIni.forEach(item => {
        const t = new Date(item.waktu_absen || item.tanggal);
        const key = t.toDateString();
        if (!perTanggal[key]) perTanggal[key] = { tanggal: t, masuk: null, pulang: null };
        if (item.status === 'Masuk') perTanggal[key].masuk = item;
        if (item.status === 'Pulang') perTanggal[key].pulang = item;
    });
    const daftarHarian = Object.values(perTanggal).sort((a, b) => b.tanggal - a.tanggal);

    const totalHadir = daftarHarian.filter(h => h.masuk).length;
    const totalTerlambat = daftarHarian.filter(h => h.masuk && h.masuk.keterangan && h.masuk.keterangan !== 'Normal').length;

    const labelBulan = new Date(tahunAktif, bulanAktif, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const bulanIniAdalahSekarang = bulanAktif === sekarang.getMonth() && tahunAktif === sekarang.getFullYear();

    return (
        <div class="w-full pb-6">
            <SubHeader title="Riwayat Absensi" subtitle={userSession.nama} onBack={onBack} />

            <div class="flex items-center justify-between bg-white border border-gray-150 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
                <button type="button" onClick={() => gantiBulan(-1)} aria-label="Bulan sebelumnya" class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-600 active:bg-gray-100">
                    <IconChevronLeft className="w-4 h-4" />
                </button>
                <span class="text-xs font-black text-gray-700 uppercase">{labelBulan}</span>
                <button type="button" onClick={() => gantiBulan(1)} disabled={bulanIniAdalahSekarang} aria-label="Bulan berikutnya"
                    class={`w-9 h-9 flex items-center justify-center rounded-full border ${bulanIniAdalahSekarang ? 'bg-gray-50 border-gray-150 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600 active:bg-gray-100'}`}>
                    <IconChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <p class="text-xl font-black text-blue-700">{totalHadir}</p>
                    <p class="text-[10px] text-blue-500 font-bold uppercase">Total Hadir</p>
                </div>
                <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                    <p class="text-xl font-black text-amber-700">{totalTerlambat}</p>
                    <p class="text-[10px] text-amber-500 font-bold uppercase">Total Terlambat</p>
                </div>
            </div>

            <h3 class="text-xs font-black text-gray-500 uppercase mb-2">Detail Harian</h3>
            <div class="space-y-2">
                {loading && <p class="text-xs text-gray-400 text-center py-8">Memuat riwayat...</p>}
                {!loading && gagal && (
                    <div class="text-center py-8">
                        <p class="text-xs text-red-500 mb-2">Gagal memuat riwayat absensi.</p>
                        <button type="button" onClick={muatRiwayat} class="text-xs font-bold text-blue-600 underline">Coba Lagi</button>
                    </div>
                )}
                {!loading && !gagal && daftarHarian.length === 0 && (
                    <p class="text-xs text-gray-400 text-center py-8">Belum ada absensi di bulan ini.</p>
                )}
                {!loading && daftarHarian.map(h => (
                    <div key={h.tanggal.toDateString()} class="bg-white border border-gray-150 rounded-xl p-3.5 shadow-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-black text-gray-800">{h.tanggal.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                            {h.masuk && h.masuk.keterangan && (
                                <span class={`text-[10px] font-black uppercase ${h.masuk.keterangan === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>{h.masuk.keterangan}</span>
                            )}
                        </div>
                        <div class="flex gap-5 text-[11px] font-semibold text-gray-500">
                            <span class="flex items-center gap-1"><IconClock className="w-3.5 h-3.5 text-gray-300" /> Masuk: <b class="text-gray-800 font-mono">{h.masuk ? new Date(h.masuk.waktu_absen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</b></span>
                            <span class="flex items-center gap-1"><IconClock className="w-3.5 h-3.5 text-gray-300" /> Pulang: <b class="text-gray-800 font-mono">{h.pulang ? new Date(h.pulang.waktu_absen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</b></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==================== TAB: FORM PENGAJUAN (KASBON / CUTI / IZIN / SAKIT) ====================
function PengajuanPanel({ userSession, onBack }) {
    const [jenisAktif, setJenisAktif] = React.useState('Kasbon');
    const [riwayatKasbon, setRiwayatKasbon] = React.useState([]);
    const [riwayatPengajuan, setRiwayatPengajuan] = React.useState([]);
    const [limitInfo, setLimitInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [pesan, setPesan] = React.useState('');

    // Form Kasbon
    const [jumlahKasbon, setJumlahKasbon] = React.useState('');
    const [alasanKasbon, setAlasanKasbon] = React.useState('');
    const [regionKasbon, setRegionKasbon] = React.useState('');
    const [vendorKasbon, setVendorKasbon] = React.useState('');
    const [metodeBayarKasbon, setMetodeBayarKasbon] = React.useState('E-Wallet');
    const [penyediaBayarKasbon, setPenyediaBayarKasbon] = React.useState('');
    const [noRekKasbon, setNoRekKasbon] = React.useState('');

    // Form Cuti/Izin/Sakit
    const [tglMulai, setTglMulai] = React.useState('');
    const [tglSelesai, setTglSelesai] = React.useState('');
    const [alasanCIS, setAlasanCIS] = React.useState('');

    const muatUlangData = async () => {
        try {
            const [resKasbon, resLimit, resPengajuan] = await Promise.all([
                fetch(`${API_BASE}/kasbon/mine/${userSession.karyawan_id}`),
                fetch(`${API_BASE}/kasbon/limit/${userSession.karyawan_id}`),
                fetch(`${API_BASE}/pengajuan/mine/${userSession.karyawan_id}`)
            ]);
            setRiwayatKasbon(await resKasbon.json());
            setLimitInfo(await resLimit.json());
            setRiwayatPengajuan(await resPengajuan.json());
        } catch (err) { /* diam-diam gagal, riwayat tetap kosong */ }
    };

    React.useEffect(() => { muatUlangData(); }, []);

    const ajukanKasbon = async (e) => {
        e.preventDefault();
        if (!jumlahKasbon || Number(jumlahKasbon) <= 0) return alert('Isi jumlah kasbon dengan benar!');
        if (!regionKasbon) return alert('Pilih region terlebih dahulu!');
        if (!vendorKasbon) return alert('Pilih vendor terlebih dahulu!');
        if (!penyediaBayarKasbon) return alert(metodeBayarKasbon === 'E-Wallet' ? 'Pilih penyedia e-wallet!' : 'Pilih nama bank tujuan!');
        if (!noRekKasbon.trim()) return alert(metodeBayarKasbon === 'E-Wallet' ? 'Isi nomor e-wallet!' : 'Isi nomor rekening!');
        setLoading(true); setPesan('');
        try {
            const response = await fetch(`${API_BASE}/kasbon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    karyawan_id: userSession.karyawan_id,
                    nama: userSession.nama,
                    jumlah: Number(jumlahKasbon),
                    alasan: alasanKasbon,
                    region: regionKasbon,
                    vendor: vendorKasbon,
                    metode_pembayaran: metodeBayarKasbon,
                    penyedia_pembayaran: penyediaBayarKasbon,
                    no_rekening: noRekKasbon.trim()
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                setPesan('✅ ' + data.message);
                setJumlahKasbon(''); setAlasanKasbon('');
                setRegionKasbon(''); setVendorKasbon('');
                setMetodeBayarKasbon('E-Wallet'); setPenyediaBayarKasbon(''); setNoRekKasbon('');
                muatUlangData();
            } else {
                setPesan('❌ ' + data.message);
            }
        } catch (err) { setPesan('❌ Gangguan koneksi'); }
        finally { setLoading(false); }
    };

    const ajukanCutiIzinSakit = async (e) => {
        e.preventDefault();
        if (!tglMulai || !tglSelesai) return alert('Isi tanggal mulai dan selesai!');
        setLoading(true); setPesan('');
        try {
            const response = await fetch(`${API_BASE}/pengajuan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    karyawan_id: userSession.karyawan_id,
                    nama: userSession.nama,
                    jenis: jenisAktif,
                    tanggal_mulai: tglMulai,
                    tanggal_selesai: tglSelesai,
                    alasan: alasanCIS
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                setPesan('✅ ' + data.message);
                setTglMulai(''); setTglSelesai(''); setAlasanCIS('');
                muatUlangData();
            } else {
                setPesan('❌ ' + data.message);
            }
        } catch (err) { setPesan('❌ Gangguan koneksi'); }
        finally { setLoading(false); }
    };

    const JENIS_LIST = [
        { key: 'Kasbon', Icon: IconWallet },
        { key: 'Cuti', Icon: IconCalendarOff },
        { key: 'Izin', Icon: IconForm },
        { key: 'Sakit', Icon: IconAlertTriangle },
    ];

    return (
        <div class="w-full pb-6">
            <SubHeader title="Form Pengajuan" subtitle={userSession.nama} onBack={onBack} />

            <div class="grid grid-cols-4 gap-1.5 mb-4 bg-gray-100 rounded-2xl p-1.5">
                {JENIS_LIST.map(j => (
                    <button key={j.key} type="button" onClick={() => { setJenisAktif(j.key); setPesan(''); }}
                        class={`flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-bold transition min-h-[44px] justify-center ${jenisAktif === j.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                        <j.Icon className="w-4 h-4" />
                        {j.key}
                    </button>
                ))}
            </div>

            {pesan && <div class="p-3 rounded-xl text-xs font-bold mb-3 text-center bg-gray-50 border border-gray-150">{pesan}</div>}

            {jenisAktif === 'Kasbon' ? (
                <div>
                    {limitInfo && (
                        <div class="bg-blue-50 border border-blue-100 rounded-xl p-3.5 mb-4 text-xs font-semibold text-blue-900 space-y-1.5">
                            <div class="flex justify-between"><span>Limit Kasbon Anda</span><span>{formatRupiah(limitInfo.limit)}</span></div>
                            <div class="flex justify-between"><span>Sedang Terpakai</span><span>{formatRupiah(limitInfo.terpakai)}</span></div>
                            <div class="flex justify-between font-black border-t border-blue-100 pt-1.5"><span>Sisa Limit</span><span>{formatRupiah(limitInfo.sisa)}</span></div>
                        </div>
                    )}
                    <form onSubmit={ajukanKasbon} class="space-y-3.5 mb-5">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Jumlah Kasbon (Rp)</label>
                            <input type="number" min="1" placeholder="cth: 500000" value={jumlahKasbon} onChange={e => setJumlahKasbon(e.target.value)} class="w-full px-4 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div class="grid grid-cols-1 gap-3.5">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Region</label>
                                <select value={regionKasbon} onChange={e => setRegionKasbon(e.target.value)} class="w-full px-3.5 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                                    <option value="">Pilih region</option>
                                    {KASBON_REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vendor</label>
                                <select value={vendorKasbon} onChange={e => setVendorKasbon(e.target.value)} class="w-full px-3.5 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                                    <option value="">Pilih vendor</option>
                                    {KASBON_VENDOR_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alasan / Keperluan</label>
                            <textarea placeholder="Jelaskan keperluan kasbon..." value={alasanKasbon} onChange={e => setAlasanKasbon(e.target.value)} class="w-full px-4 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" rows="2"></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Metode Pembayaran</label>
                            <div class="grid grid-cols-2 gap-2">
                                {['E-Wallet', 'Transfer Bank'].map(m => (
                                    <button key={m} type="button" onClick={() => { setMetodeBayarKasbon(m); setPenyediaBayarKasbon(''); }}
                                        class={`py-2.5 rounded-lg text-[11px] font-bold border transition min-h-[44px] ${metodeBayarKasbon === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-3.5">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">{metodeBayarKasbon === 'E-Wallet' ? 'Penyedia E-Wallet' : 'Nama Bank'}</label>
                                <select value={penyediaBayarKasbon} onChange={e => setPenyediaBayarKasbon(e.target.value)} class="w-full px-3.5 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                                    <option value="">{metodeBayarKasbon === 'E-Wallet' ? 'Pilih e-wallet' : 'Pilih bank'}</option>
                                    {(metodeBayarKasbon === 'E-Wallet' ? KASBON_EWALLET_OPTIONS : KASBON_BANK_OPTIONS).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">{metodeBayarKasbon === 'E-Wallet' ? 'No. E-Wallet' : 'No. Rekening'}</label>
                                <input type="text" inputmode="numeric" placeholder={metodeBayarKasbon === 'E-Wallet' ? 'cth: 08123456789' : 'cth: 1234567890'} value={noRekKasbon} onChange={e => setNoRekKasbon(e.target.value)} class="w-full px-3.5 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} class="w-full bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-400 text-sm">
                            {loading ? 'Mengirim...' : 'AJUKAN KASBON'}
                        </button>
                    </form>

                    <h3 class="text-xs font-black text-gray-500 uppercase mb-2">Riwayat Kasbon</h3>
                    <div class="space-y-2">
                        {riwayatKasbon.length === 0 && <p class="text-xs text-gray-400 text-center py-4">Belum ada pengajuan kasbon.</p>}
                        {riwayatKasbon.map(k => (
                            <div key={k._id} class="bg-white border border-gray-150 rounded-xl p-3.5 shadow-sm">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-black text-sm text-gray-900">{formatRupiah(k.jumlah)}</span>
                                    <StatusBadge status={k.status} />
                                </div>
                                {(k.region || k.vendor) && (
                                    <p class="text-[10px] text-gray-500 mb-1">{k.region}{k.region && k.vendor ? ' • ' : ''}{k.vendor}</p>
                                )}
                                {k.alasan && <p class="text-xs text-gray-500 mb-1">{k.alasan}</p>}
                                {k.metode_pembayaran && (
                                    <p class="text-[10px] text-gray-500 mb-1">{k.metode_pembayaran} - {k.penyedia_pembayaran} • {k.no_rekening}</p>
                                )}
                                <p class="text-[10px] font-mono text-gray-400">{new Date(k.tanggal_pengajuan).toLocaleDateString('id-ID')}</p>
                                {k.status === 'Disetujui' && <p class="text-[10px] font-bold mt-1 text-green-700">{k.lunas ? '✔ Lunas' : '⏳ Belum lunas / akan dipotong gaji'}</p>}
                                {k.status === 'Ditolak' && k.catatan_admin && <p class="text-[10px] mt-1 text-red-600">Catatan: {k.catatan_admin}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <form onSubmit={ajukanCutiIzinSakit} class="space-y-3.5 mb-5">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tgl Mulai</label>
                                <input type="date" value={tglMulai} onChange={e => setTglMulai(e.target.value)} class="w-full px-3 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tgl Selesai</label>
                                <input type="date" value={tglSelesai} onChange={e => setTglSelesai(e.target.value)} class="w-full px-3 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alasan</label>
                            <textarea placeholder={`Jelaskan alasan ${jenisAktif.toLowerCase()}...`} value={alasanCIS} onChange={e => setAlasanCIS(e.target.value)} class="w-full px-4 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" rows="2"></textarea>
                        </div>
                        <button type="submit" disabled={loading} class="w-full bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-400 text-sm">
                            {loading ? 'Mengirim...' : `AJUKAN ${jenisAktif.toUpperCase()}`}
                        </button>
                    </form>

                    <h3 class="text-xs font-black text-gray-500 uppercase mb-2">Riwayat {jenisAktif}</h3>
                    <div class="space-y-2">
                        {riwayatPengajuan.filter(p => p.jenis === jenisAktif).length === 0 && (
                            <p class="text-xs text-gray-400 text-center py-4">Belum ada pengajuan {jenisAktif.toLowerCase()}.</p>
                        )}
                        {riwayatPengajuan.filter(p => p.jenis === jenisAktif).map(p => (
                            <div key={p._id} class="bg-white border border-gray-150 rounded-xl p-3.5 shadow-sm">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-bold text-xs text-gray-800">
                                        {new Date(p.tanggal_mulai).toLocaleDateString('id-ID')} — {new Date(p.tanggal_selesai).toLocaleDateString('id-ID')}
                                    </span>
                                    <StatusBadge status={p.status} />
                                </div>
                                {p.alasan && <p class="text-xs text-gray-500">{p.alasan}</p>}
                                {p.status === 'Ditolak' && p.catatan_admin && <p class="text-[10px] mt-1 text-red-600">Catatan: {p.catatan_admin}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== TAB: ABSENSI (KAMERA) ====================
function AbsensiPanel({ userSession, onBack, videoRef, selectedShift, setSelectedShift, loading, handleAbsen, modalData, setModalData, onSelesai, konfirmasiTelat, onLanjutkanTelat, onBatalkanTelat, lokasi, cariLokasi, statusHariIni, statusHariIniLoading }) {
    const gpsSiap = lokasi.status === 'siap';
    const tombolDasarTerkunci = loading || !gpsSiap || statusHariIniLoading;

    // Jam WIB berjalan (update tiap detik): dipakai untuk jam digital & peringatan batas Absen Masuk 08:30 WIB.
    const [waktuSekarang, setWaktuSekarang] = React.useState(() => new Date());
    const [statusBatasMasuk, setStatusBatasMasuk] = React.useState(() => getStatusBatasMasukWIB());
    React.useEffect(() => {
        const timer = setInterval(() => {
            setWaktuSekarang(new Date());
            setStatusBatasMasuk(getStatusBatasMasukWIB());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Aturan kunci tombol:
    // - "Absen Masuk" terkunci kalau hari ini SUDAH absen masuk (tidak bisa absen masuk 2x / ganti shift)
    // - "Absen Pulang" terkunci kalau BELUM absen masuk (harus masuk dulu baru bisa pulang),
    //   atau kalau hari ini SUDAH absen pulang juga (sudah selesai, tidak bisa pulang 2x)
    const masukTerkunci = tombolDasarTerkunci || statusHariIni.sudahMasuk;
    const pulangTerkunci = tombolDasarTerkunci || !statusHariIni.sudahMasuk || statusHariIni.sudahPulang;

    // Pilihan shift dikunci begitu sudah Absen Masuk hari ini, supaya konsisten sampai Absen Pulang
    const shiftTerkunci = statusHariIni.sudahMasuk;

    const kelasTombolShift = (aktif, terkunci) => {
        if (terkunci && !aktif) return 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed';
        if (aktif) return 'bg-blue-600 text-white border-blue-600 shadow-sm';
        return 'bg-white text-gray-700 border-gray-200';
    };

    return (
        <div class="w-full pb-6 relative">
            <SubHeader title="Absensi" subtitle={`${userSession.nama} · ID: ${userSession.karyawan_id}`} onBack={onBack} />

            {/* JAM DIGITAL BERJALAN */}
            <div class="bg-blue-900 rounded-2xl px-5 py-4 mb-4 text-center shadow-md">
                <p class="text-3xl font-black text-white font-mono tracking-wider tabular-nums">{getJamBerjalanWIB(waktuSekarang)}</p>
                <p class="text-[11px] text-blue-200 font-semibold mt-0.5">{waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} WIB</p>
            </div>

            <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden mb-4 shadow-inner border border-gray-200">
                <video ref={videoRef} autoPlay playsInline muted class="w-full h-full object-cover transform -scale-x-100"></video>
                <div class="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 text-[10px] text-white pl-1.5 pr-2 py-1 rounded-full font-mono font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE CAMERA ACTIVE
                </div>
            </div>

            {/* PERINGATAN BATAS JAM ABSEN MASUK 08:30 WIB — hanya tampil sebelum karyawan Absen Masuk hari ini */}
            {!statusHariIniLoading && !statusHariIni.sudahMasuk && (
                <div class={`mb-3 text-left rounded-xl p-3 border flex items-start gap-2.5 ${statusBatasMasuk.sudahLewat ? 'bg-red-50 border-red-150' : 'bg-blue-50 border-blue-150'}`}>
                    <span class={`shrink-0 mt-0.5 ${statusBatasMasuk.sudahLewat ? 'text-red-600' : 'text-blue-600'}`}>
                        {statusBatasMasuk.sudahLewat ? <IconAlertTriangle className="w-4 h-4" /> : <IconClock className="w-4 h-4" />}
                    </span>
                    <div class="min-w-0">
                        <p class={`text-[11px] font-black uppercase ${statusBatasMasuk.sudahLewat ? 'text-red-700' : 'text-blue-700'}`}>
                            {statusBatasMasuk.sudahLewat ? 'Sudah Lewat Jam Absen Masuk' : 'Batas Absen Masuk 08:30 WIB'}
                        </p>
                        <p class="text-[10px] text-gray-500">
                            {statusBatasMasuk.sudahLewat
                                ? `Sekarang ${statusBatasMasuk.jamText} WIB. Anda akan tercatat TERLAMBAT ${statusBatasMasuk.selisihMenit} menit jika Absen Masuk sekarang.`
                                : `Sekarang ${statusBatasMasuk.jamText} WIB. Absen Masuk sebelum 08:30 WIB supaya tidak tercatat terlambat.`}
                        </p>
                    </div>
                </div>
            )}

            {/* STATUS GPS: wajib aktif sebelum bisa absen, sama seperti kamera */}
            <div class={`mb-3 text-left rounded-xl p-3 border flex items-start gap-2.5 ${gpsSiap ? 'bg-green-50 border-green-150' : lokasi.status === 'gagal' ? 'bg-red-50 border-red-150' : 'bg-amber-50 border-amber-150'}`}>
                <span class={`shrink-0 mt-0.5 ${gpsSiap ? 'text-green-600' : lokasi.status === 'gagal' ? 'text-red-600' : 'text-amber-600'}`}>
                    <IconMapPin className="w-4 h-4" />
                </span>
                <div class="min-w-0 flex-1">
                    <p class={`text-[11px] font-black uppercase ${gpsSiap ? 'text-green-700' : lokasi.status === 'gagal' ? 'text-red-700' : 'text-amber-700'}`}>
                        {gpsSiap ? 'Lokasi Terverifikasi' : lokasi.status === 'mencari' ? 'Memeriksa lokasi Anda...' : lokasi.status === 'gagal' ? 'Lokasi Gagal Diverifikasi' : 'Menunggu Lokasi'}
                    </p>
                    <p class="text-[10px] text-gray-500 truncate">
                        {gpsSiap
                            ? (lokasi.alamat || `${lokasi.latitude.toFixed(5)}, ${lokasi.longitude.toFixed(5)}`)
                            : lokasi.status === 'gagal'
                                ? 'Izin lokasi diperlukan untuk bisa absen. Aktifkan GPS lalu coba lagi.'
                                : 'Aktifkan izin lokasi GPS untuk bisa absen.'}
                    </p>
                </div>
                {!gpsSiap && (
                    <button type="button" onClick={cariLokasi} class="shrink-0 text-[10px] font-bold text-blue-600 underline py-1">Coba Lagi</button>
                )}
            </div>

            {/* STATUS ABSEN HARI INI: kasih tahu karyawan sudah sampai tahap mana */}
            {!statusHariIniLoading && (statusHariIni.sudahMasuk || statusHariIni.sudahPulang) && (
                <div class={`mb-4 text-left rounded-xl p-3 border flex items-start gap-2.5 ${statusHariIni.sudahPulang ? 'bg-blue-50 border-blue-150' : 'bg-green-50 border-green-150'}`}>
                    <span class={`shrink-0 mt-0.5 ${statusHariIni.sudahPulang ? 'text-blue-600' : 'text-green-600'}`}><IconCheckCircle className="w-4 h-4" /></span>
                    <div class="min-w-0">
                        <p class={`text-[11px] font-black uppercase ${statusHariIni.sudahPulang ? 'text-blue-700' : 'text-green-700'}`}>
                            {statusHariIni.sudahPulang ? 'Absensi Hari Ini Selesai' : 'Sudah Absen Masuk'}
                        </p>
                        <p class="text-[10px] text-gray-500">
                            {statusHariIni.sudahPulang
                                ? 'Anda sudah Absen Masuk dan Absen Pulang hari ini. Sampai jumpa besok!'
                                : 'Tinggal klik Absen Pulang saat selesai kerja.'}
                        </p>
                    </div>
                </div>
            )}

            {/* --- SEMENTARA DISEMBUNYIKAN: UI pilih jadwal shift ---
                Fitur shift dinonaktifkan dulu, jadi user tidak perlu pilih apa-apa.
                selectedShift otomatis terisi 'Non-Shift' (lihat React.useState di atas).
                Nanti kalau mau diaktifkan lagi, tinggal uncomment blok di bawah ini.

            <div class="mb-5 text-left bg-gray-50 p-3 rounded-xl border border-gray-150">
                <label class="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-wide text-center">PILIH JADWAL SHIFT ANDA HARI INI:</label>
                <div class="grid grid-cols-3 gap-2">
                    <button type="button" disabled={shiftTerkunci} onClick={() => setSelectedShift('Shift 1')} class={`py-2 rounded-lg text-xs font-bold border transition ${kelasTombolShift(selectedShift === 'Shift 1', shiftTerkunci)}`}>
                        Shift 1 <span class="block text-[9px] font-medium opacity-80">07:00- 16:00</span>
                    </button>
                    <button type="button" disabled={shiftTerkunci} onClick={() => setSelectedShift('Shift 2')} class={`py-2 rounded-lg text-xs font-bold border transition ${kelasTombolShift(selectedShift === 'Shift 2', shiftTerkunci)}`}>
                        Shift 2 <span class="block text-[9px] font-medium opacity-80">15:00- 23:59</span>
                    </button>
                    <button type="button" disabled={shiftTerkunci} onClick={() => setSelectedShift('Non-Shift')} class={`py-2 rounded-lg text-xs font-bold border transition ${kelasTombolShift(selectedShift === 'Non-Shift', shiftTerkunci)}`}>
                        Regular <span class="block text-[9px] font-medium opacity-80">09:00 - 18:00</span>
                    </button>
                </div>
                {shiftTerkunci && (
                    <p class="text-[10px] text-gray-400 mt-2 text-center">🔒 Shift terkunci karena sudah Absen Masuk hari ini.</p>
                )}
            </div>
            */}

            <div class="grid grid-cols-2 gap-3">
                <button onClick={() => handleAbsen('Masuk')} disabled={masukTerkunci} class="bg-green-600 active:bg-green-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm">
                    {loading ? 'Memproses...' : statusHariIni.sudahMasuk ? '✓ SUDAH ABSEN MASUK' : 'ABSEN MASUK'}
                </button>
                <button onClick={() => handleAbsen('Pulang')} disabled={pulangTerkunci} class="bg-amber-500 active:bg-amber-600 text-white font-extrabold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm">
                    {loading ? 'Memproses...' : statusHariIni.sudahPulang ? '✓ SUDAH ABSEN PULANG' : 'ABSEN PULANG'}
                </button>
            </div>

            {/* MODAL NOTIFIKASI MODERN DI TENGAH LAYAR */}
            {modalData && (() => {
                const telat = modalData.keterangan && modalData.keterangan !== 'Normal';
                return (
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
                        <div class={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${telat ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {telat ? <IconAlertTriangle className="w-8 h-8" /> : <IconCheckCircle className="w-8 h-8" />}
                        </div>
                        <h3 class="text-xl font-black text-gray-900">{telat ? 'Absen Berhasil — Terlambat' : 'Absensi Tercatat'}</h3>
                        <p class="text-xs text-gray-400 mt-0.5 font-medium">Data absensi Anda telah masuk ke sistem utama</p>

                        {telat && (
                            <div class="mt-3 bg-red-50 border border-red-150 rounded-xl p-3 text-left">
                                <p class="text-[11px] font-black uppercase text-red-700">Anda Tercatat Terlambat</p>
                                <p class="text-[11px] text-red-600 mt-0.5">Absen Masuk melewati batas jam 08:30 WIB. Mohon usahakan Absen Masuk sebelum 08:30 WIB besok.</p>
                            </div>
                        )}

                        <div class="my-4 bg-gray-50 rounded-xl p-3 text-left border border-gray-200 space-y-1.5 text-xs font-semibold">
                            <div class="flex justify-between"><span class="text-gray-400">Status Log:</span> <span class="text-blue-600 uppercase font-black">{modalData.status}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Jam Log:</span> <span class="text-gray-800 font-mono font-bold">{modalData.waktu} WIB</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Keterangan:</span> <span class={telat ? 'text-red-600 font-black' : 'text-green-600'}>{modalData.keterangan}</span></div>
                        </div>

                        <button onClick={onSelesai} class="w-full bg-gray-900 active:bg-black text-white font-bold py-3 rounded-xl transition shadow-md text-sm">
                            Selesai & Lanjutkan
                        </button>
                    </div>
                </div>
                );
            })()}

            {/* MODAL KONFIRMASI TERLAMBAT — pengganti window.confirm bawaan browser (yang tampilannya
                kaku, tidak bisa distyle, dan beda-beda tiap browser), diseragamkan dengan gaya modal
                "Absensi Tercatat" di atas supaya lebih rapi & minimalis */}
            {konfirmasiTelat && (
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
                        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-red-100 text-red-600">
                            <IconAlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 class="text-lg font-black text-gray-900">Peringatan Terlambat</h3>
                        <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">
                            Sekarang jam <span class="font-bold text-gray-700">{konfirmasiTelat.jamText} WIB</span>, sudah melewati batas Absen Masuk (08:30 WIB).
                        </p>

                        <div class="my-4 bg-red-50 border border-red-150 rounded-xl p-3">
                            <p class="text-[10px] font-black uppercase text-red-500 tracking-wide">Anda Akan Tercatat</p>
                            <p class="text-lg font-black text-red-700 mt-0.5">TERLAMBAT {konfirmasiTelat.selisihMenit} Menit</p>
                        </div>

                        <p class="text-xs text-gray-500 mb-4">Lanjutkan Absen Masuk?</p>

                        <div class="grid grid-cols-2 gap-3">
                            <button onClick={onBatalkanTelat} class="bg-gray-100 active:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl transition text-sm">
                                Batal
                            </button>
                            <button onClick={onLanjutkanTelat} class="bg-red-600 active:bg-red-700 text-white font-bold py-2.5 rounded-xl transition shadow-md text-sm">
                                Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Batas waktu tidak ada aktivitas (idle) sebelum user otomatis di-logout paksa.
// Diset 90 menit (di tengah rentang 1-2 jam yang diminta).
const IDLE_LOGOUT_MS = 90 * 60 * 1000;

// ==================== TAB: NOTIFIKASI (KASBON / CUTI / IZIN / SAKIT YANG SUDAH DIPUTUSKAN) ====================
function NotifikasiPanel({ userSession, onBack }) {
    const [daftar, setDaftar] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [gagal, setGagal] = React.useState(false);

    const muatNotifikasi = React.useCallback(async () => {
        setLoading(true); setGagal(false);
        try {
            const [resKasbon, resPengajuan] = await Promise.all([
                fetch(`${API_BASE}/kasbon/notifikasi/${userSession.karyawan_id}`),
                fetch(`${API_BASE}/pengajuan/notifikasi/${userSession.karyawan_id}`)
            ]);
            if (!resKasbon.ok || !resPengajuan.ok) throw new Error('Gagal memuat');
            const dataKasbon = await resKasbon.json();
            const dataPengajuan = await resPengajuan.json();

            // Gabungkan notifikasi Kasbon + Cuti/Izin/Sakit jadi satu daftar, urut terbaru dulu
            const gabungan = [
                ...(Array.isArray(dataKasbon) ? dataKasbon.map(k => ({
                    _id: k._id, tipe: 'kasbon', jenisLabel: 'Kasbon', status: k.status,
                    catatan_admin: k.catatan_admin, tanggal_keputusan: k.tanggal_keputusan,
                    notif_dibaca: k.notif_dibaca,
                    detail: formatRupiah(k.jumlah)
                })) : []),
                ...(Array.isArray(dataPengajuan) ? dataPengajuan.map(p => ({
                    _id: p._id, tipe: 'pengajuan', jenisLabel: p.jenis, status: p.status,
                    catatan_admin: p.catatan_admin, tanggal_keputusan: p.tanggal_keputusan,
                    notif_dibaca: p.notif_dibaca,
                    detail: `${new Date(p.tanggal_mulai).toLocaleDateString('id-ID')} — ${new Date(p.tanggal_selesai).toLocaleDateString('id-ID')}`
                })) : [])
            ].sort((a, b) => new Date(b.tanggal_keputusan || 0) - new Date(a.tanggal_keputusan || 0));

            setDaftar(gabungan);

            // Tandai semua notifikasi yang baru ditampilkan sebagai sudah dibaca (best-effort, diam-diam kalau gagal)
            const belumDibaca = gabungan.filter(n => !n.notif_dibaca);
            belumDibaca.forEach(n => {
                const endpoint = n.tipe === 'kasbon' ? `${API_BASE}/kasbon/${n._id}/baca` : `${API_BASE}/pengajuan/${n._id}/baca`;
                fetch(endpoint, { method: 'PUT' }).catch(() => {});
            });
        } catch (err) {
            setGagal(true);
        } finally {
            setLoading(false);
        }
    }, [userSession.karyawan_id]);

    React.useEffect(() => { muatNotifikasi(); }, [muatNotifikasi]);

    return (
        <div class="w-full pb-6">
            <SubHeader title="Notifikasi" subtitle={userSession.nama} onBack={onBack} />
            <div class="space-y-2">
                {loading && <p class="text-xs text-gray-400 text-center py-8">Memuat notifikasi...</p>}
                {!loading && gagal && (
                    <div class="text-center py-8">
                        <p class="text-xs text-red-500 mb-2">Gagal memuat notifikasi.</p>
                        <button type="button" onClick={muatNotifikasi} class="text-xs font-bold text-blue-600 underline">Coba Lagi</button>
                    </div>
                )}
                {!loading && !gagal && daftar.length === 0 && (
                    <div class="text-center py-10">
                        <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center mx-auto mb-3">
                            <IconBell className="w-6 h-6" />
                        </div>
                        <p class="text-xs text-gray-400 px-6">Belum ada notifikasi. Notifikasi akan muncul di sini setelah pengajuan Kasbon/Cuti/Izin/Sakit Anda di-ACC atau ditolak Owner.</p>
                    </div>
                )}
                {!loading && daftar.map(n => {
                    const disetujui = n.status === 'Disetujui';
                    return (
                        <div key={`${n.tipe}-${n._id}`} class={`rounded-xl p-3.5 border-l-4 shadow-sm ${n.notif_dibaca ? 'bg-white border-gray-200' : disetujui ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                            <div class="flex justify-between items-start mb-1.5 gap-2">
                                <span class="flex items-center gap-1.5 font-black text-xs text-gray-800 uppercase">
                                    {!n.notif_dibaca && <span class="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>}
                                    {n.jenisLabel}
                                </span>
                                <StatusBadge status={n.status} />
                            </div>
                            <p class="text-xs text-gray-600 font-semibold mb-1.5">{n.detail}</p>
                            <p class={`text-[11px] font-bold flex items-center gap-1 ${disetujui ? 'text-green-600' : 'text-red-600'}`}>
                                {disetujui ? <IconCheckCircle className="w-3.5 h-3.5" /> : <IconX className="w-3.5 h-3.5" />}
                                {disetujui
                                    ? `Pengajuan ${n.jenisLabel} Anda telah di-ACC Owner`
                                    : `Pengajuan ${n.jenisLabel} Anda ditolak Owner`}
                            </p>
                            {n.catatan_admin && <p class="text-[10px] text-gray-500 mt-1.5">Catatan: {n.catatan_admin}</p>}
                            {n.tanggal_keputusan && (
                                <p class="text-[10px] font-mono text-gray-400 mt-1.5">{new Date(n.tanggal_keputusan).toLocaleString('id-ID')}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AppAbsensi() {
    const SESSION_KEY = 'setnet_absensi_session';
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userSession, setUserSession] = React.useState(null);
    const [tabAktif, setTabAktif] = React.useState('Menu'); // Menu | Absensi | Form | Riwayat | Notifikasi
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const idleTimerRef = React.useRef(null);

    const [karyawanId, setKaryawanId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pesan, setPesan] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Sementara UI pilih shift disembunyikan (fitur shift dinonaktifkan dulu),
    // jadi selalu kirim 'Non-Shift' otomatis tanpa user perlu pilih apa-apa.
    const [selectedShift, setSelectedShift] = React.useState('Non-Shift');
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);

    // State baru untuk Modal Notification Kustom
    const [modalData, setModalData] = React.useState(null);

    // Modal konfirmasi Absen Masuk yang sudah lewat batas jam 08:30 WIB
    // (pengganti window.confirm bawaan browser yang tampilannya kaku & tidak bisa distyle)
    const [konfirmasiTelat, setKonfirmasiTelat] = React.useState(null); // null | { jamText, selisihMenit, statusAbsen }

    // State lokasi GPS: wajib aktif sama seperti kamera sebelum bisa absen.
    // status: 'idle' | 'mencari' | 'siap' | 'gagal'
    const [lokasi, setLokasi] = React.useState({ status: 'idle', latitude: null, longitude: null, alamat: '' });

    // Status absen HARI INI (WIB): dipakai untuk mengunci tombol "Absen Masuk" setelah
    // sudah absen masuk (biar tidak bisa absen masuk 2x / ganti shift), dan mengunci
    // tombol "Absen Pulang" sampai karyawan sudah absen masuk dulu.
    const [statusHariIni, setStatusHariIni] = React.useState({ sudahMasuk: false, sudahPulang: false, shift: null });
    const [statusHariIniLoading, setStatusHariIniLoading] = React.useState(true);

    // Badge jumlah notifikasi belum dibaca, dipakai di Bottom Nav (dihitung ulang tiap kembali ke Menu)
    const [notifBelumDibacaNav, setNotifBelumDibacaNav] = React.useState(0);
    React.useEffect(() => {
        if (!isLoggedIn || !userSession) return;
        let batal = false;
        (async () => {
            try {
                const [resKasbon, resPengajuan] = await Promise.all([
                    fetch(`${API_BASE}/kasbon/notifikasi/${userSession.karyawan_id}`),
                    fetch(`${API_BASE}/pengajuan/notifikasi/${userSession.karyawan_id}`)
                ]);
                const dataKasbon = await resKasbon.json();
                const dataPengajuan = await resPengajuan.json();
                if (batal) return;
                const belumDibaca =
                    (Array.isArray(dataKasbon) ? dataKasbon.filter(k => !k.notif_dibaca).length : 0) +
                    (Array.isArray(dataPengajuan) ? dataPengajuan.filter(p => !p.notif_dibaca).length : 0);
                setNotifBelumDibacaNav(belumDibaca);
            } catch (err) { /* diam-diam gagal, badge tetap 0 */ }
        })();
        return () => { batal = true; };
    }, [isLoggedIn, userSession, tabAktif]);

    const muatStatusHariIni = React.useCallback(async () => {
        if (!userSession) return;
        setStatusHariIniLoading(true);
        try {
            const res = await fetch(`${API_BASE}/absen/status-hari-ini/${userSession.karyawan_id}`);
            const data = await res.json();
            setStatusHariIni(data);
            // Kalau sudah absen masuk hari ini, kunci pilihan shift ke shift yang dipakai saat itu
            if (data.sudahMasuk && data.shift) {
                setSelectedShift(data.shift);
            }
        } catch (err) {
            // Diam-diam gagal — anggap belum absen supaya tidak salah memblokir user.
            // (Server tetap jadi penjaga terakhir kalau ternyata sudah absen.)
            setStatusHariIni({ sudahMasuk: false, sudahPulang: false, shift: null });
        } finally {
            setStatusHariIniLoading(false);
        }
    }, [userSession]);

    const cariLokasi = React.useCallback(() => {
        if (!navigator.geolocation) {
            setLokasi({ status: 'gagal', latitude: null, longitude: null, alamat: '' });
            return;
        }
        setLokasi(prev => ({ ...prev, status: 'mencari' }));
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let alamat = '';
                try {
                    // Reverse geocode alamat (best-effort, boleh gagal tanpa menghentikan absen)
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=0`);
                    const data = await res.json();
                    alamat = data && data.display_name ? data.display_name : '';
                } catch (err) { /* diam-diam gagal, kirim tanpa alamat */ }
                setLokasi({ status: 'siap', latitude, longitude, alamat });
            },
            () => {
                setLokasi({ status: 'gagal', latitude: null, longitude: null, alamat: '' });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }, []);

    // Pulihkan sesi login dari penyimpanan lokal saat halaman di-refresh,
    // supaya karyawan tidak perlu login ulang tiap kali me-refresh halaman.
    React.useEffect(() => {
        try {
            const tersimpan = localStorage.getItem(SESSION_KEY);
            if (tersimpan) {
                const karyawan = JSON.parse(tersimpan);
                if (karyawan && karyawan.karyawan_id) {
                    setUserSession(karyawan);
                    setIsLoggedIn(true);
                }
            }
        } catch (err) { /* penyimpanan lokal tidak tersedia/rusak, anggap belum login */ }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!karyawanId || !password) return alert('Isi ID Karyawan dan Password!');
        setLoading(true); setPesan('');
        try {
            const response = await fetch(`${API_BASE}/absen/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ karyawan_id: karyawanId, password })
            });
            const data = await response.json();
            if (response.status === 200) {
                setUserSession(data.karyawan);
                setIsLoggedIn(true);
                setTabAktif('Menu');
                try { localStorage.setItem(SESSION_KEY, JSON.stringify(data.karyawan)); } catch (err) { /* abaikan jika penyimpanan lokal tidak tersedia */ }
            } else {
                setPesan(`❌ ${data.message}`);
            }
        } catch (error) { setPesan('❌ Gangguan koneksi'); }
        finally { setLoading(false); }
    };

    // Tombol Logout di menu hanya MEMINTA konfirmasi; proses logout sesungguhnya ada di handleLogout di bawah.
    const requestLogout = () => setShowLogoutConfirm(true);

    const handleLogout = () => {
        matikanKamera();
        setIsLoggedIn(false);
        setUserSession(null);
        setTabAktif('Menu');
        setKaryawanId('');
        setPassword('');
        setShowLogoutConfirm(false);
        try { localStorage.removeItem(SESSION_KEY); } catch (err) { /* abaikan jika penyimpanan lokal tidak tersedia */ }
    };

    // Logout otomatis (paksa, tanpa modal konfirmasi) karena user meninggalkan halaman
    // tanpa aktivitas apa pun selama IDLE_LOGOUT_MS. User harus login ulang setelah ini.
    const handleAutoLogout = React.useCallback(() => {
        matikanKamera();
        setIsLoggedIn(false);
        setUserSession(null);
        setTabAktif('Menu');
        setKaryawanId('');
        setPassword('');
        setShowLogoutConfirm(false);
        try { localStorage.removeItem(SESSION_KEY); } catch (err) { /* abaikan jika penyimpanan lokal tidak tersedia */ }
        setPesan('⏰ Sesi Anda berakhir karena tidak ada aktivitas. Silakan login kembali.');
    }, []);

    // Pantau aktivitas user (klik, ketik, sentuh, scroll) selama sudah login.
    // Setiap ada aktivitas, timer idle direset. Kalau timer habis (tidak ada
    // aktivitas sama sekali selama IDLE_LOGOUT_MS), user otomatis di-logout.
    React.useEffect(() => {
        if (!isLoggedIn) {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            return;
        }
        const resetTimerIdle = () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(handleAutoLogout, IDLE_LOGOUT_MS);
        };
        const daftarEvent = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
        daftarEvent.forEach(ev => window.addEventListener(ev, resetTimerIdle, { passive: true }));
        resetTimerIdle(); // mulai hitung sejak login / halaman dibuka

        return () => {
            daftarEvent.forEach(ev => window.removeEventListener(ev, resetTimerIdle));
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [isLoggedIn, handleAutoLogout]);

    // Kamera & GPS hanya aktif ketika berada di halaman Absensi
    React.useEffect(() => {
        if (isLoggedIn && tabAktif === 'Absensi') {
            bukaKamera();
            cariLokasi();
            muatStatusHariIni();
        } else {
            matikanKamera();
        }
        return () => matikanKamera();
    }, [isLoggedIn, tabAktif, muatStatusHariIni]);

    const bukaKamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (err) {
            alert("⚠️ Gagal mengakses kamera. Mohon izinkan akses kamera!");
        }
    };

    const matikanKamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const handleAbsen = async (statusAbsen) => {
        if (!streamRef.current) {
            return alert("Kamera belum aktif!");
        }
        if (lokasi.status !== 'siap') {
            return alert("⚠️ Lokasi GPS belum aktif/ditemukan. Mohon izinkan akses lokasi lalu coba lagi!");
        }
        if (statusAbsen === 'Masuk' && statusHariIni.sudahMasuk) {
            return alert("⚠️ Anda sudah Absen Masuk hari ini. Tidak bisa Absen Masuk lagi.");
        }
        if (statusAbsen === 'Pulang' && !statusHariIni.sudahMasuk) {
            return alert("⚠️ Anda belum Absen Masuk hari ini. Silakan Absen Masuk terlebih dahulu.");
        }
        if (statusAbsen === 'Pulang' && statusHariIni.sudahPulang) {
            return alert("⚠️ Anda sudah Absen Pulang hari ini.");
        }

        // Peringatan tambahan kalau Absen Masuk dilakukan setelah batas 08:30 WIB —
        // karyawan tetap bisa lanjut absen (tetap tercatat, backend yang jadi penentu akhir),
        // tapi diberi kesempatan untuk sadar & konfirmasi dulu bahwa ini akan tercatat Terlambat.
        // Pakai modal kustom (bukan window.confirm bawaan browser) supaya tampilannya konsisten
        // dengan desain aplikasi & tidak jelek/kaku seperti popup default browser.
        if (statusAbsen === 'Masuk') {
            const batas = getStatusBatasMasukWIB();
            if (batas.sudahLewat) {
                setKonfirmasiTelat({ jamText: batas.jamText, selisihMenit: batas.selisihMenit, statusAbsen });
                return;
            }
        }

        await prosesAbsen(statusAbsen);
    };

    // Proses submit absen sesungguhnya (ambil foto dari kamera + kirim ke server).
    // Dipisah dari handleAbsen supaya bisa dipanggil ulang setelah user menekan
    // "Lanjutkan" di modal konfirmasi terlambat.
    const prosesAbsen = async (statusAbsen) => {
        setLoading(true);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth || 640;
            canvas.height = videoRef.current.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const dataFotoBase64 = canvas.toDataURL('image/jpeg', 0.6);

            const response = await fetch(`${API_BASE}/absen`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    karyawan_id: userSession.karyawan_id,
                    nama: userSession.nama,
                    status: statusAbsen,
                    shift: selectedShift,
                    foto: dataFotoBase64,
                    latitude: lokasi.latitude,
                    longitude: lokasi.longitude,
                    alamat: lokasi.alamat
                })
            });

            const result = await response.json();
            if (response.status === 201) {
                // Tampilkan modal kustom (Bukan alert browser atas lagi)
                setModalData({
                    waktu: new Date(result.data.waktu_absen).toLocaleTimeString('id-ID'),
                    keterangan: result.data.keterangan,
                    status: result.data.status
                });
                // Update status hari ini secara langsung, supaya tombol yang baru dipakai
                // langsung terkunci tanpa perlu fetch ulang ke server.
                setStatusHariIni(prev => ({
                    sudahMasuk: prev.sudahMasuk || statusAbsen === 'Masuk',
                    sudahPulang: prev.sudahPulang || statusAbsen === 'Pulang',
                    shift: prev.shift || (statusAbsen === 'Masuk' ? selectedShift : prev.shift)
                }));
            } else if (response.status === 400 && result.message) {
                // Kasus race-condition: misal 2 tab dibuka bersamaan, atau status hari ini
                // belum sempat termuat sebelum user klik. Server tetap jadi penjaga terakhir.
                alert(`⚠️ ${result.message}`);
                muatStatusHariIni(); // sinkronkan ulang tombol biar tidak nyangkut salah kunci
            }
        } catch (error) {
            alert('❌ Terjadi kesalahan sistem.');
        } finally {
            setLoading(false);
        }
    };

    // User menekan "Lanjutkan" di modal konfirmasi terlambat → tutup modal, lanjut proses absen
    const lanjutkanAbsenTelat = () => {
        const statusAbsen = konfirmasiTelat && konfirmasiTelat.statusAbsen;
        setKonfirmasiTelat(null);
        if (statusAbsen) prosesAbsen(statusAbsen);
    };

    // User menekan "Batal" di modal konfirmasi terlambat → tutup modal, absen dibatalkan
    const batalkanAbsenTelat = () => setKonfirmasiTelat(null);

    if (!isLoggedIn) {
        return (
            <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 px-5">
                <div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm">
                    <div class="text-center mb-6">
                        <h1 class="text-3xl font-extrabold text-blue-600 tracking-wider">SETNET</h1>
                        <p class="text-sm text-gray-400 mt-1">Portal Absensi Karyawan & Teknisi</p>
                    </div>
                    {pesan && <div class="p-3 rounded-xl text-xs font-bold mb-4 text-center bg-red-100 text-red-800">{pesan}</div>}
                    <form onSubmit={handleLogin} class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ID Karyawan</label>
                            <input type="text" placeholder="Masukkan ID" value={karyawanId} onChange={e => setKaryawanId(e.target.value)} class="w-full px-4 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} class="w-full px-4 py-3 border border-gray-250 rounded-xl outline-none text-sm font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <button type="submit" disabled={loading} class="w-full bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-400 text-sm">
                            {loading ? 'Memvalidasi...' : 'MASUK KE SISTEM'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    let konten;
    if (tabAktif === 'Absensi') {
        konten = (
            <AbsensiPanel
                userSession={userSession}
                onBack={() => setTabAktif('Menu')}
                videoRef={videoRef}
                selectedShift={selectedShift}
                setSelectedShift={setSelectedShift}
                loading={loading}
                handleAbsen={handleAbsen}
                modalData={modalData}
                setModalData={setModalData}
                onSelesai={() => { setModalData(null); setTabAktif('Menu'); }}
                konfirmasiTelat={konfirmasiTelat}
                onLanjutkanTelat={lanjutkanAbsenTelat}
                onBatalkanTelat={batalkanAbsenTelat}
                lokasi={lokasi}
                cariLokasi={cariLokasi}
                statusHariIni={statusHariIni}
                statusHariIniLoading={statusHariIniLoading}
            />
        );
    } else if (tabAktif === 'Form') {
        konten = <PengajuanPanel userSession={userSession} onBack={() => setTabAktif('Menu')} />;
    } else if (tabAktif === 'Riwayat') {
        konten = <RiwayatAbsensiPanel userSession={userSession} onBack={() => setTabAktif('Menu')} />;
    } else if (tabAktif === 'Notifikasi') {
        konten = <NotifikasiPanel userSession={userSession} onBack={() => setTabAktif('Menu')} />;
    } else {
        konten = <MenuDashboard userSession={userSession} onNavigate={setTabAktif} onLogout={requestLogout} />;
    }

    return (
        <div class="min-h-screen w-full bg-gray-50">
            <div class="max-w-2xl mx-auto" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}>
                <div class={tabAktif === 'Menu' ? '' : 'px-4 pt-4'}>
                    {konten}
                </div>
            </div>

            <BottomNav tabAktif={tabAktif} onNavigate={setTabAktif} notifBelumDibaca={notifBelumDibacaNav} />

            {/* MODAL KONFIRMASI LOGOUT */}
            {showLogoutConfirm && (
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
                        <div class="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <IconLogOut className="w-6 h-6" />
                        </div>
                        <h3 class="text-lg font-black text-gray-900">Keluar dari Akun?</h3>
                        <p class="text-xs text-gray-400 mt-1 mb-5">Anda perlu login kembali dengan ID Karyawan &amp; Password untuk mengakses sistem absensi.</p>
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setShowLogoutConfirm(false)} class="w-full bg-gray-100 active:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition text-sm">
                                Batal
                            </button>
                            <button type="button" onClick={handleLogout} class="w-full bg-red-600 active:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-md transition text-sm">
                                Ya, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppAbsensi />);