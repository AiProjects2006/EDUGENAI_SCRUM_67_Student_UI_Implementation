import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import './ActivityPlayer.css';

const ActivityPlayer = () => {
    const navigate = useNavigate();
    const { triggerMascotVoice, triggerMascotAnimation } = useOceanAudio();
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 5;
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // We need a place to track score to pass to the score page
    const [score, setScore] = useState(0);

    const questionText = "What is the main habitat of a clownfish?";

    const handleReadQuestion = () => {
        triggerMascotVoice(questionText);
    };

    const handleAnswerSubmit = () => {
        setShowFeedback(true);

        // Check if correct
        const isCorrect = selectedAnswer === 0; // In this mock, index 0 is correct

        if (isCorrect) {
            setScore(prev => prev + 1);
            triggerMascotVoice("Correct! Great job!", 1.6, 1.1);
            triggerMascotAnimation('happy');
        } else {
            triggerMascotVoice("Oops! The correct answer is Sea Anemone.", 1.5, 0.9);
            triggerMascotAnimation('sad');
        }

        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);
            if (currentQuestion < totalQuestions) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                // Navigate to score page and pass the final score
                const finalScore = isCorrect ? score + 1 : score;
                navigate('/score', { state: { score: finalScore, total: totalQuestions } });
            }
        }, 3000); // Increased wait time to hear the voice
    };

    return (
        <div className="activity-player-page">
            <div className="player-header glass-panel">
                <div className="progress-stats">
                    <span>Question {currentQuestion} / {totalQuestions}</span>
                    <div className="player-progress-bar">
                        <div className="player-progress-fill" style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}></div>
                    </div>
                </div>
                <button className="voice-btn-large" onClick={handleReadQuestion}>🔊 Read</button>
            </div>

            <div className="question-card glass-panel">
                <h2>What is the main habitat of a clownfish?</h2>

                <div className="answers-grid">
                    {['Sea Anemone', 'Coral Reef', 'Deep Ocean', 'Sandy Bottom'].map((answer, index) => (
                        <div
                            key={index}
                            className={`answer-card glass-panel ${selectedAnswer === index ? 'selected' : ''} ${showFeedback && selectedAnswer === index ? (index === 0 ? 'correct' : 'wrong') : ''}`}
                            onClick={() => !showFeedback && setSelectedAnswer(index)}
                        >
                            {answer}
                        </div>
                    ))}
                </div>
            </div>

            <div className="player-footer">
                {/* We can't go back in games! */}
                <div></div>
                <button
                    className="btn-primary submit-ans-btn"
                    disabled={selectedAnswer === null || showFeedback}
                    onClick={handleAnswerSubmit}
                >
                    Submit Answer
                </button>
            </div>

            {showFeedback && (
                <div className={`feedback-overlay ${selectedAnswer === 0 ? 'correct' : 'wrong'}`}>
                    <div className="feedback-content">
                        {selectedAnswer === 0 ? '🎉 Amazing Job!' : '💡 Good try! The correct answer is Sea Anemone.'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityPlayer;
