import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from '../TopNavigation/TopNavigation';
import BubblesMascot from '../../mascot/BubblesMascot/BubblesMascot';
import OceanBackground from '../OceanBackground/OceanBackground';
import { useOceanAudio } from '../../../context/AudioContext';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../common/AppIcon/AppIcon';
import './OceanLayout.css';

const OceanLayout = () => {
  const { isVoiceEnabled, isBgmPlaying, toggleVoiceSystem, toggleBgmSystem } = useOceanAudio();
  const { updateUser } = useUser();

  const handleToggleVoice = () => {
    toggleVoiceSystem();
    updateUser({ voiceGuidanceEnabled: !isVoiceEnabled });
  };

  const handleToggleBgm = () => {
    toggleBgmSystem();
    updateUser({ ambientMusicEnabled: !isBgmPlaying });
  };

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
          onClick={handleToggleVoice}
        >
          {isVoiceEnabled ? <AppIcon icon="twemoji:speaker-high-volume" /> : <AppIcon icon="twemoji:muted-speaker" />}
        </button>
        <button 
          id="btn-global-bgm" 
          className={`audio-btn ${!isBgmPlaying ? 'muted' : ''}`} 
          title="Toggle Magical Ambient BGM"
          onClick={handleToggleBgm}
        >
          {isBgmPlaying ? <AppIcon icon="twemoji:musical-note" /> : <AppIcon icon="twemoji:bell-with-slash" />}
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
