import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import './Notes.css';

const Notes = () => {
  const navigate = useNavigate();
  const { triggerMascotVoice } = useOceanAudio();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const slides = [
    {
      icon: '📐',
      title: 'What is a Triangle?',
      content: 'A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry.',
      fact: 'Did you know the starfish is shaped like 5 triangles put together?',
      audio: 'A triangle is a polygon with three edges and three vertices. Did you know the starfish is shaped like 5 triangles put together?'
    },
    {
      icon: '⏹️',
      title: 'What is a Square?',
      content: 'A square is a regular quadrilateral, which means that it has four equal sides and four equal angles.',
      fact: 'A chessboard is made of 64 smaller squares!',
      audio: 'A square has four equal sides and four equal angles. A chessboard is made of 64 smaller squares!'
    },
    {
      icon: '⭕',
      title: 'What is a Circle?',
      content: 'A circle is a shape consisting of all points in a plane that are at a given distance from a given point, the center.',
      fact: 'Bubbles are perfect spheres, which look like circles from any angle!',
      audio: 'A circle has all points at a given distance from the center. Bubbles look like circles!'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleReadAloud = () => {
    setIsReading(true);
    triggerMascotVoice(slides[currentSlide].audio);
    // Reset visual reading state after 5 seconds
    setTimeout(() => setIsReading(false), 5000);
  };

  const handleDownload = () => {
    window.print(); // Triggers the browser's PDF save/print dialog
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="notes-page">
      <div className="notes-header glass-panel">
        <button className="back-btn" onClick={() => navigate('/modules')}>← Back</button>
        <h2>Geometry Basics</h2>
        <div className="notes-actions">
          <button className={`action-btn ${isBookmarked ? 'active' : ''}`} onClick={handleBookmark} style={isBookmarked ? {background: 'rgba(42, 157, 143, 0.4)'} : {}}>
            {isBookmarked ? '🔖 Bookmarked!' : '🔖 Bookmark'}
          </button>
          <button className={`action-btn voice-reading ${isReading ? 'reading' : ''}`} onClick={handleReadAloud}>
            {isReading ? '🔊 Reading...' : '🔊 Read Aloud'}
          </button>
          <button className="action-btn" onClick={handleDownload}>⬇️ Download PDF</button>
        </div>
      </div>

      <div className="notes-content glass-panel">
        <div className="slide-viewer">
          <div className="slide-image">{slides[currentSlide].icon}</div>
          <h3>{slides[currentSlide].title}</h3>
          <p>{slides[currentSlide].content}</p>
          
          <div className="fun-fact">
            <span className="mascot-icon">🐙</span>
            <p><strong>Bubbles says:</strong> {slides[currentSlide].fact}</p>
          </div>
        </div>

        <div className="slide-navigation">
          <button className="btn-secondary" onClick={handlePrev} style={{ visibility: currentSlide === 0 ? 'hidden' : 'visible' }}>Previous Slide</button>
          <span>Slide {currentSlide + 1} of {slides.length}</span>
          <button className="btn-secondary" onClick={handleNext} style={{ visibility: currentSlide === slides.length - 1 ? 'hidden' : 'visible' }}>Next Slide</button>
        </div>
      </div>

      <div className="notes-footer">
        <button className="btn-primary huge-btn" onClick={() => navigate('/activity-map')}>
          Ready for Activities! 🎮
        </button>
      </div>
    </div>
  );
};

export default Notes;
