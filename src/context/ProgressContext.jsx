import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const defaultState = {
      coursesCompleted: 0,
      modulesCompleted: 0,
      activitiesDone: 0,
      starsEarned: 0,
      subjectProgress: {
        Mathematics: { percentage: 10, color: '#ef476f' },
        Science: { percentage: 20, color: '#06d6a0' },
        English: { percentage: 5, color: '#ffd166' },
        ICT: { percentage: 0, color: '#66f2ff' }
      },
      badges: [
        { id: 'math', name: 'Math Whiz', icon: '🥇', earned: false },
        { id: 'science', name: 'Science Pro', icon: '🥈', earned: false },
        { id: 'reader', name: 'Reader', icon: '🥉', earned: false },
        { id: 'grammar', name: 'Grammar Master', icon: '🔒', earned: false }
      ]
    };

    const saved = localStorage.getItem('ocean_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new subjects like ICT are added if they were missing in local storage
      const mergedSubjectProgress = { ...defaultState.subjectProgress, ...parsed.subjectProgress };
      return { ...parsed, subjectProgress: mergedSubjectProgress };
    }
    return defaultState;
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
