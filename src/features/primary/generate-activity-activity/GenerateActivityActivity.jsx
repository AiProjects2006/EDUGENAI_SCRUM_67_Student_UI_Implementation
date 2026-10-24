import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import speechService from '../../../services/SpeechService';
import { AppIcon } from '../../../components/common/AppIcon/AppIcon';
import ActivityRenderer from '../../../components/activity-types/ActivityRenderer';
import { generatorMockActivities } from '../../../data/generatorMockActivities';
import '../activity-player/ActivityPlayer.css';
import aiService from '../../../services/AIService';

const GenerateActivityActivity = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { triggerMascotVoice, triggerMascotAnimation } = useOceanAudio();
    
    // Dynamic state from the generator
    const { type, diff, count } = location.state || {};
    const requestedCount = count || 5;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [activities, setActivities] = useState([]);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackData, setFeedbackData] = useState({ isCorrect: false, text: '' });
    const [answerHistory, setAnswerHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);

    const currentActivity = activities[currentQuestionIndex];
    const totalQuestions = activities.length;

    // Timer logic
    useEffect(() => {
        if (currentActivity && currentActivity.timeLimitSeconds) {
            setTimeLeft(currentActivity.timeLimitSeconds);
        } else {
            setTimeLeft(null);
        }
    }, [currentActivity]);

    useEffect(() => {
        if (timeLeft === null || showFeedback) return;

        if (timeLeft <= 0) {
            handleAnswerSubmit(false, "Time's up!", "Ran out of time");
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, showFeedback]);

    // Mocking or using the real AI Generation based on user selection
    useEffect(() => {
        // 1. If real AI-generated questions were passed from the generator, use them directly
        if (location.state?.generatedQuestions && Array.isArray(location.state.generatedQuestions) && location.state.generatedQuestions.length > 0) {
            setActivities(location.state.generatedQuestions);
            return;
        }

        const courseTitle = location.state?.course || 'Course';
        const moduleTitle = location.state?.module || 'Module Overview';
        const courseSubject = location.state?.subject || location.state?.course || 'General';
        const modId = location.state?.moduleId;

        // 2. Check if a published activity exists for this course / module in localStorage
        try {
            const rawPub = localStorage.getItem('published_activities');
            if (rawPub) {
                const pubList = JSON.parse(rawPub);
                const found = pubList.find((a) =>
                    (modId && Number(a.moduleId) === Number(modId)) ||
                    (a.moduleTitle && a.moduleTitle.toLowerCase() === moduleTitle.toLowerCase()) ||
                    (a.courseTitle && a.courseTitle.toLowerCase() === courseTitle.toLowerCase())
                );
                if (found && Array.isArray(found.questions) && found.questions.length > 0) {
                    setActivities(found.questions.slice(0, requestedCount));
                    return;
                }
            }
        } catch (_) {}

        // Otherwise, map the generator string to our mock activityType enum as fallback
        let mapType = 'MCQ';
        if (type === 'Multiple Choice Questions (MCQ)') mapType = 'MCQ';
        if (type === 'Quiz') mapType = 'QUIZ';
        if (type === 'True/False') mapType = 'TRUE_FALSE';
        if (type === 'Short Answer') mapType = 'SHORT_ANSWER';
        if (type === 'Structured Essay') mapType = 'STRUCTURED_ESSAY';
        if (type === 'Problem Solving Exercise') mapType = 'PROBLEM_SOLVING';
        if (type === 'Application-Based Questions') mapType = 'APPLICATION';
        if (type === 'Timed Quiz') mapType = 'TIMED_QUIZ';
        if (type === 'Challenge Quiz') mapType = 'CHALLENGE_QUIZ';
        if (type === 'Sorting') mapType = 'SORTING';
        if (type === 'Match the Following') mapType = 'MATCH_FOLLOWING';
        if (type === 'Fill in the Blanks') mapType = 'FILL_BLANKS';
        if (type === 'Hotspot Activity') mapType = 'HOTSPOT';
        if (type === 'Drag and Drop') mapType = 'DRAG_DROP';
        if (type === 'Poll') mapType = 'POLL';

        // 3. Intelligently synthesize questions tailored to the created course and module for all 15 activity types
        const dynamicQuestions = [];
        for (let i = 1; i <= requestedCount; i++) {
            if (mapType === 'TRUE_FALSE') {
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'TRUE_FALSE',
                    icon: 'twemoji:check-mark-button',
                    question: `${moduleTitle} is an essential concept studied in ${courseTitle} (Principle ${i}).`,
                    options: ['True', 'False'],
                    correctAnswer: 'True',
                    correctFeedback: 'Great job! That is correct! 🌟',
                    incorrectFeedback: 'Oops! This statement is true according to the lesson.',
                    points: 2
                });
            } else if (mapType === 'FILL_BLANKS') {
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'FILL_BLANKS',
                    icon: 'twemoji:pencil',
                    question: `In ${courseTitle}, mastering ${moduleTitle} requires understanding its ______ clearly.`,
                    correctAnswer: 'principles',
                    correctFeedback: 'Well done! You filled in the blank correctly! 🌟',
                    incorrectFeedback: 'The correct word is "principles".',
                    points: 2
                });
            } else if (mapType === 'SORTING' || mapType === 'MATCH_FOLLOWING') {
                const cat1 = `${moduleTitle} Concepts`;
                const cat2 = `Related Factors`;
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: mapType === 'MATCH_FOLLOWING' ? 'MATCH_FOLLOWING' : 'SORTING',
                    icon: mapType === 'MATCH_FOLLOWING' ? 'twemoji:link' : 'twemoji:card-file-box',
                    question: `Sort the following items into the correct categories for ${moduleTitle}:`,
                    categories: [cat1, cat2],
                    items: [
                        { name: `Core Concept ${i}A`, category: cat1, icon: 'twemoji:star' },
                        { name: `Core Concept ${i}B`, category: cat1, icon: 'twemoji:sparkles' },
                        { name: `Environmental Factor ${i}`, category: cat2, icon: 'twemoji:deciduous-tree' },
                        { name: `External Condition ${i}`, category: cat2, icon: 'twemoji:cloud' }
                    ],
                    correctFeedback: 'Incredible! All items sorted into the right categories! 🌟',
                    incorrectFeedback: 'Check your sorted items and try again.',
                    points: 2
                });
            } else if (mapType === 'DRAG_DROP') {
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'DRAG_DROP',
                    icon: 'twemoji:puzzle-piece',
                    question: `Arrange the stages of ${moduleTitle} in the correct chronological order:`,
                    itemsToOrder: [
                        `Step 1: Introduction to ${moduleTitle}`,
                        `Step 2: Exploring primary components`,
                        `Step 3: Conducting practical analysis`,
                        `Step 4: Drawing conclusions for ${courseTitle}`
                    ],
                    correctFeedback: 'Perfect order! You arranged all steps correctly! 🌟',
                    incorrectFeedback: 'Try arranging the steps again.',
                    points: 2
                });
            } else if (mapType === 'HOTSPOT') {
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'HOTSPOT',
                    icon: 'twemoji:magnifying-glass-tilted-right',
                    question: `Click on the designated target zone (bottom zone) in the ${moduleTitle} diagram:`,
                    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
                    correctFeedback: 'Found the target zone! Spot on! 🌟',
                    incorrectFeedback: 'Missed it! Click closer to the bottom roots area.',
                    points: 2
                });
            } else if (mapType === 'STRUCTURED_ESSAY') {
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'STRUCTURED_ESSAY',
                    icon: 'twemoji:open-book',
                    passage: `${moduleTitle} is an essential unit in ${courseTitle}. It introduces students to fundamental principles, processes, and real-world applications that shape our understanding of modern science and learning.`,
                    question: `Based on the passage, why is ${moduleTitle} important to study? Write 2-3 sentences.`,
                    correctAnswer: 'Any',
                    correctFeedback: 'Wonderful essay! Great explanation of the concepts! 🌟',
                    incorrectFeedback: 'Try adding more details from the passage.',
                    points: 2
                });
            } else if (mapType === 'SHORT_ANSWER' || mapType === 'CHALLENGE_QUIZ' || mapType === 'PROBLEM_SOLVING') {
                const expectedAns = mapType === 'PROBLEM_SOLVING' ? '100' : 'principles';
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: mapType,
                    icon: mapType === 'CHALLENGE_QUIZ' ? 'twemoji:trophy' : (mapType === 'PROBLEM_SOLVING' ? 'twemoji:abacus' : 'twemoji:thinking-face'),
                    question: mapType === 'PROBLEM_SOLVING'
                        ? `Problem ${i}: In ${courseTitle}, if 20 units of ${moduleTitle} are multiplied by 5, what is the result?`
                        : `What is the primary scientific or mathematical principle underlying ${moduleTitle} (Part ${i})?`,
                    correctAnswer: expectedAns,
                    correctFeedback: 'Superb! Your answer is spot on! 🌟',
                    incorrectFeedback: `Oops! The correct answer was "${expectedAns}".`,
                    points: 2
                });
            } else if (mapType === 'TIMED_QUIZ') {
                const coreAnswer = `Key Principle of ${moduleTitle} (#${i})`;
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'TIMED_QUIZ',
                    icon: 'twemoji:stopwatch',
                    question: `Fast Challenge: Which of the following is a primary characteristic of "${moduleTitle}" in ${courseTitle}?`,
                    options: [
                        coreAnswer,
                        `Secondary element unrelated to ${moduleTitle}`,
                        `Opposing factor in general studies`,
                        `External variable not covered in ${courseTitle}`
                    ],
                    correctAnswer: coreAnswer,
                    timeLimitSeconds: 20,
                    correctFeedback: 'Fast and correct! Awesome work! 🌟',
                    incorrectFeedback: `Time or answer missed! The correct answer was "${coreAnswer}".`,
                    points: 2
                });
            } else if (mapType === 'POLL') {
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'POLL',
                    icon: 'twemoji:bar-chart',
                    question: `Which concept of ${moduleTitle} was easiest to understand?`,
                    options: [
                        `Core Definitions of ${moduleTitle}`,
                        `Visual Diagrams and Slides`,
                        `Interactive Experiments`,
                        `Real-World Examples`
                    ],
                    correctAnswer: `Core Definitions of ${moduleTitle}`,
                    correctFeedback: 'Thank you for your vote! 🌟',
                    incorrectFeedback: 'Thanks for sharing your opinion!',
                    points: 2
                });
            } else if (mapType === 'APPLICATION') {
                const coreAnswer = `Apply ${moduleTitle} principles to resolve the issue`;
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: 'APPLICATION',
                    icon: 'twemoji:light-bulb',
                    question: `Scenario ${i}: A student encounters a real-world scenario involving ${moduleTitle} in ${courseTitle}. What is the best course of action?`,
                    options: [
                        coreAnswer,
                        `Ignore the data and proceed without analysis`,
                        `Change variables arbitrarily without testing`,
                        `Conclude without observing results`
                    ],
                    correctAnswer: coreAnswer,
                    correctFeedback: 'Great application of principles! 🌟',
                    incorrectFeedback: `The recommended approach was "${coreAnswer}".`,
                    points: 2
                });
            } else {
                // MCQ, QUIZ
                const coreAnswer = `Key Principle of ${moduleTitle} (#${i})`;
                dynamicQuestions.push({
                    id: 1000 + i,
                    activityType: mapType,
                    icon: 'twemoji:question-mark',
                    question: `Which of the following is a core concept of "${moduleTitle}" in ${courseTitle}?`,
                    options: [
                        coreAnswer,
                        `Secondary element unrelated to ${moduleTitle}`,
                        `Opposing factor in general studies`,
                        `External variable not covered in ${courseTitle}`
                    ],
                    correctAnswer: coreAnswer,
                    correctFeedback: 'Awesome work! That is the correct answer! 🌟',
                    incorrectFeedback: `Oops! The correct answer is "${coreAnswer}".`,
                    points: 2
                });
            }
        }

        setActivities(dynamicQuestions);
    }, [type, requestedCount, location.state]);

    useEffect(() => {
        if (currentActivity && currentActivity.question) {
            const readableQuestion = currentActivity.question.replace(/______/g, 'blank');
            triggerMascotVoice(`Here is question ${currentQuestionIndex + 1}! ${readableQuestion}`);
        }
    }, [currentQuestionIndex, currentActivity, triggerMascotVoice]);

    const handleReadQuestion = () => {
        if (currentActivity && currentActivity.question) {
            const readableQuestion = currentActivity.question.replace(/______/g, 'blank');
            triggerMascotVoice(readableQuestion);
        }
    };

    const handleAnswerSubmit = (isCorrect, feedbackText, studentAnswer) => {
        setFeedbackData({ isCorrect, text: feedbackText });
        setShowFeedback(true);

        const historyItem = {
            question: currentActivity.question,
            icon: currentActivity.icon,
            correctAnswer: currentActivity.correctAnswer || (currentActivity.itemsToOrder ? currentActivity.itemsToOrder.join(', ') : 'Activity completed correctly'),
            studentAnswer: studentAnswer || 'N/A',
            isCorrect: isCorrect
        };
        
        setAnswerHistory(prev => [...prev, historyItem]);

        if (isCorrect) {
            setScore(prev => prev + 1);
            speechService.playCorrect();
            triggerMascotVoice(feedbackText || "Correct! Great job!", 1.6, 1.1);
            triggerMascotAnimation('happy');
        } else {
            speechService.playIncorrect();
            triggerMascotVoice(feedbackText || "Oops! Try again next time.", 1.5, 0.9);
            triggerMascotAnimation('sad');
        }

        setTimeout(() => {
            setShowFeedback(false);
            
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                const finalScore = isCorrect ? score + 1 : score;
                const finalHistory = [...answerHistory, historyItem];

                // Record attempt in backend Activity Service
                if (location.state?.generatedActivity) {
                    aiService.submitActivity({
                        activityId: location.state?.generatedActivity?.activityId || 1,
                        generatedActivity: location.state?.generatedActivity,
                        answers: finalHistory.map(h => h.studentAnswer)
                    }).catch(e => console.warn('Submit activity attempt logged:', e));
                }

                navigate('/generate-activity-score', {
                    state: {
                        score: finalScore,
                        total: totalQuestions,
                        answerHistory: finalHistory,
                        course: courseTitle,
                        module: moduleTitle,
                        subject: courseSubject,
                        moduleId: modId,
                        courseId: location.state?.courseId
                    }
                });
            }
        }, 3000);
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="activity-player-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>Loading your custom {type} Activity...</h2>
            </div>
        );
    }

    return (
        <div className="activity-player-page">
            <div className="player-header glass-panel">
                <div className="progress-stats">
                    <span>Question {currentQuestionIndex + 1} / {totalQuestions}</span>
                    <div className="player-progress-bar">
                        <div className="player-progress-fill" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                    </div>
                </div>
                {timeLeft !== null && (
                    <div className="timer-badge glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: timeLeft <= 5 ? 'rgba(255, 71, 111, 0.4)' : 'rgba(0, 0, 0, 0.2)', padding: '8px 20px', borderRadius: '20px', color: timeLeft <= 5 ? '#ffb3c1' : 'white', fontWeight: 'bold', fontSize: '1.2rem', border: `2px solid ${timeLeft <= 5 ? '#ef476f' : 'transparent'}`, transition: 'all 0.3s' }}>
                        <AppIcon icon="twemoji:hourglass-done" /> 
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                )}
                <button className="voice-btn-large" onClick={handleReadQuestion}>
                    <AppIcon icon="twemoji:speaker-high-volume" /> Read
                </button>
            </div>

            <div className="question-card glass-panel" style={{ padding: '2rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--golden-yellow)', marginBottom: '2rem', fontSize: '1.2rem', alignSelf: 'flex-start' }}>
                    {type ? `${type} (${diff})` : 'Generated Activity'}
                </h3>
                
                <ActivityRenderer 
                    key={`${currentQuestionIndex}-${currentActivity.id}`}
                    activity={currentActivity} 
                    onAnswerSubmit={handleAnswerSubmit} 
                />
            </div>

            <div className="player-footer">
                <div></div>
            </div>

            {showFeedback && (
                <div className={`feedback-overlay ${feedbackData.isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="feedback-content">
                        {feedbackData.isCorrect ? (
                            <><AppIcon icon="twemoji:party-popper" /> {feedbackData.text}</>
                        ) : (
                            <><AppIcon icon="twemoji:light-bulb" /> {feedbackData.text}</>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateActivityActivity;
