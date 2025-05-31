const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadProduct } = require('../middleware/upload');

// Add debug log to check imported controller
console.log('productController imported:', productController);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', uploadProduct, productController.createProduct);
router.put('/:id', uploadProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;