from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging

from database.database import get_db, AsyncSessionLocal
from services.candidate_ranking_service import CandidateRankingService

logger = logging.getLogger("api.ranking")
router = APIRouter(prefix="/api/v1/ranking", tags=["Ranking & Explainability"])

@router.post("/generate/{job_id}")
async def generate_rankings(
    job_id: str,
    client_id: str,
    background_tasks: BackgroundTasks,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Trigger the LLM evaluation loop to score and rank top semantic matches."""
    
    async def run_ranking_task(c_id, j_id, lmt):
        async with AsyncSessionLocal() as session:
            try:
                await CandidateRankingService.rank_candidates_for_job(c_id, uuid.UUID(j_id), session, limit=lmt)
            except Exception as e:
                logger.error(f"Error generating rankings: {e}")
                from events.event_bus import event_bus
                from events.event_types import EventType
                from events.dispatcher import create_event
                await event_bus.publish(create_event(c_id, EventType.Completed, 100, f"Ranking Failed: {str(e)}"))

    background_tasks.add_task(run_ranking_task, client_id, job_id, limit)
    return {"message": "Candidate AI Ranking initiated."}

@router.get("/results/{job_id}")
async def get_ranking_results(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Fetch the final ranked candidates with explainability data for the UI."""
    from sqlalchemy import select
    from database.models import CandidateRanking, CandidateExplainability, Candidate
    from sqlalchemy.orm import selectinload
    
    stmt = select(CandidateRanking).where(CandidateRanking.job_id == uuid.UUID(job_id)).order_by(CandidateRanking.match_score.desc())
    res = await db.execute(stmt)
    rankings = res.scalars().all()
    
    results = []
    for r in rankings:
        c_stmt = select(Candidate).where(Candidate.id == r.candidate_id)
        c = (await db.execute(c_stmt)).scalar_one_or_none()
        
        ex_stmt = select(CandidateExplainability).where(CandidateExplainability.candidate_id == r.candidate_id).where(CandidateExplainability.job_id == uuid.UUID(job_id))
        ex = (await db.execute(ex_stmt)).scalar_one_or_none()
        
        if c and ex:
            results.append({
                "candidate_id": str(c.id),
                "first_name": c.first_name,
                "last_name": c.last_name,
                "current_role": c.current_role,
                "match_score": r.match_score,
                "confidence_score": r.confidence_score,
                "hiring_recommendation": r.hiring_recommendation,
                "explainability": {
                    "matching_skills": ex.matching_skills,
                    "missing_skills": ex.missing_skills,
                    "strengths": ex.strengths,
                    "weaknesses": ex.weaknesses
                }
            })
            
    return {"results": results}
