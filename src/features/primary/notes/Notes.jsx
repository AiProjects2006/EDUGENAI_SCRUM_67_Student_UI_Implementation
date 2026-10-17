import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { useProgress } from '../../../context/ProgressContext';
import { useSaved } from '../../../context/SavedContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import { fetchModuleSlides } from '../../../services/CourseService';
import './Notes.css';

const DEFAULT_GEOMETRY_SLIDES = [
  {
    icon: 'twemoji:triangular-ruler',
    title: 'What is a Triangle?',
    content: 'A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry. The sum of angles in any planar triangle is always 180 degrees.',
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

const Notes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();
  const { incrementModules } = useProgress();
  const { saveItem, removeItem, isSaved } = useSaved();

  const {
    module: moduleTitle = 'Geometry Basics',
    moduleId,
    course: courseTitle = 'Mathematics',
    courseId
  } = location.state || {};

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [loading, setLoading] = useState(true);

  const noteId = moduleId ? `note-${moduleId}` : 101;

  useEffect(() => {
    let active = true;

    const loadSlides = async () => {
      try {
        let loaded = [];
        if (moduleId) {
          loaded = await fetchModuleSlides(moduleId);
        }

        if (active) {
          if (Array.isArray(loaded) && loaded.length > 0) {
            // Real slides from backend - use them
            setSlides(loaded);
          } else if (!moduleId || (Number(moduleId) === 1 && moduleTitle.toLowerCase().includes('geometry'))) {
            // Default demo slides for geometry module
            setSlides(DEFAULT_GEOMETRY_SLIDES);
          } else {
            // Template for newly created module with no slides yet
            // Keeps the same structure - only title updates, rest is template
            setSlides([
              {
                icon: 'twemoji:open-book',
                title: `Welcome to ${moduleTitle}`,
                content: `You are exploring ${moduleTitle} in ${courseTitle}. Your teacher has prepared this lesson module. Follow the concepts, take notes, and explore the AI activities below!`,
                fact: 'Bubbles says: Practicing regularly helps you unlock high scores and badges!',
                audio: `Welcome to ${moduleTitle}. Your teacher has prepared this lesson module. Follow the concepts and take notes!`
              }
            ]);
          }
        }
      } catch (err) {
        if (active && (!slides || slides.length === 0)) {
          setSlides(DEFAULT_GEOMETRY_SLIDES);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSlides();

    // Auto-update when student switches back to window or storage changes
    window.addEventListener('focus', loadSlides);
    window.addEventListener('storage', loadSlides);

    // Cross-origin BroadcastChannel listener
    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('edugenai_channel');
        channel.onmessage = (event) => {
          if (!event.data || event.data.type === 'SLIDES_UPDATED' || event.data.type === 'MODULES_UPDATED') {
            loadSlides();
          }
        };
      }
    } catch (_) {}

    // Polling interval so updates from content creator immediately reflect
    const interval = setInterval(loadSlides, 4000);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('focus', loadSlides);
      window.removeEventListener('storage', loadSlides);
      if (channel) channel.close();
    };
  }, [moduleId, moduleTitle, courseTitle]);

  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides, currentSlide]);

  useEffect(() => {
    if (slides.length > 0 && slides[currentSlide]) {
      triggerMascotVoice(`Viewing slide ${currentSlide + 1}: ${slides[currentSlide].title}`);
    } else {
      triggerMascotVoice(`Let's read our notes on ${moduleTitle}!`);
    }
  }, [triggerMascotVoice, currentSlide, slides, moduleTitle]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleReadAloud = () => {
    if (!slides[currentSlide]) return;
    setIsReading(true);
    const textToRead =
      slides[currentSlide].audio ||
      `${slides[currentSlide].title}. ${slides[currentSlide].content} ${slides[currentSlide].fact ? 'Bubbles says: ' + slides[currentSlide].fact : ''}`;

    triggerMascotVoice(textToRead);
    setTimeout(() => setIsReading(false), 5000);
  };

  const handleDownload = () => {
    window.print();
  };

  const handleBookmark = () => {
    if (isSaved(noteId, 'Notes')) {
      removeItem(noteId, 'Notes');
    } else {
      saveItem({
        id: noteId,
        type: 'Notes',
        title: `${courseTitle} - ${moduleTitle}`,
        icon: slides[currentSlide]?.icon || 'twemoji:triangular-ruler'
      });
    }
  };

  const activeSlide = slides[currentSlide] || slides[0] || {};

  return (
    <div className="notes-page">
      <div className="notes-header glass-panel">
        <div className="header-content">
          <button
            className="back-btn"
            onClick={() => navigate('/modules', { state: { course: courseTitle, courseId } })}
            aria-label="Go Back"
          >
            <svg className="back-icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {courseTitle}
              </div>
              <h2 style={{ margin: 0 }}>{moduleTitle}</h2>
            </div>
            <button 
              className={`gamified-star-btn ${isSaved(noteId, 'Notes') ? 'saved' : ''}`}
              onClick={handleBookmark}
              title="Save Notes"
            >
              <AppIcon icon="twemoji:star" />
            </button>
          </div>

          <div className="notes-actions" style={{ position: 'absolute', right: 0 }}>
            <button
              className={`action-btn voice-reading ${isReading ? 'reading' : ''}`}
              onClick={handleReadAloud}
              disabled={slides.length === 0}
            >
              {isReading ? (
                <><AppIcon icon="twemoji:speaker-high-volume" /> Reading...</>
              ) : (
                <><AppIcon icon="twemoji:speaker-high-volume" /> Read Aloud</>
              )}
            </button>
            <button className="action-btn" onClick={handleDownload} disabled={slides.length === 0}>
              <AppIcon icon="twemoji:down-arrow" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Print View for All Slides */}
      <div className="print-all-slides">
        {slides.map((slide, index) => (
          <div key={index} className="print-slide">
            <div className="print-slide-header">
              {courseTitle} - {moduleTitle} - Slide {index + 1} of {slides.length}
            </div>
            <div className="slide-image">
              <AppIcon icon={slide.icon || 'twemoji:blue-book'} />
            </div>
            <h3>{slide.title}</h3>
            <p>{slide.content}</p>
            {slide.fact && (
              <div className="fun-fact">
                <span className="mascot-icon"><AppIcon icon="twemoji:octopus" /></span>
                <p><strong>Bubbles says:</strong> {slide.fact}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Slide Interactive Viewer */}
      <div className="notes-content glass-panel">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <AppIcon icon="twemoji:compass" />
            <p>Loading module slides...</p>
          </div>
        ) : (
          <>
            <div className="slide-viewer">
              <div className="slide-image">
                <AppIcon icon={activeSlide.icon || 'twemoji:triangular-ruler'} />
              </div>
              <h3>{activeSlide.title}</h3>
              <p>{activeSlide.content}</p>

              {activeSlide.fact && (
                <div className="fun-fact">
                  <span className="mascot-icon"><AppIcon icon="twemoji:octopus" /></span>
                  <p><strong>Bubbles says:</strong> {activeSlide.fact}</p>
                </div>
              )}

              {activeSlide.file && (
                <div style={{ marginTop: '1.5rem' }}>
                  <a
                    href={activeSlide.file.url}
                    download={activeSlide.file.name}
                    target="_blank"
                    rel="noreferrer"
                    className="attached-resource-chip"
                  >
                    <AppIcon icon="twemoji:paperclip" />
                    <span>Download Slide Material: {activeSlide.file.name}</span>
                  </a>
                </div>
              )}
            </div>

            <div className="slide-navigation">
              <button
                className="btn-secondary"
                onClick={handlePrev}
                style={{ visibility: currentSlide === 0 ? 'hidden' : 'visible' }}
              >
                Previous Slide
              </button>
              <span>Slide {currentSlide + 1} of {slides.length}</span>
              <button
                className="btn-secondary"
                onClick={handleNext}
                style={{ visibility: currentSlide === slides.length - 1 ? 'hidden' : 'visible' }}
              >
                Next Slide
              </button>
            </div>
          </>
        )}
      </div>

      <div className="notes-footer" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn-primary huge-btn"
          onClick={() => {
            incrementModules();
            navigate('/generate-activity', { state: { module: moduleTitle, course: courseTitle } });
          }}
        >
          Generate AI Activity <AppIcon icon="twemoji:sparkles" />
        </button>
        <button
          className="btn-secondary huge-btn"
          onClick={() => navigate('/activity-map')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Explore Quest Map <AppIcon icon="twemoji:world-map" />
        </button>
      </div>
    </div>
  );
};

export default Notes;
