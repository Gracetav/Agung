const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const config = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('--- Connecting to MySQL server ---');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`--- Database \`${process.env.DB_NAME}\` ensured ---`);

        await connection.query(`USE \`${process.env.DB_NAME}\`;`);

        // Categories table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        // Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Products table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price INT NOT NULL,
                stock INT NOT NULL,
                description TEXT,
                image VARCHAR(255),
                category_id INT,
                tipekendaraan VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            );
        `);

        // Orders table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_price INT NOT NULL,
                status ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
                shipping_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // Order Items table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                qty INT NOT NULL,
                price INT NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
        `);

        // Payments table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                proof VARCHAR(255) NOT NULL,
                status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            );
        `);

        // Add missing columns safely
        const alterations = {
            'users': ['ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE'],
            'products': [
                'ALTER TABLE products ADD COLUMN category_id INT',
                'ALTER TABLE products ADD COLUMN tipekendaraan VARCHAR(255)'
            ],
            'orders': ['ALTER TABLE orders ADD COLUMN shipping_address TEXT']
        };

        for (const table in alterations) {
            for (const sql of alterations[table]) {
                try {
                    await connection.query(sql);
                    console.log(`Executed: ${sql}`);
                } catch (err) {
                    // Column might already exist
                }
            }
        }

        console.log('--- All tables migrated successfully ---');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('--- Migration failed ---');
        console.error(error.stack);
        process.exit(1);
    }
}

migrate();
