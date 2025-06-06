const Wishlist = require("../model/wishListModel");
const Product = require("../model/Product");
const Image = require("../model/ProductImage");
const ProductImage = require("../model/ProductImage");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if already in wishlist
    const exists = await Wishlist.findOne({ where: { userId, productId } });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }
    const wishlistItem = await Wishlist.create({
      userId: Number(userId),
      productId: Number(productId),
    });

    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const deleted = await Wishlist.destroy({ where: { userId, productId } });
    if (!deleted) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Remove from wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all wishlist items for a user
// Get all wishlist items for a user
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      attributes: ["productId"],
    });

    const productIds = wishlistItems.map((item) => item.productId);

    const products = await Product.findAll({
      where: { productId: productIds },
      include: [
        {
          model: ProductImage,
          attributes: ["imageUrl"],
        },
      ],
    });

    const formattedProducts = products.map((product) => {
      const productJSON = product.toJSON();
      return {
        ...productJSON,
        images: productJSON.productImage?.map((img) => img.imageUrl),
      };
    });

    res.status(200).json({
      productIds,
      products: formattedProducts,
    });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
