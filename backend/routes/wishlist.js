const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.post('/', authenticateToken, addToWishlist);
router.get('/', authenticateToken, getWishlist);
router.delete('/:productId', authenticateToken, removeFromWishlist);

module.exports = router;