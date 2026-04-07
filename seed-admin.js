const db = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [existing] = await db.execute('SELECT * FROM users WHERE email = "admin@agung.com"');
    
    if (existing.length === 0) {
      await db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'Admin Agung',
        'admin@agung.com',
        hashedPassword,
        'admin'
      ]);
      console.log('Admin account seeded successfully!');
      console.log('Email: admin@agung.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin account already exists.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedAdmin();
