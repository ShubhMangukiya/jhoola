const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  title: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Categories', key: 'id' } },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  originalPrice: { type: DataTypes.FLOAT, allowNull: true },
  image1: { type: DataTypes.STRING, allowNull: true },
  image2: { type: DataTypes.STRING, allowNull: true },
  image3: { type: DataTypes.STRING, allowNull: true },
  image4: { type: DataTypes.STRING, allowNull: true },
  video: { type: DataTypes.STRING, allowNull: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  isTopSelling: { type: DataTypes.BOOLEAN, defaultValue: false },
  isListed: { type: DataTypes.BOOLEAN, defaultValue: true },
  reviews: { type: DataTypes.JSON, allowNull: true },
}, {
  timestamps: true,
});

module.exports = Product;