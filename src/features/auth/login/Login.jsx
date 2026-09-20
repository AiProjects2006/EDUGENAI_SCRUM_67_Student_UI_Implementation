import React from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import '../registration/Registration.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Direct to dashboard on login
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Welcome Back Explorer! 🌊</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Your email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your secret password" required />
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <span 
                onClick={() => navigate('/forgot-password')} 
                style={{ color: 'var(--golden-yellow)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
              >
                Forgot Password?
              </span>
            </div>
          </div>
          <button type="submit" className="btn-primary">Log In</button>
        </form>
        <p className="login-link">
          New here? <span onClick={() => navigate('/registration')}>Register now</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
