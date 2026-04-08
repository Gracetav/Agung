const db = require('../config/db');

module.exports = {
  // User Actions
  checkout: async (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) return res.redirect('/user/cart');
    
    const { shipping_address } = req.body;
    let total_price = 0;
    req.session.cart.forEach(item => total_price += (item.qty * item.price));
    
    const [result] = await db.execute('INSERT INTO orders (user_id, total_price, status, shipping_address) VALUES (?, ?, "pending", ?)', [req.session.userId, total_price, shipping_address]);
    const order_id = result.insertId;
    
    for (const item of req.session.cart) {
      await db.execute('INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)', [order_id, item.id, item.qty, item.price]);
      await db.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.qty, item.id]);
    }
    
    req.session.cart = [];
    req.flash('success_msg', 'Pemesanan berhasil, silakan upload bukti pembayaran');
    res.redirect(`/user/orders/${order_id}`);
  },
  
  viewOrder: async (req, res) => {
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.session.userId]);
    if (orders.length === 0) return res.redirect('/user/orders');
    
    const [items] = await db.execute('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [req.params.id]);
    const [payments] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [req.params.id]);
    
    res.render('user/order_detail', { order: orders[0], items, payment: payments[0], title: 'Detail Pesanan' });
  },
  
  myOrders: async (req, res) => {
    const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.session.userId]);
    res.render('user/orders', { orders, title: 'Pesanan Saya' });
  },
  
  uploadPayment: async (req, res) => {
    const order_id = req.params.id;
    const proof = req.file ? req.file.filename : null;
    
    if (!proof) {
      req.flash('error_msg', 'Silakan upload gambar bukti transfer');
      return res.redirect(`/user/orders/${order_id}`);
    }
    
    await db.execute('INSERT INTO payments (order_id, proof, status) VALUES (?, ?, "pending")', [order_id, proof]);
    
    req.flash('success_msg', 'Bukti pembayaran berhasil diupload, silakan tunggu konfirmasi admin.');
    res.redirect(`/user/orders/${order_id}`);
  },
  
  // Admin Actions
  index: async (req, res) => {
    const [orders] = await db.execute('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.id DESC');
    res.render('admin/orders/index', { orders, title: 'Order Management' });
  },
  
  adminViewOrder: async (req, res) => {
    const [orders] = await db.execute('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?', [req.params.id]);
    if (orders.length === 0) return res.redirect('/admin/orders');
    
    const [items] = await db.execute('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [req.params.id]);
    const [payments] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [req.params.id]);
    
    res.render('admin/orders/view', { order: orders[0], items, payment: payments[0], title: 'Detail Pesanan Admin' });
  },
  
  updateStatus: async (req, res) => {
    const { status } = req.body;
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    
    req.flash('success_msg', 'Status pesanan diperbarui');
    res.redirect(`/admin/orders/${req.params.id}`);
  }
};
