import React from 'react';
import { useOceanAudio } from "../../../context/AudioContext";
import './BubblesMascot.css';

const BubblesMascot = () => {
  const { mascotState, mascotMessage, triggerMascotVoice, triggerMascotAnimation } = useOceanAudio();

  const handleMascotClick = () => {
    // Only trigger if not already talking to prevent overlap issues
    if (mascotState !== 'talking') {
      triggerMascotVoice("I'm Bubbles! Let's explore the ocean together!");
      triggerMascotAnimation('happy');
    }
  };

  const isSpeaking = mascotState === 'talking' && mascotMessage !== '';

  return (
    <div className={`bubbles-mascot-container mascot-${mascotState}`} onClick={handleMascotClick}>
      {isSpeaking && (
        <div className="speech-bubble">
          <div className="speech-pointer"></div>
          {mascotMessage}
        </div>
      )}
      
      {/* Cartoon Baby Octopus Image */}
      <div className="octopus-body-img">
        <img src="/octopus.png" alt="Bubbles Mascot" className="mascot-img" />
      </div>
    </div>
  );
};

export default BubblesMascot;
