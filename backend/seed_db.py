import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import AsyncSessionLocal, engine
from database.models import Base, Job, JobHiringProfile, Candidate, SemanticMatch, CandidateRanking, CandidateExplainability

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        job_id = uuid.UUID("00000000-0000-0000-0000-000000000000")
        
        # Check if job exists
        from sqlalchemy import select
        existing = await db.execute(select(Job).where(Job.id == job_id))
        if existing.scalar_one_or_none():
            print("Database already seeded.")
            return

        print("Seeding database with initial data...")
        
        job = Job(
            id=job_id,
            title="Principal AI Engineer",
            department="Engineering",
            description="Looking for a senior engineer to lead our LLM integration strategy."
        )
        
        hiring_profile = JobHiringProfile(
            job_id=job_id,
            ideal_candidate_summary="An elite AI architect capable of building RAG systems.",
            ideal_tech_stack="Python, FastAPI, Postgres, Vector DBs, LangChain",
            ideal_leadership_level="Principal"
        )
        
        c1_id = uuid.uuid4()
        c1 = Candidate(id=c1_id, first_name="Alex", last_name="Mercer", email="alex@example.com", current_role="Principal AI Engineer", years_of_experience=10.0)
        c2_id = uuid.uuid4()
        c2 = Candidate(id=c2_id, first_name="Sarah", last_name="Chen", email="sarah@example.com", current_role="Senior Backend Developer", years_of_experience=7.0)
        c3_id = uuid.uuid4()
        c3 = Candidate(id=c3_id, first_name="David", last_name="Kim", email="david@example.com", current_role="Machine Learning Engineer", years_of_experience=5.0)
        
        db.add_all([job, hiring_profile, c1, c2, c3])
        await db.commit()
        
        # Seed Semantic Matches so Phase 7 can pick them up
        sm1 = SemanticMatch(candidate_id=c1_id, job_id=job_id)
        sm1.similarity_score = 98.2
        sm2 = SemanticMatch(candidate_id=c2_id, job_id=job_id)
        sm2.similarity_score = 94.0
        sm3 = SemanticMatch(candidate_id=c3_id, job_id=job_id)
        sm3.similarity_score = 91.5
        
        # Seed Ranking so Phase 8-10 have data
        r1 = CandidateRanking(candidate_id=c1_id, job_id=job_id, match_score=96.5, confidence_score=99.0, hiring_recommendation="Strong Hire")
        e1 = CandidateExplainability(candidate_id=c1_id, job_id=job_id, strengths=["Exceptional background in Deep Learning and FastApi.", "Perfect architectural alignment."], weaknesses=["Slightly higher salary expectations."], matching_skills=["Python"], missing_skills=[])
        
        r2 = CandidateRanking(candidate_id=c2_id, job_id=job_id, match_score=92.1, confidence_score=95.0, hiring_recommendation="Hire")
        e2 = CandidateExplainability(candidate_id=c2_id, job_id=job_id, strengths=["Strong backend fundamentals.", "Deep database optimization skills."], weaknesses=["Lacks MLOps production experience."], matching_skills=["Postgres"], missing_skills=["Vector DBs"])
        
        r3 = CandidateRanking(candidate_id=c3_id, job_id=job_id, match_score=88.4, confidence_score=90.0, hiring_recommendation="Borderline")
        e3 = CandidateExplainability(candidate_id=c3_id, job_id=job_id, strengths=["Great hands-on model training experience."], weaknesses=["Limited API development experience.", "Junior leadership profile."], matching_skills=["Python"], missing_skills=["FastAPI"])
        
        db.add_all([sm1, sm2, sm3, r1, r2, r3, e1, e2, e3])
        await db.commit()
        print("Database seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed())
