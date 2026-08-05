import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PlayButton.css';

const PlayButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState([]);

    const handleClick = (e) => {
        // Create bubble particles for the click burst effect
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200 - 50,
            scale: Math.random() * 1 + 0.5,
        }));
        setParticles(newParticles);
        
        // Remove particles after animation finishes
        setTimeout(() => setParticles([]), 1000);
        
        if (onClick) {
            // Slight delay to let the user see the click animation
            setTimeout(() => onClick(e), 400);
        }
    };

    return (
        <div 
            className="play-button-container" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >


            {/* Button Wrapper for Particles */}
            <div className="button-wrapper">
                <AnimatePresence>
                    {particles.map(p => (
                        <motion.div
                            key={p.id}
                            className="bubble-particle"
                            initial={{ opacity: 1, scale: 0, x: "-50%", y: "-50%" }}
                            animate={{ 
                                opacity: 0, 
                                scale: p.scale, 
                                x: `calc(-50% + ${p.x}px)`, 
                                y: `calc(-50% + ${p.y}px)` 
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            🫧
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Main 3D Button */}
                <motion.button
                    className="gamified-play-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ 
                        y: 14, // Compress downward along Y-axis to match the 14px 3D base shadow
                        scale: 0.95,
                        boxShadow: "0 0px 0 #cc4a00, 0 5px 10px rgba(0,0,0,0.5), inset 0 -5px 15px rgba(0,0,0,0.2)"
                    }}
                    onClick={handleClick}
                    animate={{
                        y: isHovered ? 0 : [0, -10, 0], // Bobbing effect when not hovered
                    }}
                    transition={{
                        y: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <div className="glossy-highlight"></div>
                    <span className="btn-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <motion.span
                            style={{ display: 'inline-block' }}
                            animate={isHovered ? {
                                y: [0, -15, 0],
                                rotate: [0, -15, 20, 0],
                            } : { y: 0, rotate: 0 }}
                            transition={isHovered ? {
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            } : { duration: 0.5, ease: "easeOut" }}
                        >
                             🤿
                        </motion.span>
                        Dive In!
                    </span>
                </motion.button>
            </div>
        </div>
    );
};

export default PlayButton;
