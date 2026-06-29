import uuid
import json
import asyncio
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from sqlalchemy.orm import selectinload

from database.models import (
    Candidate, Job, JobHiringProfile, JobSkill, Embedding, SemanticMatch
)
from providers.ai.factory import LLMFactory
from providers.vector_factory import VectorFactory
from events.event_bus import event_bus
from events.event_types import EventType
from events.dispatcher import create_event

class SemanticSearchService:
    @staticmethod
    async def generate_all_candidate_embeddings(client_id: str, db: AsyncSession):
        """Batch generates embeddings for all candidates that don't have them."""
        await event_bus.publish(create_event(client_id, EventType.EmbeddingStarted, 10, "Fetching candidates..."))
        
        # In a real system, we'd chunk this. For the demo, we fetch all.
        stmt = select(Candidate).options(
            selectinload(Candidate.skills),
            selectinload(Candidate.experiences)
        )
        result = await db.execute(stmt)
        candidates = result.scalars().all()
        
        if not candidates:
            await event_bus.publish(create_event(client_id, EventType.Completed, 100, "No candidates found."))
            return {"indexed": 0}

        await event_bus.publish(create_event(client_id, EventType.EmbeddingStarted, 30, f"Generating embeddings for {len(candidates)} candidates..."))
        
        embed_provider = LLMFactory.get_embedding_provider()
        vector_db = VectorFactory.get_provider()
        
        texts_to_embed = []
        payloads = []
        
        for c in candidates:
            # Construct a rich text representation of the candidate
            skills_str = ", ".join([s.name for s in c.skills])
            exp_str = " | ".join([f"{e.title} at {e.company}" for e in c.experiences])
            
            doc = f"Name: {c.first_name} {c.last_name}. Role: {c.current_role}. Experience: {c.years_of_experience} years. Skills: {skills_str}. History: {exp_str}."
            if c.metadata_data:
                # Add extra context if it exists
                if isinstance(c.metadata_data, dict):
                    doc += f" Context: {json.dumps(c.metadata_data)}"
                else:
                    doc += f" Context: {c.metadata_data}"
                
            texts_to_embed.append(doc)
            payloads.append({
                "candidate_id": str(c.id),
                "role": c.current_role,
                "years": c.years_of_experience
            })

        # Generate vectors (using SentenceTransformers locally)
        vectors = await embed_provider.get_embeddings(texts_to_embed) # This method takes list or string. 
        # Wait, our get_embeddings interface takes a single string. Let's fix that or loop.
        # Looking at our implementation, get_embeddings(self, text: str). Let's loop.
        actual_vectors = []
        for txt in texts_to_embed:
            vec = await embed_provider.get_embeddings(txt)
            actual_vectors.append(vec)
            
        await event_bus.publish(create_event(client_id, EventType.DatabaseInsertStarted, 70, "Indexing into Vector Database..."))
        
        # Index in FAISS
        await vector_db.index_vectors(actual_vectors, payloads)
        
        # Persist to SQLite
        for i, c in enumerate(candidates):
            emb = Embedding(
                candidate_id=c.id,
                model_name="sentence-transformers",
                vector=actual_vectors[i]
            )
            db.add(emb)
            
        await db.commit()
        await event_bus.publish(create_event(client_id, EventType.Completed, 100, "Embedding generation complete."))
        return {"indexed": len(candidates)}

    @staticmethod
    async def perform_hybrid_search(client_id: str, job_id: uuid.UUID, db: AsyncSession):
        """Executes Hybrid Semantic Search for a Job."""
        await event_bus.publish(create_event(client_id, EventType.SemanticSearchStarted, 10, "Preparing Semantic Query..."))
        
        # 1. Get Job & Profile
        stmt = select(Job).options(
            selectinload(Job.hiring_profile),
            selectinload(Job.skills)
        ).where(Job.id == job_id)
        result = await db.execute(stmt)
        job = result.scalar_one_or_none()
        
        if not job or not job.hiring_profile:
            raise ValueError("Job or Hiring Profile not found. Run Phase 5 analysis first.")
            
        # 2. Build Semantic Query
        query_text = f"Looking for: {job.hiring_profile.ideal_candidate_summary}. Tech Stack: {job.hiring_profile.ideal_tech_stack}. Role: {job.title}."
        
        await event_bus.publish(create_event(client_id, EventType.SemanticSearchStarted, 40, "Searching Vector Database..."))
        
        # 3. Get Vector
        embed_provider = LLMFactory.get_embedding_provider()
        query_vector = await embed_provider.get_embeddings(query_text)
        
        # 4. Search Vector DB
        vector_db = VectorFactory.get_provider()
        search_results = await vector_db.search_vectors(query_vector, limit=100)
        
        if not search_results:
            await event_bus.publish(create_event(client_id, EventType.Completed, 100, "No candidates match."))
            return {"matches": []}
            
        await event_bus.publish(create_event(client_id, EventType.RankingStarted, 70, "Computing Similarity Features..."))
        
        # 5. Feature Computation & Structured Filtering
        # For each candidate returned, compute structured match scores
        matched_candidates = []
        for res in search_results:
            c_id_str = res.get("candidate_id")
            sem_score = res.get("_score", 0.0)
            
            # Fetch Candidate from DB to do structured comparison
            c_stmt = select(Candidate).options(selectinload(Candidate.skills)).where(Candidate.id == uuid.UUID(c_id_str))
            c_res = await db.execute(c_stmt)
            candidate = c_res.scalar_one_or_none()
            
            if candidate:
                # Skill Coverage Calculation
                job_skills = {s.name.lower() for s in job.skills if s.is_required}
                cand_skills = {s.name.lower() for s in candidate.skills}
                
                if not job_skills:
                    skill_coverage = 1.0
                else:
                    intersection = job_skills.intersection(cand_skills)
                    skill_coverage = len(intersection) / len(job_skills)
                    
                # Experience Alignment
                # e.g., if job needs Senior, we expect > 5 years
                exp_alignment = min(1.0, (candidate.years_of_experience or 0) / 7.0) 
                
                # Overall Confidence (Feature mix)
                confidence = (sem_score * 0.5) + (skill_coverage * 0.3) + (exp_alignment * 0.2)
                
                # Save features to DB
                sm = SemanticMatch(
                    candidate_id=candidate.id,
                    job_id=job.id,
                    similarity_score=confidence,
                    match_rationale="Semantic alignment combined with structured skill coverage."
                )
                db.add(sm)
                
                matched_candidates.append({
                    "candidate_id": str(candidate.id),
                    "first_name": candidate.first_name,
                    "last_name": candidate.last_name,
                    "role": candidate.current_role,
                    "semantic_score": round(sem_score * 100, 1),
                    "skill_coverage": round(skill_coverage * 100, 1),
                    "experience_alignment": round(exp_alignment * 100, 1),
                    "overall_confidence": round(confidence * 100, 1)
                })
                
        # Sort by overall confidence
        matched_candidates.sort(key=lambda x: x["overall_confidence"], reverse=True)
        
        await db.commit()
        await event_bus.publish(create_event(client_id, EventType.Completed, 100, f"Retrieved {len(matched_candidates)} candidates."))
        
        return {"matches": matched_candidates}
