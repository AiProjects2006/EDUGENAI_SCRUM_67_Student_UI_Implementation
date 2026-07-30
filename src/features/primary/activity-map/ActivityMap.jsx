import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import speechService from '../../../services/SpeechService';
import './ActivityMap.css';

const ActivityMap = () => {
    const navigate = useNavigate();

    const initialLevels = [
<<<<<<< HEAD
        { id: 1, status: 'current', stars: 0, label: 'Coral Trivia' },
        { id: 2, status: 'locked', stars: 0, label: 'Reef Spelling' },
        { id: 3, status: 'locked', stars: 0, isCheckpoint: true, label: 'Pearl Bridge' },
        { id: 4,  status: 'locked', stars: 0, label: 'Shell Matching' },
        { id: 5,  status: 'locked', stars: 0, label: 'Deep Sea Math' },
        { id: 6,  status: 'locked', stars: 0, isBoss: true, label: 'Kraken Challenge' },
=======
        { id: 1, type: 'mcq', status: 'current', stars: 0, label: 'Coral Trivia' },
        { id: 2, type: 'fill-blank', status: 'locked', stars: 0, label: 'Reef Spelling' },
        { id: 3, type: 'checkpoint', status: 'locked', stars: 0, isCheckpoint: true, label: 'Pearl Bridge' },
        { id: 4, type: 'matching', status: 'locked', stars: 0, label: 'Shell Matching' },
        { id: 5, type: 'short-answer', status: 'locked', stars: 0, label: 'Deep Sea Math' },
        { id: 6, type: 'boss', status: 'locked', stars: 0, isBoss: true, label: 'Kraken Challenge' },
>>>>>>> origin/develop
    ];

    const savedActiveLevel = parseInt(sessionStorage.getItem('activeLevelId') || '1', 10);
    const [activeLevelId, setActiveLevelId] = useState(savedActiveLevel);

    useEffect(() => {
        sessionStorage.setItem('activeLevelId', activeLevelId);
    }, [activeLevelId]);

    const levels = initialLevels.map(lvl => {
        if (lvl.id < activeLevelId) return { ...lvl, status: 'completed', stars: 3 };
        if (lvl.id === activeLevelId) return { ...lvl, status: 'current' };
        return { ...lvl, status: 'locked' };
    });

    const handleNodeClick = (clickedLevel) => {
        if (clickedLevel.status === 'locked') {
            speechService.playIncorrect();
            speechService.speak('This level is locked. Complete previous challenges first!');
            return;
        }

        // Store which level is currently being played
        sessionStorage.setItem('playingLevelId', clickedLevel.id);
        navigate('/activity');
    };

    const getNodeIcon = (level) => {
        if (level.isBoss) return '🏴‍☠️';
        if (level.isCheckpoint) return '🐚';
        if (level.status === 'locked') return '💎';
        if (level.status === 'completed') return '⭐';
        return '🫧';
    };

    return (
        <div className="activity-map-page">
            <div className="map-header ocean-card">
                <h2>Coral Islands Path 🪸</h2>
                <p>Complete activities to unlock the Treasure Cave!</p>
            </div>

            <div className="map-path-container">
                {/* SVG Path line behind nodes */}
                <svg className="path-line" viewBox="0 0 200 800" preserveAspectRatio="none">
                    <path d="M100,50 C180,150 20,250 100,350 C180,450 20,550 100,650 C150,720 80,780 100,800" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="12" strokeDasharray="20,20" />
                </svg>

                <div className="nodes-wrapper">
                    {levels.map((level, index) => (
                        <div
                            key={level.id}
                            className={`map-node ${level.status} ${level.isBoss ? 'boss-node' : ''} ${level.isCheckpoint ? 'checkpoint-node' : ''}`}
                            style={{
                                top: `${index * 130}px`,
                                left: index % 2 === 0 ? '60%' : '20%'
                            }}
                            onClick={() => handleNodeClick(level)}
                        >
                            <div className="node-icon">
                                {getNodeIcon(level)}
                            </div>
                            <div className="node-label glass-panel">{level.label}</div>
                            {level.status === 'completed' && !level.isCheckpoint && !level.isBoss && (
                                <div className="stars-earned">
                                    {'⭐'.repeat(level.stars)}
                                </div>
                            )}
                            {level.status === 'completed' && (level.isCheckpoint || level.isBoss) && (
                                <div className="badge-earned" title="Badge Unlocked!">
                                    <span className="icon">🏆</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
<<<<<<< HEAD
            <button className="btn-success ai-generator-btn fixed-right" onClick={() => navigate('/generate-activity')}>
                ✨ AI Generator
=======

            <button className="btn-success ai-generator-btn fixed-right" onClick={() => navigate('/generate-activity')}>
                AI Activity Generator
>>>>>>> origin/develop
            </button>
        </div>
    );
};

export default ActivityMap;
