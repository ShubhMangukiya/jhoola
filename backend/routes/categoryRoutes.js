
const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
  updatecategory
} = require('../controller/categoryController');
const upload=require('../middleware/uploadMiddleware')

router.post('/addcategory',upload.single('image'),createCategory);
router.get('/', getCategories);
router.put('/update/:categoryId',upload.single('image'), updatecategory);
router.delete('/delete/:categoryId', deleteCategory);

module.exports = router;

