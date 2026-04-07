const db = require('../config/db');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Admin Product Management
  index: async (req, res) => {
    const [products] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.render('admin/products/index', { products, title: 'Product Management' });
  },
  
  create: (req, res) => {
    res.render('admin/products/create', { title: 'Tambah Produk' });
  },
  
  store: async (req, res) => {
    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.filename : null;
    
    if (!name || !price || !stock) {
      req.flash('error_msg', 'Silakan isi semua data wajib');
      return res.redirect('/admin/products/create');
    }
    
    await db.execute('INSERT INTO products (name, price, stock, description, image) VALUES (?, ?, ?, ?, ?)', [name, price, stock, description, image]);
    
    req.flash('success_msg', 'Produk berhasil ditambahkan');
    res.redirect('/admin/products');
  },
  
  edit: async (req, res) => {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.redirect('/admin/products');
    
    res.render('admin/products/edit', { product: products[0], title: 'Edit Produk' });
  },
  
  update: async (req, res) => {
    const { name, price, stock, description } = req.body;
    const [oldProducts] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    let image = oldProducts[0].image;
    
    if (req.file) {
      if (image && fs.existsSync(path.join(__dirname, '../uploads/products/', image))) {
        fs.unlinkSync(path.join(__dirname, '../uploads/products/', image));
      }
      image = req.file.filename;
    }
    
    await db.execute('UPDATE products SET name = ?, price = ?, stock = ?, description = ?, image = ? WHERE id = ?', [name, price, stock, description, image, req.params.id]);
    
    req.flash('success_msg', 'Produk berhasil diperbarui');
    res.redirect('/admin/products');
  },
  
  destroy: async (req, res) => {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length > 0) {
      const image = products[0].image;
      if (image && fs.existsSync(path.join(__dirname, '../uploads/products/', image))) {
        fs.unlinkSync(path.join(__dirname, '../uploads/products/', image));
      }
      await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    }
    
    req.flash('success_msg', 'Produk berhasil dihapus');
    res.redirect('/admin/products');
  },
  
  // User Catalog
  catalog: async (req, res) => {
    const [products] = await db.query('SELECT * FROM products WHERE stock > 0 ORDER BY id DESC');
    res.render('user/catalog', { products, title: 'Katalog Produk' });
  },
  
  detail: async (req, res) => {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.redirect('/');
    
    res.render('user/product_detail', { product: products[0], title: products[0].name });
  }
};
