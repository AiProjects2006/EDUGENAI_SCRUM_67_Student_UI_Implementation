import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './TopNavigation.css';

const TopNavigation = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  return (
    <nav className="top-navigation">
      <div className="nav-bubbles">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
          <span className="icon">🏠</span>
          <span className="label">Dashboard</span>
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
          <span className="icon">📚</span>
          <span className="label">Courses</span>
        </NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
          <span className="icon">🎯</span>
          <span className="label">Recommendations</span>
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
          <span className="icon">📈</span>
          <span className="label">My Progress</span>
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}>
          <span className="icon">⭐</span>
          <span className="label">Saved</span>
        </NavLink>
      </div>

      <div className="nav-right">
        <button className="nav-bubble notification-btn" onClick={() => alert('No new notifications!')}>
          <span className="icon">🔔</span>
          <span className="badge">3</span>
        </button>

        <div className="profile-container">
          <button className="nav-bubble profile-btn" onClick={toggleProfile}>
            <span className="icon">👤</span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown glass-panel">
              <div className="dropdown-header">
                <div className="avatar">👦</div>
                <div className="user-info">
                  <h4>Alex Explorer</h4>
                  <p>Grade 4</p>
                </div>
              </div>
              <ul className="dropdown-menu">
                <li onClick={() => { navigate('/profile'); setProfileOpen(false); }}>View Profile</li>
                <li onClick={() => { navigate('/profile'); setProfileOpen(false); }}>Edit Profile</li>
                <li onClick={() => { navigate('/settings'); setProfileOpen(false); }}>Settings</li>
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
