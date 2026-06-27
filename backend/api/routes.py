from fastapi import APIRouter, UploadFile, File, Depends, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime

from database.database import get_db, engine, AsyncSessionLocal
from database.models import Base, Candidate, Job, Dataset, ProcessingStatus
from streaming.websocket_manager import manager
from services.candidate_service import CandidateService
from services.job_service import JobService
from events.dispatcher import initialize_dispatcher
from workers.worker import background_worker
from jobs.job_queue import ingestion_queue, IngestionJob

router = APIRouter()
START_TIME = datetime.utcnow()

@router.on_event("startup")
async def startup_event():
    # Automatically initialize tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Initialize the events dispatcher bridging event bus to websocket
    await initialize_dispatcher()
    
    # Start background worker loop
    await background_worker.start()

@router.on_event("shutdown")
async def shutdown_event():
    # Gracefully stop the background worker
    await background_worker.stop()

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "RecruitGPT API"}

@router.get("/api/v1/system/status")
async def get_system_status(db: AsyncSession = Depends(get_db)):
    # 1. Check database connection
    db_status = "connected"
    try:
        await db.execute(select(1))
    except Exception:
        db_status = "disconnected"
        
    # 2. Get counts
    candidate_count = 0
    job_count = 0
    if db_status == "connected":
        try:
            cand_stmt = select(func.count(Candidate.id)).where(Candidate.is_deleted == False)
            cand_res = await db.execute(cand_stmt)
            candidate_count = cand_res.scalar() or 0
            
            job_stmt = select(func.count(Job.id)).where(Job.is_deleted == False)
            job_res = await db.execute(job_stmt)
            job_count = job_res.scalar() or 0
        except Exception:
            pass
            
    # 3. Get dataset status and stats
    datasets_info = []
    total_processed = 0
    total_failed = 0
    if db_status == "connected":
        try:
            ds_stmt = select(Dataset).order_by(Dataset.uploaded_at.desc())
            ds_res = await db.execute(ds_stmt)
            datasets = ds_res.scalars().all()
            for ds in datasets:
                datasets_info.append({
                    "id": str(ds.id),
                    "name": ds.name,
                    "version": ds.version,
                    "uploaded_at": ds.uploaded_at.isoformat() if ds.uploaded_at else None,
                    "status": ds.status,
                    "record_count": ds.record_count
                })
                
            # Get import statistics from ProcessingStatus
            ps_stmt = select(ProcessingStatus)
            ps_res = await db.execute(ps_stmt)
            ps_rows = ps_res.scalars().all()
            for ps in ps_rows:
                total_processed += ps.processed_records
                total_failed += ps.failed_records
        except Exception:
            pass
            
    # 4. Processing/Worker status
    queue_size = ingestion_queue.size()
    worker_active = queue_size > 0
    
    # 5. Active websockets
    ws_connections = len(manager.active_connections)
    
    # 6. Uptime
    uptime_duration = datetime.utcnow() - START_TIME
    uptime_seconds = int(uptime_duration.total_seconds())
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_str = f"{hours}h {minutes}m {seconds}s"
    
    return {
        "database_connection": db_status,
        "dataset_status": datasets_info,
        "candidate_count": candidate_count,
        "job_count": job_count,
        "processing_status": {
            "worker_active": worker_active,
            "queue_size": queue_size
        },
        "websocket_status": {
            "active_connections": ws_connections
        },
        "current_application_version": "1.0.0",
        "api_uptime": uptime_str,
        "import_statistics": {
            "processed_records": total_processed,
            "failed_records": total_failed
        }
    }

@router.websocket("/ws/v1/ingestion/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle ping/pong or control messages
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.post("/api/v1/upload/{client_id}")
async def upload_dataset(
    client_id: str,
    file: UploadFile = File(...),
):
    content = await file.read()
    filename = file.filename
    
    # Hand off processing to the background worker via asyncio Queue
    job = IngestionJob(
        client_id=client_id,
        filename=filename,
        content=content,
        db_session_factory=AsyncSessionLocal
    )
    await ingestion_queue.enqueue(job)
    
    return {"message": "Dataset uploaded and queued for processing.", "filename": filename}

@router.get("/api/v1/candidates")
async def list_candidates(db: AsyncSession = Depends(get_db)):
    candidates = await CandidateService.get_all_candidates(db)
    return {"candidates": [c.model_dump() for c in candidates]}

@router.get("/api/v1/candidates/search")
async def search_candidates(q: str = "", db: AsyncSession = Depends(get_db)):
    candidates = await CandidateService.search_candidates(db, query=q)
    return {"candidates": [c.model_dump() for c in candidates]}

@router.get("/api/v1/candidates/{id}")
async def get_candidate(id: str, db: AsyncSession = Depends(get_db)):
    candidate = await CandidateService.get_candidate_by_id(db, candidate_id=id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate.model_dump()

@router.get("/api/v1/jobs")
async def list_jobs(db: AsyncSession = Depends(get_db)):
    jobs = await JobService.get_all_jobs(db)
    return {"jobs": [j.model_dump() for j in jobs]}
