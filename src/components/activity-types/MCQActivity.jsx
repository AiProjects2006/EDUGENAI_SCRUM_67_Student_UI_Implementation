import React, { useState } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const MCQActivity = ({ data, onAnswerSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    if (showResult) return; // Prevent clicking after submitting
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setShowResult(true);

    let isCorrect = false;
    let feedback = data.incorrectFeedback;

    if (data.activityType === 'POLL') {
      isCorrect = true; // Always true for score purposes so we don't penalize them
      feedback = data.correctFeedback || "Thanks for voting!";
    } else {
      isCorrect = selectedOption === data.correctAnswer;
      feedback = isCorrect ? data.correctFeedback : data.incorrectFeedback;
    }
    
    // Call the parent's submit function so the player can update score/progress
    if (onAnswerSubmit) {
      onAnswerSubmit(isCorrect, feedback, selectedOption);
    }
  };

  return (
    <div className="activity-container mcq-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question}
      </h2>
      
      <div className="mcq-options-grid">
        {data.options.map((option, index) => {
          let className = "mcq-option glass-panel ";
          if (selectedOption === option) className += "selected ";
          if (showResult) {
            if (data.activityType === 'POLL') {
              // Just highlight the one they voted for as "correct"
              if (selectedOption === option) className += "correct-answer ";
            } else {
              if (option === data.correctAnswer) className += "correct-answer ";
              if (selectedOption === option && option !== data.correctAnswer) className += "wrong-answer ";
            }
          }

          return (
            <div 
              key={index} 
              className={className}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          );
        })}
      </div>

      <div className="activity-actions">
        <button 
          className="btn-primary" 
          disabled={!selectedOption || showResult}
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default MCQActivity;
