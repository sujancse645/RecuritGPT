from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any, Optional
from datetime import datetime

from database.models import Candidate, Skill, Experience, Education

class CandidateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, candidate_data: Dict[str, Any]) -> Candidate:
        candidate = Candidate(**candidate_data)
        self.db.add(candidate)
        await self.db.commit()
        await self.db.refresh(candidate)
        return candidate

    async def bulk_insert(self, records: List[Dict[str, Any]], job_id: Any = None, dataset_id: Any = None) -> int:
        # Helper to parse dates
        def parse_date(date_str: Optional[str]) -> Optional[datetime]:
            if not date_str:
                return None
            try:
                # Handle YYYY-MM-DD
                return datetime.strptime(date_str[:10], "%Y-%m-%d")
            except Exception:
                return None

        # Helper to map proficiency to score
        def map_proficiency(prof: str) -> float:
            mapping = {
                "beginner": 25.0,
                "intermediate": 50.0,
                "advanced": 75.0,
                "expert": 100.0
            }
            return mapping.get(prof.lower(), 50.0)

        for record in records:
            profile = record.get("profile", {})
            signals = record.get("redrob_signals", {})
            
            # Simple heuristic calculations for database matching columns
            years_exp = float(profile.get("years_of_experience", 0.0))
            github_val = float(signals.get("github_activity_score", 0.0))
            github_val = 0.0 if github_val == -1.0 else github_val
            
            # Compute placeholder scores for the Command Center UI
            match_score = min(99.0, max(50.0, float(70.0 + (years_exp * 2.0) + (github_val * 0.1))))
            confidence = float(signals.get("profile_completeness_score", 85.0))
            
            status = "Highly Recommended" if match_score >= 90.0 else (
                "Recommended" if match_score >= 80.0 else (
                    "Potential Fit" if match_score >= 70.0 else "Needs Review"
                )
            )
            
            # Uniqueness check for email
            cand_id = record.get("candidate_id", "")
            clean_name = "".join(c for c in profile.get("anonymized_name", "").lower() if c.isalnum())
            email = f"{clean_name}.{cand_id.lower()}@example.com"

            # Create related entities
            skills = [
                Skill(
                    name=s.get("name", "Unknown"),
                    score=map_proficiency(s.get("proficiency", "intermediate"))
                ) for s in record.get("skills", [])
            ]
            
            experiences = []
            for exp in record.get("career_history", []):
                experiences.append(
                    Experience(
                        title=exp.get("title", "Unknown"),
                        company=exp.get("company", "Unknown"),
                        start_date=parse_date(exp.get("start_date")),
                        end_date=parse_date(exp.get("end_date")),
                        is_promotion=False
                    )
                )
            
            educations = [
                Education(
                    degree=edu.get("degree", "Unknown"),
                    institution=edu.get("institution", "Unknown"),
                    graduation_year=edu.get("end_year")
                ) for edu in record.get("education", [])
            ]
            
            # Store all raw and behavioral signals in the metadata JSON column
            meta_json = {
                "redrob_signals": signals,
                "profile": profile,
                "certifications": record.get("certifications", []),
                "languages": record.get("languages", []),
                "hidden_gem_reason": "High platform activity & solid technical foundation." if github_val > 80 and signals.get("recruiter_response_rate", 0) > 0.8 else None
            }

            candidate = Candidate(
                job_id=job_id,
                dataset_id=dataset_id,
                first_name=profile.get("anonymized_name", "Unknown").split()[0] if profile.get("anonymized_name") else "Unknown",
                last_name=" ".join(profile.get("anonymized_name", "").split()[1:]) if profile.get("anonymized_name") else "",
                email=email,
                phone=None,
                current_role=profile.get("current_title"),
                years_of_experience=years_exp,
                match_score=match_score,
                confidence=confidence,
                recommendation_status=status,
                metadata_data=meta_json,
                embedding_vector=None,
                skills=skills,
                experiences=experiences,
                educations=educations
            )
            self.db.add(candidate)
            
        await self.db.commit()
        return len(records)

    async def get_all(self) -> List[Candidate]:
        result = await self.db.execute(select(Candidate).where(Candidate.is_deleted == False))
        return list(result.scalars().all())
