import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./components/Cart";
import First from "./components/First";
import Loginpage from "./components/Loginpage";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import Wishlist from "./components/Wishlist";
import Contact from "./components/Contact";
import Ourstory from "./components/Ourstory";
import Shopby from "./components/Shopby";
import Singleproduct from "./components/Singleproduct"; // Matches the file name
import Profile from "./components/Profile";
import ProductListing from "./components/ProductListing";
import Home from "./Page/Home";
import NewProduct from "./components/Newproduct";
import AdminRoutes from "./Admin"; // Ensure this file exists and exports routes


function App() {
  return (
    <Router>
      <Routes>
        {/* Home and Landing Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/First" element={<First />} />

        {/* Authentication Pages */}
        <Route path="/Loginpage" element={<Loginpage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Profile" element={<Profile />} />

        {/* Shop and Product Pages */}
        <Route path="/Shopby" element={<Shopby />} />
        <Route path="/AllProduct" element={<ProductListing />} />
        <Route path="/singleproduct/:id" element={<Singleproduct />} /> {/* Consistent case */}
        <Route path="/NewProduct" element={<NewProduct />} />

        {/* Cart and Checkout */}
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />

        {/* Additional Pages */}
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Ourstory" element={<Ourstory />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;