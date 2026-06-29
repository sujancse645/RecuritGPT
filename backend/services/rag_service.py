import uuid
import logging
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database.models import Job, Candidate, CandidateRanking
from providers.ai.factory import LLMFactory
from providers.vector_factory import VectorFactory
from prompts.copilot_prompt import COPILOT_SYSTEM_PROMPT, build_rag_prompt

logger = logging.getLogger("services.rag")

class RAGService:
    @staticmethod
    async def chat(job_id: str, question: str, history: List[Dict[str, str]], db: AsyncSession) -> str:
        """Handles RAG pipeline: Retrieves context from FAISS & DB, queries LLM."""
        
        # 1. Embed the user's question
        embed_provider = LLMFactory.get_embedding_provider()
        query_vector = await embed_provider.get_embeddings(question)
        
        # 2. Search FAISS for related candidates
        vector_db = VectorFactory.get_provider()
        search_results = await vector_db.search_vectors(query_vector, limit=5)
        
        context_str = ""
        
        # 3. Retrieve Job Context
        if job_id:
            try:
                j_stmt = select(Job).options(selectinload(Job.hiring_profile)).where(Job.id == uuid.UUID(job_id))
                job = (await db.execute(j_stmt)).scalar_one_or_none()
                if job and job.hiring_profile:
                    context_str += f"JOB CONTEXT:\nTitle: {job.title}\nRequirements: {job.hiring_profile.ideal_tech_stack}\n\n"
            except Exception as e:
                logger.error(f"Failed to fetch job for RAG context: {e}")
                
        # 4. Retrieve Candidate Context from FAISS results
        context_str += "CANDIDATE CONTEXT:\n"
        for res in search_results:
            c_id = res.get("candidate_id")
            if not c_id:
                continue
                
            c_stmt = select(Candidate).options(selectinload(Candidate.skills)).where(Candidate.id == uuid.UUID(c_id))
            c = (await db.execute(c_stmt)).scalar_one_or_none()
            
            if c:
                skills_str = ", ".join([s.name for s in c.skills])
                # Check if we have rankings
                r_stmt = select(CandidateRanking).where(CandidateRanking.candidate_id == c.id).where(CandidateRanking.job_id == uuid.UUID(job_id))
                r = (await db.execute(r_stmt)).scalar_one_or_none()
                
                match_info = f"(Match Score: {r.match_score}, Rec: {r.hiring_recommendation})" if r else ""
                
                context_str += f"- {c.first_name} {c.last_name} ({c.current_role}) {match_info}. Skills: {skills_str}. Exp: {c.years_of_experience} yrs.\n"
                
        # 5. Build History string
        history_str = ""
        for h in history[-5:]: # Last 5 messages for context window
            role = "Recruiter" if h.get("role") == "user" else "Copilot"
            history_str += f"{role}: {h.get('content')}\n"
            
        # 6. Build Prompt & Query LLM
        prompt = build_rag_prompt(question, context_str, history_str)
        llm = LLMFactory.get_provider()
        
        # We need the Mock provider to return conversational text if API key is missing
        try:
            answer = await llm.generate_completion(prompt, system_instruction=COPILOT_SYSTEM_PROMPT, json_mode=False)
            if answer == "{}" or answer.strip() == "":
                return "Based on the candidate pool, I found some strong matches. Let me know if you'd like me to compare them!"
            return answer
        except Exception as e:
            logger.error(f"LLM Chat Error: {e}")
            return "I'm having trouble analyzing the data right now. Please check the AI provider connection."
