const Review = require('../model/reviewModel');

exports.createReview = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);

    const { username, rating, comment, productId, userRole } = req.body;
    const reviewImage = req.file ? req.file.filename : null;

    if (!username || !rating || !comment || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newReview = await Review.create({
      username,
      rating,
      comment,
      productId,
      userRole,
      reviewImage,
    });

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (err) {
    console.error('❌ Error in createReview:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Review.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
