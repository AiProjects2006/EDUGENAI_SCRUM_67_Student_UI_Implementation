import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from '../TopNavigation/TopNavigation';
import BubblesMascot from '../../mascot/BubblesMascot/BubblesMascot';
import OceanBackground from '../OceanBackground/OceanBackground';
import { useOceanAudio } from '../../../context/AudioContext';
import './OceanLayout.css';

const OceanLayout = () => {
  const { isVoiceEnabled, isBgmPlaying, toggleVoiceSystem, toggleBgmSystem } = useOceanAudio();

  return (
    <div className="ocean-layout">
      {/* Animated Background Elements */}
      <OceanBackground />

      {/* Global Sound Control Indicator */}
      <div className="global-audio-controller">
        <button 
          id="btn-global-voice" 
          className={`audio-btn ${!isVoiceEnabled ? 'muted' : ''}`} 
          title="Toggle Bubbles Voice Guidance"
          onClick={toggleVoiceSystem}
        >
          {isVoiceEnabled ? '🔊' : '🔇'}
        </button>
        <button 
          id="btn-global-bgm" 
          className={`audio-btn ${!isBgmPlaying ? 'muted' : ''}`} 
          title="Toggle Magical Ambient BGM"
          onClick={toggleBgmSystem}
        >
          {isBgmPlaying ? '🎵' : '🔕'}
        </button>
      </div>

      {/* Main UI */}
      <div className="ocean-content-wrapper">
        <TopNavigation />
        <main className="ocean-main-content">
          <Outlet />
        </main>
      </div>
      
      {/* Global AI Mascot */}
      <BubblesMascot />
    </div>
  );
};

export default OceanLayout;
