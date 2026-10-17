import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Profile.css';

const Profile = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div 
      className="settings-modal-overlay" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="settings-modal-content glass-panel" 
        style={{ width: '90%', maxWidth: '500px', padding: '30px', borderRadius: '20px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'white', zIndex: 10 }} 
          onClick={onClose}
          title="Close Profile"
        >
          ×
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <AppIcon icon="twemoji:identification-card" /> My Profile
        </h2>
        
        <div className="profile-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="avatar-large" style={{ fontSize: '3.5rem', marginBottom: '5px' }}>
            {user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http')) ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} />
            ) : (
              <AppIcon icon={user.avatar || 'twemoji:bust-in-silhouette'} />
            )}
          </div>
          <h3 style={{ fontSize: '1.3rem', margin: '5px 0' }}>{user.fullName}</h3>
          <p style={{ color: 'var(--golden-yellow)', fontWeight: 'bold', margin: 0 }}>{user.grade}</p>
        </div>

        <div style={{ background: 'rgba(79, 172, 254, 0.2)', padding: '15px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(79, 172, 254, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
            <AppIcon icon="twemoji:calendar" /> <strong style={{ color: '#4facfe' }}>Academic Access</strong>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.9 }}>345 Days Remaining</p>
          <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
             <div style={{ width: '90%', height: '100%', background: '#4facfe', borderRadius: '4px' }}></div>
          </div>
        </div>

        <div className="settings-section" style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '10px', cursor: 'pointer' }}
            onClick={() => { onClose(); navigate('/account'); }}
          >
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:bust-in-silhouette" /> My Account</span>
            <AppIcon icon="twemoji:right-arrow" />
          </div>

          <div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '10px', cursor: 'pointer' }}
            onClick={() => { onClose(); navigate('/help'); }}
          >
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:question-mark" /> Help Center</span>
            <AppIcon icon="twemoji:right-arrow" />
          </div>

          <div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '10px', cursor: 'pointer' }}
            onClick={() => { onClose(); navigate('/contact'); }}
          >
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><AppIcon icon="twemoji:telephone-receiver" /> Contact</span>
            <AppIcon icon="twemoji:right-arrow" />
          </div>
          
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={() => {
          sessionStorage.clear();
          localStorage.removeItem('ocean_progress'); 
          onClose();
          navigate('/login');
        }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
