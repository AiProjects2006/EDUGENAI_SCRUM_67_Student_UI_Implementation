import React, { useState } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const TrueFalseActivity = ({ data, onAnswerSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    if (showResult) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setShowResult(true);
    const isCorrect = selectedOption === data.correctAnswer;
    
    if (onAnswerSubmit) {
      onAnswerSubmit(isCorrect, isCorrect ? data.correctFeedback : data.incorrectFeedback, selectedOption);
    }
  };

  return (
    <div className="activity-container tf-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question}
      </h2>
      
      <div className="tf-options-container">
        <div 
          className={`tf-card glass-panel true-card ${selectedOption === 'True' ? 'selected' : ''} ${showResult && data.correctAnswer === 'True' ? 'correct-answer' : ''} ${showResult && selectedOption === 'True' && data.correctAnswer !== 'True' ? 'wrong-answer' : ''}`}
          onClick={() => handleOptionClick('True')}
        >
          <AppIcon icon="twemoji:check-mark-button" /> TRUE
        </div>
        
        <div 
          className={`tf-card glass-panel false-card ${selectedOption === 'False' ? 'selected' : ''} ${showResult && data.correctAnswer === 'False' ? 'correct-answer' : ''} ${showResult && selectedOption === 'False' && data.correctAnswer !== 'False' ? 'wrong-answer' : ''}`}
          onClick={() => handleOptionClick('False')}
        >
          <AppIcon icon="twemoji:cross-mark" /> FALSE
        </div>
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

export default TrueFalseActivity;
