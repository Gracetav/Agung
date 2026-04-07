const db = require('../config/db');

module.exports = {
  dashboard: async (req, res) => {
    const [[products]] = await db.query('SELECT COUNT(*) as total FROM products');
    const [[orders]] = await db.query('SELECT COUNT(*) as total FROM orders');
    const [[users]] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "user"');
    
    res.render('admin/dashboard', { stats: { products: products.total, orders: orders.total, users: users.total }, title: 'Admin Dashboard' });
  },
  
  users: async (req, res) => {
    const [users] = await db.execute('SELECT * FROM users WHERE role = "user" ORDER BY id DESC');
    res.render('admin/users/index', { users, title: 'User Management' });
  },
  
  deleteUser: async (req, res) => {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    req.flash('success_msg', 'User berhasil dihapus');
    res.redirect('/admin/users');
  }
};
