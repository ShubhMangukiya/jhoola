const express = require('express');
const router = express.Router();
const { createOrder, createRazorpayOrder, getUserOrders, getOrders, updateOrderStatus } = require('../controllers/ordersController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createOrder);
router.post('/razorpay', authenticateToken, createRazorpayOrder);
router.get('/manage', authenticateToken, getUserOrders); // For user-specific orders
router.get('/', getOrders); // For admin to fetch all orders
router.put('/update-status', updateOrderStatus); // For admin to update order status

module.exports = router;