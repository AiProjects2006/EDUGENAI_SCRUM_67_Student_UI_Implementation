import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import './Recommendations.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const { triggerMascotVoice } = useOceanAudio();

  // Dynamic state for recommendations
  const [recommendedCourses, setRecommendedCourses] = useState([
    { id: 1, title: 'Creative Writing', description: 'Learn to write stories!', subject: 'english', icon: '📖', path: '/notes' },
    { id: 2, title: 'Ocean Geography', description: 'Discover the deep blue!', subject: 'science', icon: '🌊', path: '/notes' }
  ]);

  const [suggestedActivities, setSuggestedActivities] = useState([
    { id: 1, title: 'Pizza Fractions', description: 'Math • Medium Difficulty', subject: 'math', icon: '🍕', path: '/activity-map' },
    { id: 2, title: 'Shark Habitats', description: 'Science • Easy Difficulty', subject: 'science', icon: '🦈', path: '/activity-map' }
  ]);

  useEffect(() => {
    triggerMascotVoice(`Here are some recommendations handpicked for you! Since you did so well in Math, try this fun fractions puzzle!`);
  }, [triggerMascotVoice]);

  return (
    <div className="recommendations-page">
      <div className="reco-header glass-panel">
        <h2>Handpicked for You! 🎯</h2>
        <div className="mascot-tip">
          <span className="mascot-icon">🐙</span>
          <p><strong>Bubbles says:</strong> Since you did so well in Math, try this fun fractions puzzle!</p>
        </div>
      </div>

      <div className="reco-sections">
        <div className="reco-section">
          <h3>Recommended Courses 📚</h3>
          <div className="reco-grid">
            {recommendedCourses.map(course => (
              <div key={course.id} className="reco-card glass-panel" onClick={() => { triggerMascotVoice(course.title); setTimeout(() => navigate(course.path), 1000); }}>
                <div className={`reco-img ${course.subject}`}>{course.icon}</div>
                <div className="reco-info">
                  <h4>{course.title}</h4>
                  <p>{course.description}</p>
                  <button className="btn-secondary">Explore</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reco-section">
          <h3>AI Suggested Activities ✨</h3>
          <div className="reco-grid">
            {suggestedActivities.map(activity => (
              <div key={activity.id} className="reco-card glass-panel" onClick={() => { triggerMascotVoice(activity.title); setTimeout(() => navigate(activity.path), 1000); }}>
                <div className={`reco-img ${activity.subject}`}>{activity.icon}</div>
                <div className="reco-info">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <button className="btn-primary">Play Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
