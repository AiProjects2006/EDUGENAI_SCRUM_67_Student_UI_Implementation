import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import '../registration/Registration.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Email, 2 = Code + New Password, 3 = Success

  const handleSendCode = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Reset Password <AppIcon icon="twemoji:water-wave" /></h2>
        
        {step === 1 && (
          <>
            <p style={{ color: 'white', marginBottom: '1.5rem' }}>
              Enter your email address and we'll send you a magical code to reset your password.
            </p>
            <form onSubmit={handleSendCode}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="Your email" required />
              </div>
              <button type="submit" className="btn-primary">Send Reset Code</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: 'white', marginBottom: '1.5rem' }}>
              We sent a secret code to your email! Enter it below along with your new password.
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label>Secret Code</label>
                <input type="text" placeholder="123456" required />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input type="password" placeholder="New secret password" required />
              </div>
              <button type="submit" className="btn-primary">Reset My Password</button>
            </form>
          </>
        )}

        {step === 3 && (
          <div style={{ padding: '2rem 0' }}>
            <h3 style={{ color: 'var(--golden-yellow)', marginBottom: '1rem' }}>Success! <AppIcon icon="twemoji:party-popper" /></h3>
            <p style={{ color: 'white' }}>
              Your password has been reset! Redirecting you back to login...
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
