const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
const port = 4003;

// Load models & associations
const { Product, Category, Color, ProductImage,Cart,Wishlist } = require('./model/index');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const colorRoutes = require('./routes/colorRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes=require('./routes/cartRoutes')
const wishlistRoutes=require('./routes/wishlistRoutes')
const orderRoutes=require('./routes/orderRoutes')
const razorpayRoutes=require('./routes/razorpayRoutes')
const instagramRoutes=require('./routes/instagramRoutes')
const sliderRoutes=require('./routes/sliderRoutes')
const videoRoutes=require('./routes/videoRoutes')
const reviewRoutes=require('./routes/reviewRoutes')

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/color', colorRoutes);
app.use('/api/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/order', orderRoutes);
app.use('/razorpay', razorpayRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/slider', sliderRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found', status: 404 });
});

// Sync & start
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ DB Synced');
  app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('DB Sync Error:', err);
});
