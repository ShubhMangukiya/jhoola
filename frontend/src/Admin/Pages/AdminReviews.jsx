import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../components/Variable";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const thStyle = {
  backgroundColor: "#262B0D",
  color: "white",
  padding: "12px 15px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
  verticalAlign: "middle",
};

const imgStyle = {
  width: "120px",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "0 20px",
};

const headerStyle = {
  fontSize: "1.8rem",
  fontWeight: "700",
  color: "#333",
  marginBottom: "10px",
};

const loadingStyle = {
  fontSize: "1.2rem",
  textAlign: "center",
  marginTop: "50px",
  color: "#555",
};

const deleteBtnStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/reviews`);
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load reviews");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setDeletingId(id);
      await axios.delete(`${API_URL}/api/reviews/${id}`);
      // Remove deleted review from state
      setReviews(reviews.filter((review) => review.id !== id));
      setDeletingId(null);
    } catch (err) {
      alert("Failed to delete review");
      setDeletingId(null);
    }
  };

  if (loading) return <div style={loadingStyle}>Loading reviews...</div>;
  if (error) return <div style={loadingStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>All Reviews (Admin Panel)</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Rating</th>
            <th style={thStyle}>Comment</th>
            <th style={thStyle}>Product ID</th>
            <th style={thStyle}>Review Image</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td style={tdStyle}>{review.id}</td>
              <td style={tdStyle}>{review.username}</td>
              <td style={tdStyle}>{review.userRole || "N/A"}</td>
              <td style={tdStyle}>{review.rating}</td>
              <td style={tdStyle}>{review.comment}</td>
              <td style={tdStyle}>{review.productId}</td>
              <td style={tdStyle}>
                {review.reviewImage ? (
                  <img
                    src={`${API_URL}/uploads/review_images/${review.reviewImage}`}
                    alt="Review"
                    style={imgStyle}
                  />
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No Image
                  </span>
                )}
              </td>
              <td style={tdStyle}>
                {new Date(review.createdAt).toLocaleString()}
              </td>
              <td style={tdStyle}>
                <button
                  style={deleteBtnStyle}
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviews;
