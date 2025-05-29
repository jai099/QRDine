import React, { useState } from 'react';
import './ChefLogin.css';

const ChefLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check against multiple static credentials
    const valid = CHEF_CREDENTIALS.some(
      cred => cred.username === username && cred.password === password
    );
    if (valid) {
      setError('');
      onLogin && onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="chef-login-bg">
      <form className="chef-login-form" onSubmit={handleSubmit}>
        <h2 className="chef-login-title">👨‍🍳 Chef Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="chef-login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="chef-login-input"
        />
        {error && <div className="chef-login-error">{error}</div>}
        <button type="submit" className="chef-login-btn">Login</button>
      </form>
    </div>
  );
};

export default ChefLogin;
