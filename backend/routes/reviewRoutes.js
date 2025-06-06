const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const reviewController = require('../controller/reviewController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/review_images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create review with optional image upload
router.post('/', upload.single('reviewImage'), reviewController.createReview);

// Get all reviews
router.get('/', reviewController.getAllReviews);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
