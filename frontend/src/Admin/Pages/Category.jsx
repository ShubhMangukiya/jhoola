import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL, userToken } from "../../components/Variable";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const fileInputRef = useRef(null);
  const userData = userToken();
  const token = userData?.token;
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      if (editingCategory) {
        await axios.put(
          `${API_URL}/api/categories/update/${editingCategory.categoryId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(`${API_URL}/api/categories/addcategory`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchCategories();
      setName("");
      setImage(null);
      setEditingCategory(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error saving category", error);
    }
  };

  const handleDelete = async (category) => {
    try {
      await axios.delete(
        `${API_URL}/api/categories/delete/${category.categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Categories</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded-md bg-white"
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 w-full rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          {editingCategory ? "Update" : "Add"} Category
        </button>
      </form>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <li
            key={category.categoryId}
            className="flex flex-col items-center p-4 border rounded-md shadow-md"
          >
            <span className="font-semibold mb-2">{category.name}</span>
            {console.log(`${API_URL}/uploads/${category.imageUrl}`)}
            {category.imageUrl && (
              <img
                src={`${API_URL}/uploads/${category.imageUrl}`}
                alt={category.name}
                className="w-20 h-20 object-cover rounded-md mb-2"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setName(category.name);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
              {/* <button
                onClick={() => handleDelete(category)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
