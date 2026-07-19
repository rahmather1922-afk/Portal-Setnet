const API_BASE = '/api';

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

function StatusBadge({ status }) {
    const map = {
        Pending: 'bg-amber-100 text-amber-700',
        Disetujui: 'bg-green-100 text-green-700',
        Ditolak: 'bg-red-100 text-red-700'
    };
    return <span class={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

// Header kecil dipakai di semua sub-halaman (tombol kembali ke menu utama)
function SubHeader({ title, onBack }) {
    return (
        <div class="flex items-center gap-2 mb-4">
            <button onClick={onBack} type="button" class="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 transition">
                ←
            </button>
            <h2 class="text-base font-black text-gray-900">{title}</h2>
        </div>
    );
}

// ==================== MENU UTAMA (DASHBOARD) ====================
function MenuDashboard({ userSession, onNavigate, onLogout }) {
    const [rekap, setRekap] = React.useState({ hadir: 0, terlambat: 0 });
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

                setRekap({ hadir, terlambat });
            } catch (err) { /* diam-diam gagal, rekap tetap 0 */ }
        })();
        return () => { batal = true; };
    }, []);

    const MENU_ITEMS = [
        { key: 'Absensi', label: 'Absensi', icon: '📷', bg: 'bg-blue-100 text-blue-600' },
        { key: 'Form', label: 'Form', icon: '📝', bg: 'bg-violet-100 text-violet-600' },
        { key: 'Riwayat', label: 'Riwayat Absensi', icon: '🕒', bg: 'bg-amber-100 text-amber-600' },
        { key: 'Logout', label: 'Logout', icon: '🚪', bg: 'bg-red-100 text-red-600' },
    ];

    return (
        <div class="w-full">
            <div class="bg-blue-900 rounded-2xl px-5 pt-5 pb-8 shadow-xl relative overflow-hidden">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-white font-black tracking-wide text-sm">SATNET <span class="text-blue-300">Mobile</span></span>
                    <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">🔔</span>
                </div>
                <h1 class="text-white font-black text-lg leading-tight">{userSession.nama}</h1>
                <p class="text-blue-200 text-xs font-mono font-bold mb-1">ID: {userSession.karyawan_id}</p>
                <p class="text-blue-100 text-xs">Selamat {sapaanWaktu()}, semoga pekerjaan hari ini lancar ya, selamat bekerja.</p>
            </div>

            <div class="bg-white -mt-5 rounded-2xl shadow-lg border border-gray-100 p-5 relative z-10">
                <h3 class="text-xs font-black text-gray-500 uppercase mb-3 tracking-wide">Pilih Menu</h3>
                <div class="grid grid-cols-4 gap-2 mb-6">
                    {MENU_ITEMS.map(item => (
                        <button key={item.key} type="button"
                            onClick={() => item.key === 'Logout' ? onLogout() : onNavigate(item.key)}
                            class="flex flex-col items-center gap-1.5 group">
                            <span class={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${item.bg} group-active:scale-95 transition`}>
                                {item.icon}
                            </span>
                            <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-black text-gray-500 uppercase tracking-wide">Kehadiran Bulan Ini</h3>
                    <button type="button" onClick={() => onNavigate('Riwayat')} class="text-[11px] font-bold text-blue-600">Lainnya</button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <p class="text-[10px] font-bold text-blue-500 uppercase mb-2">Kehadiran</p>
                        <p class="text-2xl font-black text-blue-700">{rekap.hadir}</p>
                        <p class="text-[10px] text-blue-400 font-semibold">Total Kehadiran</p>
                    </div>
                    <div class="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p class="text-[10px] font-bold text-amber-600 uppercase mb-2">Terlambat</p>
                        <p class="text-2xl font-black text-amber-700">{rekap.terlambat}</p>
                        <p class="text-[10px] text-amber-500 font-semibold">Total Terlambat</p>
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
        <div class="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 w-full">
            <SubHeader title="Riwayat Absensi" onBack={onBack} />

            <div class="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl px-3 py-2 mb-4">
                <button type="button" onClick={() => gantiBulan(-1)} class="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 font-bold text-sm">‹</button>
                <span class="text-xs font-black text-gray-700 uppercase">{labelBulan}</span>
                <button type="button" onClick={() => gantiBulan(1)} disabled={bulanIniAdalahSekarang}
                    class={`w-7 h-7 rounded-full border font-bold text-sm ${bulanIniAdalahSekarang ? 'bg-gray-100 border-gray-150 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>›</button>
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
            <div class="space-y-2 max-h-80 overflow-y-auto">
                {loading && <p class="text-xs text-gray-400 text-center py-4">Memuat riwayat...</p>}
                {!loading && gagal && (
                    <div class="text-center py-4">
                        <p class="text-xs text-red-500 mb-2">Gagal memuat riwayat absensi.</p>
                        <button type="button" onClick={muatRiwayat} class="text-xs font-bold text-blue-600 underline">Coba Lagi</button>
                    </div>
                )}
                {!loading && !gagal && daftarHarian.length === 0 && (
                    <p class="text-xs text-gray-400 text-center py-4">Belum ada absensi di bulan ini.</p>
                )}
                {!loading && daftarHarian.map(h => (
                    <div key={h.tanggal.toDateString()} class="bg-gray-50 border border-gray-150 rounded-xl p-3">
                        <div class="flex justify-between items-center mb-1.5">
                            <span class="text-xs font-black text-gray-800">{h.tanggal.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                            {h.masuk && h.masuk.keterangan && (
                                <span class={`text-[10px] font-black uppercase ${h.masuk.keterangan === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>{h.masuk.keterangan}</span>
                            )}
                        </div>
                        <div class="flex gap-4 text-[11px] font-semibold text-gray-500">
                            <span>Masuk: <b class="text-gray-800 font-mono">{h.masuk ? new Date(h.masuk.waktu_absen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</b></span>
                            <span>Pulang: <b class="text-gray-800 font-mono">{h.pulang ? new Date(h.pulang.waktu_absen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</b></span>
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
        setLoading(true); setPesan('');
        try {
            const response = await fetch(`${API_BASE}/kasbon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    karyawan_id: userSession.karyawan_id,
                    nama: userSession.nama,
                    jumlah: Number(jumlahKasbon),
                    alasan: alasanKasbon
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                setPesan('✅ ' + data.message);
                setJumlahKasbon(''); setAlasanKasbon('');
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

    const JENIS_LIST = ['Kasbon', 'Cuti', 'Izin', 'Sakit'];

    return (
        <div class="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 w-full">
            <SubHeader title="Form Pengajuan" onBack={onBack} />

            <div class="grid grid-cols-4 gap-1.5 mb-4">
                {JENIS_LIST.map(j => (
                    <button key={j} type="button" onClick={() => { setJenisAktif(j); setPesan(''); }}
                        class={`py-2 rounded-lg text-[11px] font-bold border transition ${jenisAktif === j ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {j}
                    </button>
                ))}
            </div>

            {pesan && <div class="p-2.5 rounded-xl text-xs font-bold mb-3 text-center bg-gray-50 border border-gray-150">{pesan}</div>}

            {jenisAktif === 'Kasbon' ? (
                <div>
                    {limitInfo && (
                        <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-xs font-semibold text-blue-900 space-y-1">
                            <div class="flex justify-between"><span>Limit Kasbon Anda</span><span>{formatRupiah(limitInfo.limit)}</span></div>
                            <div class="flex justify-between"><span>Sedang Terpakai</span><span>{formatRupiah(limitInfo.terpakai)}</span></div>
                            <div class="flex justify-between font-black"><span>Sisa Limit</span><span>{formatRupiah(limitInfo.sisa)}</span></div>
                        </div>
                    )}
                    <form onSubmit={ajukanKasbon} class="space-y-3 mb-5">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Jumlah Kasbon (Rp)</label>
                            <input type="number" min="1" placeholder="cth: 500000" value={jumlahKasbon} onChange={e => setJumlahKasbon(e.target.value)} class="w-full px-4 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Alasan / Keperluan</label>
                            <textarea placeholder="Jelaskan keperluan kasbon..." value={alasanKasbon} onChange={e => setAlasanKasbon(e.target.value)} class="w-full px-4 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" rows="2"></textarea>
                        </div>
                        <button type="submit" disabled={loading} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition disabled:bg-gray-400 text-sm">
                            {loading ? 'Mengirim...' : 'AJUKAN KASBON'}
                        </button>
                    </form>

                    <h3 class="text-xs font-black text-gray-500 uppercase mb-2">Riwayat Kasbon</h3>
                    <div class="space-y-2 max-h-64 overflow-y-auto">
                        {riwayatKasbon.length === 0 && <p class="text-xs text-gray-400 text-center py-3">Belum ada pengajuan kasbon.</p>}
                        {riwayatKasbon.map(k => (
                            <div key={k._id} class="bg-gray-50 border border-gray-150 rounded-xl p-3">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-black text-sm text-gray-900">{formatRupiah(k.jumlah)}</span>
                                    <StatusBadge status={k.status} />
                                </div>
                                {k.alasan && <p class="text-xs text-gray-500 mb-1">{k.alasan}</p>}
                                <p class="text-[10px] font-mono text-gray-400">{new Date(k.tanggal_pengajuan).toLocaleDateString('id-ID')}</p>
                                {k.status === 'Disetujui' && <p class="text-[10px] font-bold mt-1 text-green-700">{k.lunas ? '✔ Lunas' : '⏳ Belum lunas / akan dipotong gaji'}</p>}
                                {k.status === 'Ditolak' && k.catatan_admin && <p class="text-[10px] mt-1 text-red-600">Catatan: {k.catatan_admin}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <form onSubmit={ajukanCutiIzinSakit} class="space-y-3 mb-5">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tgl Mulai</label>
                                <input type="date" value={tglMulai} onChange={e => setTglMulai(e.target.value)} class="w-full px-3 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tgl Selesai</label>
                                <input type="date" value={tglSelesai} onChange={e => setTglSelesai(e.target.value)} class="w-full px-3 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Alasan</label>
                            <textarea placeholder={`Jelaskan alasan ${jenisAktif.toLowerCase()}...`} value={alasanCIS} onChange={e => setAlasanCIS(e.target.value)} class="w-full px-4 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" rows="2"></textarea>
                        </div>
                        <button type="submit" disabled={loading} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition disabled:bg-gray-400 text-sm">
                            {loading ? 'Mengirim...' : `AJUKAN ${jenisAktif.toUpperCase()}`}
                        </button>
                    </form>

                    <h3 class="text-xs font-black text-gray-500 uppercase mb-2">Riwayat {jenisAktif}</h3>
                    <div class="space-y-2 max-h-64 overflow-y-auto">
                        {riwayatPengajuan.filter(p => p.jenis === jenisAktif).length === 0 && (
                            <p class="text-xs text-gray-400 text-center py-3">Belum ada pengajuan {jenisAktif.toLowerCase()}.</p>
                        )}
                        {riwayatPengajuan.filter(p => p.jenis === jenisAktif).map(p => (
                            <div key={p._id} class="bg-gray-50 border border-gray-150 rounded-xl p-3">
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
function AbsensiPanel({ userSession, onBack, videoRef, selectedShift, setSelectedShift, loading, handleAbsen, modalData, setModalData, onSelesai }) {
    return (
        <div class="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 text-center w-full relative">
            <SubHeader title="Absensi" onBack={onBack} />
            <p class="text-xs font-mono font-bold text-gray-400 mb-4">{userSession.nama} · ID: {userSession.karyawan_id}</p>

            <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-inner border border-gray-200">
                <video ref={videoRef} autoPlay playsInline muted class="w-full h-full object-cover transform -scale-x-100"></video>
                <div class="absolute bottom-2 left-2 bg-black/60 text-[10px] text-white px-2 py-0.5 rounded font-mono font-bold">📷 LIVE CAMERA ACTIVE</div>
            </div>

            <div class="mb-5 text-left bg-gray-50 p-3 rounded-xl border border-gray-150">
                <label class="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-wide text-center">PILIH JADWAL SHIFT ANDA HARI INI:</label>
                <div class="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setSelectedShift('Shift 1')} class={`py-2 rounded-lg text-xs font-bold border transition ${selectedShift === 'Shift 1' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200'}`}>
                        Shift 1 <span class="block text-[9px] font-medium opacity-80">07:00</span>
                    </button>
                    <button type="button" onClick={() => setSelectedShift('Shift 2')} class={`py-2 rounded-lg text-xs font-bold border transition ${selectedShift === 'Shift 2' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200'}`}>
                        Shift 2 <span class="block text-[9px] font-medium opacity-80">15:00</span>
                    </button>
                    <button type="button" onClick={() => setSelectedShift('Non-Shift')} class={`py-2 rounded-lg text-xs font-bold border transition ${selectedShift === 'Non-Shift' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200'}`}>
                        Regular <span class="block text-[9px] font-medium opacity-80">09:00</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <button onClick={() => handleAbsen('Masuk')} disabled={loading} class="bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-300 text-sm">
                    {loading ? 'Memproses...' : 'ABSEN MASUK'}
                </button>
                <button onClick={() => handleAbsen('Pulang')} disabled={loading} class="bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-300 text-sm">
                    {loading ? 'Memproses...' : 'ABSEN PULANG'}
                </button>
            </div>

            {/* MODAL NOTIFIKASI MODERN DI TENGAH LAYAR */}
            {modalData && (
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center transform scale-100 transition-all">
                        <div class="w-16 h-16 bg-green-150 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-3">✓</div>
                        <h3 class="text-xl font-black text-gray-900">ABSEN BERHASIL!</h3>
                        <p class="text-xs text-gray-400 mt-0.5 font-medium">Data absensi Anda telah masuk ke sistem utama</p>

                        <div class="my-4 bg-gray-50 rounded-xl p-3 text-left border border-gray-200 space-y-1.5 text-xs font-semibold">
                            <div class="flex justify-between"><span class="text-gray-400">Status Log:</span> <span class="text-blue-600 uppercase font-black">{modalData.status}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Jam Log:</span> <span class="text-gray-800 font-mono font-bold">{modalData.waktu} WIB</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Keterangan:</span> <span class={modalData.keterangan === 'Normal' ? 'text-green-600' : 'text-red-600'}>{modalData.keterangan}</span></div>
                        </div>

                        <button onClick={onSelesai} class="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl transition shadow-md text-sm">
                            Selesai & Lanjutkan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function AppAbsensi() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userSession, setUserSession] = React.useState(null);
    const [tabAktif, setTabAktif] = React.useState('Menu'); // Menu | Absensi | Form | Riwayat

    const [karyawanId, setKaryawanId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pesan, setPesan] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [selectedShift, setSelectedShift] = React.useState('Shift 1');
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);

    // State baru untuk Modal Notification Kustom
    const [modalData, setModalData] = React.useState(null);

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
            } else {
                setPesan(`❌ ${data.message}`);
            }
        } catch (error) { setPesan('❌ Gangguan koneksi'); }
        finally { setLoading(false); }
    };

    const handleLogout = () => {
        if (!confirm('Yakin ingin logout dari sesi ini?')) return;
        matikanKamera();
        setIsLoggedIn(false);
        setUserSession(null);
        setTabAktif('Menu');
        setKaryawanId('');
        setPassword('');
    };

    // Kamera hanya aktif ketika berada di halaman Absensi
    React.useEffect(() => {
        if (isLoggedIn && tabAktif === 'Absensi') {
            bukaKamera();
        } else {
            matikanKamera();
        }
        return () => matikanKamera();
    }, [isLoggedIn, tabAktif]);

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
                    foto: dataFotoBase64
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
            }
        } catch (error) {
            alert('❌ Terjadi kesalahan sistem.');
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-extrabold text-blue-600 tracking-wider">SATNET</h1>
                    <p class="text-sm text-gray-400 mt-1">Portal Absensi Karyawan & Teknisi</p>
                </div>
                {pesan && <div class="p-3 rounded-xl text-xs font-bold mb-4 text-center bg-red-100 text-red-800">{pesan}</div>}
                <form onSubmit={handleLogin} class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ID Karyawan</label>
                        <input type="text" placeholder="Masukkan ID" value={karyawanId} onChange={e => setKaryawanId(e.target.value)} class="w-full px-4 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} class="w-full px-4 py-2.5 border border-gray-250 rounded-xl outline-none text-sm font-semibold" />
                    </div>
                    <button type="submit" disabled={loading} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition disabled:bg-gray-400 text-sm">
                        {loading ? 'Memvalidasi...' : 'MASUK KE SISTEM'}
                    </button>
                </form>
            </div>
        );
    }

    if (tabAktif === 'Absensi') {
        return (
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
            />
        );
    }

    if (tabAktif === 'Form') {
        return <PengajuanPanel userSession={userSession} onBack={() => setTabAktif('Menu')} />;
    }

    if (tabAktif === 'Riwayat') {
        return <RiwayatAbsensiPanel userSession={userSession} onBack={() => setTabAktif('Menu')} />;
    }

    return <MenuDashboard userSession={userSession} onNavigate={setTabAktif} onLogout={handleLogout} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppAbsensi />);
