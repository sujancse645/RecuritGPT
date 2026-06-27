import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Uuid
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

class Dataset(Base, TimestampMixin):
    __tablename__ = 'datasets'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String)
    status = Column(String)
    status = Column(String, default="UPLOADED")
    record_count = Column(Integer, default=0)
    job_count = Column(Integer, default=0)
    checksum = Column(String)

    candidates = relationship("Candidate", back_populates="dataset")

class Job(Base, TimestampMixin):
    __tablename__ = 'jobs'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    department = Column(String)
    location = Column(String)
    employment_type = Column(String)
    
    candidates = relationship("Candidate", back_populates="job")
    
    hiring_profile = relationship("JobHiringProfile", back_populates="job", uselist=False, cascade="all, delete-orphan")
    complexity_score = relationship("JobComplexityScore", back_populates="job", uselist=False, cascade="all, delete-orphan")
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    reasoning = relationship("JobReasoning", back_populates="job", cascade="all, delete-orphan")
    insights = relationship("JobInsight", back_populates="job", cascade="all, delete-orphan")
    kg_nodes = relationship("JobKnowledgeGraphNode", back_populates="job", cascade="all, delete-orphan")

class Candidate(Base, TimestampMixin):
    __tablename__ = 'candidates'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_id = Column(Uuid(as_uuid=True), ForeignKey('datasets.id'))
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True)
    phone = Column(String)
    current_role = Column(String)
    years_of_experience = Column(Float)
    
    # Non-structured raw data preserved safely
    metadata_data = Column("metadata", JSON) # JSONB in pg
    
    # Placeholder for future AI phases
    embedding_vector = Column(JSON) # Reserved for actual array/vector
    semantic_profile = Column(JSON) # Reserved
    match_score = Column(Float)
    confidence = Column(Float)
    recommendation_status = Column(String)
    
    dataset = relationship("Dataset", back_populates="candidates")
    skills = relationship("Skill", back_populates="candidate", cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="candidate", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="candidate", cascade="all, delete-orphan")

class Skill(Base, TimestampMixin):
    __tablename__ = 'skills'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    name = Column(String, nullable=False)
    score = Column(Float) # 0-100 proficiency
    
    candidate = relationship("Candidate", back_populates="skills")

class Experience(Base, TimestampMixin):
    __tablename__ = 'experiences'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_promotion = Column(Boolean, default=False)
    
    candidate = relationship("Candidate", back_populates="experiences")

class Education(Base, TimestampMixin):
    __tablename__ = 'educations'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    degree = Column(String)
    institution = Column(String)
    graduation_year = Column(Integer)
    
    candidate = relationship("Candidate", back_populates="educations")

class ProcessingStatus(Base, TimestampMixin):
    __tablename__ = 'processing_status'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_name = Column(String, nullable=False)
    status = Column(String, nullable=False) # UPLOADING, VALIDATING, SAVING, COMPLETED, FAILED
    total_records = Column(Integer, default=0)
    processed_records = Column(Integer, default=0)
    failed_records = Column(Integer, default=0)
    error_log = Column(Text)

class ProcessingLog(Base, TimestampMixin):
    __tablename__ = 'processing_logs'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    processing_status_id = Column(Uuid(as_uuid=True), ForeignKey('processing_status.id'))
    level = Column(String) # INFO, WARN, ERROR
    message = Column(Text)

# =========================================================================
# PHASE 5: AI JOB HIRING INTELLIGENCE TABLES
# =========================================================================

class JobHiringProfile(Base, TimestampMixin):
    __tablename__ = 'job_hiring_profiles'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    ideal_candidate_summary = Column(Text)
    ideal_career_progression = Column(Text)
    ideal_tech_stack = Column(Text)
    ideal_team_size = Column(String)
    ideal_industry_background = Column(String)
    ideal_leadership_level = Column(String)
    ideal_learning_ability = Column(String)
    ideal_innovation_ability = Column(String)
    ideal_communication_style = Column(String)
    ideal_problem_solving_ability = Column(String)
    ideal_architecture_experience = Column(String)
    ideal_cloud_experience = Column(String)
    ideal_devops_experience = Column(String)
    ideal_ai_readiness = Column(String)
    
    job = relationship("Job", back_populates="hiring_profile")

class JobComplexityScore(Base, TimestampMixin):
    __tablename__ = 'job_complexity_scores'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    technical_complexity = Column(Float)
    leadership_requirement = Column(Float)
    architecture_requirement = Column(Float)
    cloud_maturity = Column(Float)
    innovation_level = Column(Float)
    business_criticality = Column(Float)
    communication_requirement = Column(Float)
    learning_requirement = Column(Float)
    hiring_difficulty = Column(Float)
    overall_confidence = Column(Float)
    
    job = relationship("Job", back_populates="complexity_score")

class JobSkill(Base, TimestampMixin):
    __tablename__ = 'job_skills'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    name = Column(String, nullable=False)
    category = Column(String)
    subcategory = Column(String)
    importance = Column(Float)
    confidence = Column(Float)
    is_required = Column(Boolean, default=False)
    is_preferred = Column(Boolean, default=False)
    is_optional = Column(Boolean, default=False)
    is_emerging = Column(Boolean, default=False)
    is_transferable = Column(Boolean, default=False)
    is_deprecated = Column(Boolean, default=False)
    
    job = relationship("Job", back_populates="skills")

class JobReasoning(Base, TimestampMixin):
    __tablename__ = 'job_reasoning'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    statement = Column(Text, nullable=False)
    confidence = Column(Float)
    
    job = relationship("Job", back_populates="reasoning")

class JobInsight(Base, TimestampMixin):
    __tablename__ = 'job_insights'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    insight_type = Column(String, nullable=False) # e.g. "Top Critical Skills", "Market Scarcity"
    description = Column(Text, nullable=False)
    
    job = relationship("Job", back_populates="insights")

class JobKnowledgeGraphNode(Base, TimestampMixin):
    __tablename__ = 'job_kg_nodes'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    entity_name = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    
    job = relationship("Job", back_populates="kg_nodes")
    edges_out = relationship("JobKnowledgeGraphEdge", foreign_keys="[JobKnowledgeGraphEdge.source_node_id]", back_populates="source_node", cascade="all, delete-orphan")
    edges_in = relationship("JobKnowledgeGraphEdge", foreign_keys="[JobKnowledgeGraphEdge.target_node_id]", back_populates="target_node", cascade="all, delete-orphan")

class JobKnowledgeGraphEdge(Base, TimestampMixin):
    __tablename__ = 'job_kg_edges'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_node_id = Column(Uuid(as_uuid=True), ForeignKey('job_kg_nodes.id'))
    target_node_id = Column(Uuid(as_uuid=True), ForeignKey('job_kg_nodes.id'))
    relationship_type = Column(String, nullable=False)
    
    source_node = relationship("JobKnowledgeGraphNode", foreign_keys=[source_node_id], back_populates="edges_out")
    target_node = relationship("JobKnowledgeGraphNode", foreign_keys=[target_node_id], back_populates="edges_in")


# =========================================================================
# AI PLACEHOLDER TABLES (Phase 5-12 Preparations)
# =========================================================================

class Embedding(Base, TimestampMixin):
    __tablename__ = 'embeddings'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    model_name = Column(String)
    vector = Column(JSON) # To be replaced with pgvector

class SemanticMatch(Base, TimestampMixin):
    __tablename__ = 'semantic_matches'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

class CandidateScore(Base, TimestampMixin):
    __tablename__ = 'candidate_scores'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

class AgentReasoning(Base, TimestampMixin):
    __tablename__ = 'agent_reasoning'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

class Explainability(Base, TimestampMixin):
    __tablename__ = 'explainability'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

class KnowledgeGraph(Base, TimestampMixin):
    __tablename__ = 'knowledge_graph_nodes'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

class InterviewQuestion(Base, TimestampMixin):
    __tablename__ = 'interview_questions'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)


# --- Future AI-Ready Placeholder Tables (Unused in Phase 4) ---

class Embeddings(Base, TimestampMixin):
    __tablename__ = 'embeddings_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    vector = Column(JSON) # JSON array of floats
    model_name = Column(String)

class SemanticMatches(Base, TimestampMixin):
    __tablename__ = 'semantic_matches_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    job_id = Column(Uuid(as_uuid=True), ForeignKey('jobs.id'))
    similarity_score = Column(Float)
    match_rationale = Column(Text)

class CandidateScores(Base, TimestampMixin):
    __tablename__ = 'candidate_scores_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    cognitive_score = Column(Float)
    role_fit_score = Column(Float)
    experience_score = Column(Float)
    growth_score = Column(Float)

class AgentReasoning(Base, TimestampMixin):
    __tablename__ = 'agent_reasoning_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    thought_process = Column(Text)
    agent_role = Column(String)
    decision = Column(String)

class Explainability(Base, TimestampMixin):
    __tablename__ = 'explainability_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    key_drivers = Column(JSON)
    gap_analysis = Column(JSON)
    summary = Column(Text)

class KnowledgeGraph(Base, TimestampMixin):
    __tablename__ = 'knowledge_graph_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String)
    entity_name = Column(String)
    relations = Column(JSON)

class InterviewQuestions(Base, TimestampMixin):
    __tablename__ = 'interview_questions_placeholder'
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(Uuid(as_uuid=True), ForeignKey('candidates.id'))
    question_text = Column(Text)
    expected_answer = Column(Text)
    focus_area = Column(String)
    difficulty = Column(String)
