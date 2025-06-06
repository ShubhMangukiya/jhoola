const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Color = sequelize.define(
  'color',
  {
    colorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_color_name',
        msg: 'Color name must be unique',
      },
    },
  },
  {
    tableName: 'colors',  // plural
    timestamps: true,
  }
);

module.exports = Color;
