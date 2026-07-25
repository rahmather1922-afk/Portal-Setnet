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

// Helper: cari Material kategori ONT yang nama-nya cocok dengan teks Merek Modem yang
// diketik/dipilih user, DI BUCKET Penggunaan (IB/MT) yang sama dengan baris log-nya.
// Return null kalau kosong/tidak match apapun (mis. user isi merek custom lewat "Lainnya")
// — dalam kondisi itu stok ONT sengaja TIDAK dipotong, cuma stok kabel yang jalan.
async function cariOntMaterial(merekModem, penggunaan) {
  if (!merekModem) return null;
  return Material.findOne({ kategori: 'ONT', penggunaan, nama: merekModem });
}

// ==================== MASTER DATA MATERIAL (CRUD) — tabel "MATRIAL MASUK" di Excel ====================

// --- DAFTAR SELURUH MATERIAL (filter opsional ?kategori=Kabel) ---
router.get('/material', VIEW_ROLES, async (req, res) => {
  try {
    const { kategori, penggunaan } = req.query;
    const filter = {};
    if (kategori) filter.kategori = kategori;
    if (penggunaan && ['IB', 'MT'].includes(penggunaan)) filter.penggunaan = penggunaan;
    const data = await Material.find(filter).sort({ penggunaan: 1, kategori: 1, nama: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data material', error: error.message });
  }
});

// --- TAMBAH JENIS MATERIAL BARU (ex: Kabel "100 M", stok awal 15) ---
// Kalau jenis material dengan Kategori + Penggunaan + Nama yang SAMA (case-insensitive)
// sudah terdaftar sebelumnya, TIDAK bikin baris duplikat baru — anggap ini restock/
// penambahan stok untuk jenis yang sudah ada (mis. stok "100 M" sisa 3, diinput lagi
// qty 5 lewat form Tambah Jenis Material -> jadi 8), supaya Master Material tidak
// numpuk baris kembar untuk barang yang sebenarnya sama. Tercatat juga di MaterialStokLog
// (tipe "Penambahan") biar konsisten & kehitung di /material/report seperti restock biasa.
router.post('/material', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, penggunaan, nama, satuan, stock_awal, keterangan, sn_list } = req.body;
    if (!nama) {
      return res.status(400).json({ message: 'Nama/jenis material wajib diisi!' });
    }
    const kategoriFinal = kategori || 'Kabel';
    if (penggunaan && !['IB', 'MT'].includes(penggunaan)) {
      return res.status(400).json({ message: 'Penggunaan harus "IB" atau "MT"' });
    }
    const penggunaanFinal = penggunaan || 'IB';
    const stokAwalNum = Number(stock_awal) || 0;
    const dibuat_oleh = req.header('x-user-id') || '';
    const namaTrim = String(nama).trim();

    // Cari dulu apakah jenis material ini (Kategori+Penggunaan+Nama, tanpa peduli besar-kecil
    // huruf atau spasi berlebih) sudah ada. Escape karakter regex biar nama dgn simbol aman.
    const namaRegex = new RegExp(`^${namaTrim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const existing = await Material.findOne({ kategori: kategoriFinal, penggunaan: penggunaanFinal, nama: namaRegex });

    // Khusus kategori ONT: qty (stock_awal) diisi user lewat form Tambah Jenis Material,
    // dan tiap unit boleh langsung dicatat SN-nya (opsional per unit, boleh dikosongkan).
    const snListBersih = kategoriFinal === 'ONT' && Array.isArray(sn_list)
      ? [...new Set(sn_list.map(sn => String(sn || '').trim()).filter(Boolean))]
      : [];

    if (existing) {
      if (stokAwalNum > 0) existing.stock += stokAwalNum;
      if (snListBersih.length > 0) existing.sn_list = [...new Set([...(existing.sn_list || []), ...snListBersih])];
      await existing.save();

      // Catat sebagai log Penambahan (audit trail) hanya kalau memang ada qty yang ditambahkan.
      if (stokAwalNum > 0) {
        const logGabung = new MaterialStokLog({
          material_id: existing._id,
          material_nama: existing.nama,
          tipe: 'Penambahan',
          jumlah: stokAwalNum,
          keterangan: keterangan || `Digabung otomatis dari input "Tambah Jenis Material" (jenis "${existing.nama}" sudah terdaftar)`,
          dibuat_oleh
        });
        await logGabung.save();
      }

      return res.status(200).json({
        message: `Jenis material "${existing.nama}" (${penggunaanFinal}) sudah terdaftar — stok digabung${stokAwalNum > 0 ? ` (+${stokAwalNum})` : ''}, stok terkini: ${existing.stock} ${existing.satuan}`,
        data: existing,
        digabung: true
      });
    }

    const materialBaru = new Material({
      kategori: kategoriFinal,
      penggunaan: penggunaanFinal,
      nama: namaTrim,
      satuan: satuan || 'Roll',
      stock_awal: stokAwalNum,
      stock: stokAwalNum, // saat pertama dibuat, stok terkini = stok awal
      sn_list: snListBersih,
      keterangan: keterangan || '',
      dibuat_oleh
    });
    await materialBaru.save();
    res.status(201).json({ message: 'Material berhasil ditambahkan', data: materialBaru, digabung: false });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan material', error: error.message });
  }
});

// --- EDIT MATERIAL (nama/kategori/satuan/keterangan). Untuk edit stok_awal juga boleh
//     lewat sini (mis. koreksi input awal), TAPI tidak otomatis mengubah stock terkini. ---
router.put('/material/:id', MANAGE_ROLES, async (req, res) => {
  try {
    const { kategori, penggunaan, nama, satuan, stock_awal, keterangan } = req.body;
    if (penggunaan && !['IB', 'MT'].includes(penggunaan)) {
      return res.status(400).json({ message: 'Penggunaan harus "IB" atau "MT"' });
    }
    const updateData = { kategori, nama, satuan, keterangan };
    if (penggunaan) updateData.penggunaan = penggunaan;
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
      kabel_id, status, return_catatan, catatan_report, penggunaan, project, region, vendor, id_wo
    } = req.body;

    if (!nama_team || !kabel_id) {
      return res.status(400).json({ message: 'Nama team dan jenis kabel wajib diisi!' });
    }
    if (penggunaan && !['IB', 'MT'].includes(penggunaan)) {
      return res.status(400).json({ message: 'Penggunaan harus "IB" atau "MT"' });
    }
    const penggunaanFinal = penggunaan || 'IB';
    const statusFinal = ['Terpakai', 'Idle'].includes(status) ? status : 'Idle';

    const kabel = await Material.findById(kabel_id);
    if (!kabel) return res.status(404).json({ message: 'Jenis kabel tidak ditemukan di master material' });
    // Pastikan kabel yang dipilih memang dari bucket stok Penggunaan yang sama, supaya
    // pemakaian IB tidak diam-diam motong stok bucket MT (atau sebaliknya).
    if ((kabel.penggunaan || 'IB') !== penggunaanFinal) {
      return res.status(400).json({
        message: `Jenis kabel "${kabel.nama}" ada di bucket Penggunaan "${kabel.penggunaan || 'IB'}", tidak cocok dengan Penggunaan "${penggunaanFinal}" yang dipilih.`
      });
    }

    // Merek Modem opsional link ke Material kategori ONT (bucket Penggunaan sama) -> kalau
    // ketemu & status langsung "Terpakai", stok ONT-nya ikut terpotong 1 seperti kabel.
    const ontMaterial = await cariOntMaterial(merek_modem, penggunaanFinal);

    let kabelStokDipotong = false;
    let ontStokDipotong = false;
    try {
      if (statusFinal === 'Terpakai') {
        await ubahStok(kabel_id, -1);
        kabelStokDipotong = true;
        if (ontMaterial) {
          await ubahStok(ontMaterial._id, -1);
          ontStokDipotong = true;
        }
      }

      const dibuat_oleh = req.header('x-user-id') || '';
      const logBaru = new PemakaianMaterial({
        tanggal_pengambilan: tanggal_pengambilan ? new Date(tanggal_pengambilan) : new Date(),
        teknisi_id: teknisi_id || '',
        nama_team,
        merek_modem: merek_modem || '',
        ont_material_id: ontMaterial ? ontMaterial._id : null,
        sn_ont: sn_ont || '',
        kabel_id,
        kabel_nama: kabel.nama,
        status: statusFinal,
        return_catatan: return_catatan || '',
        catatan_report: catatan_report || '',
        penggunaan: penggunaanFinal,
        project: project || '',
        region: region || '',
        vendor: vendor || '',
        id_wo: id_wo || '',
        dibuat_oleh
      });
      await logBaru.save();
      res.status(201).json({ message: 'Log pemakaian material berhasil disimpan', data: logBaru });
    } catch (innerError) {
      // Rollback best-effort kalau kabel sudah terpotong tapi ONT gagal (atau save dokumen gagal),
      // supaya stok tidak nyangkut "kepotong sebagian" saat terjadi error di tengah proses.
      if (kabelStokDipotong) await ubahStok(kabel_id, +1).catch(() => {});
      if (ontStokDipotong) await ubahStok(ontMaterial._id, +1).catch(() => {});
      throw innerError;
    }
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
      status, return_catatan, catatan_report, penggunaan, project, region, vendor, id_wo,
      ont_list, kabel_list
    } = req.body;

    if (!nama_team) {
      return res.status(400).json({ message: 'Nama team wajib diisi!' });
    }
    if (penggunaan && !['IB', 'MT'].includes(penggunaan)) {
      return res.status(400).json({ message: 'Penggunaan harus "IB" atau "MT"' });
    }
    const penggunaanFinal = penggunaan || 'IB';
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
      if ((m.penggunaan || 'IB') !== penggunaanFinal) {
        return res.status(400).json({
          message: `Jenis kabel "${m.nama}" ada di bucket Penggunaan "${m.penggunaan || 'IB'}", tidak cocok dengan Penggunaan "${penggunaanFinal}" yang dipilih.`
        });
      }
      materialsMap[id] = m;
    }

    const statusFinal = ['Terpakai', 'Idle'].includes(status) ? status : 'Idle';

    // Merek Modem berlaku 1 untuk seluruh batch -> kalau cocok Material kategori ONT
    // (bucket Penggunaan sama), stok ONT-nya ikut terpotong sebanyak totalUnit.
    const ontMaterial = await cariOntMaterial(merek_modem, penggunaanFinal);

    // Total kebutuhan per jenis kabel (kalau 1 jenis kabel dipakai di beberapa baris).
    const totalPerKabel = {};
    rows.forEach(r => { totalPerKabel[r.kabel_id] = (totalPerKabel[r.kabel_id] || 0) + r.jumlah; });

    // Kalau langsung "Terpakai", cek dulu stok semua jenis kabel (+ ONT kalau ada) CUKUP
    // sebelum motong apapun, supaya tidak ada potongan stok "setengah jalan" kalau kurang.
    if (statusFinal === 'Terpakai') {
      for (const id of Object.keys(totalPerKabel)) {
        const m = materialsMap[id];
        if (m.stock < totalPerKabel[id]) {
          return res.status(400).json({
            message: `Stok tidak cukup. Sisa stok "${m.nama}" saat ini: ${m.stock} ${m.satuan}, dibutuhkan ${totalPerKabel[id]}.`
          });
        }
      }
      if (ontMaterial && ontMaterial.stock < totalUnit) {
        return res.status(400).json({
          message: `Stok tidak cukup. Sisa stok Merek Modem "${ontMaterial.nama}" saat ini: ${ontMaterial.stock} ${ontMaterial.satuan}, dibutuhkan ${totalUnit}.`
        });
      }
    }

    // Ratakan jadi 1 kabel_id per unit, dipasangkan berurutan dengan SN ONT (kalau ada).
    const flatKabelIds = [];
    rows.forEach(r => { for (let i = 0; i < r.jumlah; i++) flatKabelIds.push(r.kabel_id); });
    const snList = Array.isArray(ont_list) ? ont_list : [];

    const dibuat_oleh = req.header('x-user-id') || '';
    const tanggalFinal = tanggal_pengambilan ? new Date(tanggal_pengambilan) : new Date();

    // batch_id unik per submit — dipakai FE untuk menggabungkan semua unit dari 1x input
    // ini jadi 1 baris ringkasan di tabel "Log Pemakaian per Teknisi".
    const batchId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const stokTerpotong = []; // { id, jumlah } — untuk rollback kalau ada error di tengah jalan
    const dibuatDocs = [];
    try {
      if (statusFinal === 'Terpakai') {
        for (const id of Object.keys(totalPerKabel)) {
          await ubahStok(id, -totalPerKabel[id]);
          stokTerpotong.push({ id, jumlah: totalPerKabel[id] });
        }
        if (ontMaterial) {
          await ubahStok(ontMaterial._id, -totalUnit);
          stokTerpotong.push({ id: ontMaterial._id, jumlah: totalUnit });
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
          ont_material_id: ontMaterial ? ontMaterial._id : null,
          sn_ont: snList[i] || '',
          kabel_id: kabelId,
          kabel_nama: kabelDoc.nama,
          status: statusFinal,
          return_catatan: return_catatan || '',
          catatan_report: catatan_report || '',
          penggunaan: penggunaanFinal,
          project: project || '',
          region: region || '',
          vendor: vendor || '',
          id_wo: id_wo || '',
          dibuat_oleh,
          batch_id: batchId
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

// --- UBAH STATUS BANYAK BARIS SEKALIGUS (Idle <-> Terpakai) ---
// Dipakai halaman "Stok di Tangan Teknisi": admin/gudang centang beberapa unit yang
// masih Idle punya 1/beberapa teknisi, lalu 1x klik tandai semuanya "Terpakai" begitu
// dikonfirmasi sudah kepasang di lapangan (atau sebaliknya, balikin ke Idle kalau salah pencet).
// Stok tiap unit disesuaikan satu-satu (bukan digabung), supaya kalau salah satu gagal
// (mis. stok sudah kepakai duluan di tempat lain), unit lainnya tetap jalan & dilaporkan
// jelas mana yang gagal + kenapa — bukan all-or-nothing.
// PENTING: route ini didaftarkan SEBELUM 'PUT /pemakaian-material/:id' supaya path statis
// 'bulk-status' tidak tertangkap duluan oleh parameter ':id' punya Express.
router.put('/pemakaian-material/bulk-status', MANAGE_ROLES, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Pilih minimal 1 baris log yang mau diubah statusnya' });
    }
    if (!['Terpakai', 'Idle'].includes(status)) {
      return res.status(400).json({ message: 'Status harus "Terpakai" atau "Idle"' });
    }

    const berhasil = [];
    const gagal = [];
    for (const id of ids) {
      try {
        const log = await PemakaianMaterial.findById(id);
        if (!log) { gagal.push({ id, alasan: 'Log tidak ditemukan (mungkin sudah dihapus)' }); continue; }
        if (log.status === status) { berhasil.push(id); continue; } // sudah sesuai target, tidak perlu ubah stok

        if (log.status === 'Idle' && status === 'Terpakai') {
          await ubahStok(log.kabel_id, -1);
          if (log.ont_material_id) await ubahStok(log.ont_material_id, -1);
        } else if (log.status === 'Terpakai' && status === 'Idle') {
          await ubahStok(log.kabel_id, +1);
          if (log.ont_material_id) await ubahStok(log.ont_material_id, +1);
        }
        log.status = status;
        await log.save();
        berhasil.push(id);
      } catch (innerError) {
        gagal.push({ id, alasan: innerError.message });
      }
    }

    res.status(200).json({
      message: `${berhasil.length} log berhasil diubah jadi "${status}"` + (gagal.length ? `, ${gagal.length} gagal diubah` : ''),
      berhasil,
      gagal
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memproses perubahan status massal', error: error.message });
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
      kabel_id, status, return_catatan, catatan_report, penggunaan, project, region, vendor, id_wo
    } = req.body;

    if (penggunaan && !['IB', 'MT'].includes(penggunaan)) {
      return res.status(400).json({ message: 'Penggunaan harus "IB" atau "MT"' });
    }
    const penggunaanFinal = penggunaan || log.penggunaan || 'IB';

    const kabelIdBaru = kabel_id || String(log.kabel_id);
    const statusBaru = ['Terpakai', 'Idle'].includes(status) ? status : log.status;
    const kabelBerubah = kabelIdBaru !== String(log.kabel_id);
    const merekModemBaru = merek_modem !== undefined ? merek_modem : log.merek_modem;

    // Validasi kabel yang dipilih (baru atau tetap yang lama) memang dari bucket
    // Penggunaan yang sama — dicek DULU sebelum stok siapapun disentuh.
    const kabelCek = await Material.findById(kabelIdBaru);
    if (!kabelCek) return res.status(404).json({ message: 'Jenis kabel tidak ditemukan di master material' });
    if ((kabelCek.penggunaan || 'IB') !== penggunaanFinal) {
      return res.status(400).json({
        message: `Jenis kabel "${kabelCek.nama}" ada di bucket Penggunaan "${kabelCek.penggunaan || 'IB'}", tidak cocok dengan Penggunaan "${penggunaanFinal}" yang dipilih.`
      });
    }
    // Merek Modem baru (kalau ada perubahan teks/penggunaan) -> cari ulang match Material ONT-nya.
    const ontMaterialBaru = await cariOntMaterial(merekModemBaru, penggunaanFinal);

    // Balikkan dulu efek stok dari kondisi LAMA, baru terapkan efek stok yang BARU.
    if (log.status === 'Terpakai') {
      await ubahStok(log.kabel_id, +1); // kembalikan stok kabel lama
      if (log.ont_material_id) await ubahStok(log.ont_material_id, +1); // kembalikan stok modem lama
    }
    let kabelBaruDoc = null;
    if (statusBaru === 'Terpakai') {
      kabelBaruDoc = await ubahStok(kabelIdBaru, -1); // potong stok kabel baru
      if (ontMaterialBaru) await ubahStok(ontMaterialBaru._id, -1); // potong stok modem baru
    } else if (kabelBerubah) {
      kabelBaruDoc = kabelCek;
    }
    log.ont_material_id = ontMaterialBaru ? ontMaterialBaru._id : null;

    if (tanggal_pengambilan) log.tanggal_pengambilan = new Date(tanggal_pengambilan);
    if (teknisi_id !== undefined) log.teknisi_id = teknisi_id;
    if (nama_team) log.nama_team = nama_team;
    if (merek_modem !== undefined) log.merek_modem = merek_modem;
    if (sn_ont !== undefined) log.sn_ont = sn_ont;
    if (return_catatan !== undefined) log.return_catatan = return_catatan;
    if (catatan_report !== undefined) log.catatan_report = catatan_report;
    log.penggunaan = penggunaanFinal;
    if (project !== undefined) log.project = project;
    if (region !== undefined) log.region = region;
    if (vendor !== undefined) log.vendor = vendor;
    if (id_wo !== undefined) log.id_wo = id_wo;
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
      if (log.ont_material_id) await ubahStok(log.ont_material_id, +1);
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
    const { material_id, tipe, jumlah, teknisi_id, teknisi_nama, keterangan, tanggal, sn_list } = req.body;
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

    // Kalau material kategori ONT & tipe Penambahan (restock), gabungkan SN baru (opsional,
    // dikirim frontend sesuai jumlah yang diinput) ke daftar sn_list material yang bersangkutan.
    if (tipe === 'Penambahan' && material.kategori === 'ONT' && Array.isArray(sn_list)) {
      const snBaru = sn_list.map(sn => String(sn || '').trim()).filter(Boolean);
      if (snBaru.length > 0) {
        material.sn_list = [...new Set([...(material.sn_list || []), ...snBaru])];
        await material.save();
      }
    }

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
      // Cocokkan baris log yg pakai material ini sbg Kabel (kabel_id) ATAU sbg Merek Modem
      // (ont_material_id) — supaya kategori ONT juga kehitung terpakai/idle-nya, bukan cuma Kabel.
      const logMaterialIni = semuaPemakaian.filter(l =>
        String(l.kabel_id) === String(m._id) || (l.ont_material_id && String(l.ont_material_id) === String(m._id))
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
        penggunaan: m.penggunaan || 'IB',
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

    // Rekap per teknisi/team (total unit ONT+kabel yang sudah resmi "Terpakai"),
    // dipecah per Penggunaan (IB/MT) supaya Owner langsung lihat komposisi kerja
    // tiap team: berapa banyak dari Instalasi Baru vs Maintenance.
    const perTeamMap = {};
    semuaPemakaian.filter(l => l.status === 'Terpakai').forEach(l => {
      const key = l.teknisi_id || l.nama_team;
      if (!perTeamMap[key]) {
        perTeamMap[key] = {
          teknisi_id: l.teknisi_id,
          nama_team: l.nama_team,
          total_unit_ib: 0,
          total_unit_mt: 0,
          total_unit_terpakai: 0
        };
      }
      if ((l.penggunaan || 'IB') === 'MT') {
        perTeamMap[key].total_unit_mt += 1;
      } else {
        perTeamMap[key].total_unit_ib += 1;
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