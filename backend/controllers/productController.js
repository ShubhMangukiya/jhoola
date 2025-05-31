  const { Product } = require('../models/associations');

  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.findAll({ include: ['Category'] });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: ['Category'] });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.createProduct = async (req, res) => {
    try {
      console.log('Creating product:', req.body, req.files);
      const { title, categoryId, description, price, originalPrice, isFeatured, isTopSelling, isListed, reviews } = req.body;
      const images = {
        image1: req.files['image1'] ? `/uploads/${req.files['image1'][0].filename}` : null,
        image2: req.files['image2'] ? `/uploads/${req.files['image2'][0].filename}` : null,
        image3: req.files['image3'] ? `/uploads/${req.files['image3'][0].filename}` : null,
        image4: req.files['image4'] ? `/uploads/${req.files['image4'][0].filename}` : null,
        video: req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null,
      };
      if (!title || !categoryId || !description || !price) {
        return res.status(400).json({ message: 'Title, categoryId, description, and price are required' });
      }
      const product = await Product.create({
        title, categoryId, description, price, originalPrice,
        ...images, isFeatured, isTopSelling, isListed,
        reviews: reviews ? JSON.parse(reviews) : null,
      });
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof multer.MulterError) {
        res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  };

  exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      const { title, categoryId, description, price, originalPrice, isFeatured, isTopSelling, isListed, reviews } = req.body;
      const images = {
        image1: req.files['image1'] ? `/uploads/${req.files['image1'][0].filename}` : product.image1,
        image2: req.files['image2'] ? `/uploads/${req.files['image2'][0].filename}` : product.image2,
        image3: req.files['image3'] ? `/uploads/${req.files['image3'][0].filename}` : product.image3,
        image4: req.files['image4'] ? `/uploads/${req.files['image4'][0].filename}` : product.image4,
        video: req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : product.video,
      };
      await product.update({
        title, categoryId, description, price, originalPrice,
        ...images, isFeatured, isTopSelling, isListed,
        reviews: reviews ? JSON.parse(reviews) : product.reviews,
      });
      res.json(product);
    } catch (error) {
      if (error instanceof multer.MulterError) {
        res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  };

  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      await product.destroy();
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Add multer to the controller for error handling
  const multer = require('multer');