require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./config/database");

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine (untuk nanti frontend)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import API routes
const barangApiRoutes = require('./routes/barang');
const penggunaApiRoutes = require('./routes/pengguna');

// Import View routes
const barangViewRoutes = require('./routes/barang_views');      // ← Cek ini
const penggunaViewRoutes = require('./routes/pengguna_views');  // ← Dan ini

// API ROUTES
app.use('/', barangApiRoutes);
app.use('/', penggunaApiRoutes);

// VIEW ROUTES
app.use('/', barangViewRoutes);      // ← Line 31? Error di sini
app.use('/', penggunaViewRoutes);  // ← Line 32? Error di sini

// Routes
// Halaman Utama - Menampilkan Dashboard
app.get('/', (req, res) => {
  const queryBarang = 'SELECT COUNT(*) as count FROM barang';
  const queryPengguna = 'SELECT COUNT(*) as count FROM pengguna';

  db.query(queryBarang, (err, barangResult) => {
    if (err) throw err;
    db.query(queryPengguna, (err, penggunaResult) => {
      if (err) throw err;
      res.render('index', {
        title: 'Beranda',
        page: 'home',
        barangCount: barangResult[0].count,
        penggunaCount: penggunaResult[0].count
      });
    });
  });
});

// Halaman Manajemen Barang
app.get('/barang', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Not Found',
    page: 'error'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err);
  res.status(500).render('error', {
    title: 'Error',
    page: 'error',
    error: err.message
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log("🚀 SERVER STARTED!");
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Database: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log("=".repeat(50));
});

module.exports = app;