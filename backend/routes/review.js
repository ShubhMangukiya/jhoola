const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAllReviews, getReviewById, createReview, updateReview, deleteReview } = require('../controllers/ReviewController');

router.get('/', authenticateToken, getAllReviews);
router.get('/:id', authenticateToken, getReviewById);
router.post('/', authenticateToken, createReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;