import React, { useState } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const ShortAnswerActivity = ({ data, onAnswerSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    setShowResult(true);
    
    // For math and simple short answers, exact or case-insensitive match
    const isCorrect = inputValue.trim().toLowerCase() === data.correctAnswer.toLowerCase();
    
    if (onAnswerSubmit) {
      onAnswerSubmit(isCorrect, isCorrect ? data.correctFeedback : data.incorrectFeedback, inputValue.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult && inputValue.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="activity-container short-answer-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question}
      </h2>

      <div className="short-answer-input-container">
        <input
          type="text"
          className={`large-text-input ${showResult ? (inputValue.trim().toLowerCase() === data.correctAnswer.toLowerCase() ? 'correct' : 'wrong') : ''}`}
          value={inputValue}
          onChange={(e) => !showResult && setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your answer here..."
          disabled={showResult}
          autoFocus
        />
      </div>

      <div className="activity-actions">
        <button 
          className="btn-primary" 
          disabled={!inputValue.trim() || showResult}
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default ShortAnswerActivity;
