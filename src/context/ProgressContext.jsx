import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('ocean_progress');
    if (saved) return JSON.parse(saved);
    return {
      coursesCompleted: 0,
      modulesCompleted: 0,
      activitiesDone: 0,
      starsEarned: 0,
      subjectProgress: {
        Mathematics: { percentage: 10, current: 'Fractions & Decimals', color: '#ef476f' },
        Science: { percentage: 20, current: 'Marine Biology', color: '#06d6a0' },
        English: { percentage: 5, current: 'Creative Writing', color: '#ffd166' }
      },
      badges: [
        { id: 'math', name: 'Math Whiz', icon: '🥇', earned: false },
        { id: 'science', name: 'Science Pro', icon: '🥈', earned: false },
        { id: 'reader', name: 'Reader', icon: '🥉', earned: false },
        { id: 'grammar', name: 'Grammar Master', icon: '🔒', earned: false }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('ocean_progress', JSON.stringify(progress));
  }, [progress]);

  const addStars = (amount) => {
    setProgress(prev => {
        const newStars = prev.starsEarned + amount;
        const newBadges = [...prev.badges];
        if (newStars >= 100) newBadges[0].earned = true; // Unlock math whiz example
        if (newStars >= 500) newBadges[1].earned = true; // Unlock science pro
        return { ...prev, starsEarned: newStars, badges: newBadges };
    });
  };

  const incrementActivities = () => {
    setProgress(prev => ({ ...prev, activitiesDone: prev.activitiesDone + 1 }));
  };

  const incrementCourses = () => {
    setProgress(prev => ({ ...prev, coursesCompleted: prev.coursesCompleted + 1 }));
  };

  const incrementModules = () => {
    setProgress(prev => ({ ...prev, modulesCompleted: prev.modulesCompleted + 1 }));
  };

  const updateSubjectProgress = (subject, amount) => {
    setProgress(prev => {
      const newSubjectProgress = { ...prev.subjectProgress };
      if (newSubjectProgress[subject]) {
        newSubjectProgress[subject].percentage = Math.min(100, newSubjectProgress[subject].percentage + amount);
      }
      return { ...prev, subjectProgress: newSubjectProgress };
    });
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      addStars,
      incrementActivities,
      incrementCourses,
      incrementModules,
      updateSubjectProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
