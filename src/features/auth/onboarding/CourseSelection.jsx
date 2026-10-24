import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import './Onboarding.css';

const catalogData = {
  "Grade 3": [
    { subject: 'Mathematics', title: 'Mathematics 3', icon: 'twemoji:abacus', courses: [
      { id: 'math-3-1', name: 'Multiplication Basics & Word Problems', icon: 'twemoji:input-numbers', category: 'Mathematics' },
      { id: 'math-3-2', name: 'Geometry Basics & Shapes', icon: 'twemoji:triangular-ruler', category: 'Mathematics' }
    ]},
    { subject: 'Environmental Studies', title: 'Environmental Studies 3', icon: 'twemoji:deciduous-tree', courses: [
      { id: 'env-3-1', name: 'Our Living Environment', icon: 'twemoji:potted-plant', category: 'Environmental Studies' },
      { id: 'env-3-2', name: 'Plants and Animals Around Us', icon: 'twemoji:tropical-fish', category: 'Environmental Studies' }
    ]},
    { subject: 'ICT', title: 'ICT 3', icon: 'twemoji:laptop', courses: [
      { id: 'ict-3-1', name: 'Introduction to Computers', icon: 'twemoji:desktop-computer', category: 'ICT' },
      { id: 'ict-3-2', name: 'Mouse & Keyboard Mastery', icon: 'twemoji:computer-mouse', category: 'ICT' }
    ]}
  ],
  "Grade 4": [
    { subject: 'Mathematics', title: 'Mathematics 4', icon: 'twemoji:abacus', courses: [
      { id: 'math-4-1', name: 'Fractions & Decimals', icon: 'twemoji:input-numbers', category: 'Mathematics' },
      { id: 'math-4-2', name: 'Geometry & Angles', icon: 'twemoji:triangular-ruler', category: 'Mathematics' }
    ]},
    { subject: 'Environmental Studies', title: 'Environmental Studies 4', icon: 'twemoji:deciduous-tree', courses: [
      { id: 'env-4-1', name: 'Our Living Environment & Ecosystems', icon: 'twemoji:water-wave', category: 'Environmental Studies' },
      { id: 'env-4-2', name: 'Weather and Natural Resources', icon: 'twemoji:sun-behind-cloud', category: 'Environmental Studies' }
    ]},
    { subject: 'ICT', title: 'ICT 4', icon: 'twemoji:laptop', courses: [
      { id: 'ict-4-1', name: 'Digital Tools & Document Creation', icon: 'twemoji:keyboard', category: 'ICT' },
      { id: 'ict-4-2', name: 'Internet Basics & Safe Browsing', icon: 'twemoji:globe-with-meridians', category: 'ICT' }
    ]}
  ],
  "Grade 5": [
    { subject: 'Mathematics', title: 'Mathematics 5', icon: 'twemoji:abacus', courses: [
      { id: 'math-5-1', name: 'Advanced Fractions & Ratios', icon: 'twemoji:abacus', category: 'Mathematics' },
      { id: 'math-5-2', name: 'Measurement, Area & Volume', icon: 'twemoji:triangular-ruler', category: 'Mathematics' }
    ]},
    { subject: 'Environmental Studies', title: 'Environmental Studies 5', icon: 'twemoji:deciduous-tree', courses: [
      { id: 'env-5-1', name: 'Ecosystem Preservation & Biodiversity', icon: 'twemoji:globe-showing-americas', category: 'Environmental Studies' },
      { id: 'env-5-2', name: 'Climate & Energy Conservation', icon: 'twemoji:seedling', category: 'Environmental Studies' }
    ]},
    { subject: 'ICT', title: 'ICT 5', icon: 'twemoji:laptop', courses: [
      { id: 'ict-5-1', name: 'Introduction to Computer Basics & Digital Safety', icon: 'twemoji:laptop', category: 'ICT' },
      { id: 'ict-5-2', name: 'Digital Citizenship & Cyber Safety', icon: 'twemoji:shield', category: 'ICT' }
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
                  <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {isExpanded ? <>Close <AppIcon icon="twemoji:see-no-evil-monkey" /></> : <>Peek Inside <AppIcon icon="twemoji:eyes" /></>}
                  </span>
                </div>
                <button 
                  className="btn-primary small-btn" 
                  onClick={() => toggleAllCoursesForSubject(subjectItem)}
                  style={{ 
                    padding: '8px 15px', 
                    fontSize: '14px', 
                    backgroundColor: allSelected ? '#ef476f' : '',
                    borderColor: allSelected ? '#ef476f' : ''
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
                          }}><AppIcon icon="twemoji:check-mark-button" style={{ width: '14px', height: '14px' }} /></div>
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
