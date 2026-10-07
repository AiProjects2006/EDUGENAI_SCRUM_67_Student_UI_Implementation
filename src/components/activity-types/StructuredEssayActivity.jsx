import React, { useState } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const StructuredEssayActivity = ({ data, onAnswerSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    setShowResult(true);
    
    // For structured essay, we just accept the answer as participation/grading will be manual/AI based
    const isCorrect = true; 
    
    if (onAnswerSubmit) {
      onAnswerSubmit(isCorrect, isCorrect ? data.correctFeedback : data.incorrectFeedback, inputValue.trim());
    }
  };

  return (
    <div className="activity-container structured-essay-activity">
      
      {/* 1. The Story / Passage */}
      {data.passage && (
        <div className="essay-passage glass-panel">
          <h3><AppIcon icon="twemoji:open-book" /> Read</h3>
          <p>{data.passage}</p>
        </div>
      )}

      {/* 2. The Question */}
      <div className="essay-question glass-panel">
        <h3><AppIcon icon="twemoji:thinking-face" /> Question</h3>
        <p>
          {data.icon && <AppIcon icon={data.icon} />}{' '}
          {data.question}
        </p>
      </div>

      {/* 3. The Input Area */}
      <div className="essay-input glass-panel">
        <h3><AppIcon icon="twemoji:writing-hand" /> Your Answer</h3>
        <textarea
          className={`large-text-input ${showResult ? 'correct' : ''}`}
          style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
          value={inputValue}
          onChange={(e) => !showResult && setInputValue(e.target.value)}
          placeholder="Type your answer here... (Press Enter for a new line)"
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

export default StructuredEssayActivity;
