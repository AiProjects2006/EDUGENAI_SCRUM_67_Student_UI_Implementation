import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Registration.css';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); 
      setOtp(newOtp);
      
      // Auto-advance
      if (index < 3) {
        inputRefs[index + 1].current.focus();
      } else {
        // Auto-submit when the 4th box is filled
        if (newOtp.join('').length === 4) {
          submitOtp(newOtp.join(''));
        }
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const submitOtp = (fullOtp) => {
    if (fullOtp.length < 4) {
      setError('Please enter all 4 digits.');
      return;
    }
    setError('');
    setTimeout(() => {
      navigate('/profile-setup');
    }, 500); // Tiny delay to let user see the 4th digit before redirecting
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

        <p style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' }}>
          Ahoy! We just sent a message in a bottle to your email address. 
          Enter the 4-digit secret code inside it to verify your account!
        </p>

        {error && <div style={{ color: '#ef476f', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '1rem' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: '60px',
                height: '70px',
                fontSize: '2.5rem',
                textAlign: 'center',
                borderRadius: '15px',
                border: '2px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
