# AI_SPECIFICATION.md

# AI Specification

## 1. Overview

RecruitGPT uses AI throughout the recruitment lifecycle to automate resume parsing, candidate ranking, semantic search, interview analysis, job matching, and conversational assistance.

The AI layer must be modular so different LLM and embedding providers can be configured without changing application logic.

---

# 2. AI Architecture

```
User
   │
   ▼
Frontend
   │
   ▼
Backend AI Service
   │
   ├── Prompt Manager
   ├── RAG Engine
   ├── Embedding Service
   ├── Vector Search
   ├── LLM Gateway
   └── AI Analytics
```

---

# 3. Supported AI Providers

* OpenAI-compatible APIs
* Anthropic Claude
* Google Gemini
* Azure OpenAI
* Ollama (local)
* Custom LLM Gateway

Provider selection must be configurable.

---

# 4. AI Modules

* Resume Parser
* Candidate Ranking
* Job Matching
* Skill Extraction
* Experience Extraction
* Education Extraction
* Resume Summarization
* Interview Analysis
* Interview Summarization
* Candidate Recommendation
* Recruiter Copilot
* AI Chat Assistant
* Semantic Search
* Knowledge Retrieval
* Offer Letter Assistant

---

# 5. Resume Parsing

Extract:

* Personal Details
* Skills
* Experience
* Education
* Certifications
* Projects
* Languages
* Employment History
* Contact Information

Return structured JSON.

---

# 6. Candidate Ranking

Inputs:

* Resume
* Job Description
* Required Skills
* Experience
* Education
* Certifications

Outputs:

* Match Score (0–100)
* Matching Skills
* Missing Skills
* Strengths
* Weaknesses
* Hiring Recommendation
* Confidence Score

---

# 7. Semantic Search

Use embeddings for:

* Candidate Search
* Resume Search
* Job Search
* Knowledge Search

Support:

* Natural language queries
* Hybrid keyword + vector search
* Similarity ranking

---

# 8. RAG (Retrieval-Augmented Generation)

Knowledge sources:

* Resumes
* Job Descriptions
* Interview Notes
* Company Policies
* Internal Documents
* FAQs

Workflow:

```
Question

↓

Embedding

↓

Vector Search

↓

Relevant Context

↓

LLM

↓

Final Response
```

---

# 9. AI Chat Assistant

Capabilities:

* Candidate search
* Job recommendations
* Resume explanation
* Hiring insights
* Recruitment analytics
* Interview summaries
* Policy questions
* Workflow guidance

Maintain conversation history.

---

# 10. Prompt Management

Each AI feature uses versioned prompts.

Examples:

* Resume Parsing
* Candidate Ranking
* Interview Summary
* Job Match Analysis
* Recruiter Assistant
* Offer Generation

Prompts must be editable without code changes.

---

# 11. Embeddings

Supported models:

* OpenAI embeddings
* BGE
* E5
* Instructor
* Local embedding models

Store vectors separately from business data.

---

# 12. Vector Database

Supported:

* pgvector
* Qdrant
* Pinecone
* Weaviate
* Milvus

Store:

* Candidate embeddings
* Resume embeddings
* Job embeddings
* Knowledge embeddings

---

# 13. AI Analytics

Track:

* Request count
* Token usage
* Cost
* Latency
* Success rate
* Failure rate
* Confidence scores

---

# 14. AI Safety

Implement:

* Prompt injection protection
* Input validation
* Output validation
* PII masking
* Rate limiting
* Content moderation
* Audit logging

---

# 15. Configuration

Configurable parameters:

* LLM provider
* Embedding model
* Temperature
* Max tokens
* Similarity threshold
* Top-K retrieval
* Prompt versions

---

# 16. Performance Targets

* Resume Parsing: <10 seconds
* Candidate Ranking: <5 seconds
* Semantic Search: <300 ms
* AI Chat Response: <5 seconds
* Embedding Generation: <2 seconds

---

# 17. Acceptance Criteria

The AI subsystem is complete when:

* Resumes are parsed into structured data.
* Candidate-job matching returns a score and explanation.
* Semantic search retrieves relevant candidates.
* RAG answers use retrieved context.
* AI chat assistant supports recruitment workflows.
* AI providers can be switched via configuration.
* All AI requests are logged and monitored.
* Security controls protect prompts and sensitive data.
