import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Onboarding.css';

const catalogData = {
  "Grade 3": [
    { subject: 'Math', title: 'Mathematics 3', icon: 'twemoji:abacus', courses: [
      { id: 'math-3-1', name: 'Fractions & Decimals', icon: 'twemoji:input-numbers', category: 'Math' },
      { id: 'math-3-2', name: 'Geometry Basics', icon: 'twemoji:triangular-ruler', category: 'Math' }
    ]},
    { subject: 'Science', title: 'Science 3', icon: 'twemoji:microscope', courses: [
      { id: 'sci-3-1', name: 'Marine Biology', icon: 'twemoji:tropical-fish', category: 'Science' },
      { id: 'sci-3-2', name: 'Plant Life', icon: 'twemoji:potted-plant', category: 'Science' }
    ]},
    { subject: 'English', title: 'English 3', icon: 'twemoji:open-book', courses: [
      { id: 'eng-3-1', name: 'Grammar Basics', icon: 'twemoji:pencil', category: 'English' },
      { id: 'eng-3-2', name: 'Reading Comprehension', icon: 'twemoji:books', category: 'English' }
    ]}
  ],
  "Grade 4": [
    { subject: 'Math', title: 'Mathematics 4', icon: 'twemoji:abacus', courses: [
      { id: 'math-4-1', name: 'Fractions & Decimals', icon: 'twemoji:input-numbers', category: 'Math' },
      { id: 'math-4-2', name: 'Geometry Basics', icon: 'twemoji:triangular-ruler', category: 'Math' }
    ]},
    { subject: 'Science', title: 'Science 4', icon: 'twemoji:microscope', courses: [
      { id: 'sci-4-1', name: 'Marine Biology', icon: 'twemoji:tropical-fish', category: 'Science' }
    ]},
    { subject: 'English', title: 'English 4', icon: 'twemoji:open-book', courses: [
      { id: 'eng-4-1', name: 'Grammar Advanced', icon: 'twemoji:pencil', category: 'English' }
    ]}
  ],
  "Grade 5": [
    { subject: 'Math', title: 'Mathematics 5', icon: 'twemoji:abacus', courses: [
      { id: 'math-5-1', name: 'Advanced Algebra', icon: 'twemoji:abacus', category: 'Math' }
    ]},
    { subject: 'Science', title: 'Science 5', icon: 'twemoji:microscope', courses: [
      { id: 'sci-5-1', name: 'Physics Basics', icon: 'twemoji:rocket', category: 'Science' }
    ]},
    { subject: 'English', title: 'English 5', icon: 'twemoji:open-book', courses: [
      { id: 'eng-5-1', name: 'Essay Writing', icon: 'twemoji:scroll', category: 'English' }
    ]}
  ]
};

const CourseSelection = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const currentGrade = user?.grade || "Grade 3";
  
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [expandedSubject, setExpandedSubject] = useState(null);

  const subjects = catalogData[currentGrade] || [];

  const toggleCourseSelect = (course) => {
    setSelectedCourses(prev => {
      const exists = prev.find(c => c.id === course.id);
      if (exists) return prev.filter(c => c.id !== course.id);
      return [...prev, course];
    });
  };

  const toggleAllCoursesForSubject = (subjectItem) => {
    const allSelected = subjectItem.courses.every(c => 
      selectedCourses.find(sc => sc.id === c.id)
    );

    setSelectedCourses(prev => {
      let newSelected = [...prev];
      if (allSelected) {
        return newSelected.filter(sc => !subjectItem.courses.find(c => c.id === sc.id));
      } else {
        subjectItem.courses.forEach(c => {
          if (!newSelected.find(sc => sc.id === c.id)) {
            newSelected.push(c);
          }
        });
        return newSelected;
      }
    });
  };

  const handleEnroll = () => {
    updateUser({ courses: selectedCourses });
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-page">
      <OceanBackground />
      <div className="onboarding-header glass-panel">
        <h2>Choose Your Courses</h2>
        <p>You selected {currentGrade}. Select whole subjects or pick specific courses to enroll!</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '800px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
        {subjects.map((subjectItem) => {
          const isExpanded = expandedSubject === subjectItem.subject;
          const allSelected = subjectItem.courses.every(c => selectedCourses.find(sc => sc.id === c.id));
          
          return (
            <div key={subjectItem.subject} className="glass-panel" style={{ padding: '20px', borderRadius: '15px', transition: 'transform 0.2s ease-in-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', flexGrow: 1 }}
                  onClick={() => setExpandedSubject(isExpanded ? null : subjectItem.subject)}
                  onMouseEnter={(e) => e.currentTarget.parentElement.parentElement.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.parentElement.parentElement.style.transform = 'scale(1)'}
                >
                  <AppIcon icon={subjectItem.icon} />
                  <h3 style={{ margin: 0 }}>{subjectItem.title}</h3>
                  <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                    {isExpanded ? 'Close 🙈' : 'Peek Inside 👀'}
                  </span>
                </div>
                <button 
                  className="btn-primary small-btn" 
                  onClick={() => toggleAllCoursesForSubject(subjectItem)}
                  style={{ 
                    padding: '8px 15px', 
                    fontSize: '14px', 
                    backgroundColor: allSelected ? '#ff6b6b' : '',
                    borderColor: allSelected ? '#ff6b6b' : ''
                  }}
                >
                  {allSelected ? 'Clear All' : 'Select All'}
                </button>
              </div>

              {isExpanded && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                  {subjectItem.courses.map(course => {
                    const isSelected = selectedCourses.find(c => c.id === course.id);
                    return (
                      <div 
                        key={course.id} 
                        className={`grade-card glass-panel`}
                        onClick={() => toggleCourseSelect(course)}
                        style={{ 
                          position: 'relative', 
                          border: isSelected ? '3px solid #00f2fe' : 'none',
                          cursor: 'pointer',
                          minWidth: '150px',
                          padding: '15px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center'
                        }}
                      >
                        <h4 style={{ margin: '0 0 10px 0' }}>{course.name}</h4>
                        <AppIcon icon={course.icon} />
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: '-10px', right: '-10px',
                            backgroundColor: '#00f2fe', color: 'white', borderRadius: '50%',
                            width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', border: '2px solid white'
                          }}>✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', zIndex: 2, position: 'relative' }}>
        <button className="btn-secondary" onClick={() => navigate('/grade-select')}>
          Back to Grades
        </button>
        <button 
          className="btn-primary" 
          onClick={handleEnroll}
          disabled={selectedCourses.length === 0}
          style={{ opacity: selectedCourses.length === 0 ? 0.5 : 1 }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CourseSelection;
