import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../components/Variable';

function Color() {
  const [name, setName] = useState('');
  const [color, setColor] = useState([]);
  const [message, setMessage] = useState('');

  const fetchColor = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/color`);
      setColor(res.data);
    } catch (err) {
      console.error('Error fetching color');
    }
  };

  useEffect(() => {
    fetchColor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/color`, { name });
      setMessage(`Color ${res.data.name} created successfully`);
      setName('');
      fetchColor(); // refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error creating color');
    }
  };

  const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this color?');
  if (!confirmed) return; // user canceled

  try {
    await axios.delete(`${API_URL}/api/color/${id}`);
    setMessage('🗑️ Color deleted');
    fetchColor();
  } catch (err) {
    setMessage(' Error deleting color');
  }
};


  return (
    <div>
      <h2 className='text-xl font-[700] font-[Poppins]'>Add Color</h2>
      <form onSubmit={handleSubmit} className=''>
        <input
          type="text"
          value={name}
          placeholder="Enter color name"
          onChange={(e) => setName(e.target.value)}
          className='border p-2 border mt-3 rounded-lg w-[30vw] font-[Poppins]'
        /> <br />
        <button className='bg-[#262B0D] text-white p-2 rounded-lg mt-3 px-10 font-[Poppins]' type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      <h3 className='text-xl font-[Poppins] font-[700] mt-10'>Color List</h3>
      <table
  style={{
    borderCollapse: 'collapse',
    width: '100%',
    marginTop: '20px',
  }}
>
  <thead>
    <tr>
      <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>ID</th>
      <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th>
      <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {color.map((mat) => (
      <tr key={mat.colorId}>
        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{mat.colorId}</td>
        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{mat.name}</td>
        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
          <button
            onClick={() => handleDelete(mat.colorId)}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default Color;
