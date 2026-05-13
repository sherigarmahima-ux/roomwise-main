export interface Question {
  id: number;
  section: string;
  sectionIndex: number;
  question: string;
  options: string[];
}

export const sections = [
  "Daily Routine & Sleep Habits",
  "Study Habits & Academics",
  "Cleanliness & Personal Space",
  "Social Behaviour & Visitors",
  "Lifestyle Preferences",
  "Conflict Handling & Compatibility",
];

export const sectionWeights = {
  "Daily Routine & Sleep Habits": 0.20,
  "Study Habits & Academics": 0.20,
  "Cleanliness & Personal Space": 0.20,
  "Social Behaviour & Visitors": 0.15,
  "Lifestyle Preferences": 0.15,
  "Conflict Handling & Compatibility": 0.10,
};

export const questions: Question[] = [
  // Section A: Daily Routine & Sleep Habits (8 questions)
  {
    id: 1,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "What time do you usually go to sleep on weekdays?",
    options: ["Before 10 pm", "10–11 pm", "11–12 pm", "After 12 am"],
  },
  {
    id: 2,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "What time do you usually wake up?",
    options: ["Before 6 am", "6–7 am", "7–8 am", "After 8 am"],
  },
  {
    id: 3,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "Are you a:",
    options: ["Morning person", "Night person", "Depends on workload"],
  },
  {
    id: 4,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "How sensitive are you to noise while sleeping?",
    options: ["Very sensitive", "Somewhat sensitive", "Not sensitive"],
  },
  {
    id: 5,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "Do you use your phone or laptop in bed at night?",
    options: ["Never", "Sometimes", "Frequently"],
  },
  {
    id: 6,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "Are you comfortable with lights being on late at night in the room?",
    options: ["Yes", "Sometimes", "No"],
  },
  {
    id: 7,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "Do you take afternoon naps regularly?",
    options: ["Yes", "Occasionally", "No"],
  },
  {
    id: 8,
    section: "Daily Routine & Sleep Habits",
    sectionIndex: 0,
    question: "How important is strict sleep routine for you?",
    options: ["Very important", "Somewhat important", "Not important"],
  },

  // Section B: Study Habits & Academics (8 questions)
  {
    id: 9,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "Where do you mostly study?",
    options: ["Room", "Library", "Combination of both"],
  },
  {
    id: 10,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "Preferred study environment:",
    options: ["Complete silence", "Light background noise", "Music is okay"],
  },
  {
    id: 11,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "Do you study late nights during exams?",
    options: ["Yes", "Sometimes", "No"],
  },
  {
    id: 12,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "Are you comfortable if your roommate studies while you are resting?",
    options: ["Yes", "Sometimes", "No"],
  },
  {
    id: 13,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "Do you prefer group study in the room?",
    options: ["Yes", "Occasionally", "No"],
  },
  {
    id: 14,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "How disciplined are you with study schedules?",
    options: ["Very disciplined", "Moderate", "Flexible"],
  },
  {
    id: 15,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "During exams, your room should be:",
    options: ["Quiet zone", "Balanced", "Doesn't matter"],
  },
  {
    id: 16,
    section: "Study Habits & Academics",
    sectionIndex: 1,
    question: "How important is academic seriousness in your roommate?",
    options: ["Very important", "Somewhat important", "Not important"],
  },

  // Section C: Cleanliness & Personal Space (8 questions)
  {
    id: 17,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "How clean do you keep your personal space?",
    options: ["Very clean", "Reasonably clean", "Casual"],
  },
  {
    id: 18,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "How often do you clean your room?",
    options: ["Daily", "Weekly", "When required"],
  },
  {
    id: 19,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "How do you feel about clothes/books lying around?",
    options: ["Not acceptable", "Okay sometimes", "Doesn't bother me"],
  },
  {
    id: 20,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "Shared responsibilities (sweeping, trash, etc.) should be:",
    options: ["Strictly shared", "Flexible", "Not a priority"],
  },
  {
    id: 21,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "Are you okay sharing personal items (charger, kettle, bucket)?",
    options: ["Yes", "Some items only", "No"],
  },
  {
    id: 22,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "How important is room organisation to you?",
    options: ["Very important", "Moderate", "Low priority"],
  },
  {
    id: 23,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "How do you react if a roommate is messy?",
    options: ["Speak directly", "Adjust silently", "Get annoyed"],
  },
  {
    id: 24,
    section: "Cleanliness & Personal Space",
    sectionIndex: 2,
    question: "Cleanliness level of roommate should be:",
    options: ["Similar to mine", "Better than mine", "Doesn't matter"],
  },

  // Section D: Social Behaviour & Visitors (8 questions)
  {
    id: 25,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "How often do friends visit your room?",
    options: ["Rarely", "Occasionally", "Frequently"],
  },
  {
    id: 26,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "Are you comfortable with your roommate having visitors?",
    options: ["Yes", "With prior notice", "No"],
  },
  {
    id: 27,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "Preferred room environment:",
    options: ["Quiet & private", "Balanced", "Social & lively"],
  },
  {
    id: 28,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "Do you enjoy spending time with roommates?",
    options: ["Yes", "Sometimes", "Prefer personal space"],
  },
  {
    id: 29,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "Are you comfortable sharing room space for group discussions?",
    options: ["Yes", "Sometimes", "No"],
  },
  {
    id: 30,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "How important is personal privacy for you?",
    options: ["Very important", "Moderate", "Low priority"],
  },
  {
    id: 31,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "Do you prefer roommates from similar background/language?",
    options: ["Yes", "Neutral", "No preference"],
  },
  {
    id: 32,
    section: "Social Behaviour & Visitors",
    sectionIndex: 3,
    question: "How do you usually spend free time in hostel?",
    options: ["Resting", "Socialising", "Online/Gaming", "Studying"],
  },

  // Section E: Lifestyle Preferences (8 questions)
  {
    id: 33,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Do you wake up early for prayers, yoga, or routines?",
    options: ["Yes", "Sometimes", "No"],
  },
  {
    id: 34,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Food preference:",
    options: ["Vegetarian", "Eggetarian", "Non-vegetarian"],
  },
  {
    id: 35,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Are you comfortable sharing room with different food habits?",
    options: ["Yes", "With some limits", "No"],
  },
  {
    id: 36,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Smoking:",
    options: ["I smoke", "I don't smoke but okay with it", "Not okay at all"],
  },
  {
    id: 37,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Alcohol:",
    options: ["I drink", "I don't but okay with it", "Not okay at all"],
  },
  {
    id: 38,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Do you frequently order food late at night?",
    options: ["Yes", "Occasionally", "No"],
  },
  {
    id: 39,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Are you comfortable with phone calls/video calls in the room?",
    options: ["Yes", "Limited duration only", "Prefer quiet"],
  },
  {
    id: 40,
    section: "Lifestyle Preferences",
    sectionIndex: 4,
    question: "Do you prefer AC / Fan / No preference?",
    options: ["AC", "Fan", "Doesn't matter"],
  },

  // Section F: Conflict Handling & Compatibility (10 questions)
  {
    id: 41,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "If an issue arises, you usually:",
    options: ["Discuss openly", "Avoid initially", "Get stressed"],
  },
  {
    id: 42,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "How quickly do you get irritated by others' habits?",
    options: ["Very quickly", "Sometimes", "Rarely"],
  },
  {
    id: 43,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "Are you comfortable giving feedback to roommates?",
    options: ["Yes", "Depends on situation", "No"],
  },
  {
    id: 44,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "How do you prefer conflicts to be resolved?",
    options: ["Direct conversation", "Mediated by third party", "Give it time"],
  },
  {
    id: 45,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "What matters more in a roommate?",
    options: ["Discipline", "Friendliness", "Balance of both"],
  },
  {
    id: 46,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "How adaptable are you to different personalities?",
    options: ["Very adaptable", "Somewhat adaptable", "Not much"],
  },
  {
    id: 47,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "If your roommate is different from you, you:",
    options: ["Adjust", "Expect adjustment from them", "Feel uncomfortable"],
  },
  {
    id: 48,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "How important is mutual respect in shared space?",
    options: ["Extremely important", "Important", "Moderate"],
  },
  {
    id: 49,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "Would you prefer a roommate similar to you or complementary?",
    options: ["Similar", "Complementary", "No preference"],
  },
  {
    id: 50,
    section: "Conflict Handling & Compatibility",
    sectionIndex: 5,
    question: "Overall, how flexible are you in living arrangements?",
    options: ["Very flexible", "Moderately flexible", "Not flexible"],
  },
];
