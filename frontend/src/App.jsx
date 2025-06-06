import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Cart from "./components/Cart";
import First from "./components/First";
import Loginpage from "./components/Loginpage";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import Wishlist from "./components/Wishlist";
import Contact from "./components/Contact";
import Ourstory from "./components/Ourstory";
import Shopby from "./components/Shopby";
import Singleproduct from "./components/Singleproduct";
import Profile from "./components/Profile";
import AllProduct from "./components/AllProduct";
import Home from "./Page/Home";
import NewProduct from "./components/NewProduct";
import ScrollToTop from "./components/ScrollTop";
import OrderSuccess from "./components/Order-success";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Admin Components
import AdminLayout from "./Admin/Component/AdminLayout";
import Dashboard from "./Admin/Pages/Dashboard";

import AddProduct from "./Admin/Pages/AddProduct";
import Color from "./Admin/Pages/Color";
import Category from "./Admin/Pages/Category";
import AdminOrders from "./Admin/Pages/AdminOrders";
import Instagram from "./Admin/Pages/Instagram";
import AdminSliderManager from "./Admin/Pages/AdminSliderManager";
import AdminReviews from "./Admin/Pages/AdminReviews";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="category" element={<Category />} />
            <Route path="products" element={<AddProduct />} />
            <Route path="color" element={<Color />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="instagram" element={<Instagram />} />
            <Route path="slider" element={<AdminSliderManager />} />
            <Route path="review" element={<AdminReviews />} />
          </Route>

          {/* Client Routes */}
          <Route path="*" element={<AppContent />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavAndFooter =
    location.pathname === "/Loginpage" || location.pathname === "/Signup";
  return (
    <>
      {!hideNavAndFooter && (
        <Suspense
          fallback={<div className="loading">Loading Navigation...</div>}
        >
          <Navbar />
        </Suspense>
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Loginpage" element={<Loginpage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Ourstory" element={<Ourstory />} />
        <Route path="/First" element={<First />} />
        <Route path="/Shopby" element={<Shopby />} />
        <Route path="/Shopby/:categoryId" element={<Shopby />} />
        <Route path="/Singleproduct/:productId" element={<Singleproduct />} />
        <Route path="/NewProduct" element={<NewProduct />} />
        <Route path="/AllProduct" element={<AllProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      {!hideNavAndFooter && (
        <Suspense fallback={<div className="loading">Loading Footer...</div>}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}

export default App;
