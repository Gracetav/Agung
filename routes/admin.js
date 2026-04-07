const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAdmin, isAuth } = require('../middleware/auth');
const adminController = require('../controllers/AdminController');
const productController = require('../controllers/ProductController');
const orderController = require('../controllers/OrderController');

// Multer Config for Products
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(isAuth, isAdmin);

router.get('/dashboard', adminController.dashboard);

// User Management
router.get('/users', adminController.users);
router.post('/users/delete/:id', adminController.deleteUser);

// Product Management
router.get('/products', productController.index);
router.get('/products/create', productController.create);
router.post('/products/create', upload.single('image'), productController.store);
router.get('/products/edit/:id', productController.edit);
router.post('/products/edit/:id', upload.single('image'), productController.update);
router.post('/products/delete/:id', productController.destroy);

// Order Management
router.get('/orders', orderController.index);
router.get('/orders/:id', orderController.adminViewOrder);
router.post('/orders/:id/status', orderController.updateStatus);

module.exports = router;
