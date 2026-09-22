import React, { useEffect } from 'react';
import { useProgress } from '../../../context/ProgressContext';
import { useOceanAudio } from '../../../context/AudioContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Progress.css';

const Progress = () => {
  const { progress } = useProgress();
  const { triggerMascotVoice } = useOceanAudio();

  useEffect(() => {
    triggerMascotVoice("Let's look at your amazing progress! Keep swimming forward!");
  }, [triggerMascotVoice]);

  return (
    <div className="progress-page">
      <div className="progress-header glass-panel">
        <h2>My Progress <AppIcon icon="twemoji:chart-increasing" /></h2>
        <p>You're doing great! Keep swimming forward!</p>
      </div>

      <div className="progress-stats-row">
        <div className="stat-card glass-panel">
          <div className="stat-icon"><AppIcon icon="twemoji:books" /></div>
          <div className="stat-info">
            <h4>Courses Completed</h4>
            <p>{progress.coursesCompleted}/5</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon"><AppIcon icon="twemoji:check-mark-button" /></div>
          <div className="stat-info">
            <h4>Activities Done</h4>
            <p>{progress.activitiesDone}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon"><AppIcon icon="twemoji:star" /></div>
          <div className="stat-info">
            <h4>Stars Earned</h4>
            <p>{progress.starsEarned}</p>
          </div>
        </div>
      </div>

      <div className="progress-sections">
        <div className="progress-section glass-panel">
          <h3>Overall Progress</h3>
          <div className="subject-progress">
            {Object.entries(progress.subjectProgress).map(([subject, details]) => (
              <div className="sub-prog-item" key={subject}>
                <div className="prog-label"><span>{subject}</span><span>{details.percentage}%</span></div>
                <div className="prog-bar"><div className="fill" style={{width: `${details.percentage}%`, background: details.color}}></div></div>
                {/*<p className="prog-unit" style={{marginTop: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)'}}>Current: {details.current}</p>*/}
              </div>
            ))}
          </div>
        </div>

        <div className="progress-section glass-panel">
          <h3>My Badges <AppIcon icon="twemoji:trophy" /></h3>
          <div className="badges-grid">
            {progress.badges.map(badge => (
              <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                <span className="icon">
                  {typeof badge.icon === 'string' && badge.icon.startsWith('twemoji:') ? 
                    <AppIcon icon={badge.icon} /> : badge.icon}
                </span>
                <p>{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
