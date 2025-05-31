const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

router.post('/', authenticateToken, addToCart);
router.get('/', authenticateToken, getCart);
router.delete('/:productId', authenticateToken, removeFromCart);

module.exports = router;