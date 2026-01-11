const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Halaman List Pengguna
router.get('/pengguna', (req, res) => {
  const sql = `
    SELECT p.*, b.nama_barang 
    FROM pengguna p
    LEFT JOIN barang b ON p.id_barang = b.id_barang
    ORDER BY p.id_pengguna ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).render('error', { 
        title: 'Error',
        page: 'error',
        error: err.message 
      });
    }
    
    res.render('pengguna/index', {
      title: 'Daftar Pengguna',
      page: 'pengguna',
      pengguna: results
    });
  });
});

// Form Tambah Pengguna
router.get('/pengguna/create', (req, res) => {
  const sql = "SELECT id_barang, nama_barang FROM barang ORDER BY nama_barang";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error mengambil data barang");
    }
    
    res.render('pengguna/create', {
      title: 'Tambah Pengguna',
      page: 'pengguna',
      barang: results
    });
  });
});

// Proses Tambah Pengguna
router.post('/pengguna/create', (req, res) => {
  const { nama_pengguna, id_barang, jadwal_shift } = req.body;
  const sql = "INSERT INTO pengguna (nama_pengguna, id_barang, jadwal_shift) VALUES (?, ?, ?)";
  
  db.query(sql, [nama_pengguna, id_barang || null, jadwal_shift], (err) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error menambahkan pengguna");
    }
    
    console.log("✅ Pengguna ditambahkan");
    res.redirect('/pengguna');
  });
});

// Form Edit Pengguna
router.get('/pengguna/edit/:id', (req, res) => {
  const sqlPengguna = "SELECT * FROM pengguna WHERE id_pengguna = ?";
  const sqlBarang = "SELECT id_barang, nama_barang FROM barang ORDER BY nama_barang";
  
  db.query(sqlPengguna, [req.params.id], (err1, resultsPengguna) => {
    if (err1 || resultsPengguna.length === 0) {
      return res.status(404).send("Pengguna tidak ditemukan");
    }
    
    db.query(sqlBarang, (err2, resultsBarang) => {
      if (err2) {
        return res.status(500).send("Error mengambil data barang");
      }
      
      res.render('pengguna/edit', {
        title: 'Edit Pengguna',
        page: 'pengguna',
        pengguna: resultsPengguna[0],
        barang: resultsBarang
      });
    });
  });
});

// Proses Update Pengguna
router.post('/pengguna/edit/:id', (req, res) => {
  const { nama_pengguna, id_barang, jadwal_shift } = req.body;
  const sql = "UPDATE pengguna SET nama_pengguna=?, id_barang=?, jadwal_shift=? WHERE id_pengguna=?";
  
  db.query(sql, [nama_pengguna, id_barang || null, jadwal_shift, req.params.id], (err) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error mengupdate pengguna");
    }
    
    console.log("✅ Pengguna diupdate");
    res.redirect('/pengguna');
  });
});

// Proses Hapus Pengguna
router.post('/pengguna/delete/:id', (req, res) => {
  const sql = "DELETE FROM pengguna WHERE id_pengguna=?";
  
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error menghapus pengguna");
    }
    
    console.log("✅ Pengguna dihapus");
    res.redirect('/pengguna');
  });
});

module.exports = router;  // ← INI JUGA PENTING!