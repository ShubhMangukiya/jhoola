const { Order, Cart, User } = require("../models");
const Razorpay = require("razorpay");
require("dotenv").config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_GFyWZxg5tFOLm7",
  key_secret: process.env.RAZORPAY_SECRET_KEY || "your_razorpay_key_secret",
});

exports.createOrder = async (req, res) => {
  const {
    cartItems,
    total,
    paymentMethod,
    firstName,
    lastName,
    phone,
    email,
    address,
    apartment,
    city,
    state,
    zipCode,
    tax,
    shipping,
    subtotal,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;
  const userId = req.user.id;

  const requiredFields = [
    "cartItems",
    "total",
    "paymentMethod",
    "firstName",
    "lastName",
    "phone",
    "email",
    "address",
    "city",
    "state",
    "zipCode",
    "tax",
    "shipping",
    "subtotal",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
  }

  try {
    let orderStatus = paymentMethod === "online" ? "pending" : "confirmed";
    let paymentId = razorpay_payment_id || null;

    if (paymentMethod === "online" && razorpay_payment_id) {
      const payment = await instance.payments.fetch(razorpay_payment_id);
      if (payment.status === "captured" && payment.amount === total * 100) {
        orderStatus = "confirmed";
      } else {
        return res.status(400).json({ message: "Payment verification failed" });
      }
    }

    const order = await Order.create({
      userId,
      total,
      paymentId,
      paymentMethod,
      status: orderStatus,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.price || 0,
      })),
      firstName,
      lastName,
      phone,
      email,
      address,
      apartment,
      city,
      state,
      zipCode,
      tax,
      shipping,
      subtotal,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    await Cart.destroy({ where: { userId } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({ where: { userId } });
    if (!orders || orders.length === 0) {
      return res.status(200).json([]); // Return empty array if no orders
    }
    const parsedOrders = orders.map((order) => ({
      ...order.toJSON(),
      items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
    }));
    res.json(parsedOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  const adminEmail = "admin";
  const adminPassword = "admin123";
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ message: "Admin email and password are required" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    console.log("Credentials mismatch:", { email, password });
    return res.status(401).json({ message: "Unauthorized: Invalid admin credentials" });
  }

  try {
    const orders = await Order.findAll();
    const parsedOrders = orders.map((order) => ({
      ...order.toJSON(),
      items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
    }));
    res.json(parsedOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Error fetching all orders", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  const { email, password } = req.query;

  const adminEmail = "admin";
  const adminPassword = "admin123";
  if (!email || !password) {
    return res.status(400).json({ message: "Admin email and password are required" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin credentials" });
  }

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const parsedOrder = {
      ...order.toJSON(),
      items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
    };
    res.status(200).json({ message: "Order status updated successfully", order: parsedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  const { total, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    if (paymentMethod !== "online") {
      return res.status(400).json({ message: "Invalid payment method for Razorpay order creation" });
    }

    const options = {
      amount: total * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    const razorpayOrder = await instance.orders.create(options);
    res.status(200).json({ order: razorpayOrder });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
  }
};