import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', image: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    if (formData.image) formDataToSend.append('image', formData.image);

    const url = editId
      ? `${BASE_URL}/api/categories/${editId}`
      : `${BASE_URL}/api/categories`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        fetchCategories();
        setFormData({ name: '', image: null });
        setIsModalOpen(false);
        setEditId(null);
      } else {
        const errorText = await response.text();
        console.error('Failed to save category:', errorText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, image: null });
    setEditId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) fetchCategories();
        else console.error('Failed to delete category:', await response.text());
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Add Category
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 rounded shadow flex items-center">
            {category.image && (
              <img
                src={`${BASE_URL}${category.image}`}
                alt={category.name}
                className="w-16 h-16 object-cover mr-4"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;