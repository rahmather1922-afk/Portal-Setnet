const express = require('express');
const Salary = require('../models/Salary');
const SalaryPayment = require('../models/SalaryPayment');
const Karyawan = require('../models/Karyawan');
const Kasbon = require('../models/Kasbon');
const requireRole = require('../middleware/requireRole');
const { getLimitForKaryawan } = require('../config/kasbonLimit');

const router = express.Router();

// Modul Salary: 1 level dengan menu "Master Data Karyawan" (submenu Salary),
// jadi role yang boleh akses SAMA PERSIS dengan MENU_ACCESS.crud di admin.js -> owner & hrd.
const SALARY_ROLES = requireRole('owner', 'hrd');

const REGEX_PERIODE = /^\d{4}-(0[1-9]|1[0-2])$/; // "YYYY-MM"

// Helper: total kasbon yang SUDAH DISETUJUI tapi belum lunas milik satu karyawan.
// SENGAJA beda dengan hitungKasbonAktif() di routes/kasbon.js (yang juga menghitung
// kasbon Pending demi mengunci limit pengajuan) — di sini pengajuan yang masih
// Pending BELUM boleh memotong gaji karena uangnya belum tentu benar-benar cair.
async function hitungKasbonDisetujuiBelumLunas(karyawan_id) {
  const list = await Kasbon.find({ karyawan_id, status: 'Disetujui', lunas: false });
  const total = list.reduce((a, k) => a + k.jumlah, 0);
  return { total, list };
}

// --- DAFTAR MASTER GAJI SELURUH KARYAWAN (gaji pokok + limit kasbon + sisa limit terkini) ---
router.get('/salary', SALARY_ROLES, async (req, res) => {
  try {
    const semuaKaryawan = await Karyawan.find().select('-password').sort({ nama: 1 });
    const semuaSalary = await Salary.find();
    const salaryMap = {};
    semuaSalary.forEach(s => { salaryMap[s.karyawan_id] = s; });

    const data = await Promise.all(semuaKaryawan.map(async (k) => {
      const salary = salaryMap[k.karyawan_id] || null;
      const limit = getLimitForKaryawan(k);
      const { total: kasbonBelumLunas } = await hitungKasbonDisetujuiBelumLunas(k.karyawan_id);
      const gajiPokok = salary ? salary.gaji_pokok : 0;
      return {
        karyawan_id: k.karyawan_id,
        nama: k.nama,
        role: k.role,
        status: k.status,
        gaji_pokok: gajiPokok,
        limit_kasbon: limit,
        kasbon_belum_lunas: kasbonBelumLunas,
        total_harus_dibayar: Math.max(gajiPokok - kasbonBelumLunas, 0)
      };
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data master gaji', error: error.message });
  }
});

// --- SET / UPDATE GAJI POKOK & LIMIT KASBON SATU KARYAWAN (manual, bukan berdasarkan role) ---
router.put('/salary/:karyawan_id', SALARY_ROLES, async (req, res) => {
  try {
    const { karyawan_id } = req.params;
    const { gaji_pokok, limit_kasbon } = req.body;

    const karyawan = await Karyawan.findOne({ karyawan_id });
    if (!karyawan) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });

    if (gaji_pokok === undefined || gaji_pokok === null || Number(gaji_pokok) < 0) {
      return res.status(400).json({ message: 'Gaji pokok wajib diisi dan tidak boleh negatif' });
    }

    const diubah_oleh = req.header('x-user-id') || '';

    const salary = await Salary.findOneAndUpdate(
      { karyawan_id },
      { karyawan_id, gaji_pokok: Number(gaji_pokok), diubah_oleh },
      { new: true, upsert: true, runValidators: true }
    );

    // limit_kasbon di sini murni manual per-karyawan, ditulis ke field yang sudah ada
    // di Karyawan (limit_kasbon_custom). Kirim null/kosong untuk kembali ke DEFAULT_LIMIT.
    if (limit_kasbon !== undefined) {
      karyawan.limit_kasbon_custom = (limit_kasbon === null || limit_kasbon === '') ? null : Number(limit_kasbon);
      await karyawan.save();
    }

    res.status(200).json({
      message: 'Gaji pokok & limit kasbon berhasil disimpan',
      data: { gaji_pokok: salary.gaji_pokok, limit_kasbon: getLimitForKaryawan(karyawan) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyimpan data gaji', error: error.message });
  }
});

// --- RINGKASAN GAJI SATU PERIODE (ex: ?periode=2026-07) UNTUK SELURUH KARYAWAN ---
// Kalau dokumen SalaryPayment periode itu SUDAH ADA -> tampilkan angka yang terkunci (histori).
// Kalau BELUM ADA -> hitung LIVE dari gaji_pokok & kasbon Disetujui belum lunas saat ini (preview).
router.get('/salary/payment/:periode', SALARY_ROLES, async (req, res) => {
  try {
    const { periode } = req.params;
    if (!REGEX_PERIODE.test(periode)) {
      return res.status(400).json({ message: 'Format periode harus YYYY-MM, contoh: 2026-07' });
    }

    const semuaKaryawan = await Karyawan.find({ status: 'Aktif' }).select('-password').sort({ nama: 1 });
    const semuaSalary = await Salary.find();
    const salaryMap = {};
    semuaSalary.forEach(s => { salaryMap[s.karyawan_id] = s; });

    const paymentTersimpan = await SalaryPayment.find({ periode });
    const paymentMap = {};
    paymentTersimpan.forEach(p => { paymentMap[p.karyawan_id] = p; });

    const data = await Promise.all(semuaKaryawan.map(async (k) => {
      const sudahAda = paymentMap[k.karyawan_id];
      if (sudahAda) {
        return {
          _id: sudahAda._id,
          karyawan_id: k.karyawan_id,
          nama: k.nama,
          periode,
          gaji_pokok: sudahAda.gaji_pokok,
          total_kasbon_dipotong: sudahAda.total_kasbon_dipotong,
          total_dibayar: sudahAda.total_dibayar,
          status: sudahAda.status,
          tanggal_dibayar: sudahAda.tanggal_dibayar
        };
      }
      const gajiPokok = salaryMap[k.karyawan_id] ? salaryMap[k.karyawan_id].gaji_pokok : 0;
      const { total: kasbonBelumLunas } = await hitungKasbonDisetujuiBelumLunas(k.karyawan_id);
      return {
        _id: null,
        karyawan_id: k.karyawan_id,
        nama: k.nama,
        periode,
        gaji_pokok: gajiPokok,
        total_kasbon_dipotong: kasbonBelumLunas,
        total_dibayar: Math.max(gajiPokok - kasbonBelumLunas, 0),
        status: 'Belum Dibayar',
        tanggal_dibayar: null
      };
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil ringkasan gaji periode ini', error: error.message });
  }
});

// --- TANDAI GAJI SATU KARYAWAN SUDAH DIBAYAR UNTUK SATU PERIODE ---
// Mengunci angka periode itu jadi histori PERMANEN, dan otomatis menandai seluruh
// kasbon Disetujui & belum lunas milik karyawan tsb sebagai lunas (karena sudah
// resmi dipotong dari gaji yang baru saja ditransfer).
router.put('/salary/payment/:karyawan_id/bayar', SALARY_ROLES, async (req, res) => {
  try {
    const { karyawan_id } = req.params;
    const { periode } = req.body;
    if (!REGEX_PERIODE.test(periode || '')) {
      return res.status(400).json({ message: 'Format periode harus YYYY-MM, contoh: 2026-07' });
    }

    const karyawan = await Karyawan.findOne({ karyawan_id });
    if (!karyawan) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });

    const sudahAda = await SalaryPayment.findOne({ karyawan_id, periode });
    if (sudahAda && sudahAda.status === 'Sudah Dibayar') {
      return res.status(400).json({ message: `Gaji ${karyawan.nama} periode ${periode} sudah ditandai dibayar sebelumnya` });
    }

    const salary = await Salary.findOne({ karyawan_id });
    const gajiPokok = salary ? salary.gaji_pokok : 0;
    const { total: totalKasbon, list: kasbonList } = await hitungKasbonDisetujuiBelumLunas(karyawan_id);
    const totalDibayar = Math.max(gajiPokok - totalKasbon, 0);

    const dibayar_oleh = req.header('x-user-id') || '';

    const payment = await SalaryPayment.findOneAndUpdate(
      { karyawan_id, periode },
      {
        karyawan_id, nama: karyawan.nama, periode,
        gaji_pokok: gajiPokok,
        total_kasbon_dipotong: totalKasbon,
        total_dibayar: totalDibayar,
        kasbon_ids: kasbonList.map(k => k._id),
        status: 'Sudah Dibayar',
        tanggal_dibayar: new Date(),
        dibayar_oleh
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Tandai kasbon-kasbon yang ikut dipotong sebagai lunas
    if (kasbonList.length > 0) {
      await Kasbon.updateMany(
        { _id: { $in: kasbonList.map(k => k._id) } },
        { lunas: true, tanggal_lunas: new Date() }
      );
    }

    res.status(200).json({ message: `Gaji ${karyawan.nama} periode ${periode} berhasil ditandai Sudah Dibayar`, data: payment });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menandai gaji sudah dibayar', error: error.message });
  }
});

module.exports = router;
