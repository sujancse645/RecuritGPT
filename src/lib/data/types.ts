export interface Skill {
  name: string;
  score: number; // 0-100
}

export interface CareerEvent {
  title: string;
  company: string;
  year: string;
  isPromotion?: boolean;
}

export interface CandidateIntelligence {
  id: string;
  name: string;
  photoUrl: string;
  currentRole: string;
  experienceYears: number;
  
  // High level scores
  matchScore: number;
  confidence: number;
  
  // Granular scores
  careerGrowth: number;
  leadership: number;
  communication: number;
  cultureFit: number;
  learningAbility: number;
  technicalMatch: number;
  
  // Recommendation Status
  status: "Highly Recommended" | "Recommended" | "Potential Fit" | "Needs Review";
  
  // AI Explainability Data
  explainabilityReasons: string[];
  skillsDNA: Skill[];
  careerTimeline: CareerEvent[];
  hiddenGemReason?: string;
}
