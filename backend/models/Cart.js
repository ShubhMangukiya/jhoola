const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Product = require('./Product.js');
const User = require('./User.js');

const Cart = sequelize.define('Cart', {
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
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { timestamps: true });

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Cart;