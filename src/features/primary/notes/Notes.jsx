import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { useProgress } from '../../../context/ProgressContext';
import { useSaved } from '../../../context/SavedContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import { fetchModuleSlides } from '../../../services/CourseService';
import './Notes.css';

const getModuleCurriculumSlides = (courseTitle = 'General Studies', moduleTitle = 'Lesson Overview') => [
  {
    icon: 'twemoji:open-book',
    title: `Introduction to ${moduleTitle}`,
    content: `In this lesson of ${courseTitle}, you will explore the essential foundations and key ideas of ${moduleTitle}. Study each slide carefully to prepare for your activities.`,
    fact: `Bubbles says: Understanding ${moduleTitle} helps you master ${courseTitle}!`,
    audio: `Introduction to ${moduleTitle} in ${courseTitle}. Study each slide carefully to prepare for your activities.`
  },
  {
    icon: 'twemoji:light-bulb',
    title: `Key Concepts of ${moduleTitle}`,
    content: `Core concepts of ${moduleTitle} connect directly to practical real-world applications. Pay close attention to vocabulary, processes, and relationships between elements.`,
    fact: 'Did you know? Active learning and self-testing boost concept retention by over 80%!',
    audio: `Key Concepts of ${moduleTitle}. Core concepts connect directly to real-world applications.`
  },
  {
    icon: 'twemoji:star',
    title: `Summary & Activity Challenge`,
    content: `You have completed the overview of ${moduleTitle}! Review the points above, then test your knowledge with interactive AI activities.`,
    fact: 'Bubbles says: Complete all 15 question types to earn special badges and ocean gems!',
    audio: `Summary and Activity Challenge. You are now ready to test your knowledge with interactive AI activities!`
  }
];

const Notes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();
  const { incrementModules } = useProgress();
  const { saveItem, removeItem, isSaved } = useSaved();

  const {
    module: moduleTitle = 'Module Overview',
    moduleId,
    course: courseTitle = 'Course',
    courseId,
    subject: courseSubject = ''
  } = location.state || {};

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishedActivity, setPublishedActivity] = useState(null);
  const isLoadingSlidesRef = useRef(false);

  const noteId = moduleId ? `note-${moduleId}` : 101;

  useEffect(() => {
    let active = true;

    const checkPublished = async () => {
      // 1. Check local storage for activities published by teacher
      try {
        const raw = localStorage.getItem('published_activities');
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.find((a) =>
            (moduleId && Number(a.moduleId) === Number(moduleId)) ||
            (a.moduleTitle && moduleTitle && a.moduleTitle.toLowerCase() === moduleTitle.toLowerCase()) ||
            (a.courseTitle && courseTitle && a.courseTitle.toLowerCase() === courseTitle.toLowerCase())
          );
          if (found && active) {
            setPublishedActivity(found);
            return;
          }
        }
      } catch (_) { }

      // 2. Check Activity API via Gateway
      try {
        const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
        const modIdParam = moduleId || 1;
        const res = await fetch(`${GATEWAY_URL}/api/v1/activities?moduleId=${modIdParam}`).catch(() => null);
        if (res && res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0 && active) {
            // Fetch detail for first activity
            const actId = list[0].activityId || list[0].id;
            const detRes = await fetch(`${GATEWAY_URL}/api/v1/activities/${actId}`).catch(() => null);
            if (detRes && detRes.ok) {
              const detail = await detRes.json();
              if (active && detail && Array.isArray(detail.questions) && detail.questions.length > 0) {
                const actType = detail.activityType || list[0].activityType || 'MCQ';
                const formatted = {
                  ...list[0],
                  activityType: actType,
                  questions: detail.questions.map((q, idx) => ({
                    id: idx + 100,
                    activityType: q.activityType || actType,
                    question: q.questionText || q.question || `Question ${idx + 1}`,
                    options: (q.options || []).map(o => typeof o === 'string' ? o : o.optionText),
                    correctAnswer: q.correctAnswer || (q.options || []).find(o => o.correct)?.optionText || q.options?.[0]?.optionText,
                    categories: q.categories || null,
                    items: q.items || null,
                    itemsToOrder: q.itemsToOrder || null,
                    imageUrl: q.imageUrl || null,
                    passage: q.passage || null,
                    timeLimitSeconds: q.timeLimitSeconds || (actType === 'TIMED_QUIZ' ? 20 : null),
                    correctFeedback: 'Great job! That is correct! 🌟',
                    incorrectFeedback: 'Oops! Try again next time.',
                    points: q.points || 2
                  }))
                };
                setPublishedActivity(formatted);
              }
            }
          }
        }
      } catch (_) { }
    };

    checkPublished();
    window.addEventListener('focus', checkPublished);
    window.addEventListener('storage', checkPublished);

    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('edugenai_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'ACTIVITY_PUBLISHED') {
            checkPublished();
          }
        };
      }
    } catch (_) { }

    return () => {
      active = false;
      window.removeEventListener('focus', checkPublished);
      window.removeEventListener('storage', checkPublished);
      if (channel) channel.close();
    };
  }, [moduleId, moduleTitle, courseTitle]);

  useEffect(() => {
    let active = true;

    const loadSlides = async () => {
      if (isLoadingSlidesRef.current) return;
      isLoadingSlidesRef.current = true;
      try {
        let loaded = [];
        if (moduleId || moduleTitle) {
          loaded = await fetchModuleSlides(moduleId, moduleTitle, courseId, courseTitle);
        }

        if (active) {
          if (Array.isArray(loaded) && loaded.length > 0) {
            setSlides(loaded);
          } else {
            // Dynamic curriculum slides based on the module and course
            setSlides(getModuleCurriculumSlides(courseTitle, moduleTitle));
          }
        }
      } catch (err) {
        if (active && (!slides || slides.length === 0)) {
          setSlides(getModuleCurriculumSlides(courseTitle, moduleTitle));
        }
      } finally {
        isLoadingSlidesRef.current = false;
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
    } catch (_) { }

    // Polling interval so updates from content creator immediately reflect
    const interval = setInterval(loadSlides, 8000);

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
        icon: slides[currentSlide]?.icon || 'twemoji:books'
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
            onClick={() => navigate('/modules', { state: { course: courseTitle, courseId, subject: courseSubject } })}
            aria-label="Go Back"
          >
            <svg className="back-icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
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
                <AppIcon icon={activeSlide.icon || 'twemoji:books'} />
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
        {publishedActivity && (
          <button
            className="btn-primary huge-btn"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}
            onClick={() => {
              incrementModules();
              navigate('/generate-activity-activity', {
                state: {
                  type: publishedActivity.activityType || 'Multiple Choice Questions (MCQ)',
                  diff: publishedActivity.difficulty || 'MEDIUM',
                  count: publishedActivity.questions?.length || 5,
                  module: moduleTitle,
                  course: courseTitle,
                  subject: courseSubject,
                  moduleId,
                  courseId,
                  generatedQuestions: publishedActivity.questions
                }
              });
            }}
          >
            Start Course Activity ({publishedActivity.questions?.length || 5} Questions) <AppIcon icon="twemoji:sparkles" />
          </button>
        )}

        <button
          className="btn-primary huge-btn"
          onClick={() => {
            incrementModules();
            navigate('/generate-activity', {
              state: {
                module: moduleTitle,
                course: courseTitle,
                subject: courseSubject,
                moduleId,
                courseId
              }
            });
          }}
        >
          {publishedActivity ? "Generate AI Questions" : "Generate AI Activity"} <AppIcon icon="twemoji:rocket" />
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
