import React from 'react';

const RewardCard = ({ xp, coins, stars }) => {
  return (
    <div className="reward-section ocean-card">
      <h3>Your Treasures</h3>
      <div className="stats-row">
        <div className="stat-card glass-panel">
          <span className="icon">✨</span>
          <div className="stat-info">
            <h4>XP</h4>
            <p>{xp}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon">🪙</span>
          <div className="stat-info">
            <h4>Coins</h4>
            <p>{coins}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon">⭐</span>
          <div className="stat-info">
            <h4>Stars</h4>
            <p>{stars}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
