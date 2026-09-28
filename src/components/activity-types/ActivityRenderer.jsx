import React from 'react';
import MCQActivity from './MCQActivity';
import TrueFalseActivity from './TrueFalseActivity';
import FillInTheBlanksActivity from './FillInTheBlanksActivity';
import SortingActivity from './SortingActivity';
import DragDropActivity from './DragDropActivity';
import HotspotActivity from './HotspotActivity';
import ShortAnswerActivity from './ShortAnswerActivity';
import StructuredEssayActivity from './StructuredEssayActivity';
import { AppIcon } from '../common/AppIcon/AppIcon';
import './ActivityTypes.css';

// The ActivityRenderer acts as a switch, deciding which UI to show
const ActivityRenderer = ({ activity, onAnswerSubmit }) => {
  if (!activity) return null;

  switch (activity.activityType) {
    // Group 1: Multiple Choice Styles
    case 'MCQ':
    case 'QUIZ':
    case 'APPLICATION': 
    case 'TIMED_QUIZ': 
    case 'POLL':
      return <MCQActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;
      
    // Group 2: True / False
    case 'TRUE_FALSE':
      return <TrueFalseActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;
      
    // Group 3: Text Input Styles
    case 'FILL_BLANKS':
      return <FillInTheBlanksActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;
      
    case 'STRUCTURED_ESSAY':
      return <StructuredEssayActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;

    case 'SHORT_ANSWER':
    case 'CHALLENGE_QUIZ':
    case 'PROBLEM_SOLVING':
      return <ShortAnswerActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;

    // Group 4: Interactive / Drag and Drop
    case 'SORTING':
    case 'MATCH_FOLLOWING': // Fallback Match to Sorting for now
      return <SortingActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;
      
    case 'DRAG_DROP':
      return <DragDropActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;
      
    case 'HOTSPOT':
      return <HotspotActivity data={activity} onAnswerSubmit={onAnswerSubmit} />;

    default:
      return (
        <div className="unsupported-activity glass-panel">
          <h3>Oops! {activity.activityType} UI is under construction <AppIcon icon="twemoji:construction" /></h3>
          <p>Please check back later!</p>
        </div>
      );
  }
};

export default ActivityRenderer;
