const { Wishlist, Product } = require('../models');

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const existingWishlistItem = await Wishlist.findOne({ where: { userId, productId } });
    if (existingWishlistItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    const product = await Product.findByPk(productId); // Fetch product details
    const responseData = {
      ...wishlistItem.toJSON(),
      name: product.title,
      price: product.price,
      image: product.image1, // Adjust based on your Product model
    };
    res.status(201).json({ message: 'Added to wishlist', wishlistItem: responseData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product }],
    });
    const formattedItems = wishlistItems.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.Product.title,
      price: item.Product.price,
      image: item.Product.image1, // Adjust based on your Product model
    }));
    res.json(formattedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const wishlistItem = await Wishlist.findOne({ where: { userId, productId } });
    if (!wishlistItem) return res.status(404).json({ message: 'Item not found in wishlist' });

    await wishlistItem.destroy();
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};