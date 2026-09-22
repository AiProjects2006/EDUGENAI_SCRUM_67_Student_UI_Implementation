import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Recommendations.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const { triggerMascotVoice } = useOceanAudio();

  // Dynamic state for recommendations
  const [recommendedCourses, setRecommendedCourses] = useState([
    { id: 1, title: 'Creative Writing', description: 'Learn to write stories!', subject: 'english', icon: 'twemoji:open-book', path: '/notes' },
    { id: 2, title: 'Ocean Geography', description: 'Discover the deep blue!', subject: 'science', icon: 'twemoji:water-wave', path: '/notes' }
  ]);

  const [suggestedActivities, setSuggestedActivities] = useState([
    { id: 1, title: 'Pizza Fractions', description: 'Math • Medium Difficulty', subject: 'math', icon: 'twemoji:pizza', path: '/activity-map' },
    { id: 2, title: 'Shark Habitats', description: 'Science • Easy Difficulty', subject: 'science', icon: 'twemoji:shark', path: '/activity-map' }
  ]);

  useEffect(() => {
    triggerMascotVoice(`Here are some recommendations handpicked for you! Since you did so well in Math, try this fun fractions puzzle!`);
  }, [triggerMascotVoice]);

  return (
    <div className="recommendations-page">
      <div className="reco-header glass-panel">
        <h2>Handpicked for You! <AppIcon icon="twemoji:direct-hit" /></h2>
        <div className="mascot-tip">
          <span className="mascot-icon"><AppIcon icon="twemoji:octopus" /></span>
          <p><strong>Bubbles says:</strong> Since you did so well in Math, try this fun fractions puzzle!</p>
        </div>
      </div>

      <div className="reco-sections">
        <div className="reco-section">
          <h3>Recommended Courses <AppIcon icon="twemoji:books" /></h3>
          <div className="reco-grid">
            {recommendedCourses.map(course => (
              <div key={course.id} className="reco-card glass-panel" onClick={() => { triggerMascotVoice(course.title); setTimeout(() => navigate(course.path), 1000); }}>
                <div className={`reco-img ${course.subject}`}><AppIcon icon={course.icon} /></div>
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
          <h3>AI Suggested Activities <AppIcon icon="twemoji:sparkles" /></h3>
          <div className="reco-grid">
            {suggestedActivities.map(activity => (
              <div key={activity.id} className="reco-card glass-panel" onClick={() => { triggerMascotVoice(activity.title); setTimeout(() => navigate(activity.path), 1000); }}>
                <div className={`reco-img ${activity.subject}`}><AppIcon icon={activity.icon} /></div>
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
