const { Product, ProductImage, Category, Color } = require("../model");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");


// Create a new product (with optional multiple images)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      discountLabel,
      price,
      originalPrice,
      shortDesc,
      description,
      dimensions,
      weight,
      warranty,
      categoryId,
      colorId,
      averageRating,
      totalRatings,
      isNewArrival,
      isOffer,
      productType,
      singleSeaterOption,
      hangingOption, 
      customizeLength,
      shippingPolicy,
    } = req.body;

    // Create product
    const product = await Product.create({
      name,
      discountLabel,
      price,
      originalPrice,
      shortDesc,
      description: description ? JSON.parse(description) : null,
      dimensions,
      weight,
      warranty,
      categoryId: categoryId || null,
      colorId: colorId || null,
      averageRating: averageRating || 0,
      totalRatings: totalRatings || 0,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      isOffer: isOffer === "true" || isOffer === true,
      productType: productType || "product",
      singleSeaterOption: singleSeaterOption || null,
      hangingOption: hangingOption || null, // ✅ added
      customizeLength: customizeLength || null, // ✅ added
      shippingPolicy: shippingPolicy || null, // ✅ added
    });

    // Handle image uploads (req.files from multer)
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        productId: product.productId,
        imageUrl: file.filename,
      }));
      await ProductImage.bulkCreate(images);
    }

    const productWithAssociations = await Product.findByPk(product.productId, {
      include: [Category, Color, ProductImage],
    });

    res.status(201).json({ success: true, product: productWithAssociations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all products with related data
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, Color, ProductImage],
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID with related data
exports.getProductById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  // if (isNaN(id)) {
  //   return res.status(400).json({ error: "Invalid product ID" });
  // }

  console.log("Requested product ID:", id);

  try {
    const product = await Product.findByPk(id, {
      include: [Category, Color, ProductImage],
    });

    if (!product) {
      return res.status(404).json({ error: `Product with ID ${id} not found` });
    }
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update product by ID (also handle updating images)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const {
      name,
      discountLabel,
      price,
      originalPrice,
      shortDesc,
      description,
      dimensions,
      weight,
      warranty,
      categoryId,
      colorId,
      averageRating,
      totalRatings,
      isNewArrival,
      isOffer,
      productType,
      singleSeaterOption,
    } = req.body;

    await product.update({
      name,
      discountLabel,
      price,
      originalPrice,
      shortDesc,
      description: description ? JSON.parse(description) : null,
      dimensions,
      weight,
      warranty,
      categoryId: categoryId || null,
      colorId: colorId || null,
      averageRating: averageRating || 0,
      totalRatings: totalRatings || 0,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      isOffer: isOffer === "true" || isOffer === true,
      productType: productType || "product",
      singleSeaterOption: singleSeaterOption || null,
    });

    // Handle new images uploaded in update (optional)
    if (req.files && req.files.length > 0) {
      // Delete old images from DB and disk if needed (optional)
      const oldImages = await ProductImage.findAll({
        where: { productId: product.productId },
      });
      for (const img of oldImages) {
        const imgPath = path.join(__dirname, "..", "uploads", img.imageUrl);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
      await ProductImage.destroy({ where: { productId: product.productId } });

      // Add new images
      const images = req.files.map((file) => ({
        productId: product.productId,
        imageUrl: file.filename,
      }));
      await ProductImage.bulkCreate(images);
    }

    const updatedProduct = await Product.findByPk(product.productId, {
      include: [Category, Color, ProductImage],
    });

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete product by ID (also delete images)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Delete images from disk & DB
    const images = await ProductImage.findAll({
      where: { productId: product.productId },
    });
    for (const img of images) {
      const imgPath = path.join(__dirname, "..", "uploads", img.imageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await ProductImage.destroy({ where: { productId: product.productId } });

    await product.destroy();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


