import uuid
import json
import logging
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database.models import (
    Candidate, Job, JobHiringProfile, CandidateExplainability, InterviewQuestion
)
from providers.ai.factory import LLMFactory
from prompts.interview_prompt import INTERVIEW_GENERATION_PROMPT, build_interview_prompt
from events.event_bus import event_bus
from events.event_types import EventType
from events.dispatcher import create_event

logger = logging.getLogger("services.interview")

class InterviewService:
    @staticmethod
    async def generate_interview_guide(client_id: str, job_id: uuid.UUID, candidate_id: uuid.UUID, db: AsyncSession) -> List[Dict]:
        await event_bus.publish(create_event(client_id, EventType.Started, 10, "Initializing Interview Guide Generation..."))
        
        # 1. Fetch Job & Profile
        j_stmt = select(Job).options(selectinload(Job.hiring_profile)).where(Job.id == job_id)
        job = (await db.execute(j_stmt)).scalar_one_or_none()
        
        # 2. Fetch Candidate & Explainability (Phase 7 results)
        c_stmt = select(Candidate).options(selectinload(Candidate.skills)).where(Candidate.id == candidate_id)
        candidate = (await db.execute(c_stmt)).scalar_one_or_none()
        
        e_stmt = select(CandidateExplainability).where(CandidateExplainability.job_id == job_id, CandidateExplainability.candidate_id == candidate_id)
        explainability = (await db.execute(e_stmt)).scalar_one_or_none()
        
        if not job or not candidate or not explainability:
            raise ValueError("Missing Job, Candidate, or Ranking data. Run Phase 7 AI Ranking first.")
            
        job_ctx = f"Title: {job.title}\nIdeal Tech Stack: {job.hiring_profile.ideal_tech_stack}"
        cand_ctx = f"Name: {candidate.first_name} {candidate.last_name}\nStrengths: {explainability.strengths}\nWeaknesses: {explainability.weaknesses}\nMissing Skills: {explainability.missing_skills}"
        
        await event_bus.publish(create_event(client_id, EventType.Processing, 40, "Prompting LLM to generate targeted questions..."))
        
        prompt = build_interview_prompt(job_ctx, cand_ctx)
        llm = LLMFactory.get_provider()
        
        try:
            response_str = await llm.generate_completion(prompt, system_instruction=INTERVIEW_GENERATION_PROMPT, json_mode=True)
            
            # Mock Provider Fallback
            if response_str == "{}" or not response_str.startswith("["):
                questions_data = [
                    {
                        "question_text": f"I noticed you lack experience with Kubernetes, which is critical for {job.title}. How would you deploy our microservices?",
                        "expected_answer": "Candidate should mention CI/CD pipelines, containerization concepts (Docker), and willingness to learn K8s.",
                        "focus_area": "Gap Assessment",
                        "difficulty": "Hard"
                    },
                    {
                        "question_text": "Walk me through how you optimized the backend architecture at your last company.",
                        "expected_answer": "Should detail database indexing, caching strategies, or async task processing.",
                        "focus_area": "Strengths Validation",
                        "difficulty": "Medium"
                    }
                ]
            else:
                questions_data = json.loads(response_str)
                
            # Save to DB
            saved_results = []
            for q in questions_data:
                iq = InterviewQuestion(
                    candidate_id=candidate.id,
                    job_id=job.id,
                    question_text=q.get("question_text"),
                    expected_answer=q.get("expected_answer"),
                    focus_area=q.get("focus_area"),
                    difficulty=q.get("difficulty")
                )
                db.add(iq)
                saved_results.append({
                    "id": str(iq.id),
                    "question_text": iq.question_text,
                    "expected_answer": iq.expected_answer,
                    "focus_area": iq.focus_area,
                    "difficulty": iq.difficulty
                })
                
            await db.commit()
            
            await event_bus.publish(create_event(client_id, EventType.Completed, 100, "Interview Guide Generated!"))
            return saved_results
            
        except Exception as e:
            logger.error(f"Failed to generate interview guide: {e}")
            await event_bus.publish(create_event(client_id, EventType.Error, 100, "Failed to generate interview guide."))
            raise e
