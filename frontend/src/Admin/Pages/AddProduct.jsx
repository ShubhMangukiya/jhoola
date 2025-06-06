import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../components/Variable";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    discountLabel: "",
    price: "",
    originalPrice: "",
    shortDesc: "",
    description: "",
    dimensions: "",
    weight: "",
    warranty: "",
    materialId: "",
    categoryId: "",
    colorId: "",
    averageRating: "",
    totalRatings: "",
    isNewArrival: false,
    isOffer: false,
    productType: "product",
    singleSeaterOption: "",
    hangingOption: "",
    customizeLength: "",
    shippingPolicy: "",
  });

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, colorsRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/color`),
          axios.get(`${API_URL}/api/products`),
        ]);
        setCategories(categoriesRes.data);
        setColors(colorsRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories, colors, or products");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 8) {
      setError("You can upload up to 8 images only");
      return;
    }
    setError("");
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      images.forEach((file) => data.append("images", file));

      await axios.post(`${API_URL}/api/products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product created successfully!");
      setError("");
      setFormData({
        name: "",
        discountLabel: "",
        price: "",
        originalPrice: "",
        shortDesc: "",
        description: "",
        dimensions: "",
        weight: "",
        warranty: "",
        materialId: "",
        categoryId: "",
        colorId: "",
        averageRating: "",
        totalRatings: "",
        isNewArrival: false,
        isOffer: false,
        productType: "product",
        singleSeaterOption: "",
      });
      setImages([]);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Loading categories and colors...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "30px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 className="text-xl font-[700] font-[Poppins]">Add New Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit} className="font-[Poppins] mt-5">
        <label>Name*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Discount Label</label>
        <input
          type="text"
          name="discountLabel"
          value={formData.discountLabel}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Price*</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          style={inputStyle}
        />

        <label>Original Price</label>
        <input
          type="number"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          step="0.01"
          style={inputStyle}
        />

        <label>Short Description</label>
        <input
          type="text"
          name="shortDesc"
          value={formData.shortDesc}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* <label>Description (JSON string or text)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        /> */}

        <label>Dimensions</label>
        <input
          type="text"
          name="dimensions"
          value={formData.dimensions}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Weight</label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Warranty</label>
        <input
          type="text"
          name="warranty"
          value={formData.warranty}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Category*</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>

        <label>Color*</label>
        <select
          name="colorId"
          value={formData.colorId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select color</option>
          {colors.map((color) => (
            <option key={color.colorId} value={color.colorId}>
              {color.name}
            </option>
          ))}
        </select>

        <label>Average Rating</label>
        <input
          type="number"
          name="averageRating"
          value={formData.averageRating}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="5"
          style={inputStyle}
        />

        <label>Total Ratings</label>
        <input
          type="number"
          name="totalRatings"
          value={formData.totalRatings}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Hanging Option</label>
        <input
          type="text"
          name="hangingOption"
          value={formData.hangingOption}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Customize Length</label>
        <input
          type="text"
          name="customizeLength"
          value={formData.customizeLength}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Shipping Policy</label>
        <input
          type="text"
          name="shippingPolicy"
          value={formData.shippingPolicy}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>
          <input
            type="checkbox"
            name="isNewArrival"
            checked={formData.isNewArrival}
            onChange={handleChange}
            style={{ marginRight: "8px" }}
          />
          Is New Arrival
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            name="isOffer"
            checked={formData.isOffer}
            onChange={handleChange}
            style={{ marginRight: "8px" }}
          />
          Is Offer
        </label>

        <label>Product Type</label>
        <select
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="product">Product</option>
          <option value="accessory">Accessory</option>
        </select>

        <label>Single Seater Option</label>
        <input
          type="number"
          name="singleSeaterOption"
          value={formData.singleSeaterOption}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Upload Images (max 8)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Add Product
        </button>
      </form>
      <div style={{ marginTop: "40px" }}>
        <h2 className="text-xl font-[700] font-[Poppins]">Existing Products</h2>
        {products?.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Price</th>
                  {/* <th style={tableHeaderStyle}>Material</th> */}
                  <th style={tableHeaderStyle}>Image</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.productId}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={tableCellStyle}>{product.productId}</td>
                    <td style={tableCellStyle}>{product.name}</td>
                    <td style={tableCellStyle}>₹{product.price.toFixed(2)}</td>
                    {/* <td style={tableCellStyle}>
                      {product.material?.name || "N/A"}
                    </td> */}
                    <td style={tableCellStyle}>
                      {product?.productImages[0] ? (
                        <img
                          src={`${API_URL}/uploads/${product.productImages[0].imageUrl}`}
                          alt={product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => (e.target.src = "/placeholder.svg")}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  margin: "8px 0 16px",
  border: "2px solid #007BFF",
  borderRadius: "4px",
  boxSizing: "border-box",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#262B0D",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

const tableHeaderStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "12px",
  textAlign: "left",
  verticalAlign: "middle",
};

export default AddProduct;
