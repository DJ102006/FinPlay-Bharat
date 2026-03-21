import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { apiUrl } from '../lib/api';
import { setAuthSession } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const endpoint = isLogin ? "/login" : "/signup";
    
    try {
      const response = await fetch(apiUrl(`/api/auth${endpoint}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isLogin ? "Successfully logged in!" : "Account created successfully!");
        setAuthSession(data.token, data.user);
        setFormData({ name: '', email: '', password: '' });
        navigate(data.user?.isAdmin ? '/admin' : '/');
      } else {
        setIsError(true);
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Could not connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-toggle">
          <button 
            className={isLogin ? "active" : ""} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? "active" : ""} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Welcome Back" : "Get Started"}</h2>
          <p>{isLogin ? "Login to access your gamified learning dashboard" : "Join India's first gamified financial literacy platform"}</p>
          
          {message && (
            <div className={`status-message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p className="footer-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"} 
            <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? " Create one" : " Login here"}</span>
          </p>
        </form>
      </div>
    </div>
  );
}
