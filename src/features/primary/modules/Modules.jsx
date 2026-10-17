import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { useSaved } from '../../../context/SavedContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import { fetchCourseModules, fetchAllSlideCounts } from '../../../services/CourseService';
import './Modules.css';

const Modules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();
  const { saveItem, removeItem, isSaved } = useSaved();
  const courseTitle = location.state?.course || 'Geometry Basics';
  const courseId = location.state?.courseId;

  useEffect(() => {
    triggerMascotVoice(`Welcome to ${courseTitle}! Let's start learning our modules.`);
  }, [triggerMascotVoice, courseTitle]);

  const [apiModules, setApiModules] = useState([]);
  const [slideCounts, setSlideCounts] = useState({});

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [mods, counts] = await Promise.all([
          fetchCourseModules(courseId).catch(() => []),
          fetchAllSlideCounts().catch(() => ({}))
        ]);

        if (active) {
          setApiModules(Array.isArray(mods) ? mods : []);
          setSlideCounts(counts && typeof counts === 'object' ? counts : {});
        }
      } catch (err) {
        if (active) {
          setApiModules([]);
          setSlideCounts({});
        }
      }
    };

    load();

    // Auto-sync on window focus and storage events
    window.addEventListener('focus', load);
    window.addEventListener('storage', load);

    // Cross-origin BroadcastChannel listener
    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('edugenai_channel');
        channel.onmessage = () => {
          load();
        };
      }
    } catch (_) {}

    // Polling interval to catch real-time additions/updates - reduced to 3s for faster updates
    const interval = setInterval(load, 3000);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('focus', load);
      window.removeEventListener('storage', load);
      if (channel) channel.close();
    };
  }, [courseId]);

  const modules = apiModules;
  const completedCount = modules.filter(m => m.status === 'completed').length;
  const totalCount = modules.length;

  return (
    <div className="modules-page">
      <div className="modules-header glass-panel">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/courses')} aria-label="Go Back">
            <svg className="back-icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h2><AppIcon icon="twemoji:triangular-ruler" /> {courseTitle}</h2>
        </div>
        <p className="progress-text"><AppIcon icon="twemoji:star" /> Progress: {completedCount}/{totalCount} Modules Completed</p>
      </div>

      {modules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
          <p style={{ fontSize: '16px' }}>No modules found for this course.</p>
        </div>
      ) : (
        <div className="modules-adventure-path">
          {modules.map((module, index) => {
          const modId = module.moduleId || module.id;
          const numSlides = slideCounts[modId] || (modId === 1 ? 3 : 0);

          return (
            <div key={modId} className="module-path-item">
              <div className={`module-card glass-panel ${module.status}`} onMouseEnter={() => triggerMascotVoice(module.title)}>
                <div className="module-icon"><AppIcon icon={module.image} /></div>
                <div className="module-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p className="module-subtitle">Module {index + 1}</p>
                      {numSlides > 0 && (
                        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.4)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          <AppIcon icon="twemoji:books" /> {numSlides} {numSlides === 1 ? 'Slide' : 'Slides'}
                        </span>
                      )}
                    </div>
                    <button 
                      className={`gamified-star-btn ${isSaved(`module-${modId}`, 'Modules') ? 'saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const saveId = `module-${modId}`;
                        if (isSaved(saveId, 'Modules')) { 
                          removeItem(saveId, 'Modules');
                        } else {
                          saveItem({ id: saveId, type: 'Modules', title: module.title, icon: module.image });
                        }
                      }}
                      title="Save Module"
                    >
                      <AppIcon icon="twemoji:star" />
                    </button>
                  </div>
                  <h3>{module.title}</h3>
                  {module.description && (
                    <p style={{ fontSize: '12px', opacity: 0.85, margin: '4px 0 10px' }}>{module.description}</p>
                  )}
                  
                  {module.status === 'locked' ? (
                     <button className="btn-secondary disabled">Locked <AppIcon icon="twemoji:locked" /></button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => navigate('/notes', {
                        state: {
                          module: module.title,
                          moduleId: modId,
                          courseId: courseId,
                          course: courseTitle
                        }
                      })}
                    >
                      {module.status === 'completed' ? <><AppIcon icon="twemoji:check-mark-button" /> Review Slides</> : <><AppIcon icon="twemoji:play-button" /> Start Learning</>}
                    </button>
                  )}
                </div>
              </div>
              {index < modules.length - 1 && <div className="path-connector"></div>}
            </div>
          );
        })}
       </div>
     )}
   </div>
 );
};

export default Modules;
