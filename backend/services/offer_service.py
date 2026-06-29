import uuid
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database.models import Candidate, Job, CandidateExplainability
from providers.ai.factory import LLMFactory
from prompts.offer_prompt import OFFER_GENERATION_PROMPT, build_offer_prompt
from events.event_bus import event_bus
from events.event_types import EventType
from events.dispatcher import create_event

logger = logging.getLogger("services.offer")

class OfferService:
    @staticmethod
    async def generate_offer_letter(client_id: str, job_id: uuid.UUID, candidate_id: uuid.UUID, db: AsyncSession) -> str:
        await event_bus.publish(create_event(client_id, EventType.Started, 20, "Drafting highly personalized offer letter..."))
        
        j_stmt = select(Job).where(Job.id == job_id)
        job = (await db.execute(j_stmt)).scalar_one_or_none()
        
        c_stmt = select(Candidate).where(Candidate.id == candidate_id)
        candidate = (await db.execute(c_stmt)).scalar_one_or_none()
        
        e_stmt = select(CandidateExplainability).where(CandidateExplainability.job_id == job_id, CandidateExplainability.candidate_id == candidate_id)
        explainability = (await db.execute(e_stmt)).scalar_one_or_none()
        
        if not job or not candidate:
            raise ValueError("Job or Candidate not found.")
            
        strengths = explainability.strengths if explainability else ["Exceptional technical background and strong cultural fit."]
        
        prompt = build_offer_prompt(job.title, f"{candidate.first_name} {candidate.last_name}", str(strengths))
        llm = LLMFactory.get_provider()
        
        await event_bus.publish(create_event(client_id, EventType.Processing, 70, "Applying psychological drivers to offer text..."))
        
        try:
            offer_text = await llm.generate_completion(prompt, system_instruction=OFFER_GENERATION_PROMPT, json_mode=False)
            
            # Mock Provider Fallback
            if offer_text == "{}" or not offer_text.strip():
                offer_text = f"""# Offer of Employment: {job.title}

Dear {candidate.first_name},

We were absolutely blown away by your technical background. Specifically, your strengths in {strengths[0]} make you the perfect fit for our engineering culture. 

We would like to formally extend an offer to join us as a {job.title}.

**Compensation Package:**
- Base Salary: $180,000 USD
- Equity: 10,000 RSUs
- Sign-on Bonus: $20,000

We are building the future of AI, and we know you belong here.
"""
            await event_bus.publish(create_event(client_id, EventType.Completed, 100, "Offer Letter Generated Successfully!"))
            return offer_text
            
        except Exception as e:
            logger.error(f"Failed to generate offer letter: {e}")
            await event_bus.publish(create_event(client_id, EventType.Error, 100, "Failed to generate offer letter."))
            raise e
