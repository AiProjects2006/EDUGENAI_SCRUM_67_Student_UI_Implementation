import React, { useState } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const FillInTheBlanksActivity = ({ data, onAnswerSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    setShowResult(true);
    
    // Check if the answer is correct (case-insensitive)
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
    <div className="activity-container fill-blanks-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question.split('______').map((part, index, array) => (
          <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && (
              <input
                type="text"
                className={`blank-input ${showResult ? (inputValue.trim().toLowerCase() === data.correctAnswer.toLowerCase() ? 'correct' : 'wrong') : ''}`}
                value={inputValue}
                onChange={(e) => !showResult && setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="type here..."
                disabled={showResult}
                autoFocus
              />
            )}
          </React.Fragment>
        ))}
      </h2>

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

export default FillInTheBlanksActivity;
