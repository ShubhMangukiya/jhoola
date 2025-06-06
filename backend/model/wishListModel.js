const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const Wishlist = Sequelize.define(
  "wishlist",
  {
    wishlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user", // Reference to User model
        key: "userId",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "product", // Reference to Product model
        key: "productId",
      },
    },
  },
  {
    tableName: "wishlist",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"], // Prevent duplicate entries
      },
    ],
  }
);

module.exports = Wishlist;