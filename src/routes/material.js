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

// Helper: bersihkan daftar SN ONT dari input user -> trim, buang kosong, buang duplikat
// (case-insensitive tapi simpan casing asli entri pertama yang muncul).
function bersihkanSnList(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  const hasil = [];
  input.forEach(sn => {
    const v = String(sn || '').trim();
    if (!v) return;
    const key = v.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    hasil.push(v);
  });
  return hasil;
}

// Helper: escape karakter spesial regex, dipakai buat pencarian nama material case-insensitive
// yang AMAN (supaya nama yang mengandung karakter regex seperti "." tidak error/salah match).
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- TAMBAH JENIS MATERIAL BARU (ex: Kabel "100 M" qty 15 roll, atau ONT "ZTE" qty 10 unit
//     sekaligus daftar SN-nya). Dibuat langsung dari halaman Master Material — TIDAK ada lagi
//     halaman "Stok Masuk/Kembali" terpisah, jadi qty di sini otomatis jadi stok awal & stok
//     terkini material saat pertama dibuat.
//     KALAU jenis material (kategori + nama, case-insensitive) SUDAH ADA -> jangan buat baris baru,
//     cukup TAMBAHKAN qty ke stock_awal & stock yang sudah ada (dan gabung sn_list kalau ONT),
//     supaya daftar Master Material tetap rapi 1 baris per jenis (ex: input "80 M" qty 3, lalu
//     input "80 M" qty 5 lagi -> otomatis jadi 1 baris "80 M" dengan stok 8, bukan 2 baris). ---
router.post('/material', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, nama, satuan, stock_awal, keterangan, sn_list } = req.body;
    if (!nama) {
      return res.status(400).json({ message: 'Nama/jenis material wajib diisi!' });
    }
    const stokAwalNum = Math.max(0, Number(stock_awal) || 0);
    const dibuat_oleh = req.header('x-user-id') || '';
    const kategoriFinal = kategori || 'Kabel';
    const namaTrim = String(nama).trim();

    const existing = await Material.findOne({
      kategori: kategoriFinal,
      nama: { $regex: `^${escapeRegex(namaTrim)}$`, $options: 'i' }
    });

    if (existing) {
      existing.stock_awal += stokAwalNum;
      existing.stock += stokAwalNum;
      if (kategoriFinal === 'ONT' && Array.isArray(sn_list) && sn_list.length > 0) {
        existing.sn_list = bersihkanSnList([...(existing.sn_list || []), ...sn_list]);
      }
      if (satuan) existing.satuan = satuan;
      if (keterangan) existing.keterangan = keterangan;
      await existing.save();
      return res.status(200).json({
        message: `"${existing.nama}" sudah ada di Master Material, stok otomatis ditambahkan +${stokAwalNum}. Total sekarang: ${existing.stock} ${existing.satuan}.`,
        data: existing,
        merged: true
      });
    }

    const materialBaru = new Material({
      kategori: kategoriFinal,
      nama: namaTrim,
      satuan: satuan || 'Roll',
      stock_awal: stokAwalNum,
      stock: stokAwalNum, // saat pertama dibuat, stok terkini = stok awal (qty yang diinput)
      sn_list: kategoriFinal === 'ONT' ? bersihkanSnList(sn_list) : [],
      keterangan: keterangan || '',
      dibuat_oleh
    });
    await materialBaru.save();
    res.status(201).json({ message: 'Material berhasil ditambahkan', data: materialBaru, merged: false });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan material', error: error.message });
  }
});


// --- EDIT MATERIAL (nama/kategori/satuan/keterangan/SN ONT). Qty di form Edit dipetakan ke
//     stock_awal SEKALIGUS menyesuaikan stock terkini sebesar selisihnya (qty dinaikkan ->
//     stok terkini ikut bertambah = restock; qty diturunkan -> stok terkini ikut berkurang =
//     koreksi), supaya halaman "Stok Masuk/Kembali" yang sudah dihapus tidak dibutuhkan lagi
//     untuk restock material yang sudah ada. Stok tidak boleh sampai minus. ---
router.put('/material/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const existing = await Material.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Material tidak ditemukan' });

    const { kategori, nama, satuan, stock_awal, keterangan, sn_list } = req.body;
    const updateData = { kategori, nama, satuan, keterangan };

    if (stock_awal !== undefined && stock_awal !== null && stock_awal !== '') {
      const stokAwalBaru = Math.max(0, Number(stock_awal) || 0);
      const delta = stokAwalBaru - existing.stock_awal;
      updateData.stock_awal = stokAwalBaru;
      const stockBaru = existing.stock + delta;
      if (stockBaru < 0) {
        return res.status(400).json({
          message: `Qty tidak bisa diturunkan sebanyak itu. Sisa stok terkini "${existing.nama}" saat ini: ${existing.stock} ${existing.satuan}.`
        });
      }
      updateData.stock = stockBaru;
    }

    const kategoriFinal = kategori || existing.kategori;
    if (kategoriFinal === 'ONT' && Array.isArray(sn_list)) {
      // Gabungkan SN lama + SN baru (unik), supaya SN yang sudah dicatat sebelumnya tidak hilang.
      updateData.sn_list = bersihkanSnList([...(existing.sn_list || []), ...sn_list]);
    }

    const diupdate = await Material.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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

// Helper: cari master Material kategori ONT yang namanya cocok (case-insensitive) dengan
// merek_modem yang diketik di form Pemakaian. Return null kalau merek itu belum terdaftar
// sebagai jenis material ONT — dalam kondisi ini stok ONT memang TIDAK bisa otomatis
// dikurangi (karena tidak tahu mau kurangi stok yang mana), makanya frontend juga sudah
// kasih peringatan "ONT belum terdaftar di Master Material" saat kondisi ini terjadi.
async function cariMaterialOnt(merekModem) {
  const target = String(merekModem || '').trim();
  if (!target) return null;
  return Material.findOne({ kategori: 'ONT', nama: { $regex: `^${escapeRegex(target)}$`, $options: 'i' } });
}

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
      kabel_id, status, return_catatan, project, region, vendor
    } = req.body;

    if (!nama_team || !kabel_id) {
      return res.status(400).json({ message: 'Nama team dan jenis kabel wajib diisi!' });
    }
    const statusFinal = ['Terpakai', 'Idle'].includes(status) ? status : 'Idle';

    const kabel = await Material.findById(kabel_id);
    if (!kabel) return res.status(404).json({ message: 'Jenis kabel tidak ditemukan di master material' });

    // Cari master ONT yang cocok dgn merek_modem (kalau ada) — dipakai buat kurangi stok ONT juga,
    // bukan cuma stok kabel. Kalau merek belum terdaftar di Master Material, ont jadi null dan
    // stok ONT tidak dikurangi (tidak ada yang bisa dikurangi).
    const ont = await cariMaterialOnt(merek_modem);

    if (statusFinal === 'Terpakai') {
      if (ont && String(ont._id) !== String(kabel_id)) {
        await ubahStok(ont._id, -1);
        try {
          await ubahStok(kabel_id, -1);
        } catch (kabelError) {
          await ubahStok(ont._id, +1); // rollback stok ONT kalau potong stok kabel gagal (ex: stok kabel kurang)
          throw kabelError;
        }
      } else {
        await ubahStok(kabel_id, -1);
      }
    }

    const dibuat_oleh = req.header('x-user-id') || '';
    const logBaru = new PemakaianMaterial({
      tanggal_pengambilan: tanggal_pengambilan ? new Date(tanggal_pengambilan) : new Date(),
      teknisi_id: teknisi_id || '',
      nama_team,
      merek_modem: merek_modem || '',
      ont_id: ont ? ont._id : null,
      sn_ont: sn_ont || '',
      kabel_id,
      kabel_nama: kabel.nama,
      status: statusFinal,
      return_catatan: return_catatan || '',
      project: project || '',
      region: region || '',
      vendor: vendor || '',
      dibuat_oleh
    });
    await logBaru.save();
    res.status(201).json({ message: 'Log pemakaian material berhasil disimpan', data: logBaru });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyimpan log pemakaian material', error: error.message });
  }
});

// --- TAMBAH BANYAK BARIS LOG SEKALIGUS (batch) — dipakai form "Tambah Log Pemakaian" di
// frontend, yang bisa input beberapa unit ONT & beberapa jenis kabel dalam satu kali submit.
// Body: { ..., project, region, vendor, ont_list: [sn, ...], kabel_list: [{kabel_id, jumlah}, ...] }
// Setiap unit kabel (dihitung dari jumlah tiap baris kabel_list) jadi 1 dokumen PemakaianMaterial,
// dipasangkan berurutan dengan SN di ont_list (kalau ont_list lebih pendek, sisanya sn_ont kosong).
router.post('/pemakaian-material/batch', MANAGE_ROLES, async (req, res) => {
  try {
    const {
      tanggal_pengambilan, teknisi_id, nama_team, merek_modem,
      status, return_catatan, project, region, vendor,
      ont_list, kabel_list
    } = req.body;

    if (!nama_team) {
      return res.status(400).json({ message: 'Nama team wajib diisi!' });
    }
    if (!Array.isArray(kabel_list) || kabel_list.length === 0) {
      return res.status(400).json({ message: 'Minimal 1 jenis kabel wajib dipilih!' });
    }

    const rows = kabel_list
      .filter(r => r && r.kabel_id)
      .map(r => ({ kabel_id: r.kabel_id, jumlah: Math.max(1, Number(r.jumlah) || 1) }));
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Minimal 1 jenis kabel wajib dipilih!' });
    }
    const totalUnit = rows.reduce((total, r) => total + r.jumlah, 0);

    // Ambil master data untuk tiap jenis kabel unik, sekaligus pastikan semuanya ada.
    const uniqueIds = [...new Set(rows.map(r => r.kabel_id))];
    const materialsMap = {};
    for (const id of uniqueIds) {
      const m = await Material.findById(id);
      if (!m) return res.status(404).json({ message: 'Salah satu jenis kabel tidak ditemukan di master material' });
      materialsMap[id] = m;
    }

    const statusFinal = ['Terpakai', 'Idle'].includes(status) ? status : 'Idle';

    // Cari master ONT yang cocok dgn merek_modem (satu merek berlaku utk semua unit di batch ini).
    // Kalau merek belum terdaftar di Master Material, ont jadi null dan stok ONT tidak dikurangi.
    const ont = await cariMaterialOnt(merek_modem);

    // Total kebutuhan per jenis kabel (kalau 1 jenis kabel dipakai di beberapa baris).
    const totalPerKabel = {};
    rows.forEach(r => { totalPerKabel[r.kabel_id] = (totalPerKabel[r.kabel_id] || 0) + r.jumlah; });

    // Kalau langsung "Terpakai", cek dulu stok semua jenis kabel & stok ONT (kalau ada) CUKUP
    // sebelum motong apapun, supaya tidak ada potongan stok "setengah jalan" kalau salah satu kurang.
    if (statusFinal === 'Terpakai') {
      for (const id of Object.keys(totalPerKabel)) {
        const m = materialsMap[id];
        if (m.stock < totalPerKabel[id]) {
          return res.status(400).json({
            message: `Stok tidak cukup. Sisa stok "${m.nama}" saat ini: ${m.stock} ${m.satuan}, dibutuhkan ${totalPerKabel[id]}.`
          });
        }
      }
      if (ont && ont.stock < totalUnit) {
        return res.status(400).json({
          message: `Stok tidak cukup. Sisa stok ONT "${ont.nama}" saat ini: ${ont.stock} ${ont.satuan}, dibutuhkan ${totalUnit}.`
        });
      }
    }

    // Ratakan jadi 1 kabel_id per unit, dipasangkan berurutan dengan SN ONT (kalau ada).
    const flatKabelIds = [];
    rows.forEach(r => { for (let i = 0; i < r.jumlah; i++) flatKabelIds.push(r.kabel_id); });
    const snList = Array.isArray(ont_list) ? ont_list : [];

    const dibuat_oleh = req.header('x-user-id') || '';
    const tanggalFinal = tanggal_pengambilan ? new Date(tanggal_pengambilan) : new Date();

    const stokTerpotong = []; // { id, jumlah } — untuk rollback kalau ada error di tengah jalan
    const dibuatDocs = [];
    try {
      if (statusFinal === 'Terpakai') {
        if (ont && totalUnit > 0) {
          await ubahStok(ont._id, -totalUnit);
          stokTerpotong.push({ id: ont._id, jumlah: totalUnit });
        }
        for (const id of Object.keys(totalPerKabel)) {
          await ubahStok(id, -totalPerKabel[id]);
          stokTerpotong.push({ id, jumlah: totalPerKabel[id] });
        }
      }

      for (let i = 0; i < totalUnit; i++) {
        const kabelId = flatKabelIds[i];
        const kabelDoc = materialsMap[kabelId];
        const logBaru = new PemakaianMaterial({
          tanggal_pengambilan: tanggalFinal,
          teknisi_id: teknisi_id || '',
          nama_team,
          merek_modem: merek_modem || '',
          ont_id: ont ? ont._id : null,
          sn_ont: snList[i] || '',
          kabel_id: kabelId,
          kabel_nama: kabelDoc.nama,
          status: statusFinal,
          return_catatan: return_catatan || '',
          project: project || '',
          region: region || '',
          vendor: vendor || '',
          dibuat_oleh
        });
        await logBaru.save();
        dibuatDocs.push(logBaru);
      }

      res.status(201).json({ message: `${totalUnit} log pemakaian material berhasil disimpan`, data: dibuatDocs });
    } catch (innerError) {
      // Rollback: kembalikan stok yang sudah terpotong & hapus dokumen yang sempat kebuat,
      // supaya data tidak nyangkut setengah kalau ada error di tengah proses.
      for (const s of stokTerpotong) {
        try { await ubahStok(s.id, +s.jumlah); } catch (_) { /* abaikan, best-effort rollback */ }
      }
      for (const d of dibuatDocs) {
        try { await PemakaianMaterial.findByIdAndDelete(d._id); } catch (_) { /* abaikan */ }
      }
      throw innerError;
    }
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
      kabel_id, status, return_catatan, project, region, vendor
    } = req.body;

    const kabelIdBaru = kabel_id || String(log.kabel_id);
    const statusBaru = ['Terpakai', 'Idle'].includes(status) ? status : log.status;
    const kabelBerubah = kabelIdBaru !== String(log.kabel_id);
    const merekBaru = merek_modem !== undefined ? merek_modem : log.merek_modem;

    // Balikkan dulu efek stok dari kondisi LAMA, baru terapkan efek stok yang BARU.
    if (log.status === 'Terpakai') {
      await ubahStok(log.kabel_id, +1); // kembalikan stok kabel lama
      if (log.ont_id) await ubahStok(log.ont_id, +1); // kembalikan stok ONT lama (kalau ada)
    }
    let kabelBaruDoc = null;
    if (statusBaru === 'Terpakai') {
      kabelBaruDoc = await ubahStok(kabelIdBaru, -1); // potong stok kabel baru
    } else if (kabelBerubah) {
      kabelBaruDoc = await Material.findById(kabelIdBaru);
      if (!kabelBaruDoc) return res.status(404).json({ message: 'Jenis kabel tidak ditemukan di master material' });
    }

    // Cari master ONT sesuai merek terbaru & potong stoknya kalau status akhirnya "Terpakai".
    const ontBaru = await cariMaterialOnt(merekBaru);
    if (statusBaru === 'Terpakai' && ontBaru) {
      await ubahStok(ontBaru._id, -1);
    }

    if (tanggal_pengambilan) log.tanggal_pengambilan = new Date(tanggal_pengambilan);
    if (teknisi_id !== undefined) log.teknisi_id = teknisi_id;
    if (nama_team) log.nama_team = nama_team;
    if (merek_modem !== undefined) log.merek_modem = merek_modem;
    if (sn_ont !== undefined) log.sn_ont = sn_ont;
    if (return_catatan !== undefined) log.return_catatan = return_catatan;
    if (project !== undefined) log.project = project;
    if (region !== undefined) log.region = region;
    if (vendor !== undefined) log.vendor = vendor;
    log.status = statusBaru;
    log.kabel_id = kabelIdBaru;
    log.kabel_nama = kabelBaruDoc ? kabelBaruDoc.nama : log.kabel_nama;
    log.ont_id = ontBaru ? ontBaru._id : null;

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
      if (log.ont_id) await ubahStok(log.ont_id, +1);
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
      // Kabel dihitung dari kabel_id, ONT dihitung dari ont_id (link terpisah karena 1 baris
      // Pemakaian punya kabel & ONT sekaligus) — supaya rekap Terpakai/Idle akurat utk 2-2 nya.
      const logMaterialIni = semuaPemakaian.filter(l =>
        m.kategori === 'ONT' ? String(l.ont_id) === String(m._id) : String(l.kabel_id) === String(m._id)
      );
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