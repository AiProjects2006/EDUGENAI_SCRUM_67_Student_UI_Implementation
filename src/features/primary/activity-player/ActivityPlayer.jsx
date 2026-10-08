import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import speechService from '../../../services/SpeechService';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import ActivityRenderer from '../../../components/activity-types/ActivityRenderer';
import { getActivitiesForLevel } from '../../../data/mockActivities';
import './ActivityPlayer.css';

const ActivityPlayer = () => {
    const navigate = useNavigate();
    const { triggerMascotVoice, triggerMascotAnimation } = useOceanAudio();
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [activities, setActivities] = useState([]);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackData, setFeedbackData] = useState({ isCorrect: false, text: '' });
    const [answerHistory, setAnswerHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);

    const currentActivity = activities[currentQuestionIndex];
    const totalQuestions = activities.length;

    // Timer logic
    useEffect(() => {
        if (currentActivity && currentActivity.timeLimitSeconds) {
            setTimeLeft(currentActivity.timeLimitSeconds);
        } else {
            setTimeLeft(null);
        }
    }, [currentActivity]);

    useEffect(() => {
        if (timeLeft === null || showFeedback) return;

        if (timeLeft <= 0) {
            handleAnswerSubmit(false, "Time's up!", "Ran out of time");
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, showFeedback]);

    // Load activities for the current level when the component mounts
    useEffect(() => {
        const levelId = sessionStorage.getItem('playingLevelId') || 1;
        const levelActivities = getActivitiesForLevel(levelId);
        
        // If we found activities for this level, use them. 
        // Otherwise fallback to an empty array (or we could show an error)
        setActivities(levelActivities);
    }, []);

    useEffect(() => {
        if (currentActivity) {
            const readableQuestion = currentActivity.question.replace(/______/g, 'blank');
            triggerMascotVoice(`Here is question ${currentQuestionIndex + 1}! ${readableQuestion}`);
        }
    }, [currentQuestionIndex, currentActivity, triggerMascotVoice]);

    const handleReadQuestion = () => {
        if (currentActivity) {
            const readableQuestion = currentActivity.question.replace(/______/g, 'blank');
            triggerMascotVoice(readableQuestion);
        }
    };

    const handleAnswerSubmit = (isCorrect, feedbackText, studentAnswer) => {
        setFeedbackData({ isCorrect, text: feedbackText });
        setShowFeedback(true);
        
        const historyItem = {
            question: currentActivity.question,
            icon: currentActivity.icon,
            correctAnswer: currentActivity.correctAnswer || (currentActivity.itemsToOrder ? currentActivity.itemsToOrder.join(', ') : 'Activity completed correctly'),
            studentAnswer: studentAnswer || 'N/A',
            isCorrect: isCorrect
        };
        
        setAnswerHistory(prev => [...prev, historyItem]);

        if (isCorrect) {
            setScore(prev => prev + 1);
            speechService.playCorrect();
            triggerMascotVoice(feedbackText || "Correct! Great job!", 1.6, 1.1);
            triggerMascotAnimation('happy');
        } else {
            speechService.playIncorrect();
            triggerMascotVoice(feedbackText || "Oops! Try again next time.", 1.5, 0.9);
            triggerMascotAnimation('sad');
        }

        setTimeout(() => {
            setShowFeedback(false);
            
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // Navigate to score page and pass the final score
                const finalScore = isCorrect ? score + 1 : score;
                const finalHistory = [...answerHistory, historyItem];
                navigate('/score', { state: { score: finalScore, total: totalQuestions, answerHistory: finalHistory } });
            }
        }, 3000); // Wait 3 seconds to hear the voice before moving on
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="activity-player-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>Loading Activity...</h2>
            </div>
        );
    }

    return (
        <div className="activity-player-page">
            <div className="player-header glass-panel">
                <div className="progress-stats">
                    <span>Question {currentQuestionIndex + 1} / {totalQuestions}</span>
                    <div className="player-progress-bar">
                        <div className="player-progress-fill" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                    </div>
                </div>
                {timeLeft !== null && (
                    <div className="timer-badge glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: timeLeft <= 5 ? 'rgba(255, 71, 111, 0.4)' : 'rgba(0, 0, 0, 0.2)', padding: '8px 20px', borderRadius: '20px', color: timeLeft <= 5 ? '#ffb3c1' : 'white', fontWeight: 'bold', fontSize: '1.2rem', border: `2px solid ${timeLeft <= 5 ? '#ef476f' : 'transparent'}`, transition: 'all 0.3s' }}>
                        <AppIcon icon="twemoji:hourglass-done" /> 
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                )}
                <button className="voice-btn-large" onClick={handleReadQuestion}>
                    <AppIcon icon="twemoji:speaker-high-volume" /> Read
                </button>
            </div>

            <div className="question-card glass-panel" style={{ padding: '2rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* We pass the current activity to the Renderer */}
                <ActivityRenderer 
                    key={currentActivity.id || currentQuestionIndex}
                    activity={currentActivity} 
                    onAnswerSubmit={handleAnswerSubmit} 
                />
            </div>

            {/* The Submit button is now handled INSIDE the specific UI components (MCQActivity, etc) */}
            <div className="player-footer">
                <div></div>
                {/* Keep footer structure for layout consistency if needed */}
            </div>

            {showFeedback && (
                <div className={`feedback-overlay ${feedbackData.isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="feedback-content">
                        {feedbackData.isCorrect ? (
                            <><AppIcon icon="twemoji:party-popper" /> {feedbackData.text}</>
                        ) : (
                            <><AppIcon icon="twemoji:light-bulb" /> {feedbackData.text}</>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityPlayer;
