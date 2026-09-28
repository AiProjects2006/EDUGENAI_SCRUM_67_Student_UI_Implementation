import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import '../registration/Registration.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.length < 4) return;
    navigate('/dashboard'); // Direct to dashboard on login
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Welcome Back Explorer! <AppIcon icon="twemoji:water-wave" /></h2>
        <form onSubmit={handleLogin}>
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
                placeholder="Enter your secret password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="4"
                required 
                style={{ width: '100%', paddingRight: '40px', borderColor: password && password.length < 4 ? '#ff6b6b' : '' }}
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
              <span style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
                Password must be at least 4 characters.
              </span>
            )}
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <span 
                onClick={() => navigate('/forgot-password')} 
                style={{ color: 'var(--golden-yellow)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
              >
                Forgot Password?
              </span>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={password && password.length < 4}>Log In</button>
        </form>
        <p className="login-link">
          New here? <span onClick={() => navigate('/registration')}>Register now</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
