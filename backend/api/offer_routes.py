from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging

from database.database import get_db, AsyncSessionLocal
from services.offer_service import OfferService

logger = logging.getLogger("api.offer")
router = APIRouter(prefix="/api/v1/offers", tags=["Offer Generation"])

# We'll store the generated offers in a simple dict for the hackathon demo
# In production, this would be persisted in the DB as an Offer table.
DEMO_OFFER_STORE = {}

@router.post("/generate/{job_id}/{candidate_id}")
async def generate_offer(
    job_id: str,
    candidate_id: str,
    client_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Trigger the LLM generation of a highly personalized offer letter."""
    
    async def run_generation_task(c_id, j_id, cand_id):
        async with AsyncSessionLocal() as session:
            try:
                offer_md = await OfferService.generate_offer_letter(c_id, uuid.UUID(j_id), uuid.UUID(cand_id), session)
                DEMO_OFFER_STORE[f"{j_id}_{cand_id}"] = offer_md
            except Exception as e:
                logger.error(f"Error generating offer: {e}")
                
    background_tasks.add_task(run_generation_task, client_id, job_id, candidate_id)
    return {"message": "Offer Letter generation initiated."}

@router.get("/results/{job_id}/{candidate_id}")
async def get_offer_letter(
    job_id: str,
    candidate_id: str
):
    """Fetch the generated offer letter markdown."""
    key = f"{job_id}_{candidate_id}"
    if key in DEMO_OFFER_STORE:
        return {"markdown": DEMO_OFFER_STORE[key]}
    return {"markdown": ""}
