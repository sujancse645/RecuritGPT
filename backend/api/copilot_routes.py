from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from database.database import get_db
from services.rag_service import RAGService

logger = logging.getLogger("api.copilot")
router = APIRouter(prefix="/api/v1/copilot", tags=["AI Copilot (RAG)"])

class ChatRequest(BaseModel):
    job_id: str
    question: str
    history: List[Dict[str, str]] = []

@router.post("/chat")
async def chat_with_copilot(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """Send a message to the RAG AI Copilot."""
    try:
        answer = await RAGService.chat(request.job_id, request.question, request.history, db)
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error in Copilot Chat: {e}")
        return {"answer": "I am experiencing high cognitive load. Please try again later."}
