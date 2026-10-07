import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';

const SecondaryDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', flexDirection: 'column' }}>
      <OceanBackground />
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--golden-yellow)' }}>
          <AppIcon icon="twemoji:construction" /> Under Construction
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          The Secondary Dashboard (Grades 6 - 11) is currently being built! Please check back later.
        </p>
        <button className="btn-primary" onClick={() => navigate('/grade-select')} style={{ margin: '0 auto' }}>
          Go Back to Grade Selection
        </button>
      </div>
    </div>
  );
};

export default SecondaryDashboard;
