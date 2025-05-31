const { sequelize } = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database authenticated successfully.');

    // Sync tables in correct order: categories first, then products
    await Category.sync({ force: true });
    console.log('Categories table synced.');
    await Product.sync({ force: true });
    console.log('Products table synced.');

    // Set up associations
    Category.hasMany(Product, { foreignKey: 'categoryId' });
    Product.belongsTo(Category, { foreignKey: 'categoryId' });
    console.log('Associations set up successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { initializeDB };