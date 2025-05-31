const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { uploadCategory } = require('../middleware/upload');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', uploadCategory, categoryController.createCategory);
router.put('/:id', uploadCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;