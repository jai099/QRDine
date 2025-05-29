// src/LoginRegister.jsx
import React, { useState } from 'react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    role: 'Chef',
    username: '',
    password: '',
  });
  const [lastLogin, setLastLogin] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage('All fields are required');
      return;
    }

    if (isLogin) {
      const now = new Date().toLocaleString();
      setLastLogin(now);
      setMessage(`Welcome back, ${formData.username}!`);
    } else {
      setMessage(`User ${formData.username} registered successfully as ${formData.role}.`);
    }

    setFormData({ role: 'Chef', username: '', password: '' });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Chef">Chef</option>
            <option value="Waiter">Waiter</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      {message && <div className="text-green-600 text-center font-medium">{message}</div>}

      {lastLogin && isLogin && (
        <div className="text-sm text-gray-600 text-center">Last Login: {lastLogin}</div>
      )}

      <div className="text-center mt-4">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          className="text-blue-600 font-medium underline"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;
