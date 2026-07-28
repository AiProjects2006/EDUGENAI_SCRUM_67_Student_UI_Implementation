import React from 'react';

const AchievementCard = ({ badges }) => {
  return (
    <div className="achievements-section ocean-card">
      <h3>Recent Badges</h3>
      <div className="badges-grid">
        {badges.map((badge, index) => (
          <div key={index} className={`badge-item ${badge.tier} glass-panel`}>
            <div className="badge-icon">{badge.icon}</div>
            <p>{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementCard;
