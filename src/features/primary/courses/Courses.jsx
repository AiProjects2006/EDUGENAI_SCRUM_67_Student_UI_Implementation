import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Math', 'Science', 'English', 'ICT'];
  
  const units = [
    { id: 1, title: 'Fractions & Decimals', subject: 'Math', status: 'completed', image: '🔢' },
    { id: 2, title: 'Geometry Basics', subject: 'Math', status: 'unlocked', image: '📐' },
    { id: 3, title: 'Advanced Algebra', subject: 'Math', status: 'locked', image: '🧮' },
    { id: 4, title: 'Marine Biology', subject: 'Science', status: 'unlocked', image: '🐠' },
  ];

  const filteredUnits = units.filter(u => {
    const matchesCategory = activeCategory === 'All' || u.subject === activeCategory;
    const matchesSearch = u.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="courses-page">
      <div className="courses-header glass-panel">
        <h2>Your Learning Journey 📚</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for a course..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
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
        {filteredUnits.map(unit => (
          <div key={unit.id} className={`course-card glass-panel ${unit.status}`}>
            <div className="course-image">{unit.image}</div>
            <div className="course-content">
              <h3>{unit.title}</h3>
              <p className="subject-tag">{unit.subject}</p>
              
              {unit.status === 'locked' ? (
                <button className="btn-secondary disabled">Locked 🔒</button>
              ) : (
                <button className="btn-primary" onClick={() => navigate('/notes')}>
                  {unit.status === 'completed' ? 'Review' : 'Continue'}
                </button>
              )}
            </div>
            {unit.status === 'completed' && <div className="completion-badge">⭐</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
