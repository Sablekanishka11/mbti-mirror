export interface Question {
  id: number;
  text: string;
  optionA: {
    text: string;
    dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
  optionB: {
    text: string;
    dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
}

export const questions: Question[] = [
  // E vs I (Extroversion vs Introversion) - 5 questions
  {
    id: 1,
    text: "At a social gathering, you typically...",
    optionA: { text: "Enjoy meeting new people and starting conversations", dimension: 'E' },
    optionB: { text: "Prefer deep conversations with a few people you know", dimension: 'I' },
  },
  {
    id: 2,
    text: "After a long day at work, you prefer to...",
    optionA: { text: "Go out with friends to recharge", dimension: 'E' },
    optionB: { text: "Spend quiet time alone to recharge", dimension: 'I' },
  },
  {
    id: 3,
    text: "When working on a project, you...",
    optionA: { text: "Like to discuss ideas with others as you go", dimension: 'E' },
    optionB: { text: "Prefer to think things through before sharing", dimension: 'I' },
  },
  {
    id: 4,
    text: "In group settings, you usually...",
    optionA: { text: "Speak up and share your thoughts openly", dimension: 'E' },
    optionB: { text: "Listen more and contribute when you have something meaningful to add", dimension: 'I' },
  },
  {
    id: 5,
    text: "Your ideal weekend involves...",
    optionA: { text: "Attending events, parties, or social activities", dimension: 'E' },
    optionB: { text: "Relaxing at home with a book, movie, or hobby", dimension: 'I' },
  },

  // S vs N (Sensing vs Intuition) - 5 questions
  {
    id: 6,
    text: "When learning something new, you prefer...",
    optionA: { text: "Step-by-step instructions and practical examples", dimension: 'S' },
    optionB: { text: "Understanding the big picture and underlying concepts first", dimension: 'N' },
  },
  {
    id: 7,
    text: "You tend to focus more on...",
    optionA: { text: "What is happening now and concrete facts", dimension: 'S' },
    optionB: { text: "Future possibilities and what could be", dimension: 'N' },
  },
  {
    id: 8,
    text: "When describing an experience, you usually...",
    optionA: { text: "Focus on specific details and what actually happened", dimension: 'S' },
    optionB: { text: "Focus on the overall impression and meaning", dimension: 'N' },
  },
  {
    id: 9,
    text: "You prefer work that involves...",
    optionA: { text: "Established methods and proven techniques", dimension: 'S' },
    optionB: { text: "Innovation and exploring new approaches", dimension: 'N' },
  },
  {
    id: 10,
    text: "When making plans, you...",
    optionA: { text: "Focus on realistic outcomes based on past experience", dimension: 'S' },
    optionB: { text: "Imagine various scenarios and possibilities", dimension: 'N' },
  },

  // T vs F (Thinking vs Feeling) - 5 questions
  {
    id: 11,
    text: "When making decisions, you typically...",
    optionA: { text: "Analyze the pros and cons logically", dimension: 'T' },
    optionB: { text: "Consider how the decision affects people involved", dimension: 'F' },
  },
  {
    id: 12,
    text: "In a disagreement, you prioritize...",
    optionA: { text: "Being correct and finding the truth", dimension: 'T' },
    optionB: { text: "Maintaining harmony and understanding feelings", dimension: 'F' },
  },
  {
    id: 13,
    text: "When a friend shares a problem, you...",
    optionA: { text: "Offer practical solutions and advice", dimension: 'T' },
    optionB: { text: "Listen and provide emotional support first", dimension: 'F' },
  },
  {
    id: 14,
    text: "You value being seen as...",
    optionA: { text: "Competent and capable", dimension: 'T' },
    optionB: { text: "Caring and compassionate", dimension: 'F' },
  },
  {
    id: 15,
    text: "When giving feedback, you...",
    optionA: { text: "Focus on accuracy and areas for improvement", dimension: 'T' },
    optionB: { text: "Consider the person's feelings and emphasize positives", dimension: 'F' },
  },

  // J vs P (Judging vs Perceiving) - 5 questions
  {
    id: 16,
    text: "Your workspace is usually...",
    optionA: { text: "Organized with everything in its place", dimension: 'J' },
    optionB: { text: "Flexible and arranged based on current projects", dimension: 'P' },
  },
  {
    id: 17,
    text: "When it comes to deadlines, you...",
    optionA: { text: "Plan ahead and finish tasks early", dimension: 'J' },
    optionB: { text: "Work best under pressure closer to the deadline", dimension: 'P' },
  },
  {
    id: 18,
    text: "On vacation, you prefer to...",
    optionA: { text: "Have a detailed itinerary planned", dimension: 'J' },
    optionB: { text: "Go with the flow and decide as you go", dimension: 'P' },
  },
  {
    id: 19,
    text: "You feel more comfortable when...",
    optionA: { text: "Things are decided and settled", dimension: 'J' },
    optionB: { text: "Options are kept open", dimension: 'P' },
  },
  {
    id: 20,
    text: "In your daily life, you...",
    optionA: { text: "Follow routines and schedules", dimension: 'J' },
    optionB: { text: "Adapt and respond to what comes up", dimension: 'P' },
  },
];

export function calculateMBTI(answers: Record<number, 'A' | 'B'>): string {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer === 'A') {
      scores[question.optionA.dimension]++;
    } else if (answer === 'B') {
      scores[question.optionB.dimension]++;
    }
  });

  const mbti = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('');

  return mbti;
}
