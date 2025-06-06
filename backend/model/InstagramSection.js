const { DataTypes } = require("sequelize");
const sequelize = require('../config/db');

const InstagramSection = sequelize.define("InstagramSection", {
  reel1Image: { type: DataTypes.STRING, allowNull: true },
  reel1Link: { type: DataTypes.STRING, allowNull: true },
  reel1Alt: { type: DataTypes.STRING, allowNull: true },

  reel2Image: { type: DataTypes.STRING, allowNull: true },
  reel2Link: { type: DataTypes.STRING, allowNull: true },
  reel2Alt: { type: DataTypes.STRING, allowNull: true },

  reel3Image: { type: DataTypes.STRING, allowNull: true },
  reel3Link: { type: DataTypes.STRING, allowNull: true },
  reel3Alt: { type: DataTypes.STRING, allowNull: true },

  reel4Image: { type: DataTypes.STRING, allowNull: true },
  reel4Link: { type: DataTypes.STRING, allowNull: true },
  reel4Alt: { type: DataTypes.STRING, allowNull: true },

  reel5Image: { type: DataTypes.STRING, allowNull: true },
  reel5Link: { type: DataTypes.STRING, allowNull: true },
  reel5Alt: { type: DataTypes.STRING, allowNull: true },
});

module.exports = InstagramSection;
