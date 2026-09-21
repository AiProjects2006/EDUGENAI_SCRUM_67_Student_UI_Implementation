import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { useUser } from '../../../context/UserContext';
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
  const [avatarPreview, setAvatarPreview] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=registration&backgroundColor=b6e3f4');
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      password: password,
      avatar: avatarPreview
    });

    navigate('/profile-setup');
  };

  return (
    <div className="registration-page">
      <OceanBackground />
      <div className="registration-card glass-panel">
        <h2>Join the Adventure! 🌊</h2>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="avatar-section" style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={avatarPreview} 
              alt="Avatar" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} 
              onClick={() => fileInputRef.current.click()} 
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleAvatarChange}
            />
            <div style={{ marginTop: '0.5rem', color: '#fff', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }} onClick={() => fileInputRef.current.click()}>
              Upload Profile Picture
            </div>
          </div>
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
                style={{ width: '100%', paddingRight: '40px', borderColor: password && password.length < 4 ? '#ff6b6b' : '' }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem', userSelect: 'none' }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
            </div>
            {password && password.length < 4 && (
              <span style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
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
                style={{ width: '100%', paddingRight: '40px', borderColor: confirmPassword && password !== confirmPassword ? '#ff6b6b' : '' }}
              />
              <span 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem', userSelect: 'none' }}
                title={showConfirmPassword ? "Hide Password" : "Show Password"}
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </span>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
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
