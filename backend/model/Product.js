const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const Product = Sequelize.define(
  "product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    discountLabel: { type: DataTypes.STRING, defaultValue: null },
    price: { type: DataTypes.FLOAT, allowNull: false },
    originalPrice: { type: DataTypes.FLOAT, defaultValue: null },
    shortDesc: { type: DataTypes.STRING, defaultValue: null },
    description: { type: DataTypes.STRING, allowNull: true },
    dimensions: { type: DataTypes.STRING, allowNull: true },
    weight: { type: DataTypes.STRING, allowNull: true },
    warranty: { type: DataTypes.STRING, allowNull: true },
    categoryId: {
      // changed from materialId to categoryId
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "category", key: "categoryId" }, // updated model name and key
    },
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalRatings: { type: DataTypes.INTEGER, defaultValue: 0 },
    isNewArrival: { type: DataTypes.BOOLEAN, defaultValue: false },
    isOffer: { type: DataTypes.BOOLEAN, defaultValue: false },
    productType: {
      type: DataTypes.ENUM("product", "accessory"),
      defaultValue: "product",
      allowNull: false,
    },
    singleSeaterOption: { type: DataTypes.INTEGER, allowNull: true },
    hangingOption: { type: DataTypes.STRING, allowNull: true },
    customizeLength: { type: DataTypes.STRING, allowNull: true },
    shippingPolicy: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "product",
    timestamps: true,
  }
);

module.exports = Product;
