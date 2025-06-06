const Product = require("../model/Product");
const ProductImage = require("../model/ProductImage");
// Replace materialModel with categoryModel
const Category = require("../model/categoryModel");
const Color = require("../model/colorModel");
const Cart = require("../model/cartModel");
const Wishlist = require("../model/wishListModel");
const User = require("../model/user");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");
const InstagramSection=require('./InstagramSection')
const Slider=require('./imageSlider')
const Video=require('./Video')

// Associations

// A Product belongs to a Category (instead of Material)
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  // targetKey: 'id', // defaults to primary key, so often unnecessary
  constraints: true,
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// A Product belongs to a Color (unchanged)
Product.belongsTo(Color, {
  foreignKey: "colorId",
  targetKey: "colorId",
  constraints: true,
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Product has many ProductImages
Product.hasMany(ProductImage, { foreignKey: "productId" });
ProductImage.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Wishlist, { foreignKey: "userId", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Wishlist, { foreignKey: "productId", onDelete: "CASCADE" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });

Product.hasMany(Cart, { foreignKey: "productId", onDelete: "CASCADE" });
Cart.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  Product,
  ProductImage,
  Category,
  Color,
  Cart,
  Wishlist,
  Order,
  OrderItem,
  User,
  InstagramSection,
  Slider,
  Video
};
