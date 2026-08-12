import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import { useUser } from '../../../context/UserContext';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [dob, setDob] = useState('');
  const [calculatedGrade, setCalculatedGrade] = useState('');
  const [gradeNumber, setGradeNumber] = useState(null);
  const [ageError, setAgeError] = useState('');
  
  // Connect context fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=pearl&backgroundColor=b6e3f4');
  
  const fileInputRef = useRef(null);

  const calculateGrade = (dateString) => {
    if (!dateString) {
      setAgeError('');
      setCalculatedGrade('');
      setGradeNumber(null);
      return;
    }
    
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 8 || age > 16) {
      setAgeError('Explorers must be between 8 and 16 years old.');
      setCalculatedGrade('');
      setGradeNumber(null);
      return;
    } else {
      setAgeError('');
    }
    
    // Grade = Age - 5 (Age 8 = Grade 3, Age 16 = Grade 11)
    let grade = age - 5;
    
    setCalculatedGrade(`Grade ${grade}`);
    setGradeNumber(grade);
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
    calculateGrade(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleComplete = (e) => {
    e.preventDefault();
    
    if (ageError || !gradeNumber) {
      alert("Please enter a valid Date of Birth (Age 8 - 16)");
      return;
    }
    
    const finalGrade = calculatedGrade;
    const finalGradeNum = gradeNumber;
    
    // Map avatar URL to emojis for context, or just store the avatarUrl
    // Context expects an emoji typically, let's just pass an emoji for now
    // or let's update it to actually show the avatar they want. 
    // To match the current UserContext format, we'll use an emoji if they haven't uploaded.
    const finalAvatar = avatarUrl.includes('dicebear') ? '👦' : '🧑';
    
    updateUser({
      fullName: fullName || 'New Explorer',
      email: email || 'student@school.edu',
      phone: phone || '',
      grade: finalGrade,
      avatar: finalAvatar
    });

    navigate('/grade-select');
  };

  return (
    <div className="profile-setup-page">
      <OceanBackground />
      <div className="id-badge-card glass-panel">
        <div className="badge-header">
          <h2>⚓ Captain's ID Badge</h2>
          <p>Review and update your educational explorer statistics!</p>
        </div>
        
        <form onSubmit={handleComplete} className="badge-form">
          <div className="avatar-section">
            <img src={avatarUrl} alt="Avatar" className="badge-avatar" />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleAvatarChange}
            />
            <button 
              type="button" 
              className="btn-secondary small-btn" 
              onClick={() => fileInputRef.current.click()}
            >
              Upload Avatar
            </button>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Captain's Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Email Contact</label>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Contact Number</label>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="input-group dob-group">
              <label>Date of Birth</label>
              <input type="date" value={dob} onChange={handleDobChange} required />
              {ageError && <span style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>{ageError}</span>}
              {!ageError && calculatedGrade && <span className="grade-badge-hint">Calculated: {calculatedGrade}</span>}
            </div>
            
            <div className="input-group">
              <label>City & Country</label>
              <input type="text" placeholder="E.g., Colombo, Sri Lanka" required />
            </div>
          </div>
          
          <button type="submit" className="btn-success submit-badge">Stamp ID & Start Adventure! 🌊</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
