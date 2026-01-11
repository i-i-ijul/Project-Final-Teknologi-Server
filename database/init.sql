CREATE DATABASE IF NOT EXISTS manajemen_barang;
USE manajemen_barang;

-- Tabel utama: barang
CREATE TABLE IF NOT EXISTS barang (
    id_barang INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(100) NOT NULL,
    stok INT NOT NULL,
    jenis_barang VARCHAR(50) NOT NULL
);

-- Tabel pendukung: pengguna
CREATE TABLE IF NOT EXISTS pengguna (
    id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
    nama_pengguna VARCHAR(100) NOT NULL,
    id_barang INT,
    jadwal_shift VARCHAR(50),
    CONSTRAINT fk_barang
        FOREIGN KEY (id_barang)
        REFERENCES barang(id_barang)
        ON DELETE SET NULL
);

-- Data dummy awal
INSERT INTO barang (nama_barang, stok, jenis_barang)
VALUES ('Laptop Kantor', 10, 'Elektronik');

INSERT INTO pengguna (nama_pengguna, id_barang, jadwal_shift)
VALUES ('Andi', 1, 'Pagi');

SELECT 'Database initialized successfully!' AS status;
