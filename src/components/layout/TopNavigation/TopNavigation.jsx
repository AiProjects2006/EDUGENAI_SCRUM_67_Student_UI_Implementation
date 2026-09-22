import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../common/AppIcon/AppIcon';
import './TopNavigation.css';

const TopNavigation = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  return (
    <nav className="top-navigation">
      {location.pathname !== '/activity' && (
        <div className="nav-bubbles">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
            <span className="icon"><AppIcon icon="twemoji:house" /></span>
            <span className="label">Dashboard</span>
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
            <span className="icon"><AppIcon icon="twemoji:books" /></span>
            <span className="label">Courses</span>
          </NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
            <span className="icon"><AppIcon icon="twemoji:direct-hit" /></span>
            <span className="label">Recommendations</span>
          </NavLink>
          <NavLink to="/progress" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
            <span className="icon"><AppIcon icon="twemoji:chart-increasing" /></span>
            <span className="label">My Progress</span>
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
            <span className="icon"><AppIcon icon="twemoji:star" /></span>
            <span className="label">Saved</span>
          </NavLink>
        </div>
      )}

      <div className="nav-right">
        <button className="nav-bubble notification-btn" onClick={() => alert('No new notifications!')}>
          <span className="icon"><AppIcon icon="twemoji:bell" /></span>
          <span className="badge">3</span>
        </button>

        <div className="profile-container">
          <button className="nav-bubble profile-btn" onClick={toggleProfile}>
            <span className="icon">
              {user.avatar && user.avatar.startsWith('data:') ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <AppIcon icon={user.avatar || 'twemoji:bust-in-silhouette'} />
              )}
            </span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown glass-panel">
              <div className="dropdown-header" onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                <div className="avatar">
                  {user.avatar && user.avatar.startsWith('data:') ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <AppIcon icon={user.avatar || 'twemoji:bust-in-silhouette'} />
                  )}
                </div>
                <div className="user-info">
                  <h4>{user.fullName || 'Alex Explorer'}</h4>
                  <p>{user.grade || 'Grade 4'}</p>
                </div>
                <span className="go-icon" style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>›</span>
              </div>
              <ul className="dropdown-menu">

                <li className="logout" onClick={() => { navigate('/login'); setProfileOpen(false); }}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
