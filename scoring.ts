import { questions } from "@/data/questions";

interface Scores {
  sleep: number;
  study: number;
  cleanliness: number;
  social: number;
  lifestyle: number;
  conflict: number;
  overall: number;
}

interface ScoringResult {
  scores: Scores;
  riskFlags: string[];
}

// Section weights as specified
const sectionWeights = {
  sleep: 0.20,
  study: 0.20,
  cleanliness: 0.20,
  social: 0.15,
  lifestyle: 0.15,
  conflict: 0.10,
};

// Question to section mapping
const questionSections: Record<number, keyof typeof sectionWeights> = {};
questions.forEach((q) => {
  if (q.sectionIndex === 0) questionSections[q.id] = "sleep";
  else if (q.sectionIndex === 1) questionSections[q.id] = "study";
  else if (q.sectionIndex === 2) questionSections[q.id] = "cleanliness";
  else if (q.sectionIndex === 3) questionSections[q.id] = "social";
  else if (q.sectionIndex === 4) questionSections[q.id] = "lifestyle";
  else if (q.sectionIndex === 5) questionSections[q.id] = "conflict";
});

// Scoring patterns for different question types
// Higher score = more structured/disciplined/clean
const getOptionScore = (questionId: number, optionIndex: number, totalOptions: number): number => {
  // For most questions, first option is more structured, last is more flexible
  // Score from 100 (first option) to lower based on position
  const baseScore = 100 - (optionIndex * (100 / totalOptions));
  return Math.round(baseScore);
};

export const calculateScores = (responses: Record<number, string>): ScoringResult => {
  const sectionScores: Record<keyof typeof sectionWeights, number[]> = {
    sleep: [],
    study: [],
    cleanliness: [],
    social: [],
    lifestyle: [],
    conflict: [],
  };

  const riskFlags: string[] = [];

  // Process each response
  Object.entries(responses).forEach(([qIdStr, answer]) => {
    const qId = parseInt(qIdStr);
    const question = questions.find((q) => q.id === qId);
    if (!question) return;

    const section = questionSections[qId];
    const optionIndex = question.options.indexOf(answer);
    const score = getOptionScore(qId, optionIndex, question.options.length);
    
    sectionScores[section].push(score);

    // Check for risk flags
    // Smoking question (id: 36)
    if (qId === 36 && answer === "I smoke") {
      riskFlags.push("Smoking");
    }
    // Alcohol question (id: 37)
    if (qId === 37 && answer === "I drink") {
      riskFlags.push("Alcohol");
    }
    // Late sleep (id: 1)
    if (qId === 1 && answer === "After 12 am") {
      riskFlags.push("Late night activity");
    }
    // Very early wake (id: 2)
    if (qId === 2 && answer === "Before 6 am") {
      riskFlags.push("Very early riser");
    }
    // Low flexibility (id: 50)
    if (qId === 50 && answer === "Not flexible") {
      riskFlags.push("Low flexibility");
    }
  });

  // Calculate section averages
  const scores: Scores = {
    sleep: Math.round(sectionScores.sleep.reduce((a, b) => a + b, 0) / (sectionScores.sleep.length || 1)),
    study: Math.round(sectionScores.study.reduce((a, b) => a + b, 0) / (sectionScores.study.length || 1)),
    cleanliness: Math.round(sectionScores.cleanliness.reduce((a, b) => a + b, 0) / (sectionScores.cleanliness.length || 1)),
    social: Math.round(sectionScores.social.reduce((a, b) => a + b, 0) / (sectionScores.social.length || 1)),
    lifestyle: Math.round(sectionScores.lifestyle.reduce((a, b) => a + b, 0) / (sectionScores.lifestyle.length || 1)),
    conflict: Math.round(sectionScores.conflict.reduce((a, b) => a + b, 0) / (sectionScores.conflict.length || 1)),
    overall: 0,
  };

  // Calculate weighted overall score
  scores.overall = Math.round(
    scores.sleep * sectionWeights.sleep +
    scores.study * sectionWeights.study +
    scores.cleanliness * sectionWeights.cleanliness +
    scores.social * sectionWeights.social +
    scores.lifestyle * sectionWeights.lifestyle +
    scores.conflict * sectionWeights.conflict
  );

  return { scores, riskFlags };
};

export const calculateCompatibility = (
  scores1: Scores,
  scores2: Scores,
  flags1: string[],
  flags2: string[]
): number => {
  let score = 0;
  const categories = ["sleep", "study", "cleanliness", "social", "lifestyle", "conflict"] as const;

  categories.forEach((cat) => {
    const diff = Math.abs(scores1[cat] - scores2[cat]);
    const similarity = 100 - diff;
    score += similarity * sectionWeights[cat];
  });

  // Penalty for critical mismatches
  const smokingMismatch =
    (flags1.includes("Smoking") && !flags2.includes("Smoking")) ||
    (!flags1.includes("Smoking") && flags2.includes("Smoking"));

  if (smokingMismatch) score -= 20;

  // Sleep pattern mismatch
  const sleepMismatch =
    (flags1.includes("Late night activity") && flags2.includes("Very early riser")) ||
    (flags2.includes("Late night activity") && flags1.includes("Very early riser"));

  if (sleepMismatch) score -= 15;

  return Math.max(0, Math.min(100, Math.round(score)));
};
