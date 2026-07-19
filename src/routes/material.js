const express = require('express');
const Material = require('../models/Material');
const PemakaianMaterial = require('../models/PemakaianMaterial');
const MaterialStokLog = require('../models/MaterialStokLog');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Role yang boleh KELOLA (CRUD master, input log pemakaian/stok): admin, gudang, owner, hrd (akses penuh).
// Role yang boleh LIHAT SAJA: sama dengan yang boleh kelola — finance TIDAK lagi punya akses
// modul Material sesuai pembagian tugas terbaru (finance fokus ke Keuangan/Invoice/Tracking BAST).
const MANAGE_ROLES = requireRole('admin', 'gudang', 'owner', 'hrd');
const VIEW_ROLES = requireRole('admin', 'gudang', 'owner', 'hrd');

// Helper: sesuaikan stok Material +/- delta, tidak boleh sampai minus.
async function ubahStok(materialId, delta) {
  const material = await Material.findById(materialId);
  if (!material) throw new Error('Material tidak ditemukan');
  const stokBaru = material.stock + delta;
  if (stokBaru < 0) {
    throw new Error(`Stok tidak cukup. Sisa stok "${material.nama}" saat ini: ${material.stock} ${material.satuan}.`);
  }
  material.stock = stokBaru;
  await material.save();
  return material;
}

// ==================== MASTER DATA MATERIAL (CRUD) — tabel "MATRIAL MASUK" di Excel ====================

// --- DAFTAR SELURUH MATERIAL (filter opsional ?kategori=Kabel) ---
router.get('/material', VIEW_ROLES, async (req, res) => {
  try {
    const { kategori } = req.query;
    const filter = {};
    if (kategori) filter.kategori = kategori;
    const data = await Material.find(filter).sort({ kategori: 1, nama: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data material', error: error.message });
  }
});

// --- TAMBAH JENIS MATERIAL BARU (ex: Kabel "100 M", stok awal 15) ---
router.post('/material', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, nama, satuan, stock_awal, keterangan } = req.body;
    if (!nama) {
      return res.status(400).json({ message: 'Nama/jenis material wajib diisi!' });
    }
    const stokAwalNum = Number(stock_awal) || 0;
    const dibuat_oleh = req.header('x-user-id') || '';

    const materialBaru = new Material({
      kategori: kategori || 'Kabel',
      nama,
      satuan: satuan || 'Roll',
      stock_awal: stokAwalNum,
      stock: stokAwalNum, // saat pertama dibuat, stok terkini = stok awal
      keterangan: keterangan || '',
      dibuat_oleh
    });
    await materialBaru.save();
    res.status(201).json({ message: 'Material berhasil ditambahkan', data: materialBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan material', error: error.message });
  }
});

// --- EDIT MATERIAL (nama/kategori/satuan/keterangan). Untuk edit stok_awal juga boleh
//     lewat sini (mis. koreksi input awal), TAPI tidak otomatis mengubah stock terkini. ---
router.put('/material/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, nama, satuan, stock_awal, keterangan } = req.body;
    const updateData = { kategori, nama, satuan, keterangan };
    if (stock_awal !== undefined && stock_awal !== null) updateData.stock_awal = Number(stock_awal);

    const diupdate = await Material.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!diupdate) return res.status(404).json({ message: 'Material tidak ditemukan' });
    res.status(200).json({ message: 'Material berhasil diperbarui', data: diupdate });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui material', error: error.message });
  }
});

// --- HAPUS MATERIAL ---
router.delete('/material/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const dihapus = await Material.findByIdAndDelete(req.params.id);
    if (!dihapus) return res.status(404).json({ message: 'Material tidak ditemukan' });
    res.status(200).json({ message: 'Material berhasil dihapus', data: { _id: dihapus._id } });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus material', error: error.message });
  }
});

// ==================== LOG PEMAKAIAN PER TEKNISI — tabel utama Excel (kolom A:G) ====================

// --- DAFTAR LOG PEMAKAIAN (filter opsional: nama_team, kabel_id, status, dari/sampai tanggal) ---
router.get('/pemakaian-material', VIEW_ROLES, async (req, res) => {
  try {
    const { nama_team, kabel_id, status, dari, sampai } = req.query;
    const filter = {};
    if (nama_team) filter.nama_team = new RegExp(nama_team, 'i');
    if (kabel_id) filter.kabel_id = kabel_id;
    if (status && ['Terpakai', 'Idle'].includes(status)) filter.status = status;
    if (dari || sampai) {
      filter.tanggal_pengambilan = {};
      if (dari) filter.tanggal_pengambilan.$gte = new Date(dari);
      if (sampai) filter.tanggal_pengambilan.$lte = new Date(sampai + 'T23:59:59');
    }
    const data = await PemakaianMaterial.find(filter).sort({ tanggal_pengambilan: -1, createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil log pemakaian material', error: error.message });
  }
});

// --- TAMBAH BARIS LOG BARU (1 baris = 1 unit ONT + kabel yang dipakai teknisi) ---
// Kalau status "Terpakai" langsung saat input, stok kabel terkait otomatis berkurang 1.
// Kalau status "Idle", stok BELUM berkurang (baru dianggap terpakai kalau nanti diedit ke "Terpakai").
router.post('/pemakaian-material', MANAGE_ROLES, async (req, res) => {
  try {
    const {
      tanggal_pengambilan, teknisi_id, nama_team, merek_modem, sn_ont,
      kabel_id, status, return_catatan
    } = req.body;

    if (!nama_team || !kabel_id) {
      return res.status(400).json({ message: 'Nama team dan jenis kabel wajib diisi!' });
    }
    const statusFinal = ['Terpakai', 'Idle'].includes(status) ? status : 'Idle';

    const kabel = await Material.findById(kabel_id);
    if (!kabel) return res.status(404).json({ message: 'Jenis kabel tidak ditemukan di master material' });

    if (statusFinal === 'Terpakai') {
      await ubahStok(kabel_id, -1);
    }

    const dibuat_oleh = req.header('x-user-id') || '';
    const logBaru = new PemakaianMaterial({
      tanggal_pengambilan: tanggal_pengambilan ? new Date(tanggal_pengambilan) : new Date(),
      teknisi_id: teknisi_id || '',
      nama_team,
      merek_modem: merek_modem || '',
      sn_ont: sn_ont || '',
      kabel_id,
      kabel_nama: kabel.nama,
      status: statusFinal,
      return_catatan: return_catatan || '',
      dibuat_oleh
    });
    await logBaru.save();
    res.status(201).json({ message: 'Log pemakaian material berhasil disimpan', data: logBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyimpan log pemakaian material', error: error.message });
  }
});

// --- EDIT BARIS LOG (mis. status Idle -> Terpakai, ganti jenis kabel, dll) ---
// Stok otomatis dikoreksi sesuai perubahan status/jenis kabel supaya tetap akurat.
router.put('/pemakaian-material/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const log = await PemakaianMaterial.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log tidak ditemukan' });

    const {
      tanggal_pengambilan, teknisi_id, nama_team, merek_modem, sn_ont,
      kabel_id, status, return_catatan
    } = req.body;

    const kabelIdBaru = kabel_id || String(log.kabel_id);
    const statusBaru = ['Terpakai', 'Idle'].includes(status) ? status : log.status;
    const kabelBerubah = kabelIdBaru !== String(log.kabel_id);

    // Balikkan dulu efek stok dari kondisi LAMA, baru terapkan efek stok yang BARU.
    if (log.status === 'Terpakai') {
      await ubahStok(log.kabel_id, +1); // kembalikan stok lama
    }
    let kabelBaruDoc = null;
    if (statusBaru === 'Terpakai') {
      kabelBaruDoc = await ubahStok(kabelIdBaru, -1); // potong stok baru
    } else if (kabelBerubah) {
      kabelBaruDoc = await Material.findById(kabelIdBaru);
      if (!kabelBaruDoc) return res.status(404).json({ message: 'Jenis kabel tidak ditemukan di master material' });
    }

    if (tanggal_pengambilan) log.tanggal_pengambilan = new Date(tanggal_pengambilan);
    if (teknisi_id !== undefined) log.teknisi_id = teknisi_id;
    if (nama_team) log.nama_team = nama_team;
    if (merek_modem !== undefined) log.merek_modem = merek_modem;
    if (sn_ont !== undefined) log.sn_ont = sn_ont;
    if (return_catatan !== undefined) log.return_catatan = return_catatan;
    log.status = statusBaru;
    log.kabel_id = kabelIdBaru;
    log.kabel_nama = kabelBaruDoc ? kabelBaruDoc.nama : log.kabel_nama;

    await log.save();
    res.status(200).json({ message: 'Log pemakaian material berhasil diperbarui', data: log });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui log pemakaian material', error: error.message });
  }
});

// --- HAPUS BARIS LOG (stok otomatis dikembalikan kalau baris itu berstatus "Terpakai") ---
router.delete('/pemakaian-material/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const log = await PemakaianMaterial.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log tidak ditemukan' });

    if (log.status === 'Terpakai') {
      await ubahStok(log.kabel_id, +1);
    }
    await PemakaianMaterial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Log pemakaian material berhasil dihapus & stok disesuaikan kembali' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus log pemakaian material', error: error.message });
  }
});

// ==================== LOG STOK MASUK / DIKEMBALIKAN (angka bersih, terpisah dari kolom RETURN) ====================

// --- CATAT PENAMBAHAN (restock) ATAU PENGEMBALIAN (sisa kabel balik dari teknisi) ---
router.post('/material/stok', MANAGE_ROLES, async (req, res) => {
  try {
    const { material_id, tipe, jumlah, teknisi_id, teknisi_nama, keterangan, tanggal } = req.body;
    if (!material_id || !tipe || !jumlah) {
      return res.status(400).json({ message: 'Material, tipe, dan jumlah wajib diisi!' });
    }
    if (!['Penambahan', 'Pengembalian'].includes(tipe)) {
      return res.status(400).json({ message: 'Tipe harus "Penambahan" atau "Pengembalian"' });
    }
    const jumlahNum = Number(jumlah);
    if (jumlahNum <= 0) {
      return res.status(400).json({ message: 'Jumlah harus lebih dari 0' });
    }
    if (tipe === 'Pengembalian' && (!teknisi_id || !teknisi_nama)) {
      return res.status(400).json({ message: 'Pengembalian wajib mencantumkan teknisi asal barang' });
    }

    const material = await ubahStok(material_id, +jumlahNum);

    const dibuat_oleh = req.header('x-user-id') || '';
    const logBaru = new MaterialStokLog({
      material_id,
      material_nama: material.nama,
      tipe,
      jumlah: jumlahNum,
      teknisi_id: teknisi_id || '',
      teknisi_nama: teknisi_nama || '',
      keterangan: keterangan || '',
      tanggal: tanggal ? new Date(tanggal) : new Date(),
      dibuat_oleh
    });
    await logBaru.save();
    res.status(201).json({ message: `${tipe} material berhasil dicatat`, data: logBaru, stock_terkini: material.stock });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencatat mutasi stok material', error: error.message });
  }
});

// --- DAFTAR LOG STOK MASUK/DIKEMBALIKAN (filter opsional: material_id, tipe) ---
router.get('/material/stok', VIEW_ROLES, async (req, res) => {
  try {
    const { material_id, tipe } = req.query;
    const filter = {};
    if (material_id) filter.material_id = material_id;
    if (tipe && ['Penambahan', 'Pengembalian'].includes(tipe)) filter.tipe = tipe;
    const data = await MaterialStokLog.find(filter).sort({ tanggal: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil log stok material', error: error.message });
  }
});

// ==================== REPORT — replika tabel ringkasan Excel + rekap per teknisi ====================

// GET /material/report -> persis tabel I4:L8 di Excel (Kabel | Stok Awal | Idle | Terpakai),
// ditambah total Penambahan & Pengembalian, dan rekap total pemakaian per teknisi/team.
router.get('/material/report', VIEW_ROLES, async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    const filterTanggal = {};
    if (dari || sampai) {
      filterTanggal.tanggal_pengambilan = {};
      if (dari) filterTanggal.tanggal_pengambilan.$gte = new Date(dari);
      if (sampai) filterTanggal.tanggal_pengambilan.$lte = new Date(sampai + 'T23:59:59');
    }

    const semuaMaterial = await Material.find().sort({ kategori: 1, nama: 1 });
    const semuaPemakaian = await PemakaianMaterial.find(filterTanggal);
    const semuaStokLog = await MaterialStokLog.find();

    const perMaterial = semuaMaterial.map(m => {
      const logMaterialIni = semuaPemakaian.filter(l => String(l.kabel_id) === String(m._id));
      const totalTerpakai = logMaterialIni.filter(l => l.status === 'Terpakai').length;
      const totalIdle = logMaterialIni.filter(l => l.status === 'Idle').length;
      const totalDitambah = semuaStokLog
        .filter(l => String(l.material_id) === String(m._id) && l.tipe === 'Penambahan')
        .reduce((total, l) => total + l.jumlah, 0);
      const totalDikembalikan = semuaStokLog
        .filter(l => String(l.material_id) === String(m._id) && l.tipe === 'Pengembalian')
        .reduce((total, l) => total + l.jumlah, 0);

      return {
        material_id: m._id,
        kategori: m.kategori,
        nama: m.nama,
        satuan: m.satuan,
        stock_awal: m.stock_awal,
        total_terpakai: totalTerpakai,
        total_idle_belum_terpakai: totalIdle,
        total_ditambah: totalDitambah,
        total_dikembalikan: totalDikembalikan,
        stock_terkini: m.stock
      };
    });

    // Rekap per teknisi/team (total unit ONT+kabel yang sudah resmi "Terpakai")
    const perTeamMap = {};
    semuaPemakaian.filter(l => l.status === 'Terpakai').forEach(l => {
      const key = l.teknisi_id || l.nama_team;
      if (!perTeamMap[key]) {
        perTeamMap[key] = { teknisi_id: l.teknisi_id, nama_team: l.nama_team, total_unit_terpakai: 0 };
      }
      perTeamMap[key].total_unit_terpakai += 1;
    });

    res.status(200).json({
      perMaterial,
      perTeam: Object.values(perTeamMap).sort((a, b) => b.total_unit_terpakai - a.total_unit_terpakai)
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil report material', error: error.message });
  }
});

module.exports = router;