    const { Review } = require('../models');
    const { authenticateToken } = require('../middleware/authMiddleware');

    exports.getAllReviews = async (req, res) => {
      try {
        const reviews = await Review.findAll({ include: ['User', 'Product'] });
        res.json(reviews);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
      }
    };

    exports.getReviewById = async (req, res) => {
      try {
        const review = await Review.findByPk(req.params.id, { include: ['User', 'Product'] });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
      } catch (error) { 
        res.status(500).json({ message: 'Error fetching review', error: error.message });
      }
    };

    exports.createReview = async (req, res) => {
      const { productId, rating, comment, image } = req.body;
      const userId = req.user.id; // From authenticated token

      try {
        const review = await Review.create({ userId, productId, rating, comment, image });
        res.status(201).json({ message: 'Review created successfully', review });
      } catch (error) {
        res.status(400).json({ message: 'Error creating review', error: error.message });
      }
    };

    exports.updateReview = async (req, res) => {
      const { rating, comment, image } = req.body;
      const userId = req.user.id;

      try {
        const review = await Review.findOne({ where: { id: req.params.id, userId } });
        if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });

        await review.update({ rating, comment, image });
        res.json({ message: 'Review updated successfully', review });
      } catch (error) {
        res.status(400).json({ message: 'Error updating review', error: error.message });
      }
    };

    exports.deleteReview = async (req, res) => {
      const userId = req.user.id;

      try {
        const review = await Review.findOne({ where: { id: req.params.id, userId } });
        if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });

        await review.destroy();
        res.json({ message: 'Review deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
      }
    };