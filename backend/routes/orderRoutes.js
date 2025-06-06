const express = require("express");
const router = express.Router();
const orderControlller = require("../controller/orderController");
// const authMiddleware=require('../Middlewares/authMiddleware')

router.post("/create",orderControlller.createOrder);
router.get("/getall",orderControlller.getAllOrders);
router.get("/getorderbyid/:orderId",orderControlller.getOrderById);
router.get("/getuserorder/:userId",orderControlller.getUserOrders);
router.put("/updatestatus/:orderId",orderControlller.updateOrderStatus);
router.put("/cancel/:orderId",orderControlller.cancelOrder);
router.get('/analytics',orderControlller.getOrderAnalytics);
router.get('/delete/:orderId',orderControlller.deleteOrder);

module.exports = router;
