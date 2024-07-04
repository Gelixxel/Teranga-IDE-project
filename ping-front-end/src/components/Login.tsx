import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.data === 'Login successful') {
        navigate('/editor');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login error');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>TERANGA</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            id="username"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;