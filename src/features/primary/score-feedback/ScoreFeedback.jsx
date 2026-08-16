import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import './ScoreFeedback.css';

const ScoreFeedback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { triggerMascotVoice } = useOceanAudio();
    const [showConfetti, setShowConfetti] = useState(false);

    // Retrieve score from navigation state, or default to mock data
    const score = location.state?.score ?? 4;
    const total = location.state?.total ?? 5;
    const percentage = Math.round((score / total) * 100);

    // Determine Badge Tier
    let badgeLabel = 'Participant';
    let badgeIcon = '🌟';
    if (percentage >= 90) {
        badgeLabel = 'Diamond Badge';
        badgeIcon = '💎';
    } else if (percentage >= 80) {
        badgeLabel = 'Gold Badge';
        badgeIcon = '🥇';
    } else if (percentage >= 60) {
        badgeLabel = 'Silver Badge';
        badgeIcon = '🥈';
    } else if (percentage >= 40) {
        badgeLabel = 'Bronze Badge';
        badgeIcon = '🥉';
    }

    // Dynamic Recommendation / Feedback based on score
    let areaToReview = location.state?.weakness || 'Ocean Habitats';
    let mascotFeedback = "You did fantastic! Just review your habitats and you'll be perfect!";
    
    if (percentage >= 90) {
        areaToReview = 'None! You are a pro!';
        mascotFeedback = 'Outstanding work! You mastered this topic completely!';
    } else if (percentage < 60) {
        areaToReview = location.state?.weakness || 'Marine Biology Basics';
        mascotFeedback = "Don't give up! Let's review the basics and try again!";
    }

    useEffect(() => {
        setShowConfetti(true);
        triggerMascotVoice(`Activity Complete! You scored ${percentage} percent and earned a ${badgeLabel}!`);
    }, []);

    const handleNextActivity = () => {
        const playingLevelId = parseInt(sessionStorage.getItem('playingLevelId') || '1', 10);
        const activeLevelId = parseInt(sessionStorage.getItem('activeLevelId') || '1', 10);

        // If they beat the current active level, unlock the next one
        if (playingLevelId === activeLevelId) {
            sessionStorage.setItem('activeLevelId', activeLevelId + 1);
        }

        // If they beat the boss (Level 6)
        if (playingLevelId === 6) {
            navigate('/recommendations');
        } else {
            navigate('/activity-map');
        }
    };

    return (
        <div className="score-page">
            {showConfetti && <div className="confetti-container">🎉🎊✨🎊🎉</div>}

            <div className="score-card glass-panel">
                <h2>Activity Complete! 🏆</h2>

                <div className="score-stats">
                    <div
                        className="stat-circle score-total"
                        style={{ background: `conic-gradient(var(--aqua) ${percentage}%, rgba(255,255,255,0.2) 0)` }}
                    >
                        <span className="value">{percentage}%</span>
                        <span className="label">Score</span>
                    </div>
                    <div className="rewards-earned">
                        <div className="reward"><span className="icon">⭐</span> +{Math.max(1, Math.round(percentage / 33))} Stars</div>
                        {/*90–100% → 3 ⭐*/}
                        {/*60–89%  → 2 ⭐*/}
                        {/*0–59%   → 1 ⭐*/}
                        <div className="reward"><span className="icon">🪙</span> +{percentage} Coins</div>
                        {/*100% → 100 coins*/}
                        {/*90%  → 90 coins*/}
                        {/*80%  → 80 coins*/}
                        {/*60%  → 60 coins*/}
                        {/*40%  → 40 coins*/}
                        <div className="reward"><span className="icon">✨</span> +{score * 25} XP</div>
                        {/*4/5  → 4 × 25 = 100 XP*/}
                        {/*8/10 → 8 × 25 = 200 XP*/}
                        {/*10/10 → 10 × 25 = 250 XP*/}

                        {/*const xp = 50 + (score * 25);*/}
                        {/* Easy	            50 XP*/}
                        {/* Medium	        75 XP*/}
                        {/* Hard         	100 XP*/}
                        {/* Boss Challenge	150 XP*/}


                        {percentage >= 40 && (
                            <div className="reward badge"><span className="icon">{badgeIcon}</span> {badgeLabel}</div>
                        )}
                    </div>
                </div>

                <div className="performance-summary">
                    <div className="summary-item correct">
                        <span>✅ Correct Answers</span>
                        <span>{score}</span>
                    </div>
                    <div className="summary-item wrong">
                        <span>❌ Wrong Answers</span>
                        <span>{total - score}</span>
                    </div>
                    <div className="summary-item weakness">
                        <span>💡 Area to Review</span>
                        <span>{areaToReview}</span>
                    </div>
                </div>

                <div className="feedback-box">
                    <p><strong>Bubbles says:</strong> "{mascotFeedback}"</p>
                </div>

                <div className="score-actions">
                    <button className="btn-secondary" onClick={() => navigate('/activity')}>Retry Activity</button>
                    <button className="btn-secondary" onClick={() => navigate('/generate-activity')}>try Generate Activity</button>
                    <button className="btn-primary" onClick={handleNextActivity}>Next Activity ➡</button>
                </div>
            </div>
        </div>
    );
};

export default ScoreFeedback;
