import { ICandidateProvider } from "./CandidateProvider";
import { CandidateIntelligence } from "./types";

const MOCK_CANDIDATES: CandidateIntelligence[] = [
  {
    id: "c-1",
    name: "Elena Rostova",
    photoUrl: "https://i.pravatar.cc/150?u=elena",
    currentRole: "Senior Backend Engineer",
    experienceYears: 7,
    matchScore: 98,
    confidence: 97,
    careerGrowth: 95,
    leadership: 88,
    communication: 92,
    cultureFit: 94,
    learningAbility: 98,
    technicalMatch: 99,
    status: "Highly Recommended",
    explainabilityReasons: [
      "Matched 24 of 25 required skills.",
      "Built distributed systems similar to your current architecture.",
      "Rapid promotion velocity at previous two roles.",
      "Excellent GitHub contributions to FastAPI."
    ],
    skillsDNA: [
      { name: "Python", score: 98 },
      { name: "FastAPI", score: 95 },
      { name: "AWS", score: 90 },
      { name: "Docker/K8s", score: 85 },
      { name: "System Design", score: 92 },
    ],
    careerTimeline: [
      { title: "Junior Developer", company: "TechNova", year: "2019" },
      { title: "Backend Engineer", company: "TechNova", year: "2021", isPromotion: true },
      { title: "Senior Backend Engineer", company: "CloudScale", year: "2023", isPromotion: true },
    ]
  },
  {
    id: "c-2",
    name: "Marcus Chen",
    photoUrl: "https://i.pravatar.cc/150?u=marcus",
    currentRole: "Cloud Architect",
    experienceYears: 10,
    matchScore: 92,
    confidence: 94,
    careerGrowth: 85,
    leadership: 96,
    communication: 95,
    cultureFit: 90,
    learningAbility: 88,
    technicalMatch: 91,
    status: "Recommended",
    hiddenGemReason: "Strong Kubernetes and infrastructure leadership, highly transferable to Backend scaling roles.",
    explainabilityReasons: [
      "Deep expertise in AWS infrastructure.",
      "Has lead teams of 10+ engineers.",
      "Slight skill gap in Python, but extremely high learning ability."
    ],
    skillsDNA: [
      { name: "AWS", score: 99 },
      { name: "Kubernetes", score: 95 },
      { name: "Python", score: 75 },
      { name: "Go", score: 90 },
      { name: "Leadership", score: 96 },
    ],
    careerTimeline: [
      { title: "DevOps Engineer", company: "DataFlow", year: "2016" },
      { title: "Senior DevOps", company: "DataFlow", year: "2019", isPromotion: true },
      { title: "Cloud Architect", company: "Nexus", year: "2022", isPromotion: true },
    ]
  },
  {
    id: "c-3",
    name: "Sarah Jenkins",
    photoUrl: "https://i.pravatar.cc/150?u=sarah",
    currentRole: "Software Engineer",
    experienceYears: 4,
    matchScore: 85,
    confidence: 88,
    careerGrowth: 99,
    leadership: 70,
    communication: 85,
    cultureFit: 98,
    learningAbility: 99,
    technicalMatch: 82,
    status: "Potential Fit",
    hiddenGemReason: "Exceptional learning velocity and open-source contributions offset lower years of experience.",
    explainabilityReasons: [
      "Incredible learning trajectory.",
      "High cultural alignment.",
      "Needs mentorship in large-scale system design."
    ],
    skillsDNA: [
      { name: "Python", score: 90 },
      { name: "FastAPI", score: 85 },
      { name: "AWS", score: 60 },
      { name: "Learning", score: 99 },
    ],
    careerTimeline: [
      { title: "Intern", company: "StartupX", year: "2022" },
      { title: "Software Engineer", company: "StartupX", year: "2023", isPromotion: true },
    ]
  }
];

export class MockCandidateProvider implements ICandidateProvider {
  async getCandidates(): Promise<CandidateIntelligence[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CANDIDATES;
  }

  async getCandidateById(id: string): Promise<CandidateIntelligence | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_CANDIDATES.find(c => c.id === id) || null;
  }

  async searchCandidates(query: string): Promise<CandidateIntelligence[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const lowerQuery = query.toLowerCase();
    return MOCK_CANDIDATES.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.currentRole.toLowerCase().includes(lowerQuery) ||
      c.skillsDNA.some(s => s.name.toLowerCase().includes(lowerQuery))
    );
  }
}

// Singleton instance for easy UI consumption
export const candidateProvider = new MockCandidateProvider();
