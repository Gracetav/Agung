const db = require('../config/db');

module.exports = {
  index: async (req, res) => {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id DESC');
    res.render('admin/categories/index', { categories, title: 'Manajemen Kategori' });
  },

  create: (req, res) => {
    res.render('admin/categories/create', { title: 'Tambah Kategori' });
  },

  store: async (req, res) => {
    const { name } = req.body;
    // Slug generation: lowercase, remove non-alphanumeric (except spaces), then replace spaces with hyphens
    const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).join('-');
    
    if (!name) {
      req.flash('error_msg', 'Nama kategori wajib diisi');
      return res.redirect('/admin/categories/create');
    }

    try {
      await db.execute('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
      req.flash('success_msg', 'Kategori berhasil ditambahkan');
      res.redirect('/admin/categories');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Gagal menambahkan kategori. Nama/Slug sudah ada.');
      res.redirect('/admin/categories/create');
    }
  },

  edit: async (req, res) => {
    const [categories] = await db.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (categories.length === 0) return res.redirect('/admin/categories');
    res.render('admin/categories/edit', { category: categories[0], title: 'Edit Kategori' });
  },

  update: async (req, res) => {
    const { name, description, is_active } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    const activeStatus = is_active === 'on' ? 1 : 0;

    try {
      await db.execute('UPDATE categories SET name = ?, slug = ?, description = ?, is_active = ? WHERE id = ?', [name, slug, description, activeStatus, req.params.id]);
      req.flash('success_msg', 'Kategori berhasil diperbarui');
      res.redirect('/admin/categories');
    } catch (err) {
      req.flash('error_msg', 'Gagal update kategori.');
      res.redirect(`/admin/categories/edit/${req.params.id}`);
    }
  },

  destroy: async (req, res) => {
    await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    req.flash('success_msg', 'Kategori berhasil dihapus');
    res.redirect('/admin/categories');
  }
};
