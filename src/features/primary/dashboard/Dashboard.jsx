import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard/WelcomeCard';
import RewardCard from './components/RewardCard/RewardCard';
import AchievementCard from './components/AchievementCard/AchievementCard';
import { useOceanAudio } from '../../../context/AudioContext';
import { useUser } from '../../../context/UserContext';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import { fetchPublishedCourses } from '../../../services/CourseService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { triggerMascotVoice } = useOceanAudio();
  const { user } = useUser();
  const studentName = user?.fullName?.split(' ')[0] || 'Alex';
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    let active = true;
    const loadCourses = () => {
      fetchPublishedCourses()
        .then((courses) => {
          if (active && Array.isArray(courses)) {
            setRecentCourses(courses.slice(0, 3));
          }
        })
        .catch(() => { });
    };

    loadCourses();
    window.addEventListener('focus', loadCourses);
    window.addEventListener('storage', loadCourses);

    return () => {
      active = false;
      window.removeEventListener('focus', loadCourses);
      window.removeEventListener('storage', loadCourses);
    };
  }, []);

  useEffect(() => {
    triggerMascotVoice(`Welcome back to your Dashboard  ${studentName}! Ready to learn?`);
  }, [triggerMascotVoice]);

  const mockBadges = [
    { tier: 'gold', icon: 'twemoji:trophy', name: 'Math Genius' },
    { tier: 'silver', icon: 'twemoji:2nd-place-medal', name: 'Fast Reader' },
    { tier: 'bronze', icon: 'twemoji:3rd-place-medal', name: 'Science Starter' }
  ];

  const continueItems = recentCourses.length > 0
    ? recentCourses
    : (user?.courses && user.courses.length > 0)
      ? user.courses.map((c, idx) => ({
        id: c.id || idx,
        courseId: c.id || idx,
        title: c.name || c.title,
        subject: c.category || c.subject || 'General',
        image: c.icon || 'twemoji:books'
      }))
      : [];

  return (
    <div className="dashboard-page">
      {/* 1. Welcome Section */}
      <WelcomeCard name={studentName} streak={5} />

      <div className="dashboard-grid">
        {/* Left Column: Learning & Missions */}
        <div className="dashboard-column left-column">
          {/* 2. Continue Learning Card */}
          <div className="continue-learning ocean-card">
            <div className="card-header">
              <h3>Continue Learning</h3>
              <span className="badge-new">Recent</span>
            </div>
            {continueItems.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#e2e8f0' }}>
                <p>No active courses yet!</p>
                <button
                  className="btn-primary"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => navigate('/courses')}
                >
                  Explore Courses <AppIcon icon="twemoji:books" />
                </button>
              </div>
            ) : (
              continueItems.map((item, idx) => (
                <div key={item.id || idx} className="continue-content">
                  <div className="course-icon math-bg">
                    <AppIcon icon={item.image || 'twemoji:books'} />
                  </div>
                  <div className="course-details">
                    <h4>{item.title}</h4>
                    <p>{item.subject} • Enrolled</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${60 + (idx * 15) % 35}%` }}></div>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/modules', {
                      state: {
                        course: item.title,
                        courseId: item.courseId || item.id,
                        subject: item.subject
                      }
                    })}
                  >
                    Resume
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 3. Today's Mission */}
          {/*<div className="todays-mission ocean-card">*/}
          {/*  <h3>Today's Missions</h3>*/}
          {/*  <ul className="mission-list">*/}
          {/*    <li className="mission-item completed glass-panel">*/}
          {/*      <span className="checkbox">✅</span>*/}
          {/*      <span>Complete 1 Math Activity</span>*/}
          {/*      <span className="reward">+50 XP</span>*/}
          {/*    </li>*/}
          {/*    <li className="mission-item glass-panel">*/}
          {/*      <span className="checkbox">⭕</span>*/}
          {/*      <span>Read Science Notes for 10 min</span>*/}
          {/*      <span className="reward">+100 XP</span>*/}
          {/*    </li>*/}
          {/*  </ul>*/}
          {/*</div>*/}


        </div>

        {/* Right Column: Rewards & Progress */}
        <div className="dashboard-column right-column">
          {/* 4. Reward Section */}
          {/*<RewardCard xp={1250} coins={450} stars={12} />*/}

          {/* 6. Achievement Cards */}
          <AchievementCard badges={mockBadges} />

          {/* 7. Weekly Progress */}
          {/*<div className="weekly-progress ocean-card">*/}
          {/*  <h3>Weekly Progress</h3>*/}
          {/*  <div className="chart-placeholder glass-panel">*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '40%'}}></div><span>M</span></div>*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '60%'}}></div><span>T</span></div>*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '80%'}}></div><span>W</span></div>*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '100%'}}></div><span>T</span></div>*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '30%'}}></div><span>F</span></div>*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '10%'}}></div><span>S</span></div>*/}
          {/*    <div className="bar-group"><div className="bar" style={{height: '20%'}}></div><span>S</span></div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
      {/* 5. Subject Grid */}
      <div className="subjects-section" style={{ marginTop: '2rem' }}>
        <h3>Your Subjects</h3>
        <div className="subject-bubbles-container">
          {(() => {
            const userCats = (user?.courses || []).map(c => c.category || c.subject).filter(Boolean);
            const recentCats = recentCourses.map(c => c.subject).filter(Boolean);
            const uniqueCategories = [...new Set([...userCats, ...recentCats])];
            return uniqueCategories.length > 0 ? (
              uniqueCategories.map((category, idx) => {
                let icon = "twemoji:books";
                if (category === 'Math' || category === 'Mathematics') icon = "twemoji:abacus";
                if (category === 'Science' || category === 'Environmental Studies') icon = "twemoji:deciduous-tree";
                if (category === 'ICT') icon = "twemoji:desktop-computer";
                if (category === 'English') icon = "twemoji:open-book";
                return (
                  <div
                    key={idx}
                    className={`subject-bubble glass-panel ${category.toLowerCase()}`}
                    onMouseEnter={() => triggerMascotVoice(`${category}! Let's start learning!`)}
                    onClick={() => navigate('/courses', { state: { category: category } })}
                  >
                    <span className="subject-icon"><AppIcon icon={icon} /></span>
                    <h4>{category}</h4>
                  </div>
                );
              })
            ) : (
              <div style={{ color: 'white', padding: '1rem', width: '100%', textAlign: 'center' }}>
                <p>No subjects selected yet! Head back to enroll.</p>
                <button className="btn-secondary" onClick={() => navigate('/grade-select')} style={{ marginTop: '10px' }}>Select Courses</button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
