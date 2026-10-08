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

  const score = location.state?.score ?? 4;
  const total = location.state?.total ?? 5;
  const answerHistory = location.state?.answerHistory || [];
  const percentage = Math.round((score / total) * 100);

  const [reviewType, setReviewType] = useState(null); // 'correct' or 'wrong'

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

  const reviewItems = reviewType === 'correct' 
    ? answerHistory.filter(h => h.isCorrect) 
    : answerHistory.filter(h => !h.isCorrect);

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
          <div className="summary-item correct clickable" onClick={() => setReviewType('correct')}>
            <span><AppIcon icon="twemoji:check-mark-button" /> Correct Answers</span>
            <span>{score}</span>
          </div>
          <div className="summary-item wrong clickable" onClick={() => setReviewType('wrong')}>
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
          <button className="btn-primary" onClick={handleNextActivity}>Explore Quest Map</button>
        </div>
      </div>

      {/* Review Modal */}
      {reviewType && (
        <div className="modal-overlay" onClick={() => setReviewType(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{reviewType === 'correct' ? <><AppIcon icon="twemoji:check-mark-button" /> Correct Answers</> : <><AppIcon icon="twemoji:cross-mark" /> Wrong Answers</>}</h2>
              <button className="close-btn" onClick={() => setReviewType(null)}>×</button>
            </div>
            <div className="modal-body">
              {reviewItems.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No items to review here.</p>
              ) : (
                reviewItems.map((item, idx) => (
                  <div key={idx} className={`review-item ${item.isCorrect ? 'correct' : 'wrong'}`}>
                    <h4 className="review-question">
                      {item.icon && <AppIcon icon={item.icon} />} {item.question}
                    </h4>
                    <div className="review-answers">
                      <div className="student-answer">
                        <strong>You answered:</strong> <span>{item.studentAnswer}</span>
                      </div>
                      {!item.isCorrect && (
                        <div className="correct-answer">
                          <strong>Correct answer:</strong> <span>{item.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateActivityScore;
