const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    const config = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('--- Seeding Categories ---');

        const [existing] = await connection.query('SELECT COUNT(*) as count FROM categories');
        if (existing[0].count === 0) {
            const categories = [
                ['Oli & Pelumas'],
                ['Ban & Velg'],
                ['Mesin & Transmisi'],
                ['Kelistrikan'],
                ['Body Part'],
                ['Aksesoris']
            ];
            await connection.query('INSERT INTO categories (name) VALUES ?', [categories]);
            console.log('--- Categories seeded successfully ---');
        } else {
            console.log('--- Categories already exist, skipping ---');
        }

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('--- Seeding failed ---');
        console.error(error.stack);
        process.exit(1);
    }
}

seed();
