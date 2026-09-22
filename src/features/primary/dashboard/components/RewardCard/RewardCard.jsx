import React from 'react';
import { AppIcon } from '../../../../../components/common/AppIcon/AppIcon';

const RewardCard = ({ xp, coins, stars }) => {
  return (
    <div className="reward-section ocean-card">
      <h3>Your Treasures</h3>
      <div className="stats-row">
        <div className="stat-card glass-panel">
          <span className="icon"><AppIcon icon="twemoji:sparkles" /></span>
          <div className="stat-info">
            <h4>XP</h4>
            <p>{xp}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon"><AppIcon icon="twemoji:coin" /></span>
          <div className="stat-info">
            <h4>Coins</h4>
            <p>{coins}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon"><AppIcon icon="twemoji:star" /></span>
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
