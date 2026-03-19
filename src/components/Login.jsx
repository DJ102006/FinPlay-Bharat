import React, { useState } from 'react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

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

        <form className="login-form">
          <h2>{isLogin ? "Welcome Back" : "Get Started"}</h2>
          <p>{isLogin ? "Login to access your gamified learning dashboard" : "Join India's first gamified financial literacy platform"}</p>
          
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" required />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="submit-btn" onClick={(e) => e.preventDefault()}>
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
