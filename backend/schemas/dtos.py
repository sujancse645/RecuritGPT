from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class SkillDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    score: Optional[float] = None
    created_at: datetime

class ExperienceDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    company: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_promotion: bool
    created_at: datetime

class EducationDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    degree: Optional[str] = None
    institution: Optional[str] = None
    graduation_year: Optional[int] = None
    created_at: datetime

class CandidateDomainDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    dataset_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    current_role: Optional[str] = None
    years_of_experience: Optional[float] = None
    match_score: Optional[float] = None
    confidence: Optional[float] = None
    recommendation_status: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default=None, validation_alias="candidate_metadata")
    skills: List[SkillDTO] = []
    experiences: List[ExperienceDTO] = []
    educations: List[EducationDTO] = []
    created_at: datetime
    updated_at: datetime

class JobDomainDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    description: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    created_at: datetime
