// Login.js
import React, { useEffect, useState } from 'react';
import './Login.css'; 
import axios from "axios";
import { redirect } from 'react-router-dom';
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    
    try {
      const response = await fetch('https://api.tyhjyys.fun/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onLogin();
        redirect("/")
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="form-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;