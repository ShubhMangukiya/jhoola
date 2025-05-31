import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL } from "../config";

export default function Singleproduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({
    description: false,
    shipping: false,
    review: true,
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isInWishlist, setIsInWishlist] = useState(
    localStorage.getItem(`wishlist_${id}`) === "true"
  );
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Product data from API:", data);
      setProduct(data);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setReviewCount(data.reviews?.length || 0);
      setMainImage(
        `${BASE_URL}${data.image1 || data.image2 || data.image3 || data.image4 || "/placeholder.svg"}`
      );
    } catch (error) {
      console.error("Error fetching product:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
    setRating(4);
    setFeedback("");
    setUserName("");
    setUserRole("");
    setSelectedImage(null);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChooseImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const newReview = {
      id: reviews.length + 1,
      name: userName || "Anonymous User",
      role: userRole || "Customer",
      rating,
      comment: feedback,
      image: selectedImage || "/placeholder.svg",
      productId: id,
    };
    setReviews([newReview, ...reviews]);
    setReviewCount((prev) => prev + 1);
    closeReviewModal();

    try {
      const response = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!response.ok) throw new Error("Failed to save review");
      const savedReview = await response.json();
      console.log("Review saved:", savedReview);
    } catch (err) {
      console.error("Error saving review:", err);
      alert("Failed to save review. Try again.");
      setReviews(reviews); // Revert if save fails
      setReviewCount((prev) => prev - 1);
    }
  };

  const handleWishlistToggle = () => {
    const newValue = !isInWishlist;
    setIsInWishlist(newValue);
    localStorage.setItem(`wishlist_${id}`, newValue);
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (loading) return <div className="text-center p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center p-6 text-gray-600">Product not found</div>;

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen flex items-center justify-center p-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-8 max-w-7xl mx-auto items-start">
          {/* Left Section - Thumbnails */}
          <div className="flex flex-col gap-2">
            {[product.image1, product.image2, product.image3, product.image4]
              .filter((img) => img)
              .map((image, index) => (
                <img
                  key={index}
                  src={`${BASE_URL}${image}`}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-gray-300 hover:border-[#2A3114] transition"
                  onClick={() => handleThumbnailClick(`${BASE_URL}${image}`)}
                  onError={(e) => (e.target.src = `${BASE_URL}/placeholder.svg`)}
                />
              ))}
          </div>

          {/* Center Section - Main Image */}
          <div className="relative rounded-lg overflow-hidden shadow-md w-full h-[500px] bg-black">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = `${BASE_URL}/placeholder.svg`)}
            />
          </div>

          {/* Right Section - Product Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-serif">{product.title || "Unnamed Product"}</h1>
                <div className="text-sm text-gray-600 mt-1">
                  <Link to="/" className="hover:underline">Home</Link> /{" "}
                  <Link to="/Shopby" className="hover:underline">
                    {product.Category?.name || "Categories"}
                  </Link>{" "}
                  / {product.title}
                </div>
              </div>
              <button
                className="flex-shrink-0 rounded-full p-2 hover:bg-gray-100 transition-colors"
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`w-6 h-6 md:w-8 md:h-8 ${isInWishlist ? "fill-[#2A3114] text-[#2A3114]" : "text-gray-500"}`}
                />
              </button>
            </div>

            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? "text-lime-950" : "text-gray-300"} fill-current`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{reviewCount} Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center mb-6">
              <span className="text-2xl font-medium">₹{parseFloat(product.price || 0).toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">₹{parseFloat(product.originalPrice).toFixed(2)}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button className="py-3 px-4 bg-[#2A3114] text-white rounded hover:bg-[#3A4124] transition w-full">
                <Link to="/Checkout" className="flex items-center justify-center">
                  <span>Buy Now</span>
                </Link>
              </button>
              <button className="py-3 px-4 border border-lime-950 rounded transition w-full">
                <Link to="/Cart" className="flex items-center justify-center">
                  <span>Add to Cart</span>
                </Link>
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="border-t border-gray-200">
              <div className="py-4 border-b border-gray-200">
                <button
                  className="flex justify-between items-center w-full"
                  onClick={() => toggleSection("description")}
                >
                  <span className="font-medium">Description</span>
                  {openSections.description ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.description && (
                  <div className="py-4 space-y-3 text-sm text-gray-600">
                    <p>{product.description || "No description available"}</p>
                  </div>
                )}
              </div>

              <div className="py-4 border-b border-gray-200">
                <button
                  className="flex justify-between items-center w-full"
                  onClick={() => toggleSection("shipping")}
                >
                  <span className="font-medium">Shipping Information</span>
                  {openSections.shipping ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.shipping && (
                  <div className="py-4 text-sm text-gray-600">
                    <p>Shipping details to be added from backend.</p>
                  </div>
                )}
              </div>

              <div className="py-4 border-b border-gray-200">
                <button
                  className="flex justify-between items-center w-full"
                  onClick={() => toggleSection("review")}
                >
                  <span className="font-medium">Review</span>
                  {openSections.review ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.review && (
                  <div className="py-4 space-y-6">
                    <button
                      className="bg-[#2A3114] text-white py-2 px-6 rounded hover:bg-[#3A4124] transition"
                      onClick={openReviewModal}
                    >
                      Write Review
                    </button>
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 border-b border-gray-200 pb-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={review.image || "/placeholder.svg"}
                              alt="Review"
                              className="w-full h-full object-cover rounded"
                              onError={(e) => (e.target.src = "/placeholder.svg")}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{review.name}</h4>
                                <p className="text-xs text-gray-500">{review.role}</p>
                              </div>
                              <div className="flex">
                                {Array(5)
                                  .fill()
                                  .map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating ? "text-lime-950" : "text-gray-300"} fill-current`}
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                              </div>
                            </div>
                            <p className="mt-2 text-sm">"{review.comment}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No reviews yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md relative">
            <button
              onClick={closeReviewModal}
              className="absolute top-4 right-4 bg-[#2A3114] text-white rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleSubmitReview} className="p-6 rounded-xl border">
              <div className="flex justify-center mb-6">
                {Array(5)
                  .fill()
                  .map((_, star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star + 1)}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${star < rating ? "text-[#2A3114]" : "text-gray-300"} fill-current`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="userName" className="block mb-2 text-sm font-medium">
                    Your Name*
                  </label>
                  <input
                    type="text"
                    id="userName"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2A3114]"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userRole" className="block mb-2 text-sm font-medium">
                    Your Role
                  </label>
                  <input
                    type="text"
                    id="userRole"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2A3114]"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="feedback" className="block mb-2 text-sm font-medium">
                  Feedback*
                </label>
                <textarea
                  id="feedback"
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2A3114]"
                  placeholder="Write Your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium mr-4">Upload Image</span>
                  <button
                    type="button"
                    onClick={handleChooseImage}
                    className="bg-[#2A3114] text-white py-2 px-4 rounded text-sm"
                  >
                    Choose Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {selectedImage && (
                  <div className="mt-2">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="h-20 w-auto object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#2A3114] text-white py-3 rounded hover:bg-[#3A4124] transition"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}