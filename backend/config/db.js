const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce_db', 'root', 'your_password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database authenticated successfully.');
    await sequelize.sync({ force: false }); // Set to true for initial setup
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect or sync database:', error);
  }
};

connectDB();

module.exports = sequelize;