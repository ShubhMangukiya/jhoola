const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const Cart = require('./Cart');
const Wishlist = require('./Wishlist');
const Review = require('./Review');

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' }); // Explicit alias

User.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// Reverse associations
Product.hasMany(Cart, { foreignKey: 'productId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });
Product.hasMany(Review, { foreignKey: 'productId' });

module.exports = { Category, Product, User, Cart, Wishlist, Review };