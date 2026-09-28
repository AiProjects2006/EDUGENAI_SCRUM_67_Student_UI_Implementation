export const mockActivities = [
  // ==========================================
  // LEVEL 1: Coral Trivia (Easy - MCQ & True/False)
  // ==========================================
  {
    id: 101,
    level: 1,
    activityType: 'MCQ',
    question: "What is 8 × 4?",
    icon: "twemoji:abacus",
    options: ["24", "32", "36", "40"],
    correctAnswer: "32",
    correctFeedback: "Correct! Great job!",
    incorrectFeedback: "Oops! 8 × 4 is 32."
  },
  {
    id: 102,
    level: 1,
    activityType: 'MCQ',
    question: "Which planet do we live on?",
    icon: "twemoji:globe-showing-americas",
    options: ["Mars", "Jupiter", "Earth", "Venus"],
    correctAnswer: "Earth",
    correctFeedback: "Exactly! We live on Earth.",
    incorrectFeedback: "Not quite! We live on Earth."
  },
  {
    id: 103,
    level: 1,
    activityType: 'TRUE_FALSE',
    question: "The Sun is a star.",
    icon: "twemoji:sun",
    options: ["True", "False"],
    correctAnswer: "True",
    correctFeedback: "You got it! The sun is our closest star.",
    incorrectFeedback: "Actually, the sun IS a star!"
  },
  {
    id: 104,
    level: 1,
    activityType: 'MCQ',
    question: "What is the opposite of 'Hot'?",
    icon: "twemoji:fire",
    options: ["Warm", "Spicy", "Cold", "Freezing"],
    correctAnswer: "Cold",
    correctFeedback: "Great job! Cold is the opposite.",
    incorrectFeedback: "Not quite!"
  },
  {
    id: 105,
    level: 1,
    activityType: 'TRUE_FALSE',
    question: "Fish can breathe underwater.",
    icon: "twemoji:fish",
    options: ["True", "False"],
    correctAnswer: "True",
    correctFeedback: "Yes, they use their gills!",
    incorrectFeedback: "Actually, fish do breathe underwater!"
  },

  // ==========================================
  // LEVEL 2: Reef Spelling (Medium - Fill Blanks & Sorting)
  // ==========================================
  {
    id: 201,
    level: 2,
    activityType: 'FILL_BLANKS',
    question: "Plants need sunlight, water, and ______ to grow.",
    icon: "twemoji:seedling",
    correctAnswer: "Air", 
    correctFeedback: "Perfect! They need air to grow.",
    incorrectFeedback: "Think about what we breathe..."
  },
  {
    id: 202,
    level: 2,
    activityType: 'SORTING',
    question: "Sort these animals into Land Animals and Water Animals.",
    icon: "twemoji:paw-prints",
    items: [
      { name: "Elephant", icon: "twemoji:elephant", category: "Land" },
      { name: "Fish", icon: "twemoji:fish", category: "Water" },
      { name: "Whale", icon: "twemoji:whale", category: "Water" },
      { name: "Lion", icon: "twemoji:lion", category: "Land" }
    ],
    categories: ["Land", "Water"],
    correctFeedback: "Amazing sorting skills!",
    incorrectFeedback: "Oops! Check your animals again."
  },
  {
    id: 203,
    level: 2,
    activityType: 'FILL_BLANKS',
    question: "The Earth has ______ continent.",
    icon: "twemoji:globe-showing-americas",
    correctAnswer: "Seven", 
    correctFeedback: "Correct, there are seven continents!",
    incorrectFeedback: "Try again! It's a lucky number."
  },
  {
    id: 204,
    level: 2,
    activityType: 'SORTING',
    question: "Sort these into Fruits and Vegetables.",
    icon: "twemoji:green-apple",
    items: [
      { name: "Apple", icon: "twemoji:red-apple", category: "Fruit" },
      { name: "Carrot", icon: "twemoji:carrot", category: "Vegetable" },
      { name: "Banana", icon: "twemoji:banana", category: "Fruit" },
      { name: "Broccoli", icon: "twemoji:broccoli", category: "Vegetable" }
    ],
    categories: ["Fruit", "Vegetable"],
    correctFeedback: "Perfectly sorted!",
    incorrectFeedback: "Try again, check your fruits!"
  },
  {
    id: 205,
    level: 2,
    activityType: 'FILL_BLANKS',
    question: "A baby cat is called a ______.",
    icon: "twemoji:cat",
    correctAnswer: "Kitten", 
    correctFeedback: "Yes, it is a kitten!",
    incorrectFeedback: "Think of a small cat."
  },

  // ==========================================
  // LEVEL 3: Ocean Explorer (Medium - MCQ)
  // ==========================================
  {
    id: 301,
    level: 3,
    activityType: 'MCQ',
    question: "Which of these animals has eight legs?",
    icon: "twemoji:octopus",
    options: ["Starfish", "Crab", "Octopus", "Seahorse"],
    correctAnswer: "Octopus",
    correctFeedback: "Correct! An octopus has eight arms.",
    incorrectFeedback: "Try again! Think of 'octo'."
  },
  {
    id: 302,
    level: 3,
    activityType: 'TRUE_FALSE',
    question: "Dolphins are mammals, not fish.",
    icon: "twemoji:dolphin",
    options: ["True", "False"],
    correctAnswer: "True",
    correctFeedback: "Yes! Dolphins breathe air just like we do.",
    incorrectFeedback: "Actually, dolphins are mammals!"
  },
  {
    id: 303,
    level: 3,
    activityType: 'MCQ',
    question: "What is the largest ocean on Earth?",
    icon: "twemoji:water-wave",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correctAnswer: "Pacific",
    correctFeedback: "Yes, the Pacific Ocean is huge!",
    incorrectFeedback: "Nope, try again!"
  },
  {
    id: 304,
    level: 3,
    activityType: 'TRUE_FALSE',
    question: "Sharks have bones.",
    icon: "twemoji:shark",
    options: ["True", "False"],
    correctAnswer: "False",
    correctFeedback: "Correct! Their skeletons are made of cartilage.",
    incorrectFeedback: "Actually, they don't have bones!"
  },
  {
    id: 305,
    level: 3,
    activityType: 'MCQ',
    question: "How many hearts does an octopus have?",
    icon: "twemoji:anatomical-heart",
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: "Three",
    correctFeedback: "Wow, correct! They have three hearts.",
    incorrectFeedback: "Try again! It's more than one."
  },

  // ==========================================
  // LEVEL 4: Shell Matching (Harder - Hotspot & Drag/Drop)
  // ==========================================
  {
    id: 401,
    level: 4,
    activityType: 'HOTSPOT',
    question: "Look at the picture of the plant and click on the roots.",
    icon: "twemoji:herb",
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.3DHC86vePRug5ssUaRlhHgHaKB?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    correctFeedback: "Great! You found the roots!",
    incorrectFeedback: "Try again! Look below the stem."
  },
  {
    id: 402,
    level: 4,
    activityType: 'DRAG_DROP',
    question: "Drag the words into the correct order to show the water cycle.",
    icon: "twemoji:cloud-with-rain",
    itemsToOrder: ["Water Evaporation", "Cloud Formation", "Rainfall"],
    correctFeedback: "You mastered the water cycle!",
    incorrectFeedback: "Not quite! Think about what happens to water when it gets hot."
  },
  {
    id: 403,
    level: 4,
    activityType: 'HOTSPOT',
    question: "Look at the picture of the plant and click on the roots.",
    icon: "twemoji:seedling",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Plant_diagram.svg/400px-Plant_diagram.svg.png",
    correctFeedback: "Great! You found the roots!",
    incorrectFeedback: "Try again! Look at the bottom."
  },
  {
    id: 404,
    level: 4,
    activityType: 'DRAG_DROP',
    question: "Order the planets from closest to the Sun to farthest.",
    icon: "twemoji:ringed-planet",
    itemsToOrder: ["Mercury", "Venus", "Earth", "Mars"],
    correctFeedback: "Perfect planetary alignment!",
    incorrectFeedback: "Not quite! Remember: My Very Educated Mother..."
  },
  {
    id: 405,
    level: 4,
    activityType: 'DRAG_DROP',
    question: "Order these historical events from oldest to newest.",
    icon: "twemoji:hourglass-done",
    itemsToOrder: ["Dinosaurs Exist", "Pyramids Built", "Internet Invented"],
    correctFeedback: "Excellent timeline skills!",
    incorrectFeedback: "Oops, try fixing your timeline!"
  },

  // ==========================================
  // LEVEL 5: Deep Sea Math (Harder - Short Answer & Application)
  // ==========================================
  {
    id: 501,
    level: 5,
    activityType: 'SHORT_ANSWER',
    question: "What is 100 − 25?",
    icon: "twemoji:input-numbers",
    correctAnswer: "75",
    correctFeedback: "Perfect calculation!",
    incorrectFeedback: "Oops, try subtracting again."
  },
  {
    id: 502,
    level: 5,
    activityType: 'APPLICATION',
    question: "You are going outside to play on a very sunny day. Which item would be most useful to protect your head from the Sun?",
    icon: "twemoji:sun-with-face",
    options: ["Umbrella", "Hat", "Raincoat", "Scarf"],
    correctAnswer: "Hat",
    correctFeedback: "Smart choice! Keep your head safe from the sun.",
    incorrectFeedback: "Think about what goes directly on your head."
  },
  {
    id: 503,
    level: 5,
    activityType: 'SHORT_ANSWER',
    question: "What is 12 × 5?",
    icon: "twemoji:abacus",
    correctAnswer: "60",
    correctFeedback: "Great math skills!",
    incorrectFeedback: "Not quite, try again."
  },
  {
    id: 504,
    level: 5,
    activityType: 'APPLICATION',
    question: "If you have 3 apples and you eat 1, then buy 5 more, how many do you have?",
    icon: "twemoji:red-apple",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    correctFeedback: "Exactly!",
    incorrectFeedback: "Try again! 3 - 1 + 5"
  },
  {
    id: 505,
    level: 5,
    activityType: 'SHORT_ANSWER',
    question: "Spell the word for the color of the sky.",
    icon: "twemoji:cloud",
    correctAnswer: "Blue",
    correctFeedback: "Perfect spelling!",
    incorrectFeedback: "Try again!"
  },

  // ==========================================
  // LEVEL 6: Kraken Challenge (Boss - Timed & Challenge Quiz)
  // ==========================================
  {
    id: 601,
    level: 6,
    activityType: 'TIMED_QUIZ',
    question: "Quick! What is 9 × 5?",
    icon: "twemoji:stopwatch",
    options: ["35", "40", "45", "50"],
    correctAnswer: "45",
    timeLimitSeconds: 20,
    correctFeedback: "Fast and accurate!",
    incorrectFeedback: "Not quite! 9 × 5 is 45."
  },
  {
    id: 602,
    level: 6,
    activityType: 'CHALLENGE_QUIZ',
    question: "A farmer has 4 chickens. Each lays 3 eggs. He uses 5 eggs to make breakfast. How many eggs are left?",
    icon: "twemoji:chicken",
    correctAnswer: "7",
    correctFeedback: "You solved the boss challenge!",
    incorrectFeedback: "Let's rethink: (4 × 3) - 5..."
  },
  {
    id: 603,
    level: 6,
    activityType: 'TIMED_QUIZ',
    question: "Quick! What is the capital of France?",
    icon: "twemoji:stopwatch",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    timeLimitSeconds: 15,
    correctFeedback: "Fast and correct!",
    incorrectFeedback: "Not quite!"
  },
  {
    id: 604,
    level: 6,
    activityType: 'CHALLENGE_QUIZ',
    question: "What comes next in the sequence: 2, 4, 8, 16, ___?",
    icon: "twemoji:chart-increasing",
    correctAnswer: "32",
    correctFeedback: "Excellent pattern recognition!",
    incorrectFeedback: "Think about doubling the numbers!"
  },
  {
    id: 605,
    level: 6,
    activityType: 'TIMED_QUIZ',
    question: "Quick! Which gas do plants absorb from the air?",
    icon: "twemoji:stopwatch",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
    timeLimitSeconds: 15,
    correctFeedback: "Exactly!",
    incorrectFeedback: "Try again! It's what we breathe out."
  },

  // ==========================================
  // GENERATOR SPECIFIC MOCK DATA 
  // (Used when testing the Activity Generator)
  // ==========================================
  {
    id: 901,
    level: 99,
    activityType: 'POLL',
    question: "Class Poll: Which of these is your favorite subject to learn about?",
    icon: "twemoji:bar-chart",
    options: ["Math & Numbers", "Science & Animals", "Reading & Writing", "Art & Drawing"],
    correctAnswer: "Science & Animals", // Polls technically don't have a "correct" answer, but we satisfy the UI logic
    correctFeedback: "Thanks for voting! Many students love that subject.",
    incorrectFeedback: "Thanks for voting! Many students love that subject."
  },
  {
    id: 902,
    level: 99,
    activityType: 'STRUCTURED_ESSAY',
    question: "Write a short paragraph explaining why water is important for living things on Earth.",
    icon: "twemoji:memo",
    correctAnswer: "Water", // Very loose validation for the mock
    correctFeedback: "Excellent essay! You explained the concepts perfectly.",
    incorrectFeedback: "Try adding more details about how plants and animals use water."
  },
  {
    id: 903,
    level: 99,
    activityType: 'PROBLEM_SOLVING',
    question: "If a train leaves Station A at 2:00 PM traveling 60 mph, and reaches Station B 120 miles away, what time does it arrive?",
    icon: "twemoji:train",
    correctAnswer: "4:00 PM",
    correctFeedback: "Perfect problem solving! It takes 2 hours.",
    incorrectFeedback: "Hint: 120 miles divided by 60 mph is 2 hours."
  },
  {
    id: 904,
    level: 99,
    activityType: 'MATCH_FOLLOWING',
    question: "Match the following habitats to the correct animal.",
    icon: "twemoji:globe-with-meridians",
    items: [
      { name: "Polar Bear", icon: "twemoji:polar-bear", category: "Arctic" },
      { name: "Camel", icon: "twemoji:camel", category: "Desert" },
      { name: "Monkey", icon: "twemoji:monkey", category: "Jungle" }
    ],
    categories: ["Arctic", "Desert", "Jungle"],
    correctFeedback: "You matched them perfectly!",
    incorrectFeedback: "Check your habitats again!"
  }
];

// Helper function to get 5 questions for a specific level
export const getActivitiesForLevel = (levelId) => {
  const levelActivities = mockActivities.filter(a => a.level === parseInt(levelId));
  return levelActivities;
};
