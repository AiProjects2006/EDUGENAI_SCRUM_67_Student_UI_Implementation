import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import speechService from '../services/SpeechService';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [mascotState, setMascotState] = useState('idle'); // idle, talking, happy, sad, wave, dance
  const audioContextRef = useRef(null);
  const bgmIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      window.speechSynthesis.cancel();
    };
  }, []);

  const triggerMascotVoice = (text, pitch = 1.6, speed = 0.9) => {
    if (!isVoiceEnabled) return;
    
    speechService.speechMuted = !isVoiceEnabled;
    if (!isVoiceEnabled) return;
    
    setMascotState('talking');
    speechService.speak(text, () => {
      setMascotState('idle');
    });
  };
  
  const triggerMascotAnimation = (animationName) => {
    setMascotState(animationName);
    if (animationName !== 'idle' && animationName !== 'talking') {
      setTimeout(() => setMascotState('idle'), 3000);
    }
  };

  const toggleVoiceSystem = () => {
    setIsVoiceEnabled(prev => {
      if (prev) {
        window.speechSynthesis.cancel();
      } else {
        triggerMascotVoice("Voice assistance activated!");
      }
      return !prev;
    });
  };

  const playSoftSynthNote = (frequency, duration) => {
    if (!audioContextRef.current) return;
    let osc = audioContextRef.current.createOscillator();
    let gainNode = audioContextRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    gainNode.gain.setValueAtTime(0.04, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    osc.start();
    osc.stop(audioContextRef.current.currentTime + duration);
  };

  const startAmbientBgm = () => {
    setIsBgmPlaying(true);
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextCtor();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      let notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let index = 0;

      bgmIntervalRef.current = setInterval(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'suspended') return;
        let freq = notes[index];
        playSoftSynthNote(freq, 0.4);
        index = (index + Math.floor(Math.random() * 2) + 1) % notes.length;
      }, 700);

    } catch (e) {
      console.warn("Web Audio Context not allowed: ", e);
    }
  };

  const stopAmbientBgm = () => {
    setIsBgmPlaying(false);
    if (bgmIntervalRef.current) {
      clearInterval(bgmIntervalRef.current);
      bgmIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const toggleBgmSystem = () => {
    if (isBgmPlaying) {
      stopAmbientBgm();
    } else {
      startAmbientBgm();
    }
  };

  return (
    <AudioContext.Provider value={{
      isVoiceEnabled,
      isBgmPlaying,
      mascotState,
      triggerMascotAnimation,
      triggerMascotVoice,
      toggleVoiceSystem,
      toggleBgmSystem
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useOceanAudio = () => useContext(AudioContext);
