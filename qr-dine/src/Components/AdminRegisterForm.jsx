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
    if (localStorage.getItem('isAdmin') !== 'true') {
      window.location.href = '/admin-login'; // redirect if not admin
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      setMessage(res.data.message);
      setFormData({ username: '', password: '', role: 'waiter' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div>
      <h2>Register New Staff</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="waiter">Waiter</option>
          <option value="chef">Chef</option>
        </select><br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminRegisterForm;
