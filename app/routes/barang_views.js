const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Halaman List Barang
router.get('/barang', (req, res) => {
  const sql = "SELECT * FROM barang ORDER BY id_barang ASC";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).render('error', { 
        title: 'Error',
        page: 'error',
        error: err.message 
      });
    }
    
    res.render('barang/index', {
      title: 'Daftar Barang',
      page: 'barang',
      barang: results
    });
  });
});

// Form Tambah Barang
router.get('/barang/create', (req, res) => {
  res.render('barang/create', {
    title: 'Tambah Barang',
    page: 'barang'
  });
});

// Proses Tambah Barang
router.post('/barang/create', (req, res) => {
  const { nama_barang, stok, jenis_barang } = req.body;
  const sql = "INSERT INTO barang (nama_barang, stok, jenis_barang) VALUES (?, ?, ?)";
  
  db.query(sql, [nama_barang, stok, jenis_barang], (err) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error menambahkan barang");
    }
    
    console.log("✅ Barang ditambahkan");
    res.redirect('/barang');
  });
});

// Form Edit Barang
router.get('/barang/edit/:id', (req, res) => {
  const sql = "SELECT * FROM barang WHERE id_barang = ?";
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send("Barang tidak ditemukan");
    }
    
    res.render('barang/edit', {
      title: 'Edit Barang',
      page: 'barang',
      barang: results[0]
    });
  });
});

// Proses Update Barang
router.post('/barang/edit/:id', (req, res) => {
  const { nama_barang, stok, jenis_barang } = req.body;
  const sql = "UPDATE barang SET nama_barang=?, stok=?, jenis_barang=? WHERE id_barang=?";
  
  db.query(sql, [nama_barang, stok, jenis_barang, req.params.id], (err) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error mengupdate barang");
    }
    
    console.log("✅ Barang diupdate");
    res.redirect('/barang');
  });
});

// Proses Hapus Barang
router.post('/barang/delete/:id', (req, res) => {
  const sql = "DELETE FROM barang WHERE id_barang=?";
  
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Error menghapus barang");
    }
    
    console.log("✅ Barang dihapus");
    res.redirect('/barang');
  });
});

module.exports = router;  // ← INI PENTING!