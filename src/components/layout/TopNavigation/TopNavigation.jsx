import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../common/AppIcon/AppIcon';
import Profile from '../../../features/primary/profile/Profile';
import './TopNavigation.css';

const TopNavigation = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useUser();

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const [alerts, setAlerts] = useState({ missions: true, sounds: true });

  return (
    <>
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
            <button className="nav-bubble profile-btn" onClick={toggleProfile} style={{ padding: 0 }}>
              <span className="icon" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http')) ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <AppIcon icon={user.avatar || 'twemoji:bust-in-silhouette'} />
                )}
              </span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown glass-panel">
                <div className="dropdown-header" onClick={() => { setProfileModalOpen(true); setProfileOpen(false); }}>
                  <div className="avatar">
                    {user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http')) ? (
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
                  <li onClick={() => { setSettingsOpen(true); setProfileOpen(false); }} style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AppIcon icon="twemoji:gear" /> My Settings
                  </li>
                  <li className="logout" onClick={() => { 
                    sessionStorage.clear();
                    localStorage.removeItem('ocean_progress'); 
                    navigate('/login'); 
                    setProfileOpen(false); 
                  }}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {settingsOpen && (
        <div 
          className="settings-modal-overlay" 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
          onClick={() => setSettingsOpen(false)}
        >
          <div 
            className="settings-modal-content glass-panel" 
            style={{ width: '90%', maxWidth: '500px', padding: '30px', borderRadius: '20px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'white' }} onClick={() => setSettingsOpen(false)}>×</button>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:gear" /> My Secret Base</h2>

            <div className="settings-section" style={{ marginBottom: '25px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:artist-palette" /> World Theme</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => updateUser({ theme: 'daytime' })}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#4facfe',
                    border: user.theme === 'daytime' ? '3px solid #ffdc5d' : '3px solid transparent'
                  }}
                >
                  <AppIcon icon="twemoji:sun" /> Daytime Ocean
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => updateUser({ theme: 'midnight' })}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#1a2a6c', color: 'white',
                    border: user.theme === 'midnight' ? '3px solid #00f2fe' : '3px solid transparent'
                  }}
                >
                  <AppIcon icon="twemoji:crescent-moon" /> Midnight Ocean
                </button>
              </div>
            </div>

            <div className="settings-section" style={{ marginBottom: '25px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:bust-in-silhouette" /> My Avatar</h3>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                {['twemoji:boy', 'twemoji:girl', 'twemoji:turtle', 'twemoji:dolphin', 'twemoji:octopus'].map(avatarIcon => (
                  <div 
                    key={avatarIcon}
                    onClick={() => updateUser({ avatar: avatarIcon })}
                    style={{ 
                      width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)',
                      display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', cursor: 'pointer',
                      border: user.avatar === avatarIcon ? '3px solid #00f2fe' : '3px solid transparent',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <AppIcon icon={avatarIcon} />
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section" style={{ marginBottom: '25px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:bell" /> Mascot Alerts</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '10px', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>New Missions Reminders</span>
                <span onClick={() => setAlerts(p => ({...p, missions: !p.missions}))} style={{ fontSize: '24px', cursor: 'pointer' }}>
                  <AppIcon icon={alerts.missions ? "twemoji:check-mark-button" : "twemoji:cross-mark"} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Ocean Sounds & Music</span>
                <span onClick={() => setAlerts(p => ({...p, sounds: !p.sounds}))} style={{ fontSize: '24px', cursor: 'pointer' }}>
                  <AppIcon icon={alerts.sounds ? "twemoji:check-mark-button" : "twemoji:cross-mark"} />
                </span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setSettingsOpen(false)}>Save Changes</button>
          </div>
        </div>
      )}

      {profileModalOpen && (
        <Profile onClose={() => setProfileModalOpen(false)} />
      )}
    </>
  );
};

export default TopNavigation;
