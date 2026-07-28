import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOceanAudio } from "../../../context/AudioContext";
import './BubblesMascot.css';

const BubblesMascot = () => {
  const [message, setMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();
  const { mascotState, triggerMascotVoice, triggerMascotAnimation } = useOceanAudio();

  useEffect(() => {
    let currentMessage = '';
    
    switch (location.pathname) {
      case '/':
      case '/landing':
        currentMessage = "Hi! I'm Bubbles! Welcome to our magical ocean adventure!";
        break;
      case '/dashboard':
        currentMessage = "Welcome back to your Dashboard! Ready to learn?";
        break;
      case '/courses':
        currentMessage = "Let's explore some amazing subjects today!";
        break;
      case '/activity':
      case '/activity-map':
        currentMessage = "Ooh, a new challenge! Let's conquer this map!";
        break;
      default:
        currentMessage = "I'm here to help you learn and have fun!";
    }

    if (currentMessage) {
      setMessage(currentMessage);
      setIsSpeaking(true);
      triggerMascotVoice(currentMessage);
      
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleMascotClick = () => {
    triggerMascotVoice("I'm Bubbles! Let's explore the ocean together!");
    triggerMascotAnimation('happy');
    setMessage("I'm Bubbles! Let's explore the ocean together!");
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  return (
    <div className={`bubbles-mascot-container mascot-${mascotState}`} onClick={handleMascotClick}>
      {isSpeaking && (
        <div className="speech-bubble">
          <div className="speech-pointer"></div>
          {message}
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
