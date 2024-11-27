import React, { useState , useEffect} from 'react';
import './Register.css'; // Import the CSS file
import axios from "axios";
const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://api.tyhjyys.fun/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Registration successful');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button className="form-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
