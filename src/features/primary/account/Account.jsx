import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    password: user.password || '',
    phone: user.phone || ''
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
            <span className="icon"><AppIcon icon="mdi:arrow-left" /></span>
          </button>
          <h2 className="account-title">My Account</h2>
          <div className="placeholder-spacer"></div>
        </div>
        
        <div className="account-avatar-section">
          <div className="avatar-wrapper">
            <div className="avatar-large">
              {user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http')) ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <AppIcon icon={user.avatar || 'mdi:account'} />
              )}
            </div>
            <button className="edit-avatar-btn" title="Change Picture" onClick={() => fileInputRef.current.click()}>
              <AppIcon icon="mdi:camera" />
            </button>
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
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Your email"
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password"
                value={formData.password} 
                onChange={handleChange} 
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem', userSelect: 'none' }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AppIcon icon="twemoji:eye" /> : <AppIcon icon="twemoji:see-no-evil-monkey" />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phone"
              placeholder="Your phone number"
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn-primary save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Account;
