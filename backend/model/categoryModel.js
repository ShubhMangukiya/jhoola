// model/categoryModel.js
const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db');

const Category = Sequelize.define(
  'category',
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'unique_category', msg: 'Category must be unique' },
    },
    imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  },
  { tableName: 'category', timestamps: true }
);

module.exports = Category;
