const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const ProductImage = Sequelize.define("productImage", {
  imageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: "product",
      key: "productId",
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "productImage",
  timestamps: false,
});

module.exports = ProductImage;
