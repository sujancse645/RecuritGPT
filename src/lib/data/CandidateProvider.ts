import { CandidateIntelligence } from "./types";

export interface ICandidateProvider {
  /**
   * Fetches the full list of analyzed candidates.
   */
  getCandidates(): Promise<CandidateIntelligence[]>;

  /**
   * Fetches a single candidate's deep intelligence by ID.
   */
  getCandidateById(id: string): Promise<CandidateIntelligence | null>;

  /**
   * Performs a natural language semantic search across the candidate pool.
   */
  searchCandidates(query: string): Promise<CandidateIntelligence[]>;
}
