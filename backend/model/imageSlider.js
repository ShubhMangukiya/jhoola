const { DataTypes } = require("sequelize");
const Sequelize = require('../config/db');

const Slider = Sequelize.define("Slider", {
  image1: { type: DataTypes.STRING, allowNull: true },
  slider1Link: { type: DataTypes.STRING, allowNull: true },

  image2: { type: DataTypes.STRING, allowNull: true },
  slider2Link: { type: DataTypes.STRING, allowNull: true },

  image3: { type: DataTypes.STRING, allowNull: true },
  slider3Link: { type: DataTypes.STRING, allowNull: true },

  image4: { type: DataTypes.STRING, allowNull: true },
  slider4Link: { type: DataTypes.STRING, allowNull: true },

  image5: { type: DataTypes.STRING, allowNull: true },
  slider5Link: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Slider;