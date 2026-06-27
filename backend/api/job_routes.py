from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any, List
import uuid

from database.database import get_db, AsyncSessionLocal
from database.models import (
    Job, JobHiringProfile, JobSkill, JobComplexityScore, 
    JobReasoning, JobInsight, JobKnowledgeGraphNode, JobKnowledgeGraphEdge
)
from services.ai_job_service import AIJobService
from ingestion.parsers import ParserFactory

router = APIRouter(prefix="/api/v1/jobs", tags=["Jobs"])

@router.post("/upload")
async def upload_and_analyze_job(
    client_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Uploads a job description, extracts text, and triggers the AI Job Understanding Engine."""
    content = await file.read()
    
    # Extract text based on file format using the existing ParserFactory
    try:
        parser = ParserFactory.get_parser(file.filename)
        parsed_res = parser.parse(content)
        # Handle cases where parser returns a string or list
        if isinstance(parsed_res, list):
            text = str(parsed_res)
        elif isinstance(parsed_res, dict):
            text = str(parsed_res)
        else:
            text = parsed_res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {e}")
        
    # Extract naive title if possible (first line)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    job_title = lines[0][:255] if lines else "Untitled Role"
    
    job = Job(title=job_title, description=text)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    # We pass the async task to the background, but since it requires db ops, 
    # we need a fresh session or pass the engine. We'll define a wrapper function.
    async def run_ai_task(j_id, txt, client):
        async with AsyncSessionLocal() as session:
            await AIJobService.process_job_description(client, j_id, txt, session)
            
    background_tasks.add_task(run_ai_task, job.id, text, client_id)
    
    return {"message": "Job description uploaded and AI Analysis started.", "job_id": str(job.id)}

@router.get("/{job_id}/profile")
async def get_job_profile(job_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(JobHiringProfile).where(JobHiringProfile.job_id == uuid.UUID(job_id))
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found or still processing")
    return {
        "ideal_candidate_summary": profile.ideal_candidate_summary,
        "ideal_career_progression": profile.ideal_career_progression,
        "ideal_tech_stack": profile.ideal_tech_stack,
        "ideal_team_size": profile.ideal_team_size,
        "ideal_industry_background": profile.ideal_industry_background,
        "ideal_leadership_level": profile.ideal_leadership_level,
        "ideal_learning_ability": profile.ideal_learning_ability,
        "ideal_innovation_ability": profile.ideal_innovation_ability,
        "ideal_communication_style": profile.ideal_communication_style,
        "ideal_problem_solving_ability": profile.ideal_problem_solving_ability,
        "ideal_architecture_experience": profile.ideal_architecture_experience,
        "ideal_cloud_experience": profile.ideal_cloud_experience,
        "ideal_devops_experience": profile.ideal_devops_experience,
        "ideal_ai_readiness": profile.ideal_ai_readiness
    }

@router.get("/{job_id}/skills")
async def get_job_skills(job_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(JobSkill).where(JobSkill.job_id == uuid.UUID(job_id)).order_by(JobSkill.importance.desc())
    result = await db.execute(stmt)
    skills = result.scalars().all()
    return {"skills": [
        {
            "name": s.name, "category": s.category, "subcategory": s.subcategory,
            "importance": s.importance, "confidence": s.confidence,
            "is_required": s.is_required, "is_preferred": s.is_preferred,
            "is_optional": s.is_optional, "is_emerging": s.is_emerging,
            "is_transferable": s.is_transferable, "is_deprecated": s.is_deprecated
        } for s in skills
    ]}

@router.get("/{job_id}/complexity")
async def get_job_complexity(job_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(JobComplexityScore).where(JobComplexityScore.job_id == uuid.UUID(job_id))
    result = await db.execute(stmt)
    score = result.scalar_one_or_none()
    if not score:
        raise HTTPException(status_code=404, detail="Complexity score not found")
    return {
        "technical_complexity": score.technical_complexity,
        "leadership_requirement": score.leadership_requirement,
        "architecture_requirement": score.architecture_requirement,
        "cloud_maturity": score.cloud_maturity,
        "innovation_level": score.innovation_level,
        "business_criticality": score.business_criticality,
        "communication_requirement": score.communication_requirement,
        "learning_requirement": score.learning_requirement,
        "hiring_difficulty": score.hiring_difficulty,
        "overall_confidence": score.overall_confidence
    }

@router.get("/{job_id}/knowledge-graph")
async def get_job_kg(job_id: str, db: AsyncSession = Depends(get_db)):
    n_stmt = select(JobKnowledgeGraphNode).where(JobKnowledgeGraphNode.job_id == uuid.UUID(job_id))
    n_res = await db.execute(n_stmt)
    nodes = n_res.scalars().all()
    
    if not nodes:
        return {"nodes": [], "edges": []}
        
    node_ids = [n.id for n in nodes]
    e_stmt = select(JobKnowledgeGraphEdge).where(JobKnowledgeGraphEdge.source_node_id.in_(node_ids))
    e_res = await db.execute(e_stmt)
    edges = e_res.scalars().all()
    
    # Map to names for frontend
    id_to_name = {str(n.id): n.entity_name for n in nodes}
    
    return {
        "nodes": [{"id": str(n.id), "label": n.entity_name, "type": n.entity_type} for n in nodes],
        "edges": [{"source": str(e.source_node_id), "target": str(e.target_node_id), "label": e.relationship_type, "source_name": id_to_name.get(str(e.source_node_id)), "target_name": id_to_name.get(str(e.target_node_id))} for e in edges]
    }

@router.get("/{job_id}/insights")
async def get_job_insights(job_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(JobInsight).where(JobInsight.job_id == uuid.UUID(job_id))
    result = await db.execute(stmt)
    insights = result.scalars().all()
    return {"insights": [{"type": i.insight_type, "description": i.description} for i in insights]}

@router.get("/{job_id}/reasoning")
async def get_job_reasoning(job_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(JobReasoning).where(JobReasoning.job_id == uuid.UUID(job_id))
    result = await db.execute(stmt)
    reasoning = result.scalars().all()
    return {"reasoning": [{"statement": r.statement, "confidence": r.confidence} for r in reasoning]}
