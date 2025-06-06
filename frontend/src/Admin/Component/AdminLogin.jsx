import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BG from "../../image/Adminbg.jpg"
import axios from 'axios';
import Logo from '../../image/login logo.svg'; // Adjust the path as necessary
import { API_URL } from '../../components/Variable';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    console.log('Login response:', res.data);
    const { token, user } = res.data.value;

    if (!user.role) {
      setError('Access denied: Not an admin.');
      return;
    }

    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));

    console.log("Login successful, navigating...");
    navigate('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    setError(err.response?.data?.message || 'Login failed');
  }
};



  return (
    <div
      style={{
        backgroundImage: `url(${BG})`, // <-- replace with actual path
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(5px)', // optional for more readability
      }}
    >
      <div style={{ maxWidth: 400, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: 20, borderRadius: 8 }}>

         <div className="flex justify-center items-center">
          <img src={Logo} alt="Logo" className="w-50 h-50" />
        </div> 

        <h2 className='text-3xl font-[700] font-[Poppins]'>Admin Login</h2><br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
            className='border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
            className='border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button type="submit" style={{ width: '100%', padding: 10 }} className='bg-black text-white rounded-md hover:bg-blue-600 transition-colors duration-200'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
