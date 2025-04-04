import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { API_BASE_URL } from '../api/api';

const BASE_URL = `${API_BASE_URL}/accounts`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/`, { username, password });
      localStorage.setItem('token', response.data.access);
      navigate('/');
    } catch (error) {
      setError('Invalid username or password');
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
