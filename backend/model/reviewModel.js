const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('review', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1, max: 5 } 
  },
  comment: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  reviewImage: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { 
      model: 'Product',   // **Table name in DB — lowercase plural "products" is typical**
      key: 'productId'            // The **primary key column** in products table — usually 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userRole: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'review', // Make sure this matches your actual table name
  timestamps: true,
});

module.exports = Review;
