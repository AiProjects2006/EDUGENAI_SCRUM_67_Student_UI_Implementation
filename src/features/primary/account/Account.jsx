import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    password: user.password,
    phone: user.phone
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(formData);
    alert('Changes saved successfully!');
  };

  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="account-page">
      <div className="account-card glass-panel">
        <div className="account-header-top">
          <button type="button" className="back-btn" onClick={() => navigate('/profile')}>
            <span className="icon">←</span>
          </button>
          <h2 className="account-title">My Account</h2>
          <div className="placeholder-spacer"></div>
        </div>
        
        <div className="account-avatar-section">
          <div className="avatar-wrapper">
            <div className="avatar-large">
              {user.avatar && user.avatar.length > 10 ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user.avatar || '👤'
              )}
            </div>
            <button className="edit-avatar-btn" title="Change Picture" onClick={() => fileInputRef.current.click()}>📷</button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleAvatarChange}
            />
          </div>
          <button className="change-picture-text" onClick={() => fileInputRef.current.click()}>Change Picture</button>
        </div>

        <form className="account-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-container">
              <span className="input-icon">✉️</span>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password} 
                onChange={handleChange} 
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-container">
              <span className="input-icon">📞</span>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Account;
