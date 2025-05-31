import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });

  const adminEmail = "admin";
  const adminPassword = "admin123";

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/all?email=${adminEmail}&password=${adminPassword}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      console.log("Fetched users:", data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  };

  const handleUpdateUser = async (userId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/update?email=${adminEmail}&password=${adminPassword}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, ...formData }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("User updated:", data);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/delete?email=${adminEmail}&password=${adminPassword}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("User deleted:", data);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert("Failed to delete user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p className="text-center font-medium text-gray-600">Loading users...</p>;
  if (error) return <p className="text-center font-medium text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 ml-64">
      <h1 className="text-2xl font-bold text-lime-950 mb-4">Manage Users</h1>
      {users.length > 0 ? (
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded-md bg-white">
              {editUser === user.id ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-lime-950">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#2c3118]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-lime-950">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#2c3118]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-lime-950">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#2c3118]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateUser(user.id)}
                      className="bg-[#2c3118] text-white px-4 py-2 rounded-md hover:bg-[#3a4a22]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditUser(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong>First Name:</strong> {user.firstName}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Created On:</strong>{" "}
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-[#2c3118] text-white px-4 py-2 rounded-md hover:bg-[#3a4a22]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center font-medium text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;