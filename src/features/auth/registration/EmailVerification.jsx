import React from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Registration.css';

const EmailVerification = () => {
  const navigate = useNavigate();

  const handleVerified = () => {
    // In a real app, this would happen automatically when they click the email link.
    // For now, we simulate them being verified and moving to profile setup.
    navigate('/profile-setup');
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--golden-yellow)' }}>
          Check Your Inbox! <AppIcon icon="twemoji:envelope-with-arrow" />
        </h2>
        
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>
          <AppIcon icon="twemoji:message-in-bottle" />
        </div>

        <p style={{ color: 'white', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.5' }}>
          Ahoy! We just sent a message in a bottle to your email address. 
          Please click the link inside it to verify your account and start your ocean adventure.
        </p>

        <button className="btn-primary" onClick={handleVerified} style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
          I've Verified My Email! <AppIcon icon="twemoji:check-mark-button" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
