import React from 'react';
import './OceanBackground.css';

const OceanBackground = () => {
  // Generate random bubbles for the background
  const renderBackgroundBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 60 + 10;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 10 + 5;
      const animationDelay = Math.random() * 5;
      
      bubbles.push(
        <div 
          key={i} 
          className="bg-bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`
          }}
        />
      );
    }
    return bubbles;
  };

  return (
    <div className="ocean-background-component">
      {renderBackgroundBubbles()}
      <div className="fish fish-1">🐠</div>
      <div className="fish fish-2">🐢</div>
      <div className="fish fish-3">🐬</div>
      <div className="fish fish-4" style={{ top: '20%', animationDelay: '2s' }}>🐡</div>
      <div className="fish fish-5" style={{ top: '70%', animationDelay: '5s' }}>🪼</div>
      <div className="fish fish-6" style={{ top: '40%', animationDelay: '1s' }}>🐠</div>
      
      {/* Ocean Decor */}
      <div className="ocean-decor coral-reef-left">🪸</div>
      <div className="ocean-decor coral-reef-right">🪸</div>
      <div className="ocean-decor sea-plant-1">🪸</div>
      <div className="ocean-decor sea-plant-2">🪼</div>
      <div className="ocean-decor treasure-chest">🪙</div>
      <div className="ocean-decor ocean-crystal">💎</div>

      {/* Ocean Light Rays */}
      <div className="light-rays"></div>
    </div>
  );
};

export default OceanBackground;
