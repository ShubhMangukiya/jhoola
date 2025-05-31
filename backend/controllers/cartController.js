const { Cart } = require('../models');
const Product = require('../models/Product'); // Direct import without destructuring

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const existingCartItem = await Cart.findOne({ where: { userId, productId } });
    if (existingCartItem) {
      await existingCartItem.update({ quantity: existingCartItem.quantity + (quantity || 1) });
      return res.json({ message: 'Cart updated', cartItem: existingCartItem });
    }

    const cartItem = await Cart.create({ userId, productId, quantity: quantity || 1 });
    res.status(201).json({ message: 'Added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product, // Direct model reference
        as: 'product', // Match with association alias if defined
      }],
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Get Cart Error:', error); // Debug log
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};