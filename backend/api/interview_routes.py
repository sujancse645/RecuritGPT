from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging
from sqlalchemy import select

from database.database import get_db, AsyncSessionLocal
from database.models import InterviewQuestion
from services.interview_service import InterviewService

logger = logging.getLogger("api.interview")
router = APIRouter(prefix="/api/v1/interviews", tags=["Interview Generation"])

@router.post("/generate/{job_id}/{candidate_id}")
async def generate_interviews(
    job_id: str,
    candidate_id: str,
    client_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Trigger the LLM generation of targeted interview questions for a specific candidate."""
    
    async def run_generation_task(c_id, j_id, cand_id):
        async with AsyncSessionLocal() as session:
            try:
                await InterviewService.generate_interview_guide(c_id, uuid.UUID(j_id), uuid.UUID(cand_id), session)
            except Exception as e:
                logger.error(f"Error generating interview guide: {e}")
                
    background_tasks.add_task(run_generation_task, client_id, job_id, candidate_id)
    return {"message": "Interview Guide generation initiated."}

@router.get("/results/{job_id}/{candidate_id}")
async def get_interview_guide(
    job_id: str,
    candidate_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Fetch the generated interview questions."""
    stmt = select(InterviewQuestion).where(
        InterviewQuestion.job_id == uuid.UUID(job_id),
        InterviewQuestion.candidate_id == uuid.UUID(candidate_id)
    )
    res = await db.execute(stmt)
    questions = res.scalars().all()
    
    return {
        "results": [
            {
                "id": str(q.id),
                "question_text": q.question_text,
                "expected_answer": q.expected_answer,
                "focus_area": q.focus_area,
                "difficulty": q.difficulty
            } for q in questions
        ]
    }
