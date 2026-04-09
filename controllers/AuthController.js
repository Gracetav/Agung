const db = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = {
  loginPage: (req, res) => {
    res.render('auth/login', { title: 'Login' });
  },
  
  registerPage: (req, res) => {
    res.render('auth/register', { title: 'Register' });
  },
  
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        req.flash('error_msg', 'Semua field harus diisi');
        return res.redirect('/auth/register');
      }
      
      const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        req.flash('error_msg', 'Email sudah terdaftar');
        return res.redirect('/auth/register');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")', [name, email, hashedPassword]);
      
      req.flash('success_msg', 'Pendaftaran berhasil, silakan login');
      res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Terjadi kesalahan sistem');
      res.redirect('/auth/register');
    }
  },
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      
      if (users.length === 0) {
        req.flash('error_msg', 'Email tidak terdaftar');
        return res.redirect('/auth/login');
      }
      
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        req.flash('error_msg', 'Password salah');
        return res.redirect('/auth/login');
      }
      
      if (!user.is_active) {
        req.flash('error_msg', 'Akun Anda sudah tidak aktif. Silakan buat akun baru.');
        return res.redirect('/auth/login');
      }

      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.role = user.role;
      
      if (user.role === 'admin') {
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/');
      }
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Terjadi kesalahan sistem');
      res.redirect('/auth/login');
    }
  },
  
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
  }
};
