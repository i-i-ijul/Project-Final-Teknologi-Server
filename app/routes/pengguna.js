const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ===== CRUD PENGGUNA =====

// GET semua pengguna (dengan JOIN ke tabel barang)
router.get('/api/pengguna', (req, res) => {
  const sql = `
    SELECT p.*, b.nama_barang, b.stok, b.jenis_barang
    FROM pengguna p
    LEFT JOIN barang b ON p.id_barang = b.id_barang
    ORDER BY p.id_pengguna ASC
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error GET pengguna:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    console.log(`✅ GET /api/pengguna - Found ${result.length} items`);
    res.json(result);
  });
});

// GET pengguna by ID (dengan JOIN)
router.get('/api/pengguna/:id', (req, res) => {
  const sql = `
    SELECT p.*, b.nama_barang, b.stok, b.jenis_barang
    FROM pengguna p
    LEFT JOIN barang b ON p.id_barang = b.id_barang
    WHERE p.id_pengguna = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error GET pengguna by ID:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ 
        error: "Not found", 
        message: "Pengguna tidak ditemukan" 
      });
    }
    
    console.log(`✅ GET /api/pengguna/${req.params.id} - Found`);
    res.json(result[0]);
  });
});

// POST pengguna baru
router.post('/api/pengguna', (req, res) => {
  const { nama_pengguna, id_barang, jadwal_shift } = req.body;
  
  // Validasi
  if (!nama_pengguna) {
    return res.status(400).json({ 
      error: "Validation error", 
      message: "nama_pengguna wajib diisi" 
    });
  }
  
  const sql = "INSERT INTO pengguna (nama_pengguna, id_barang, jadwal_shift) VALUES (?, ?, ?)";
  
  db.query(sql, [nama_pengguna, id_barang || null, jadwal_shift || null], (err, result) => {
    if (err) {
      console.error("❌ Error POST pengguna:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    console.log(`✅ POST /api/pengguna - Created ID: ${result.insertId}`);
    res.status(201).json({ 
      message: "Pengguna berhasil ditambahkan",
      id: result.insertId
    });
  });
});

// PUT update pengguna
router.put('/api/pengguna/:id', (req, res) => {
  const { nama_pengguna, id_barang, jadwal_shift } = req.body;
  
  const sql = "UPDATE pengguna SET nama_pengguna=?, id_barang=?, jadwal_shift=? WHERE id_pengguna=?";
  
  db.query(sql, [nama_pengguna, id_barang || null, jadwal_shift || null, req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error PUT pengguna:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Not found", 
        message: "Pengguna tidak ditemukan" 
      });
    }
    
    console.log(`✅ PUT /api/pengguna/${req.params.id} - Updated`);
    res.json({ message: "Pengguna berhasil diupdate" });
  });
});

// DELETE pengguna
router.delete('/api/pengguna/:id', (req, res) => {
  const sql = "DELETE FROM pengguna WHERE id_pengguna=?";
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error DELETE pengguna:", err);
      return res.status(500).json({ 
        error: "Database error", 
        message: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Not found", 
        message: "Pengguna tidak ditemukan" 
      });
    }
    
    console.log(`✅ DELETE /api/pengguna/${req.params.id} - Deleted`);
    res.json({ message: "Pengguna berhasil dihapus" });
  });
});

module.exports = router;