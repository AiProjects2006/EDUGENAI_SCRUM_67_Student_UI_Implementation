import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityGenerator.css';
import PlayButton from './PlayButton';

const ActivityGenerator = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const [selectedType, setSelectedType] = useState('');
    const [selectedDiff, setSelectedDiff] = useState('');
    const [selectedCount, setSelectedCount] = useState('');
    const [customCount, setCustomCount] = useState('');

    const handleNext = () => {
        if (step === 1 && !selectedType) {
            alert("Please select an activity type first.");
            return;
        }
        if (step === 2 && !selectedDiff) {
            alert("Please select a difficulty level first.");
            return;
        }
        setStep(step + 1);
    };

    const handleGenerate = () => {
        if (step === 3 && !selectedCount) {
            alert("Please select or enter a question count first.");
            return;
        }
        if (step === 3 && selectedCount === 'custom' && !customCount) {
            alert("Please enter a valid custom count.");
            return;
        }

        setIsGenerating(true);
        setTimeout(() => {
            const finalCount = selectedCount === 'custom' ? parseInt(customCount, 10) : parseInt(selectedCount, 10);
            navigate('/generate-activity-activity', { state: { type: selectedType, diff: selectedDiff, count: finalCount } });
        }, 3000);
    };

    const renderStep = () => {
        if (isGenerating) {
            return (
                <div className="generating-view">
                    <div className="loading-spinner"></div>
                    <h3>Bubbles is generating your magical activity!</h3>
                    <p>Gathering sea crystals... 💎</p>
                </div>
            );
        }

        switch(step) {
            case 1:
                const activityTypes = [
                    'Multiple Choice Questions (MCQ)', 'Quiz', 'True/False', 'Structured Essay',
                    'Fill in the Blanks', 'Match the Following', 'Sorting', 'Drag and Drop',
                    'Poll', 'Short Answer', 'Hotspot Activity', 'Problem Solving Exercise',
                    'Application-Based Questions', 'Timed Quiz', 'Challenge Quiz'
                ];
                return (
                    <div className="generator-step" key={step}>
                        <h3>Step 1: Choose Activity Type</h3>
                        <div className="type-grid">
                            {activityTypes.map(type => (
                                <div
                                    key={type}
                                    className={`type-bubble glass-panel ${selectedType === type ? 'selected' : ''}`}
                                    onClick={() => setSelectedType(type)}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="generator-step" key={step}>
                        <h3>Step 2: Choose Difficulty</h3>
                        <div className="difficulty-grid">
                            <div className={`diff-card glass-panel easy ${selectedDiff === 'easy' ? 'selected' : ''}`} onClick={() => setSelectedDiff('easy')}>Easy 🐠</div>
                            <div className={`diff-card glass-panel medium ${selectedDiff === 'medium' ? 'selected' : ''}`} onClick={() => setSelectedDiff('medium')}>Medium 🐬</div>
                            <div className={`diff-card glass-panel hard ${selectedDiff === 'hard' ? 'selected' : ''}`} onClick={() => setSelectedDiff('hard')}>Hard 🦈</div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="generator-step" key={step}>
                        <h3>Step 3: Question Count</h3>
                        <div className="count-grid">
                            {[5, 10, 15, 20].map(count => (
                                <div
                                    key={count}
                                    className={`count-bubble glass-panel ${selectedCount === count ? 'selected' : ''}`}
                                    onClick={() => { setSelectedCount(count); setCustomCount(''); }}
                                >
                                    {count}
                                </div>
                            ))}
                            <div className={`count-bubble glass-panel custom-count ${selectedCount === 'custom' ? 'selected' : ''}`}>
                                <input
                                    type="number"
                                    placeholder="Custom..."
                                    value={customCount}
                                    onChange={(e) => {
                                        setCustomCount(e.target.value);
                                        setSelectedCount('custom');
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="generator-page">
            <PlayButton onClick={() => navigate('/activity-map')} />
            <div className="generator-card glass-panel">
                <h2>✨ AI Activity Generator</h2>

                {!isGenerating && (
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                )}

                <div className="step-content">
                    {renderStep()}
                </div>

                {!isGenerating && (
                    <div className="generator-footer">
                        {step > 1 ? (
                            <button className="btn-secondary" onClick={() => setStep(step - 1)}>Previous</button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <button className="btn-primary" onClick={handleNext}>Next</button>
                        ) : (
                            <button className="btn-primary generate-btn" onClick={handleGenerate}>Generate Activity 🚀</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityGenerator;
