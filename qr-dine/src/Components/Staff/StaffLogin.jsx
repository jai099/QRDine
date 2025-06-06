import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'waiter',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (res.status === 200 && res.data.user) {
        const userRole = res.data.user.role;

        // Redirect based on actual role from server
        if (userRole === 'waiter') {
          navigate('/waiter');
        } else if (userRole === 'chef') {
          navigate('/chef');
        } else {
          setError('Unknown role. Cannot redirect.');
        }
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-yellow-100 to-orange-100 font-sans">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Staff Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-bold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default StaffLogin;
