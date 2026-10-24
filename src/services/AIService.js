import { apiRequest } from './api';

// Map UI names to ActivityType enum understood by Activity Service
export const TYPE_MAP = {
  'Multiple Choice Questions (MCQ)': 'MCQ',
  'Quiz': 'QUIZ',
  'True/False': 'TRUE_FALSE',
  'Structured Essay': 'ESSAY',
  'Fill in the Blanks': 'FILL_BLANK',
  'Match the Following': 'MATCHING',
  'Sorting': 'SORTING',
  'Drag and Drop': 'DRAG_DROP',
  'Poll': 'POLL',
  'Short Answer': 'SHORT_ANSWER',
  'Hotspot Activity': 'HOTSPOT',
  'Problem Solving Exercise': 'PROBLEM_SOLVING',
  'Application-Based Questions': 'APPLICATION_BASED',
  'Timed Quiz': 'TIMED_QUIZ',
  'Challenge Quiz': 'CHALLENGE_QUIZ'
};

// Map backend enum to frontend renderer component types
export const RENDERER_TYPE_MAP = {
  'MCQ': 'MCQ',
  'QUIZ': 'QUIZ',
  'TRUE_FALSE': 'TRUE_FALSE',
  'ESSAY': 'STRUCTURED_ESSAY',
  'FILL_BLANK': 'FILL_BLANKS',
  'MATCHING': 'MATCH_FOLLOWING',
  'SORTING': 'SORTING',
  'DRAG_DROP': 'DRAG_DROP',
  'POLL': 'POLL',
  'SHORT_ANSWER': 'SHORT_ANSWER',
  'HOTSPOT': 'HOTSPOT',
  'PROBLEM_SOLVING': 'PROBLEM_SOLVING',
  'APPLICATION_BASED': 'APPLICATION',
  'TIMED_QUIZ': 'TIMED_QUIZ',
  'CHALLENGE_QUIZ': 'CHALLENGE_QUIZ'
};

class AIService {
  /**
   * Request AI-generated activity through API Gateway / Activity Service
   */
  async generateActivity({ moduleId = 1, subject = 'Science', topic = 'Photosynthesis', activityType = 'MCQ', difficulty = 'MEDIUM', count = 5 }) {
    const enumType = TYPE_MAP[activityType] || activityType || 'MCQ';
    const diffUpper = (difficulty || 'MEDIUM').toUpperCase();

    const payload = {
      moduleId: moduleId ? Number(moduleId) : 1,
      subject: subject || 'Science',
      topic: topic || 'General Science',
      activityType: enumType,
      difficultyLevel: diffUpper,
      questionCount: Number(count) || 5
    };

    try {
      const response = await apiRequest('/api/v1/activities/generate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        data: response,
        formattedQuestions: this.formatQuestionsForRenderer(response, enumType)
      };
    } catch (error) {
      console.warn('AI Service / Gateway activity generation failed, will use fallback:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Submit activity attempt to Activity Service
   */
  async submitActivity({ activityId = 1, generatedActivity, answers = [] }) {
    try {
      const payload = {
        activityId: activityId || 1,
        generatedActivity: generatedActivity,
        answers: answers.map((ans, idx) => ({
          questionNumber: idx + 1,
          studentAnswer: typeof ans === 'string' ? ans : JSON.stringify(ans)
        }))
      };

      return await apiRequest('/api/v1/activities/submit', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.warn('Activity submission failed:', error.message);
      return null;
    }
  }

  /**
   * Fetch past activity attempt history for student
   */
  async getActivityHistory() {
    try {
      return await apiRequest('/api/v1/activities/history');
    } catch (error) {
      console.warn('Fetch activity history failed:', error.message);
      return [];
    }
  }

  /**
   * Format backend ActivityGenerationResponse questions into ActivityRenderer format for all 15 types
   */
  formatQuestionsForRenderer(activityResponse, enumType) {
    if (!activityResponse || !Array.isArray(activityResponse.questions)) {
      return [];
    }

    const defaultRendererType = RENDERER_TYPE_MAP[enumType] || enumType || 'MCQ';
    const topic = activityResponse.title || 'Lesson Overview';

    return activityResponse.questions.map((q, index) => {
      const qActType = q.activityType ? (RENDERER_TYPE_MAP[q.activityType] || q.activityType) : defaultRendererType;

      const options = Array.isArray(q.options) && q.options.length > 0
        ? q.options.map(o => typeof o === 'string' ? o : o.optionText)
        : (qActType === 'TRUE_FALSE' ? ['True', 'False'] : []);

      // Determine correct answer
      let correctAnswer = q.correctAnswer;
      if (!correctAnswer && Array.isArray(q.options)) {
        const correctOpt = q.options.find(o => o.correct === true);
        if (correctOpt) {
          correctAnswer = typeof correctOpt === 'string' ? correctOpt : correctOpt.optionText;
        }
      }
      if (!correctAnswer && options.length > 0) {
        correctAnswer = options[0];
      }

      // Ensure FILL_BLANKS has ______
      let questionText = q.questionText || q.question || `Question ${index + 1}`;
      if (qActType === 'FILL_BLANKS' && !questionText.includes('______')) {
        if (questionText.includes('___')) {
          questionText = questionText.replace(/_{3,}/g, '______');
        } else if (questionText.includes('[blank]')) {
          questionText = questionText.replace('[blank]', '______');
        } else {
          questionText = `${questionText} ______`;
        }
      }

      // Categories and items for SORTING & MATCH_FOLLOWING
      let categories = Array.isArray(q.categories) && q.categories.length > 0 ? q.categories : null;
      let items = Array.isArray(q.items) && q.items.length > 0 ? q.items : null;

      if (qActType === 'SORTING' || qActType === 'MATCH_FOLLOWING') {
        if (!categories) {
          categories = [`Key Concepts`, `Related Factors`];
        }
        if (!items) {
          items = [
            { name: `${topic} Factor A`, category: categories[0], icon: 'twemoji:star' },
            { name: `${topic} Factor B`, category: categories[0], icon: 'twemoji:sparkles' },
            { name: `External Element A`, category: categories[1] || categories[0], icon: 'twemoji:deciduous-tree' },
            { name: `External Element B`, category: categories[1] || categories[0], icon: 'twemoji:cloud' }
          ];
        } else {
          // Ensure every item is an object with name, category, and icon
          items = items.map((itm, iIdx) => {
            if (typeof itm === 'string') {
              const cat = categories[iIdx % categories.length];
              return { name: itm, category: cat, icon: 'twemoji:sparkles' };
            }
            return {
              name: itm.name || itm.text || `Item ${iIdx + 1}`,
              category: itm.category || itm.target || categories[0],
              icon: itm.icon || 'twemoji:sparkles'
            };
          });
        }
      }

      // itemsToOrder for DRAG_DROP
      let itemsToOrder = Array.isArray(q.itemsToOrder) && q.itemsToOrder.length > 0
        ? q.itemsToOrder
        : (Array.isArray(q.correctOrder) && q.correctOrder.length > 0
            ? q.correctOrder
            : (options.length > 0 ? options : [
                `1. Introduction to ${topic}`,
                `2. Exploration of key concepts`,
                `3. Application to practice`,
                `4. Evaluation and review`
              ]));

      // Hotspot imageUrl
      const imageUrl = q.imageUrl || (qActType === 'HOTSPOT' ? 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80' : null);

      // Structured Essay passage
      const passage = q.passage || (qActType === 'STRUCTURED_ESSAY' ? `${topic} is an essential educational concept. Review the definitions, core principles, and practical examples to build a strong foundation.` : null);

      return {
        id: index + 100,
        activityType: qActType,
        question: questionText,
        instruction: q.instruction || '',
        icon: q.icon || 'twemoji:sparkles',
        options: options,
        correctAnswer: correctAnswer || (qActType === 'STRUCTURED_ESSAY' ? 'Any' : (options[0] || 'Correct')),
        categories: categories,
        items: items,
        itemsToOrder: itemsToOrder,
        imageUrl: imageUrl,
        passage: passage,
        timeLimitSeconds: q.timeLimitSeconds || (qActType === 'TIMED_QUIZ' ? 20 : null),
        correctFeedback: q.correctFeedback || 'Great job! That is correct! 🌟',
        incorrectFeedback: q.incorrectFeedback || `Oops! The correct answer was "${correctAnswer || 'stated in the lesson'}".`,
        points: q.points || 2
      };
    });
  }
}

export const aiService = new AIService();
export default aiService;
