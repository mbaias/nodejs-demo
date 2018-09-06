const express = require('express');
const uploadImageMiddleware = require('../middleware/uploadImage');
const checkAuth = require('../middleware/checkAuth');
const ProductsController = require('../controllers/products');

const router = express.Router();

router.get('/', ProductsController.allProducts);

router.post(
  '/',
  checkAuth,
  uploadImageMiddleware.single('productImage'),
  ProductsController.createProduct
);

router.get('/:productId', ProductsController.getProduct);

router.patch('/:productId', ProductsController.updateProduct);

router.delete('/:productId', checkAuth, ProductsController.deleteProduct);

module.exports = router;
