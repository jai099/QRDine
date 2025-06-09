import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'waiter',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const allowed = params.get('access');
    const sessionFlag = localStorage.getItem('adminLoggedInOnce');

    if (allowed !== 'true' || sessionFlag !== 'true') {
      window.location.href = '/login';
    } else {
      sessionStorage.removeItem('adminLoggedInOnce'); // use once
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL_AUTH_REGISTER || 'http://localhost:5000/api/auth/register',
        formData
      );
      setMessage(res.data.message);
      setFormData({ username: '', password: '', role: 'waiter' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedInOnce');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 font-sans relative px-4">
      
      {/* Top-right Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
      >
        Logout
      </button>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white mt-4 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 border border-orange-200"
      >
        <h2 className="text-3xl font-extrabold text-orange-600 text-center mb-2 tracking-wider">
          Register New Staff
        </h2>
        {message && <div className="text-green-600 text-center font-semibold">{message}</div>}
        <div className="flex flex-col gap-2">
          <label className="text-orange-700 font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="Enter username"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-orange-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="Enter password"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-orange-700 font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
          >
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-300 text-white font-bold rounded-lg text-lg shadow-md hover:brightness-110 transition-all duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default AdminRegisterForm;
