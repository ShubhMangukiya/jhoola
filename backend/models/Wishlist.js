const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Product = require('./Product.js');
const User = require('./User.js');

const Wishlist = sequelize.define('Wishlist', {
  userId: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'id' },
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' },
    allowNull: false,
  },
}, { timestamps: true });

Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Wishlist;