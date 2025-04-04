import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'
import { API_BASE_URL } from '../api/api';

const BASE_URL = `${API_BASE_URL}/accounts`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/auth/register/`, {
        username: email.split("@")[0], // Generate a simple username from email
        email,
        password,
      });
  
      console.log("Registration successful:", response.data);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error.response?.data);
    }
  };
  

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        
      <input
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
