// models/Video.js
const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db');

const Video = Sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  video: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Video;
