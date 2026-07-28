import React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard/WelcomeCard';
import RewardCard from './components/RewardCard/RewardCard';
import AchievementCard from './components/AchievementCard/AchievementCard';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const mockBadges = [
    { tier: 'gold', icon: '🏆', name: 'Math Genius' },
    { tier: 'silver', icon: '🥈', name: 'Fast Reader' },
    { tier: 'bronze', icon: '🥉', name: 'Science Starter' }
  ];

  return (
    <div className="dashboard-page">
      {/* 1. Welcome Section */}
      <WelcomeCard name="Alex" streak={5} />

      <div className="dashboard-grid">
        {/* Left Column: Learning & Missions */}
        <div className="dashboard-column left-column">
          {/* 2. Continue Learning Card */}
          <div className="continue-learning ocean-card">
            <div className="card-header">
              <h3>Continue Learning</h3>
              <span className="badge-new">Recent</span>
            </div>
            <div className="continue-content">
              <div className="course-icon math-bg">➕</div>
              <div className="course-details">
                <h4>Fractions & Decimals</h4>
                <p>Math • Level 3</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => navigate('/activity-map')}>
                Resume
              </button>
            </div>
            <div className="continue-content">
              <div className="course-icon math-bg">➕</div>
              <div className="course-details">
                <h4>Fractions & Decimals</h4>
                <p>Math • Level 3</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => navigate('/activity-map')}>
                Resume
              </button>
            </div>
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
            <div className="subject-bubble glass-panel math" onClick={() => navigate('/courses', { state: { category: 'Math' } })}>
              <span className="subject-icon">➕</span>
              <h4>Math</h4>
            </div>
            <div className="subject-bubble glass-panel science" onClick={() => navigate('/courses', { state: { category: 'Science' } })}>
              <span className="subject-icon">🧪</span>
              <h4>Science</h4>
            </div>
            <div className="subject-bubble glass-panel english" onClick={() => navigate('/courses', { state: { category: 'English' } })}>
              <span className="subject-icon">🔤</span>
              <h4>English</h4>
            </div>
            <div className="subject-bubble glass-panel ict" onClick={() => navigate('/courses', { state: { category: 'ICT' } })}>
              <span className="subject-icon">💻</span>
              <h4>ICT</h4>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
