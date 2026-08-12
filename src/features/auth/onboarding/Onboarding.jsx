import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleGradeSelect = (grade) => {
    updateUser({ grade: `Grade ${grade}` });
    
    if (grade > 5) {
      navigate('/secondary-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const grades = [3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="onboarding-page">
      <OceanBackground />
      <div className="onboarding-header glass-panel">
        <h2>Choose Your Grade Level</h2>
        <p>Let's personalize your adventure! Feel free to pick any grade.</p>
      </div>

      <div className="grade-cards">
        {grades.map((grade) => (
          <div 
            key={grade} 
            className="grade-card glass-panel"
            onClick={() => handleGradeSelect(grade)}
          >
            <h3>Grade {grade}</h3>
            <div className="grade-illustration">🎓</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
