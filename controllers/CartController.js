const db = require('../config/db');

module.exports = {
  view: async (req, res) => {
    if (!req.session.cart) req.session.cart = [];
    res.render('user/cart', { cart: req.session.cart, title: 'Keranjang Belanja' });
  },
  
  add: async (req, res) => {
    const { productId, qty } = req.body;
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) return res.redirect('/');
    
    const product = products[0];
    if (!req.session.cart) req.session.cart = [];
    
    const existingIndex = req.session.cart.findIndex(item => item.id === product.id);
    const quantityToAdd = parseInt(qty) || 1;
    
    if (existingIndex > -1) {
      req.session.cart[existingIndex].qty += quantityToAdd;
    } else {
      req.session.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: quantityToAdd,
        image: product.image
      });
    }
    
    req.flash('success_msg', 'Produk ditambahkan ke keranjang');
    res.redirect('/user/cart');
  },
  
  update: (req, res) => {
    const { productId, qty } = req.body;
    const index = req.session.cart.findIndex(item => item.id == productId);
    
    if (index > -1) {
      req.session.cart[index].qty = parseInt(qty);
    }
    
    res.redirect('/user/cart');
  },
  
  remove: (req, res) => {
    const { productId } = req.params;
    req.session.cart = req.session.cart.filter(item => item.id != productId);
    res.redirect('/user/cart');
  }
};
