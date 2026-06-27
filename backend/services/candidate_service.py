from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, or_, and_
from typing import List, Optional
import uuid

from database.models import Candidate, Skill
from schemas.dtos import CandidateDomainDTO

class CandidateService:
    @classmethod
    async def get_all_candidates(cls, db: AsyncSession, limit: int = 100) -> List[CandidateDomainDTO]:
        stmt = (
            select(Candidate)
            .where(Candidate.is_deleted == False)
            .options(
                selectinload(Candidate.skills),
                selectinload(Candidate.experiences),
                selectinload(Candidate.educations)
            )
            .order_by(Candidate.match_score.desc())
            .limit(limit)
        )
        result = await db.execute(stmt)
        candidates = result.scalars().all()
        return [CandidateDomainDTO.model_validate(c) for c in candidates]

    @classmethod
    async def get_candidate_by_id(cls, db: AsyncSession, candidate_id: str) -> Optional[CandidateDomainDTO]:
        try:
            cand_uuid = uuid.UUID(candidate_id)
        except ValueError:
            return None
            
        stmt = (
            select(Candidate)
            .where(and_(Candidate.id == cand_uuid, Candidate.is_deleted == False))
            .options(
                selectinload(Candidate.skills),
                selectinload(Candidate.experiences),
                selectinload(Candidate.educations)
            )
        )
        result = await db.execute(stmt)
        candidate = result.scalar_one_or_none()
        if not candidate:
            return None
        return CandidateDomainDTO.model_validate(candidate)

    @classmethod
    async def search_candidates(cls, db: AsyncSession, query: str, limit: int = 100) -> List[CandidateDomainDTO]:
        if not query:
            return await cls.get_all_candidates(db, limit)
            
        search_pattern = f"%{query}%"
        
        stmt = (
            select(Candidate)
            .join(Candidate.skills, isouter=True)
            .where(
                and_(
                    Candidate.is_deleted == False,
                    or_(
                        Candidate.first_name.ilike(search_pattern),
                        Candidate.last_name.ilike(search_pattern),
                        Candidate.current_role.ilike(search_pattern),
                        Skill.name.ilike(search_pattern)
                    )
                )
            )
            .options(
                selectinload(Candidate.skills),
                selectinload(Candidate.experiences),
                selectinload(Candidate.educations)
            )
            .order_by(Candidate.match_score.desc())
            .limit(limit)
        )
        
        result = await db.execute(stmt)
        seen_ids = set()
        unique_candidates = []
        for c in result.scalars().all():
            if c.id not in seen_ids:
                seen_ids.add(c.id)
                unique_candidates.append(c)
                
        return [CandidateDomainDTO.model_validate(c) for c in unique_candidates]
