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
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.phone && !/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid contact number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    updateUser(formData);
    setSuccessMessage('Profile changes saved successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
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

        {successMessage && (
          <div className="success-banner">
            <AppIcon icon="twemoji:check-mark-button" /> {successMessage}
          </div>
        )}
        
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

        <form className="account-form" onSubmit={handleSave} noValidate>
          <div className="input-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="e.g. Alex Explorer"
              value={formData.fullName} 
              onChange={handleChange} 
              style={{ borderColor: errors.fullName ? '#ff6b6b' : '' }}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="input-group">
            <label>Email *</label>
            <input 
              type="email" 
              name="email"
              placeholder="your.email@school.edu"
              value={formData.email} 
              onChange={handleChange} 
              style={{ borderColor: errors.email ? '#ff6b6b' : '' }}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
              placeholder="e.g. 0771234567"
              value={formData.phone} 
              onChange={handleChange} 
              style={{ borderColor: errors.phone ? '#ff6b6b' : '' }}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <button type="submit" className="btn-primary save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Account;
