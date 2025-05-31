const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Fixed path
const User = require('./User');
const Product = require('./Product');

const Review = sequelize.define('Review', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
  },
  comment: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING,
  },
});

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Review;