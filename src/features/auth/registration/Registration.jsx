import React from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/profile-setup');
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Join the Adventure! 🌊</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" placeholder="What's your name?" required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Your email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Create a secret password" required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Type it again!" required />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="login-link">
          Already exploring? <span onClick={() => navigate('/login')}>Log in here</span>
        </p>
      </div>
    </div>
  );
};

export default Registration;
