import React, { useState, useEffect } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

// Utility to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const DragDropActivity = ({ data, onAnswerSubmit }) => {
  const [items, setItems] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Initialize with shuffled items so they aren't in the correct order already
    setItems(shuffleArray(data.itemsToOrder));
  }, [data]);

  const handleDragStart = (e, index) => {
    if (showResult) return;
    e.dataTransfer.setData('dragIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    if (showResult) return;
    const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'), 10);
    
    if (dragIndex === dropIndex) return;

    const newItems = [...items];
    const draggedItem = newItems.splice(dragIndex, 1)[0];
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
  };

  const handleSubmit = () => {
    setShowResult(true);

    // Check if current order exactly matches the original correct order
    const isCorrect = items.every((item, idx) => item === data.itemsToOrder[idx]);
    
    if (onAnswerSubmit) {
      onAnswerSubmit(isCorrect, isCorrect ? data.correctFeedback : data.incorrectFeedback, items.join(', '));
    }
  };

  return (
    <div className="activity-container drag-drop-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question}
      </h2>

      <div className="order-list">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`order-item glass-panel ${showResult ? (item === data.itemsToOrder[idx] ? 'correct' : 'wrong') : ''}`}
            draggable={!showResult}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, idx)}
          >
            <span className="order-number">{idx + 1}.</span>
            <span className="order-text">{item}</span>
            {!showResult && <span className="drag-handle"><AppIcon icon="twemoji:up-down-arrow" /></span>}
          </div>
        ))}
      </div>

      <div className="activity-actions">
        <button 
          className="btn-primary" 
          disabled={showResult}
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DragDropActivity;
