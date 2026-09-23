// src/services/SpeechService.js

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.soundMuted = false;
    this.speechMuted = false;
    this.audioCtx = null;
    this.currentUtterance = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Speak text in a cute, child-like high-pitched voice
  speak(text, callback = null) {
    if (this.speechMuted) {
      if (callback) callback();
      return;
    }
    
    // Prevent double speaking from React StrictMode double mounts
    if (this.lastText === text && Date.now() - (this.lastTime || 0) < 500) {
        return;
    }
    this.lastText = text;
    this.lastTime = Date.now();

    if (this.synth) {
      this.synth.cancel(); // Stop current speech
      
      // Play a tiny bubble pop sound right before speaking to make it feel instant!
      this.playPop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use a tiny timeout to avoid the SpeechSynthesis cancel bug where it drops the next utterance
      setTimeout(() => {
        // Attempt to find a high quality English voice (preferably female/child-like)
        const voices = this.synth.getVoices();
        let chosenVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('natural'))
        );
        if (!chosenVoice) {
          chosenVoice = voices.find(voice => voice.lang.includes('en'));
        }
        
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        // Voice tuning parameters for Bubbles (cute, child-like baby octopus)
        utterance.pitch = 1.45; // High pitch for child voice
        utterance.rate = 0.95;  // Slightly slower, child-friendly reading speed
        utterance.volume = 1.0;

        utterance.onend = () => {
          this.currentUtterance = null;
          if (callback) callback();
        };

        utterance.onerror = (e) => {
          console.error("Speech synthesis error:", e);
          this.currentUtterance = null;
          if (callback) callback();
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
      }, 50);
    } else {
      if (callback) callback();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  // Sound Effects using Web Audio API (No files needed!)
  playPop() {
    if (this.soundMuted) return;
    this.initAudio();
    
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    // Fast frequency sweep for pop sound
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playCorrect() {
    if (this.soundMuted) return;
    this.initAudio();
    
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  playIncorrect() {
    if (this.soundMuted) return;
    this.initAudio();
    
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25); // Down sweep
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  playTreasureOpen() {
    if (this.soundMuted) return;
    this.initAudio();
    
    const ctx = this.audioCtx;
    const time = ctx.currentTime;
    
    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6 arpeggio
    notes.forEach((freq, index) => {
      playNote(freq, time + index * 0.08, 0.4);
    });
  }

  playMilestone() {
    if (this.soundMuted) return;
    this.initAudio();
    
    const ctx = this.audioCtx;
    const time = ctx.currentTime;
    
    const chord = [392.00, 493.88, 587.33, 783.99]; // G Chord
    chord.forEach(freq => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, time + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.6);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.6);
    });
  }
}

const speechService = new SpeechService();
export default speechService;
