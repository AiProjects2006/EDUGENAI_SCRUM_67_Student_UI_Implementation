import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import '../registration/Registration.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setIsSent(true);
    // Simulate API call, then redirect after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Reset Password 🌊</h2>
        
        {!isSent ? (
          <>
            <p style={{ color: 'white', marginBottom: '1.5rem' }}>
              Enter your email address and we'll send you a magical link to reset your password.
            </p>
            <form onSubmit={handleReset}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="Your email" required />
              </div>
              <button type="submit" className="btn-primary">Send Reset Link</button>
            </form>
          </>
        ) : (
          <div style={{ padding: '2rem 0' }}>
            <h3 style={{ color: 'var(--aqua)', marginBottom: '1rem' }}>Message Sent! ✉️</h3>
            <p style={{ color: 'white' }}>
              If an account exists for that email, a reset link was sent. Redirecting back to login...
            </p>
          </div>
        )}

        <p className="login-link">
          Remember it? <span onClick={() => navigate('/login')}>Back to login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
