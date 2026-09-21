import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="profile-page profile-container">
      <div className="profile-card glass-panel">
        <h2 className="profile-title">Profile</h2>
        
        <div className="profile-header">
          <div className="avatar-large">
            {user.avatar && user.avatar.length > 10 ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.avatar || '👤'
            )}
          </div>
          <h3>{user.fullName}</h3>
          <p>{user.grade}</p>
        </div>

        <div className="profile-menu">
          <button className="menu-item" onClick={() => navigate('/account')}>
            <span className="icon">👤</span>
            <span className="text">My Account</span>
            <span className="arrow">›</span>
          </button>


          <button className="menu-item" onClick={() => navigate('/help')}>
            <span className="icon">❓</span>
            <span className="text">Help Center</span>
            <span className="arrow">›</span>
          </button>

          <button className="menu-item" onClick={() => navigate('/contact')}>
            <span className="icon">📞</span>
            <span className="text">Contact</span>
            <span className="arrow">›</span>
          </button>

          <button className="menu-item logout-btn" onClick={() => navigate('/login')}>
            <span className="text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
