import React from 'react';
import { AppIcon } from '../../../../../components/common/AppIcon/AppIcon';

const WelcomeCard = ({ name, streak }) => {
  return (
    <div className="welcome-banner glass-panel">
      <div className="welcome-content">
        <h2>Welcome back, {name}! <AppIcon icon="twemoji:glowing-star" /></h2>
        <p>You have a {streak}-day learning streak! Keep it up!</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
