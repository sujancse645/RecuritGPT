from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
import uuid

from database.database import get_db, AsyncSessionLocal
from services.semantic_search_service import SemanticSearchService

router = APIRouter(prefix="/api/v1", tags=["Search & Embeddings"])

@router.post("/embeddings/generate")
async def generate_embeddings(
    client_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Batch generate vector embeddings for all candidates missing them."""
    
    async def run_embed_task(client):
        async with AsyncSessionLocal() as session:
            try:
                await SemanticSearchService.generate_all_candidate_embeddings(client, session)
            except Exception as e:
                import logging
                logging.error(f"Error generating embeddings: {e}")
                from events.event_bus import event_bus
                from events.event_types import EventType
                from events.dispatcher import create_event
                await event_bus.publish(create_event(client, EventType.Completed, 100, f"Failed: {str(e)}"))

    background_tasks.add_task(run_embed_task, client_id)
    return {"message": "Embedding generation started in background."}

@router.post("/search/semantic")
async def semantic_search(
    client_id: str,
    job_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Execute a hybrid semantic search for candidates against a job profile."""
    
    async def run_search_task(client, j_id):
        async with AsyncSessionLocal() as session:
            try:
                # The service will emit events over websocket and return matches
                matches = await SemanticSearchService.perform_hybrid_search(client, uuid.UUID(j_id), session)
                # In a real app we might cache 'matches' in redis for a fast subsequent GET
            except Exception as e:
                import logging
                logging.error(f"Error in semantic search: {e}")
                from events.event_bus import event_bus
                from events.event_types import EventType
                from events.dispatcher import create_event
                await event_bus.publish(create_event(client, EventType.Completed, 100, f"Search Failed: {str(e)}"))

    background_tasks.add_task(run_search_task, client_id, job_id)
    return {"message": "Semantic hybrid search initiated."}
