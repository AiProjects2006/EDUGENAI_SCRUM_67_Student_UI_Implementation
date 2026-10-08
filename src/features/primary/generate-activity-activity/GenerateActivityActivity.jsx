import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import speechService from '../../../services/SpeechService';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import ActivityRenderer from '../../../components/activity-types/ActivityRenderer';
import { generatorMockActivities } from '../../../data/generatorMockActivities';
import '../activity-player/ActivityPlayer.css';

const GenerateActivityActivity = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { triggerMascotVoice, triggerMascotAnimation } = useOceanAudio();
    
    // Dynamic state from the generator
    const { type, diff, count } = location.state || {};
    const requestedCount = count || 5;

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

    // Mocking the AI Generation based on user selection
    useEffect(() => {
        // Map the long generator string to our mock activityType enum
        let mapType = 'MCQ';
        if (type === 'Multiple Choice Questions (MCQ)') mapType = 'MCQ';
        if (type === 'Quiz') mapType = 'QUIZ';
        if (type === 'True/False') mapType = 'TRUE_FALSE';
        if (type === 'Short Answer') mapType = 'SHORT_ANSWER';
        if (type === 'Structured Essay') mapType = 'STRUCTURED_ESSAY';
        if (type === 'Problem Solving Exercise') mapType = 'PROBLEM_SOLVING';
        if (type === 'Application-Based Questions') mapType = 'APPLICATION';
        if (type === 'Timed Quiz') mapType = 'TIMED_QUIZ';
        if (type === 'Challenge Quiz') mapType = 'CHALLENGE_QUIZ';
        if (type === 'Sorting') mapType = 'SORTING';
        if (type === 'Match the Following') mapType = 'MATCH_FOLLOWING';
        if (type === 'Fill in the Blanks') mapType = 'FILL_BLANKS';
        if (type === 'Hotspot Activity') mapType = 'HOTSPOT';
        if (type === 'Drag and Drop') mapType = 'DRAG_DROP';
        if (type === 'Poll') mapType = 'POLL';
        
        // Find matching activities in our generator mock database
        let generatedActivities = generatorMockActivities.filter(a => a.activityType === mapType);
        
        // If we don't have enough mock data for the requested count, just loop what we have 
        // to simulate a full quiz (or show less if we have none)
        if (generatedActivities.length > 0) {
            let fullQuiz = [];
            for (let i = 0; i < requestedCount; i++) {
                fullQuiz.push(generatedActivities[i % generatedActivities.length]);
            }
            setActivities(fullQuiz);
        } else {
            // Fallback: Just show an unsupported block if we haven't mocked this type yet
            setActivities([{
                id: 999,
                activityType: mapType, // Will trigger the "Under Construction" UI in renderer
                question: `Generated ${type} Question`
            }]);
        }
    }, [type, requestedCount]);

    useEffect(() => {
        if (currentActivity && currentActivity.question) {
            const readableQuestion = currentActivity.question.replace(/______/g, 'blank');
            triggerMascotVoice(`Here is question ${currentQuestionIndex + 1}! ${readableQuestion}`);
        }
    }, [currentQuestionIndex, currentActivity, triggerMascotVoice]);

    const handleReadQuestion = () => {
        if (currentActivity && currentActivity.question) {
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
                const finalScore = isCorrect ? score + 1 : score;
                const finalHistory = [...answerHistory, historyItem];
                navigate('/generate-activity-score', { state: { score: finalScore, total: totalQuestions, answerHistory: finalHistory } });
            }
        }, 3000);
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="activity-player-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>Loading your custom {type} Activity...</h2>
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

            <div className="question-card glass-panel" style={{ padding: '2rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--golden-yellow)', marginBottom: '2rem', fontSize: '1.2rem', alignSelf: 'flex-start' }}>
                    {type ? `${type} (${diff})` : 'Generated Activity'}
                </h3>
                
                <ActivityRenderer 
                    key={`${currentQuestionIndex}-${currentActivity.id}`}
                    activity={currentActivity} 
                    onAnswerSubmit={handleAnswerSubmit} 
                />
            </div>

            <div className="player-footer">
                <div></div>
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

export default GenerateActivityActivity;
