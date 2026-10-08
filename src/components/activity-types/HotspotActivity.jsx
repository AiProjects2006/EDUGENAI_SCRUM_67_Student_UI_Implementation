import React, { useState, useRef } from 'react';
import { AppIcon } from '../common/AppIcon/AppIcon';

const HotspotActivity = ({ data, onAnswerSubmit }) => {
  const [showResult, setShowResult] = useState(false);
  const [clickPos, setClickPos] = useState(null);
  const imgRef = useRef(null);

  const handleImageClick = (e) => {
    if (showResult) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const yPercent = (y / rect.height) * 100;

    setClickPos({ x, y });

    // Mocking the hotspot logic: For "roots", let's assume the bottom 45% of the image is the correct zone
    const isCorrect = yPercent >= 55; // Clicked in the bottom 45%

    setShowResult(true);

    if (onAnswerSubmit) {
      onAnswerSubmit(isCorrect, isCorrect ? data.correctFeedback : data.incorrectFeedback, isCorrect ? "Clicked correct area" : "Clicked wrong area");
    }
  };

  return (
    <div className="activity-container hotspot-activity">
      <h2 className="activity-question">
        {data.icon && <AppIcon icon={data.icon} />}{' '}
        {data.question}
      </h2>

      <div className="hotspot-image-container" style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
        {data.imageUrl ? (
           <div 
             ref={imgRef}
             className="hotspot-image-wrapper glass-panel" 
             style={{ padding: '10px', cursor: showResult ? 'default' : 'crosshair' }}
             onClick={handleImageClick}
           >
             {/* If the image doesn't load, show a placeholder box */}
             <img 
               src={data.imageUrl} 
               alt="Activity diagram" 
               style={{ maxWidth: '100%', maxHeight: '400px', display: 'block', borderRadius: '8px' }}
               onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.nextSibling.style.display = 'flex';
               }}
             />
             <div 
               className="image-placeholder" 
               style={{ display: 'none', width: '300px', height: '400px', background: 'rgba(0,0,0,0.3)', color: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderRadius: '8px' }}
             >
                <span style={{ fontSize: '3rem' }}><AppIcon icon="twemoji:herb" /></span>
                <p>Plant Diagram (Missing Image)</p>
                <div style={{ marginTop: 'auto', padding: '20px', borderTop: '2px dashed #4facfe', width: '100%', textAlign: 'center' }}>
                  Roots Zone (Bottom 30%)
                </div>
             </div>

             {/* Show where they clicked */}
             {showResult && clickPos && (
               <div 
                 style={{
                   position: 'absolute',
                   left: clickPos.x - 15,
                   top: clickPos.y - 15,
                   width: '30px',
                   height: '30px',
                   borderRadius: '50%',
                   background: 'rgba(255, 255, 255, 0.8)',
                   border: '3px solid #ff0055',
                   boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                   pointerEvents: 'none',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   fontSize: '1rem'
                 }}
               >
                 <AppIcon icon="twemoji:round-pushpin" />
               </div>
             )}
           </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem' }}>No image provided for this activity.</div>
        )}
      </div>

      <div className="activity-actions">
        {/* We don't need a submit button because clicking the image IS the submission */}
        {!showResult && <p style={{ color: '#666', fontStyle: 'italic' }}>Click directly on the image to answer.</p>}
      </div>
    </div>
  );
};

export default HotspotActivity;
