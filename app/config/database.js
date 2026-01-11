const mysql = require("mysql2");

// Buat connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi dengan retry
let retryCount = 0;
const maxRetries = 10;

const testConnection = () => {
  db.getConnection((err, connection) => {
    if (err) {
      retryCount++;
      console.error(`❌ DB CONNECT ERROR (${retryCount}/${maxRetries}):`, err.message);
      
      if (retryCount < maxRetries) {
        console.log("🔄 Retrying in 5 seconds...");
        setTimeout(testConnection, 5000);
      } else {
        console.error("💀 Max retries reached. Exiting...");
        process.exit(1);
      }
    } else {
      console.log("✅ DB CONNECTED!");
      console.log(`   Host: ${process.env.DB_HOST}`);
      console.log(`   Database: ${process.env.DB_NAME}`);
      connection.release();
    }
  });
};

testConnection();

module.exports = db;