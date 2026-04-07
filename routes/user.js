const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuth, isUser } = require('../middleware/auth');
const cartController = require('../controllers/CartController');
const orderController = require('../controllers/OrderController');
const productController = require('../controllers/ProductController');

// Multer Config for Payments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/');
  },
  filename: (req, file, cb) => {
    cb(null, 'pay_' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Catalog - Public Access
router.get('/', productController.catalog);
router.get('/products/:id', productController.detail);

// Cart - User Required
router.get('/user/cart', isAuth, isUser, cartController.view);
router.post('/user/cart/add', isAuth, isUser, cartController.add);
router.post('/user/cart/update', isAuth, isUser, cartController.update);
router.get('/user/cart/remove/:productId', isAuth, isUser, cartController.remove);

// Orders - User Required
router.post('/user/checkout', isAuth, isUser, orderController.checkout);
router.get('/user/orders', isAuth, isUser, orderController.myOrders);
router.get('/user/orders/:id', isAuth, isUser, orderController.viewOrder);
router.post('/user/orders/:id/payment', isAuth, isUser, upload.single('proof'), orderController.uploadPayment);

module.exports = router;
