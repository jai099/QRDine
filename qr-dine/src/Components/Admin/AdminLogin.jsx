// src/Components/Admin/AdminLogin.jsx

import React, { useState } from 'react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('canAccessRegisterStaff', 'true');
      window.location.href = '/register-staff'; // redirect to registration page
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 font-sans">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 border border-orange-200"
      >
        <h2 className="text-3xl font-extrabold text-orange-600 text-center mb-2 tracking-wider">Admin Login</h2>
        {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
        <div className="flex flex-col gap-2">
          <label className="text-orange-700 font-semibold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="Enter username"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-orange-700 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-300 text-white font-bold rounded-lg text-lg shadow-md hover:brightness-110 transition-all duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
