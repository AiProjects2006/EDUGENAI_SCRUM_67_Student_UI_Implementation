import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import './Modules.css';

const Modules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();
  const courseTitle = location.state?.course || 'Geometry Basics';

  useEffect(() => {
    triggerMascotVoice(`Welcome to ${courseTitle}! Let's start learning our modules.`);
  }, [triggerMascotVoice, courseTitle]);

  const modules = [
    { id: 1, title: 'Points, Lines, and Angles', status: 'completed', image: '📘' },
    { id: 2, title: 'Triangles and the Pythagorean Theorem', status: 'unlocked', image: '📗' },
    { id: 3, title: 'Polygons and Quadrilaterals', status: 'unlocked', image: '📙' },
    { id: 4, title: 'Circles and Symmetry', status: 'unlocked', image: '📕' },
    { id: 5, title: 'Introduction to 3D Shapes', status: 'unlocked', image: '📒' },
  ];

  const completedCount = modules.filter(m => m.status === 'completed').length;
  const totalCount = modules.length;

  return (
    <div className="modules-page">
      <div className="modules-header glass-panel">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/courses')} aria-label="Go Back">
            <svg className="back-icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h2>📐 {courseTitle}</h2>
        </div>
        <p className="progress-text">⭐ Progress: {completedCount}/{totalCount} Modules Completed</p>
      </div>

      <div className="modules-adventure-path">
        {modules.map((module, index) => (
          <div key={module.id} className="module-path-item">
            <div className={`module-card glass-panel ${module.status}`} onMouseEnter={() => triggerMascotVoice(module.title)}>
              <div className="module-icon">{module.image}</div>
              <div className="module-content">
                <p className="module-subtitle">Module {module.id}</p>
                <h3>{module.title}</h3>
                
                {module.status === 'locked' ? (
                   <button className="btn-secondary disabled">Locked 🔒</button>
                ) : (
                  <button className="btn-primary" onClick={() => navigate('/notes', { state: { module: module.title } })}>
                    {module.status === 'completed' ? '✅ Review' : '▶ Continue Learning'}
                  </button>
                )}
              </div>
            </div>
            {index < modules.length - 1 && <div className="path-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
