import React, { useState } from 'react';
import axios from 'axios';
import './StaffLogin.css'; // reuse same styling

const StaffLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chef');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
        role,
      });

      if (res.status === 200) {
        localStorage.setItem('staffUser', JSON.stringify(res.data.user));
        onLogin && onLogin(); // optional callback if needed
        alert('Login successful');
        // Redirect to role-based dashboard if needed
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="chef-login-bg">
      <form className="chef-login-form" onSubmit={handleSubmit}>
        <h2 className="chef-login-title">👨‍🍳 Staff Login</h2>
        
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="chef-login-input"
        >
          <option value="chef">Chef</option>
          <option value="waiter">Waiter</option>
        </select>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="chef-login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="chef-login-input"
          required
        />
        {error && <div className="chef-login-error">{error}</div>}
        <button type="submit" className="chef-login-btn">Login</button>
      </form>
    </div>
  );
};

export default StaffLogin;
