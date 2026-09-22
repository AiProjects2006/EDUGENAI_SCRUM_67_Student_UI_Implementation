import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { useProgress } from '../../../context/ProgressContext';
import { useSaved } from '../../../context/SavedContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Notes.css';

const Notes = () => {
  const navigate = useNavigate();
  const { triggerMascotVoice } = useOceanAudio();
  const { incrementModules } = useProgress();
  const { saveItem, removeItem, isSaved } = useSaved();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const noteId = 101; // ID for Geometry Basics notes

  useEffect(() => {
    triggerMascotVoice("Let's read our notes on Geometry Basics!");
  }, [triggerMascotVoice]);

  const slides = [
    {
      icon: 'twemoji:triangular-ruler',
      title: 'What is a Triangle?',
      content: 'A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry.',
      fact: 'Did you know the starfish is shaped like 5 triangles put together?',
      audio: 'A triangle is a polygon with three edges and three vertices. Did you know the starfish is shaped like 5 triangles put together?'
    },
    {
      icon: 'twemoji:stop-button',
      title: 'What is a Square?',
      content: 'A square is a regular quadrilateral, which means that it has four equal sides and four equal angles.',
      fact: 'A chessboard is made of 64 smaller squares!',
      audio: 'A square has four equal sides and four equal angles. A chessboard is made of 64 smaller squares!'
    },
    {
      icon: 'twemoji:hollow-red-circle',
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
    if (isSaved(noteId, 'Notes')) {
      removeItem(noteId, 'Notes');
    } else {
      saveItem({ id: noteId, type: 'Notes', title: 'Geometry Basics', icon: 'twemoji:triangular-ruler' });
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-header glass-panel">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/modules')} aria-label="Go Back">
            <svg className="back-icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Geometry Basics</h2>
            <button 
              className={`gamified-star-btn ${isSaved(noteId, 'Notes') ? 'saved' : ''}`}
              onClick={handleBookmark}
              title="Save Notes"
            >
              <AppIcon icon="twemoji:star" />
            </button>
          </div>
          <div className="notes-actions" style={{ position: 'absolute', right: 0 }}>
            <button className={`action-btn voice-reading ${isReading ? 'reading' : ''}`} onClick={handleReadAloud}>
              {isReading ? <><AppIcon icon="twemoji:speaker-high-volume" /> Reading...</> : <><AppIcon icon="twemoji:speaker-high-volume" /> Read Aloud</>}
            </button>
            <button className="action-btn" onClick={handleDownload}><AppIcon icon="twemoji:down-arrow" /> Download PDF</button>
          </div>
        </div>
      </div>

      <div className="print-all-slides">
        {slides.map((slide, index) => (
          <div key={index} className="print-slide">
            <div className="print-slide-header">Geometry Basics - Slide {index + 1} of {slides.length}</div>
            <div className="slide-image"><AppIcon icon={slide.icon} /></div>
            <h3>{slide.title}</h3>
            <p>{slide.content}</p>
            <div className="fun-fact">
              <span className="mascot-icon"><AppIcon icon="twemoji:octopus" /></span>
              <p><strong>Bubbles says:</strong> {slide.fact}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="notes-content glass-panel">
        <div className="slide-viewer">
          <div className="slide-image"><AppIcon icon={slides[currentSlide].icon} /></div>
          <h3>{slides[currentSlide].title}</h3>
          <p>{slides[currentSlide].content}</p>
          
          <div className="fun-fact">
            <span className="mascot-icon"><AppIcon icon="twemoji:octopus" /></span>
            <p><strong>Bubbles says:</strong> {slides[currentSlide].fact}</p>
          </div>
        </div>

        <div className="slide-navigation">
          <button className="btn-secondary" onClick={handlePrev} style={{ visibility: currentSlide === 0 ? 'hidden' : 'visible' }}>Previous Slide</button>
          <span>Slide {currentSlide + 1} of {slides.length}</span>
          <button className="btn-secondary" onClick={handleNext} style={{ visibility: currentSlide === slides.length - 1 ? 'hidden' : 'visible' }}>Next Slide</button>
        </div>
      </div>

      <div className="notes-footer" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary huge-btn" onClick={() => { incrementModules(); navigate('/generate-activity'); }}>
          Generate AI Activity <AppIcon icon="twemoji:sparkles" />
        </button>
        <button className="btn-secondary huge-btn" onClick={() => navigate('/activity-map')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Explore Quest Map <AppIcon icon="twemoji:world-map" />
        </button>
      </div>
    </div>
  );
};

export default Notes;
