import React, { useState } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const SortingActivity = ({ data, onAnswerSubmit }) => {
  const [items, setItems] = useState(
    data.items.map(item => ({ ...item, currentCategory: 'unsorted' }))
  );
  const [showResult, setShowResult] = useState(false);

  const handleDragStart = (e, itemName) => {
    if (showResult) return;
    e.dataTransfer.setData('itemName', itemName);
  };

  const handleDrop = (e, targetCategory) => {
    if (showResult) return;
    const itemName = e.dataTransfer.getData('itemName');
    
    setItems(prev => prev.map(item => 
      item.name === itemName ? { ...item, currentCategory: targetCategory } : item
    ));
  };

  const handleSubmit = () => {
    const unsortedItems = items.filter(i => i.currentCategory === 'unsorted');
    if (unsortedItems.length > 0) return; // Must sort all

    setShowResult(true);

    const isCorrect = items.every(item => item.currentCategory === item.category);
    
    if (onAnswerSubmit) {
      const studentAnswer = items.map(i => `${i.name} -> ${i.currentCategory}`).join(', ');
      onAnswerSubmit(isCorrect, isCorrect ? data.correctFeedback : data.incorrectFeedback, studentAnswer);
    }
  };

  const unsortedItems = items.filter(i => i.currentCategory === 'unsorted');
  const isReadyToSubmit = unsortedItems.length === 0;

  return (
    <div className="activity-container sorting-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question}
      </h2>

      <div className="sorting-workspace">
        {/* Unsorted Items Bank */}
        <div 
          className="unsorted-bank glass-panel"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'unsorted')}
        >
          <h3>Items to Sort</h3>
          <div className="draggable-items">
            {unsortedItems.map((item, idx) => (
              <div 
                key={idx} 
                className="draggable-item glass-panel"
                draggable={!showResult}
                onDragStart={(e) => handleDragStart(e, item.name)}
              >
                {item.icon && <AppIcon icon={item.icon} />} {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="categories-grid">
          {data.categories.map((category, idx) => (
            <div 
              key={idx} 
              className="sort-category glass-panel"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, category)}
            >
              <h3>{category}</h3>
              <div className="category-items">
                {items.filter(i => i.currentCategory === category).map((item, iIdx) => (
                  <div 
                    key={iIdx} 
                    className={`draggable-item glass-panel ${showResult ? (item.currentCategory === item.category ? 'correct' : 'wrong') : ''}`}
                    draggable={!showResult}
                    onDragStart={(e) => handleDragStart(e, item.name)}
                  >
                    {item.icon && <AppIcon icon={item.icon} />} {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="activity-actions">
        <button 
          className="btn-primary" 
          disabled={!isReadyToSubmit || showResult}
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default SortingActivity;
