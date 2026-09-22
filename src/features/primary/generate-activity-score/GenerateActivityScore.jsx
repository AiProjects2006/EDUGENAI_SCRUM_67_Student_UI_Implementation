import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { useProgress } from '../../../context/ProgressContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import '../score-feedback/ScoreFeedback.css';

const GenerateActivityScore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();
  const { incrementActivities, addStars, incrementCourses, updateSubjectProgress } = useProgress();
  const [showConfetti, setShowConfetti] = useState(false);

  // Retrieve score from navigation state, or default to mock data
  const score = location.state?.score ?? 4;
  const total = location.state?.total ?? 5;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    setShowConfetti(true);
    triggerMascotVoice(`Activity Complete! You scored ${percentage} percent!`);
    incrementActivities();
    addStars(score * 10);
    updateSubjectProgress('Mathematics', 5); // Add 5% progress to Mathematics
    if (percentage === 100) {
      incrementCourses();
    }
  }, []);

  const handleNextActivity = () => {
    navigate('/activity-map');
  };

  return (
    <div className="score-page">
      {showConfetti && <div className="confetti-container"><AppIcon icon="twemoji:party-popper" /><AppIcon icon="twemoji:confetti-ball" /><AppIcon icon="twemoji:sparkles" /><AppIcon icon="twemoji:confetti-ball" /><AppIcon icon="twemoji:party-popper" /></div>}

      <div className="score-card glass-panel">
        <h2>Activity Complete! <AppIcon icon="twemoji:trophy" /></h2>

        <div className="score-stats" style={{ background: 'none', justifyContent: 'center' }}>
          <div 
            className="stat-circle score-total"
            style={{ background: `conic-gradient(var(--aqua) ${percentage}%, rgba(255,255,255,0.2) 0)` }}
          >
            <span className="value">{percentage}%</span>
            <span className="label">Score</span>
          </div>
          {/* Rewards removed as requested */}
        </div>

        <div className="performance-summary">
          <div className="summary-item correct">
            <span><AppIcon icon="twemoji:check-mark-button" /> Correct Answers</span>
            <span>{score}</span>
          </div>
          <div className="summary-item wrong">
            <span><AppIcon icon="twemoji:cross-mark" /> Wrong Answers</span>
            <span>{total - score}</span>
          </div>
          <div className="summary-item weakness">
            <span><AppIcon icon="twemoji:light-bulb" /> Area to Review</span>
            <span>Ocean Habitats</span>
          </div>
        </div>

        <div className="feedback-box">
          <p><strong>Bubbles says:</strong> "You did fantastic! Just review your habitats and you'll be perfect!"</p>
        </div>

        <div className="score-actions">
          <button className="btn-secondary" onClick={() => navigate('/generate-activity-activity', { state: location.state })}>Retry Activity</button>
          <button className="btn-secondary" onClick={() => navigate('/generate-activity')}>Generate Another</button>
          <button className="btn-primary" onClick={handleNextActivity}>DIVE IN!</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateActivityScore;
