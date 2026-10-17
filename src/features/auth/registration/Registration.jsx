import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 4 || password !== confirmPassword) {
      return; // Do not submit if there are inline errors
    }

    // Save initial registration details to context
    updateUser({
      fullName: name,
      email: email,
      password: password
    });

    navigate('/verify-email');
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Join the Ocean Adventure <AppIcon icon="twemoji:water-wave" /></h2>
        {error && <div style={{ color: '#ef476f', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              placeholder="What's your name?" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a secret password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="4"
                required 
                style={{ width: '100%', paddingRight: '40px', borderColor: password && password.length < 4 ? '#ef476f' : '' }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem', userSelect: 'none' }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <AppIcon icon="twemoji:eye" /> : <AppIcon icon="twemoji:see-no-evil-monkey" />}
              </span>
            </div>
            {password && password.length < 4 && (
              <span style={{ color: '#ef476f', fontSize: '0.85rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
                Password must be at least 4 characters.
              </span>
            )}
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Type it again!" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="4"
                required 
                style={{ width: '100%', paddingRight: '40px', borderColor: confirmPassword && password !== confirmPassword ? '#ef476f' : '' }}
              />
              <span 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem', userSelect: 'none' }}
                title={showConfirmPassword ? "Hide Password" : "Show Password"}
              >
                {showConfirmPassword ? <AppIcon icon="twemoji:eye" /> : <AppIcon icon="twemoji:see-no-evil-monkey" />}
              </span>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span style={{ color: '#ef476f', fontSize: '0.85rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
                Passwords do not match.
              </span>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={password.length < 4 || password !== confirmPassword}>Register</button>
        </form>
        <p className="login-link">
          Already exploring? <span onClick={() => navigate('/login')}>Log in here</span>
        </p>
      </div>
    </div>
  );
};

export default Registration;
