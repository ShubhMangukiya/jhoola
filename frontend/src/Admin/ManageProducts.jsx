import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    price: '',
    originalPrice: '',
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    video: null,
    isFeatured: false,
    isTopSelling: false,
    reviews: '',
  });
  const [categories, setCategories] = useState([]);
  const [isListView, setIsListView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch(`${BASE_URL}/api/products`);
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch(`${BASE_URL}/api/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'reviews') {
        let reviewsData = [];
        try {
          if (formData[key].trim()) {
            reviewsData = JSON.parse(formData[key]);
          }
        } catch (error) {
          console.error('Invalid JSON in reviews field:', error);
          reviewsData = [];
        }
        formDataToSend.append(key, JSON.stringify(reviewsData));
      } else if (['image1', 'image2', 'image3', 'image4', 'video'].includes(key)) {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    const url = editId
      ? `${BASE_URL}/api/products/${editId}`
      : `${BASE_URL}/api/products`;
    const method = editId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      body: formDataToSend,
    });

    if (response.ok) {
      fetchProducts();
      setFormData({
        title: '',
        categoryId: '',
        description: '',
        price: '',
        originalPrice: '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        video: null,
        isFeatured: false,
        isTopSelling: false,
        reviews: '',
      });
      setIsModalOpen(false);
      setEditId(null);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      video: null,
      reviews: JSON.stringify(product.reviews),
    });
    setEditId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchProducts();
    }
  };

  const handleToggle = async (id) => {
    const response = await fetch(`${BASE_URL}/api/products/${id}/toggle`, {
      method: 'PATCH',
    });
    if (response.ok) fetchProducts();
  };

  const getFirstImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || '';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Add Product
      </button>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsListView(!isListView)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          {isListView ? 'Grid View' : 'List View'}
        </button>
      </div>
      <div className={isListView ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}>
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {getFirstImage(product) && (
              <img
                src={`${BASE_URL}${getFirstImage(product)}`}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <p className="text-green-600 font-bold">₹{product.price}</p>
              <p className="text-gray-500 line-through">₹{product.originalPrice}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleToggle(product.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  {product.isListed ? 'Unlist' : 'List'}
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
              <h3 className="text-xl font-semibold">{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Image 1</label>
                <input
                  type="file"
                  name="image1"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block mb-2">Image 2</label>
                <input
                  type="file"
                  name="image2"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block mb-2">Image 3</label>
                <input
                  type="file"
                  name="image3"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block mb-2">Image 4</label>
                <input
                  type="file"
                  name="image4"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block mb-2">Video</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="video/*"
                />
              </div>
              <div className="flex items-center">
                <label className="block mr-2">Featured</label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="block mr-2">Top Selling</label>
                <input
                  type="checkbox"
                  name="isTopSelling"
                  checked={formData.isTopSelling}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">Reviews (JSON)</label>
                <textarea
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder='[{"name":"John Doe","rating":4,"comment":"Great product"}]'
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

export default ManageProducts;