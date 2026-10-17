import React from 'react';
import './OceanBackground.css';
import { AppIcon } from '../../common/AppIcon/AppIcon';

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
      <div className="fish fish-1"><AppIcon icon="twemoji:tropical-fish" /></div>
      <div className="fish fish-2"><AppIcon icon="twemoji:turtle" /></div>
      <div className="fish fish-3"><AppIcon icon="twemoji:dolphin" /></div>
      <div className="fish fish-4" style={{ top: '20%', animationDelay: '2s' }}><AppIcon icon="twemoji:blowfish" /></div>
      <div className="fish fish-5" style={{ top: '70%', animationDelay: '5s' }}><AppIcon icon="twemoji:jellyfish" /></div>
      <div className="fish fish-6" style={{ top: '40%', animationDelay: '1s' }}><AppIcon icon="twemoji:tropical-fish" /></div>
      
      {/* Ocean Decor */}
      <div className="ocean-decor coral-reef-left"><AppIcon icon="twemoji:coral" /></div>
      <div className="ocean-decor coral-reef-right"><AppIcon icon="twemoji:coral" /></div>
      <div className="ocean-decor sea-plant-1"><AppIcon icon="twemoji:coral" /></div>
      <div className="ocean-decor sea-plant-2"><AppIcon icon="twemoji:jellyfish" /></div>
      {/*<div className="ocean-decor treasure-chest"><AppIcon icon="twemoji:coin" /></div>*/}
      {/*<div className="ocean-decor ocean-crystal"><AppIcon icon="twemoji:gem-stone" /></div>*/}

      {/* Ocean Light Rays */}
      <div className="light-rays"></div>
    </div>
  );
};

export default OceanBackground;
