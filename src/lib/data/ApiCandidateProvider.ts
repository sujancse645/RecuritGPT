import { ICandidateProvider } from "./CandidateProvider";
import { CandidateIntelligence } from "./types";
import { candidateProvider as mockProvider } from "./MockCandidateProvider";

function mapToPresentationModel(candidate: any): CandidateIntelligence {
  const metadata = candidate.metadata || {};
  const signals = metadata.redrob_signals || {};
  const profile = metadata.profile || {};

  const github_score = signals.github_activity_score !== undefined && signals.github_activity_score !== -1
    ? signals.github_activity_score
    : 70;

  const completeness = signals.profile_completeness_score || 85;
  const response_rate = signals.recruiter_response_rate !== undefined ? signals.recruiter_response_rate : 0.8;
  const connection_count = signals.connection_count || 150;

  // Heuristics
  const careerGrowth = Math.min(99, Math.max(50, Math.floor(70 + ((candidate.experiences || []).length * 5) + (github_score * 0.15))));
  const leadership = Math.min(99, Math.max(50, Math.floor(60 + (candidate.years_of_experience || 0) * 3 + (connection_count * 0.05))));
  const communication = Math.min(99, Math.max(50, Math.floor(completeness * 0.5 + response_rate * 50)));
  const cultureFit = Math.min(99, Math.max(50, Math.floor(signals.willing_to_relocate !== false ? 80 : 65)));
  const learningAbility = Math.min(99, Math.max(50, Math.floor(75 + (github_score * 0.2))));
  const technicalMatch = Math.min(99, Math.max(50, Math.floor(candidate.match_score || 75)));

  // Explainability Reasons
  const explainabilityReasons: string[] = [];
  if (candidate.years_of_experience) {
    explainabilityReasons.push(`Demonstrated ${candidate.years_of_experience} years of professional experience.`);
  }
  if (candidate.current_role) {
    explainabilityReasons.push(`Currently active as a ${candidate.current_role}.`);
  }
  if (profile.current_company) {
    explainabilityReasons.push(`Valuable product expertise gained at ${profile.current_company}.`);
  }
  if (response_rate > 0.85) {
    explainabilityReasons.push(`High engagement indicator: responder rate is ${Math.round(response_rate * 100)}%.`);
  }
  if (github_score > 80) {
    explainabilityReasons.push("Strong technical activity in open source repositories.");
  }
  if (explainabilityReasons.length === 0) {
    explainabilityReasons.push("Profile matches the core skills required for the role.", "Strong general software development background.");
  }

  // Skills DNA
  const skillsDNA = (candidate.skills || []).map((s: any) => ({
    name: s.name,
    score: Math.floor(s.score || 75)
  })).slice(0, 6);

  // Career Timeline
  const careerTimeline = (candidate.experiences || []).map((exp: any) => {
    let year = "Recent";
    if (exp.start_date) {
      year = exp.start_date.substring(0, 4); // YYYY-MM-DD
    }
    return {
      title: exp.title,
      company: exp.company,
      year: year,
      isPromotion: exp.is_promotion || false
    };
  });

  // Sort timeline by year descending
  careerTimeline.sort((a: any, b: any) => {
    if (a.year === "Recent") return -1;
    if (b.year === "Recent") return 1;
    return b.year.localeCompare(a.year);
  });

  return {
    id: candidate.id,
    name: `${candidate.first_name} ${candidate.last_name}`,
    photoUrl: `https://i.pravatar.cc/150?u=${candidate.id}`,
    currentRole: candidate.current_role || "Software Engineer",
    experienceYears: Math.floor(candidate.years_of_experience || 0),
    matchScore: Math.floor(candidate.match_score || 75),
    confidence: Math.floor(candidate.confidence || 80),
    careerGrowth,
    leadership,
    communication,
    cultureFit,
    learningAbility,
    technicalMatch,
    status: candidate.recommendation_status || "Recommended",
    explainabilityReasons,
    skillsDNA,
    careerTimeline,
    hiddenGemReason: metadata.hidden_gem_reason || undefined
  };
}

export class ApiCandidateProvider implements ICandidateProvider {
  private baseUrl = "http://localhost:8000/api/v1";

  async getCandidates(): Promise<CandidateIntelligence[]> {
    try {
      const response = await fetch(`${this.baseUrl}/candidates`);
      if (!response.ok) throw new Error("Failed to fetch from API");
      const data = await response.json();
      return (data.candidates || []).map(mapToPresentationModel);
    } catch (e) {
      console.warn("API Backend not reachable. Falling back to Mock Provider.", e);
      return mockProvider.getCandidates();
    }
  }

  async getCandidateById(id: string): Promise<CandidateIntelligence | null> {
    try {
      const response = await fetch(`${this.baseUrl}/candidates/${id}`);
      if (!response.ok) throw new Error("Failed to fetch from API");
      const data = await response.json();
      return mapToPresentationModel(data);
    } catch (e) {
      return mockProvider.getCandidateById(id);
    }
  }

  async searchCandidates(query: string): Promise<CandidateIntelligence[]> {
    try {
      const response = await fetch(`${this.baseUrl}/candidates/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch from API");
      const data = await response.json();
      return (data.candidates || []).map(mapToPresentationModel);
    } catch (e) {
      return mockProvider.searchCandidates(query);
    }
  }
}

export const candidateProvider = new ApiCandidateProvider();
