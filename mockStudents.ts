export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  hostel: string;
  year: string;
  completed: boolean;
  completedAt?: string;
  scores: {
    sleep: number;
    study: number;
    cleanliness: number;
    social: number;
    lifestyle: number;
    conflict: number;
    overall: number;
  };
  riskFlags: string[];
}

export const mockStudents: Student[] = [
  {
    id: "STU001",
    name: "Arjun Sharma",
    email: "arjun.sharma@college.edu",
    phone: "+91 98765 43210",
    hostel: "Hostel A - Boys",
    year: "2nd Year",
    completed: true,
    completedAt: "2024-01-15",
    scores: {
      sleep: 85,
      study: 78,
      cleanliness: 92,
      social: 65,
      lifestyle: 88,
      conflict: 80,
      overall: 81,
    },
    riskFlags: [],
  },
  {
    id: "STU002",
    name: "Priya Patel",
    email: "priya.patel@college.edu",
    phone: "+91 98765 43211",
    hostel: "Hostel C - Girls",
    year: "1st Year",
    completed: true,
    completedAt: "2024-01-14",
    scores: {
      sleep: 72,
      study: 95,
      cleanliness: 88,
      social: 75,
      lifestyle: 82,
      conflict: 90,
      overall: 84,
    },
    riskFlags: [],
  },
  {
    id: "STU003",
    name: "Rahul Verma",
    email: "rahul.verma@college.edu",
    phone: "+91 98765 43212",
    hostel: "Hostel A - Boys",
    year: "3rd Year",
    completed: true,
    completedAt: "2024-01-16",
    scores: {
      sleep: 45,
      study: 60,
      cleanliness: 55,
      social: 90,
      lifestyle: 40,
      conflict: 50,
      overall: 57,
    },
    riskFlags: ["Smoking", "Late night activity"],
  },
  {
    id: "STU004",
    name: "Ananya Reddy",
    email: "ananya.reddy@college.edu",
    phone: "+91 98765 43213",
    hostel: "Hostel C - Girls",
    year: "2nd Year",
    completed: true,
    completedAt: "2024-01-15",
    scores: {
      sleep: 90,
      study: 85,
      cleanliness: 95,
      social: 60,
      lifestyle: 92,
      conflict: 85,
      overall: 85,
    },
    riskFlags: [],
  },
  {
    id: "STU005",
    name: "Vikram Singh",
    email: "vikram.singh@college.edu",
    phone: "+91 98765 43214",
    hostel: "Hostel B - Boys",
    year: "4th Year",
    completed: true,
    completedAt: "2024-01-13",
    scores: {
      sleep: 68,
      study: 72,
      cleanliness: 65,
      social: 85,
      lifestyle: 70,
      conflict: 75,
      overall: 73,
    },
    riskFlags: [],
  },
  {
    id: "STU006",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@college.edu",
    phone: "+91 98765 43215",
    hostel: "Hostel D - Girls",
    year: "1st Year",
    completed: true,
    completedAt: "2024-01-17",
    scores: {
      sleep: 82,
      study: 88,
      cleanliness: 90,
      social: 70,
      lifestyle: 85,
      conflict: 88,
      overall: 84,
    },
    riskFlags: [],
  },
  {
    id: "STU007",
    name: "Karan Mehta",
    email: "karan.mehta@college.edu",
    phone: "+91 98765 43216",
    hostel: "Hostel A - Boys",
    year: "2nd Year",
    completed: true,
    completedAt: "2024-01-14",
    scores: {
      sleep: 35,
      study: 45,
      cleanliness: 40,
      social: 95,
      lifestyle: 30,
      conflict: 35,
      overall: 47,
    },
    riskFlags: ["Smoking", "Alcohol", "Extreme sleep mismatch"],
  },
  {
    id: "STU008",
    name: "Divya Nair",
    email: "divya.nair@college.edu",
    phone: "+91 98765 43217",
    hostel: "Hostel C - Girls",
    year: "3rd Year",
    completed: true,
    completedAt: "2024-01-16",
    scores: {
      sleep: 78,
      study: 82,
      cleanliness: 85,
      social: 72,
      lifestyle: 80,
      conflict: 78,
      overall: 79,
    },
    riskFlags: [],
  },
  {
    id: "STU009",
    name: "Amit Kumar",
    email: "amit.kumar@college.edu",
    phone: "+91 98765 43218",
    hostel: "Hostel B - Boys",
    year: "1st Year",
    completed: false,
    scores: {
      sleep: 0,
      study: 0,
      cleanliness: 0,
      social: 0,
      lifestyle: 0,
      conflict: 0,
      overall: 0,
    },
    riskFlags: [],
  },
  {
    id: "STU010",
    name: "Pooja Sharma",
    email: "pooja.sharma@college.edu",
    phone: "+91 98765 43219",
    hostel: "Hostel D - Girls",
    year: "2nd Year",
    completed: true,
    completedAt: "2024-01-15",
    scores: {
      sleep: 88,
      study: 92,
      cleanliness: 94,
      social: 65,
      lifestyle: 90,
      conflict: 92,
      overall: 87,
    },
    riskFlags: [],
  },
  {
    id: "STU011",
    name: "Rohan Gupta",
    email: "rohan.gupta@college.edu",
    phone: "+91 98765 43220",
    hostel: "Hostel A - Boys",
    year: "3rd Year",
    completed: true,
    completedAt: "2024-01-17",
    scores: {
      sleep: 75,
      study: 70,
      cleanliness: 72,
      social: 80,
      lifestyle: 75,
      conflict: 70,
      overall: 74,
    },
    riskFlags: [],
  },
  {
    id: "STU012",
    name: "Meera Joshi",
    email: "meera.joshi@college.edu",
    phone: "+91 98765 43221",
    hostel: "Hostel C - Girls",
    year: "4th Year",
    completed: false,
    scores: {
      sleep: 0,
      study: 0,
      cleanliness: 0,
      social: 0,
      lifestyle: 0,
      conflict: 0,
      overall: 0,
    },
    riskFlags: [],
  },
];

export const calculateCompatibility = (student1: Student, student2: Student): number => {
  if (!student1.completed || !student2.completed) return 0;
  
  const weights = {
    sleep: 0.20,
    study: 0.20,
    cleanliness: 0.20,
    social: 0.15,
    lifestyle: 0.15,
    conflict: 0.10,
  };

  let score = 0;
  const categories = ['sleep', 'study', 'cleanliness', 'social', 'lifestyle', 'conflict'] as const;
  
  categories.forEach(cat => {
    const diff = Math.abs(student1.scores[cat] - student2.scores[cat]);
    const similarity = 100 - diff;
    score += similarity * weights[cat];
  });

  // Penalty for critical mismatches
  const bothHaveFlags = student1.riskFlags.length > 0 && student2.riskFlags.length > 0;
  const smokingMismatch = 
    (student1.riskFlags.includes("Smoking") && !student2.riskFlags.includes("Smoking")) ||
    (!student1.riskFlags.includes("Smoking") && student2.riskFlags.includes("Smoking"));
  
  if (smokingMismatch) score -= 20;
  
  return Math.max(0, Math.min(100, Math.round(score)));
};
