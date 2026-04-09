-- --- 1. SETUP DATABASE ---
CREATE DATABASE IF NOT EXISTS bengkel_agung;
USE bengkel_agung;

-- --- 2. HAPUS TABEL LAMA (URUTAN DITENTUKAN AGAR TIDAK ERROR FOREIGN KEY) ---
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- --- 3. BUAT TABEL-TABEL UTAMA ---

-- Tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Categories (Versi Premium)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    description TEXT,
    image VARCHAR(255),
    category_id INT,
    tipekendaraan VARCHAR(100), -- Matic, Bebek, Sport, dll
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabel Orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price INT NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'completed', 'rejected') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Order Items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabel Payments (Bukti Bayar)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    proof VARCHAR(255) NOT NULL,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- --- 4. SEED DATA (DATA AWAL) ---

-- Data Kategori
INSERT INTO categories (name, slug, description) VALUES 
('Oli & Pelumas', 'oli-pelumas', 'Suku cadang pelumas mesin motor'),
('Ban & Velg', 'ban-velg', 'Komponen roda motor'),
('Mesin & Transmisi', 'mesin-transmisi', 'Komponen jeroan mesin'),
('Kelistrikan', 'kelistrikan', 'Suku cadang elektrikal motor'),
('Body Part', 'body-part', 'Cover bodi dan frame original'),
('Aksesoris', 'aksesoris', 'Variasi dan pelengkap motor');

-- Data Admin (Password: admin123)
-- Menggunakan bcrypt hash yang valid
INSERT INTO users (name, email, password, role) VALUES 
('Admin Agung', 'admin@agung.com', '$2b$10$C8K0vS6Mubt0CInE1/E9ze.LpZ9u.jQvB9R7G5vXzVlG59U.p1W/m', 'admin');

-- Data Produk Contoh
INSERT INTO products (name, price, stock, description, category_id, tipekendaraan) VALUES 
('Oli Yamalube Matic 0.8L', 45000, 20, 'Oli mesin original Yamaha khusus motor Matic.', 1, 'Matic'),
('Oli Yamalube Silver 0.8L', 40000, 15, 'Oli mesin original Yamaha untuk motor Bebek.', 1, 'Bebek'),
('Ban FDR Sport XR Evo 80/90', 210000, 10, 'Ban FDR dengan daya cengkram tinggi.', 2, 'Universal'),
('Busi Denso Iridium', 95000, 30, 'Busi berperforma tinggi untuk akselerasi maksimal.', 4, 'Sport');
