import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, password } = formData;

    // Hardcoded admin login check on frontend
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedInOnce', 'true');
      // Directly navigate to admin panel without backend call
      navigate('/register-staff?access=true');
      return;
    }

    // For other users, call backend login
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL_AUTH_LOGIN || 'http://localhost:5000/api/auth/login',
        { username, password }
      );

      if (res.status === 200 && res.data.user) {
        const role = res.data.user.role;

        // Redirect based on role
        if (role === 'chef') {
          navigate('/chef');
        } else if (role === 'waiter') {
          navigate('/waiter');
        } else {
          setError('Unknown role.');
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
    <div className="min-h-screen flex justify-center items-center bg-orange-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Login</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your password"
          />
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

export default Login;
