const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ===== CRUD BARANG =====

// GET semua barang
router.get('/api/barang', (req, res) => {
  const sql = "SELECT * FROM barang ORDER BY id_barang ASC";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error GET barang:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    console.log(`✅ GET /api/barang - Found ${result.length} items`);
    res.json(result);
  });
});

// GET barang by ID
router.get('/api/barang/:id', (req, res) => {
  const sql = "SELECT * FROM barang WHERE id_barang = ?";
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error GET barang by ID:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ 
        error: "Not found", 
        message: "Barang tidak ditemukan" 
      });
    }
    
    console.log(`✅ GET /api/barang/${req.params.id} - Found`);
    res.json(result[0]);
  });
});

// POST barang baru
router.post('/api/barang', (req, res) => {
  const { nama_barang, stok, jenis_barang } = req.body;
  
  // Validasi
  if (!nama_barang || stok === undefined || !jenis_barang) {
    return res.status(400).json({ 
      error: "Validation error", 
      message: "nama_barang, stok, dan jenis_barang wajib diisi" 
    });
  }
  
  const sql = "INSERT INTO barang (nama_barang, stok, jenis_barang) VALUES (?, ?, ?)";
  
  db.query(sql, [nama_barang, stok, jenis_barang], (err, result) => {
    if (err) {
      console.error("❌ Error POST barang:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    console.log(`✅ POST /api/barang - Created ID: ${result.insertId}`);
    res.status(201).json({ 
      message: "Barang berhasil ditambahkan",
      id: result.insertId
    });
  });
});

// PUT update barang
router.put('/api/barang/:id', (req, res) => {
  const { nama_barang, stok, jenis_barang } = req.body;
  
  const sql = "UPDATE barang SET nama_barang=?, stok=?, jenis_barang=? WHERE id_barang=?";
  
  db.query(sql, [nama_barang, stok, jenis_barang, req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error PUT barang:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Not found", 
        message: "Barang tidak ditemukan" 
      });
    }
    
    console.log(`✅ PUT /api/barang/${req.params.id} - Updated`);
    res.json({ message: "Barang berhasil diupdate" });
  });
});

// DELETE barang
router.delete('/api/barang/:id', (req, res) => {
  const sql = "DELETE FROM barang WHERE id_barang=?";
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error DELETE barang:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Not found", 
        message: "Barang tidak ditemukan" 
      });
    }
    
    console.log(`✅ DELETE /api/barang/${req.params.id} - Deleted`);
    res.json({ message: "Barang berhasil dihapus" });
  });
});

module.exports = router;