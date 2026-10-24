import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { useSaved } from '../../../context/SavedContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import { useUser } from '../../../context/UserContext';
import { fetchPublishedCourses } from '../../../services/CourseService';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();
  const { saveItem, removeItem, isSaved } = useSaved();
  const { user } = useUser();
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiUnits, setApiUnits] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetchPublishedCourses()
        .then((data) => {
          if (active) {
            setApiUnits(data);
            setApiLoaded(true);
          }
        })
        .catch(() => { });

    load();

    window.addEventListener('focus', load);
    window.addEventListener('storage', load);
    window.addEventListener('coursesUpdated', load);

    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('edugenai_channel');
        channel.onmessage = (event) => {
          if (
            !event.data ||
            event.data.type === 'COURSES_UPDATED' ||
            event.data.type === 'COURSE_PUBLISHED'
          ) {
            load();
          }
        };
      }
    } catch (_) { }

    const interval = setInterval(load, 3000);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('focus', load);
      window.removeEventListener('storage', load);
      window.removeEventListener('coursesUpdated', load);
      if (channel) channel.close();
    };
  }, []);

  useEffect(() => {
    triggerMascotVoice("Let's start your Learning Journey! Pick a course!");
  }, [triggerMascotVoice]);

  const units = apiLoaded
    ? apiUnits
    : (user?.courses && user.courses.length > 0)
      ? user.courses.map((c, idx) => ({
        id: c.id || idx,
        courseId: c.id || idx,
        title: c.name || c.title,
        subject: c.category || c.subject || 'General',
        status: 'unlocked',
        image: c.icon || 'twemoji:books',
        thumbnailUrl: c.thumbnailUrl || null
      }))
      : [];

  // Only show 'All' and the subjects the student is actually enrolled in
  const categories = ['All', ...new Set(units.map(u => u.subject).filter(Boolean))];

  const filteredUnits = units.filter(u => {
    const matchesCategory = activeCategory === 'All' || u.subject === activeCategory;
    const matchesSearch = (u.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="courses-page">
      <div className="courses-header glass-panel">
        <h2>Your Learning Journey <AppIcon icon="twemoji:books" /></h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn"><AppIcon icon="twemoji:magnifying-glass-tilted-left" /></button>
        </div>
      </div>

      <div className="categories-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {filteredUnits.length === 0 ? (
          <div className="empty-courses glass-panel" style={{ textAlign: 'center', padding: '3rem', width: '100%', gridColumn: '1 / -1', color: 'white' }}>
            <span style={{ fontSize: '3rem' }}><AppIcon icon="twemoji:books" /></span>
            <h3 style={{ marginTop: '1rem', fontSize: '1.4rem' }}>No courses found</h3>
            <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>
              {searchQuery ? `No courses match "${searchQuery}".` : 'No published courses available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          filteredUnits.map(unit => (
            <div key={unit.id} className={`course-card glass-panel ${unit.status}`} onMouseEnter={() => triggerMascotVoice(unit.title)}>
              <div className="course-image">
                {unit.thumbnailUrl
                  ? <img src={unit.thumbnailUrl} alt={unit.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  : <AppIcon icon={unit.image} />}
              </div>
              <div className="course-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{unit.title}</h3>
                  <button
                    className={`gamified-star-btn ${isSaved(unit.id, 'Courses') ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSaved(unit.id, 'Courses')) {
                        removeItem(unit.id, 'Courses');
                      } else {
                        saveItem({ id: unit.id, type: 'Courses', title: unit.title, icon: unit.image });
                      }
                    }}
                    title="Save to Treasure Chest"
                  >
                    <AppIcon icon="twemoji:star" />
                  </button>
                </div>
                <p className="subject-tag">{unit.subject}</p>

                {unit.status === 'locked' ? (
                  <button className="btn-secondary disabled">Locked <AppIcon icon="twemoji:locked" /></button>
                ) : (
                  <button className="btn-primary" onClick={() => navigate('/modules', { state: { course: unit.title, courseId: unit.courseId || unit.id, subject: unit.subject } })}>
                    {unit.status === 'completed' ? <><AppIcon icon="twemoji:check-mark-button" /> Review</> : <><AppIcon icon="twemoji:play-button" /> Continue</>}
                  </button>
                )}
              </div>
              {unit.status === 'completed' && <div className="completion-badge"><AppIcon icon="twemoji:star" /></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;
