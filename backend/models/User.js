const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  cart: { type: DataTypes.JSON, defaultValue: [] },
  wishlist: { type: DataTypes.JSON, defaultValue: [] },
}, { timestamps: true });

module.exports = User;