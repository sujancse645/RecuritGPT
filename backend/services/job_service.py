from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid

from database.models import Job
from schemas.dtos import JobDomainDTO

class JobService:
    @staticmethod
    async def create_job(db: AsyncSession, title: str, description: str, department: str = None, location: str = None, employment_type: str = None) -> JobDomainDTO:
        job = Job(
            title=title,
            description=description,
            department=department,
            location=location,
            employment_type=employment_type
        )
        db.add(job)
        await db.commit()
        await db.refresh(job)
        return JobDomainDTO.model_validate(job)

    @staticmethod
    async def get_latest_job(db: AsyncSession) -> Optional[JobDomainDTO]:
        stmt = select(Job).order_by(Job.created_at.desc()).limit(1)
        result = await db.execute(stmt)
        job = result.scalar_one_or_none()
        if not job:
            return None
        return JobDomainDTO.model_validate(job)

    @staticmethod
    async def get_all_jobs(db: AsyncSession) -> List[JobDomainDTO]:
        stmt = select(Job).order_by(Job.created_at.desc())
        result = await db.execute(stmt)
        jobs = result.scalars().all()
        return [JobDomainDTO.model_validate(job) for job in jobs]
