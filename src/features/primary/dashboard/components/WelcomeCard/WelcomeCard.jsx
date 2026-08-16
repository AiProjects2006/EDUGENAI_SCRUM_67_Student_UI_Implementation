import React from 'react';

const WelcomeCard = ({ name, streak }) => {
  return (
    <div className="welcome-banner glass-panel">
      <div className="welcome-content">
        <h2>Welcome back, {name}! 🌟</h2>
        <p>You have a {streak}-day learning streak! Keep it up!</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
