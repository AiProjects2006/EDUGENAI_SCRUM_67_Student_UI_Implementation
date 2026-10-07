import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Recommendations.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerMascotVoice } = useOceanAudio();

  const score = location.state?.score ?? 4;
  const total = location.state?.total ?? 5;
  const percentage = Math.round((score / total) * 100);

  // Dynamic recommendations based on score
  let initialCourses = [
    { id: 1, title: 'Creative Writing', description: 'Learn to write stories!', subject: 'english', icon: 'twemoji:open-book', path: '/notes' },
    { id: 2, title: 'Ocean Geography', description: 'Discover the deep blue!', subject: 'science', icon: 'twemoji:water-wave', path: '/notes' }
  ];
  
  let initialActivities = [
    { id: 1, title: 'Pizza Fractions', description: 'Math • Medium Difficulty', subject: 'math', icon: 'twemoji:pizza', path: '/activity-map' },
    { id: 2, title: 'Shark Habitats', description: 'Science • Easy Difficulty', subject: 'science', icon: 'twemoji:shark', path: '/activity-map' }
  ];

  let mascotSpeech = `Here are some recommendations handpicked for you! Since you did so well, try this fun fractions puzzle!`;
  let tipText = `Since you did so well, try this fun fractions puzzle!`;

  if (percentage >= 80) {
    // High performance
    initialCourses = [
      { id: 1, title: 'Advanced Oceanography', description: 'Explore the deepest trenches!', subject: 'science', icon: 'twemoji:water-wave', path: '/notes' },
      { id: 2, title: 'Marine Biology Pro', description: 'Master marine life species!', subject: 'science', icon: 'twemoji:dolphin', path: '/notes' }
    ];
    initialActivities = [
      { id: 1, title: 'Deep Sea Math Boss', description: 'Math • Very Hard', subject: 'math', icon: 'twemoji:octopus', path: '/activity-map' },
      { id: 2, title: 'Whale Migration Challenge', description: 'Science • Very Hard', subject: 'science', icon: 'twemoji:whale', path: '/activity-map' }
    ];
    mascotSpeech = `Wow! You scored ${percentage} percent! You are ready for some really advanced challenges. Check these out!`;
    tipText = `Your high score unlocked Advanced Oceanography! You are ready for a real challenge.`;
  } else if (percentage < 60) {
    // Low performance
    initialCourses = [
      { id: 1, title: 'Math Basics Review', description: 'Brush up on your numbers.', subject: 'math', icon: 'twemoji:abacus', path: '/notes' },
      { id: 2, title: 'Ocean Basics', description: 'Review the layers of the sea.', subject: 'science', icon: 'twemoji:fish', path: '/notes' }
    ];
    initialActivities = [
      { id: 1, title: 'Easy Addition Practice', description: 'Math • Easy', subject: 'math', icon: 'twemoji:input-numbers', path: '/activity-map' },
      { id: 2, title: 'Fish Identification', description: 'Science • Easy', subject: 'science', icon: 'twemoji:blowfish', path: '/activity-map' }
    ];
    mascotSpeech = `You scored ${percentage} percent. Don't worry! Here are some great review courses to help you master the basics.`;
    tipText = `Let's review some basic math and science to help boost your score next time!`;
  }

  const [recommendedCourses, setRecommendedCourses] = useState(initialCourses);
  const [suggestedActivities, setSuggestedActivities] = useState(initialActivities);

  useEffect(() => {
    triggerMascotVoice(mascotSpeech);
  }, [triggerMascotVoice, mascotSpeech]);

  return (
    <div className="recommendations-page">
      <div className="reco-header glass-panel">
        <h2>Handpicked for You! <AppIcon icon="twemoji:direct-hit" /></h2>
        <div className="mascot-tip">
          <span className="mascot-icon"><AppIcon icon="twemoji:octopus" /></span>
          <p><strong>Bubbles says:</strong> {tipText}</p>
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
