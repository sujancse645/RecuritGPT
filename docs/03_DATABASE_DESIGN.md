# APPENDIX A — Error Handling & Response Standards

---

# A1. Standard Response Format

Every API returns a consistent response envelope.

## Success

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "requestId": "uuid"
}
```

---

## Error

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Candidate not found.",
    "details": []
  },
  "requestId": "uuid",
  "timestamp": "2026-06-28T10:00:00Z"
}
```

---

# A2. HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 202 | Accepted |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

# A3. Error Categories

- Authentication
- Authorization
- Validation
- Business Rules
- AI Errors
- Storage
- Database
- External Integration
- Rate Limiting
- System Errors

---

# A4. Pagination Standard

```json
{
  "page": 1,
  "limit": 25,
  "totalPages": 12,
  "totalItems": 287,
  "hasNext": true,
  "hasPrevious": false
}
```

---

# A5. Filtering Convention

```
?status=ACTIVE
&department=Engineering
&sort=-createdAt
&page=1
&limit=25
```

---

# A6. Sorting Convention

Ascending

```
sort=name
```

Descending

```
sort=-createdAt
```

---

# A7. Timestamp Format

All timestamps use

```
ISO 8601 UTC

2026-06-28T14:20:00Z
```

---

# A8. UUID Standard

All IDs use UUID v4.

```
8b7c7a34-9185-4b3d-bbb7-17c2185ab741
```

---

# A9. API Versioning

Current version

```
/api/v1/
```

Future versions

```
/api/v2/
```

---

# A10. Appendix Summary

This appendix defines global API conventions that apply uniformly across all RecruitGPT services, ensuring consistent response formats, error handling, pagination, filtering, versioning, and interoperability for enterprise-grade integrations.
# DATABASE_SCHEMA.md

# PART 2 — Core Identity & Organization Tables

---

# PART 2 Overview

This section defines the core identity, authentication, authorization, licensing, and organization management tables used throughout RecruitGPT.

Every other module depends on these foundational entities.

These tables support:

- Multi-Tenant Organizations
- User Management
- Authentication
- Authorization
- Role-Based Access Control (RBAC)
- API Security
- Feature Management
- Licensing
- Session Management
- Multi-Factor Authentication (MFA)

---

# 20. Entity Relationship Overview

```text
Organizations
      │
      ├──────── Users
      │             │
      │             ├──── User Roles
      │             │
      │             ├──── Sessions
      │             │
      │             ├──── MFA
      │             │
      │             └──── API Keys
      │
      ├──────── Roles
      │             │
      │             └──── Permissions
      │
      ├──────── Licenses
      │
      ├──────── Feature Flags
      │
      └──────── Organization Settings
```

---

# 21. organizations Table

## Purpose

Stores tenant organizations.

---

## Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| name | VARCHAR(255) | No | Organization Name |
| legal_name | VARCHAR(255) | Yes | Registered Name |
| domain | VARCHAR(255) | No | Email Domain |
| industry | VARCHAR(100) | Yes | Industry |
| employee_count | INTEGER | Yes | Company Size |
| subscription_plan | VARCHAR(50) | No | License Plan |
| timezone | VARCHAR(100) | No | Timezone |
| language | VARCHAR(50) | No | Default Language |
| logo_url | TEXT | Yes | Logo |
| status | VARCHAR(30) | No | Active/Suspended |
| created_at | TIMESTAMP | No | Created |
| updated_at | TIMESTAMP | No | Updated |
| deleted_at | TIMESTAMP | Yes | Soft Delete |

---

## Primary Key

```
id
```

---

## Indexes

```
idx_org_domain

idx_org_status

idx_org_subscription
```

---

## Relationships

```
Organization

↓

Users

Jobs

Candidates

Interviews

Documents
```

---

## Business Rules

- Domain must be unique.
- Soft delete enabled.
- Organization cannot be permanently deleted if active users exist.

---

# 22. users Table

## Purpose

Stores platform users.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| first_name | VARCHAR(100) |
| last_name | VARCHAR(100) |
| email | VARCHAR(320) |
| password_hash | TEXT |
| phone | VARCHAR(30) |
| avatar_url | TEXT |
| job_title | VARCHAR(120) |
| status | VARCHAR(30) |
| email_verified | BOOLEAN |
| last_login | TIMESTAMP |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP |

---

## Foreign Keys

```
organization_id

REFERENCES organizations(id)
```

---

## Indexes

```
idx_users_email

idx_users_org

idx_users_status

idx_users_last_login
```

---

## Constraints

```
Email unique per organization.
```

---

## Business Rules

- Password stored using Argon2.
- Email verification mandatory.
- Soft delete enabled.

---

# 23. roles Table

## Purpose

Stores RBAC roles.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| name | VARCHAR(120) |
| description | TEXT |
| system_role | BOOLEAN |
| created_at | TIMESTAMP |

---

## Default Roles

- Platform Administrator
- Organization Administrator
- Recruiter
- Hiring Manager
- Interviewer
- Viewer

---

## Indexes

```
idx_roles_name

idx_roles_org
```

---

# 24. permissions Table

## Purpose

Stores permission catalog.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| code | VARCHAR(150) |
| module | VARCHAR(100) |
| description | TEXT |
| created_at | TIMESTAMP |

---

## Examples

```
candidate.read

candidate.write

job.create

job.delete

admin.manage

analytics.view
```

---

## Constraints

Permission code must be globally unique.

---

# 25. role_permissions Table

## Purpose

Maps roles to permissions.

---

## Columns

| Column | Type |
|----------|------|
| role_id | UUID |
| permission_id | UUID |

---

## Composite Key

```
role_id

permission_id
```

---

## Relationships

```
Roles

↓

Permissions
```

---

# 26. user_roles Table

## Purpose

Assigns roles to users.

---

## Columns

| Column | Type |
|----------|------|
| user_id | UUID |
| role_id | UUID |
| assigned_by | UUID |
| assigned_at | TIMESTAMP |

---

## Business Rules

Users may have multiple roles.

---

# 27. sessions Table

## Purpose

Stores active login sessions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| refresh_token | TEXT |
| ip_address | INET |
| user_agent | TEXT |
| expires_at | TIMESTAMP |
| revoked | BOOLEAN |
| created_at | TIMESTAMP |

---

## Indexes

```
idx_sessions_user

idx_sessions_expiry
```

---

## Security

Expired sessions are automatically deleted.

---

# 28. api_keys Table

## Purpose

Stores API credentials.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| name | VARCHAR(120) |
| key_hash | TEXT |
| scopes | JSONB |
| expires_at | TIMESTAMP |
| last_used | TIMESTAMP |
| created_by | UUID |

---

## Security

- Key stored hashed
- Never retrievable
- Rotatable
- Revocable

---

# 29. mfa_devices Table

## Purpose

Stores MFA authenticators.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| type | VARCHAR(50) |
| secret | TEXT |
| verified | BOOLEAN |
| created_at | TIMESTAMP |

---

## Supported Types

- TOTP
- SMS
- Email
- WebAuthn
- Passkey

---

# 30. login_history Table

## Purpose

Tracks authentication history.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| ip_address | INET |
| country | VARCHAR(100) |
| browser | VARCHAR(120) |
| device | VARCHAR(120) |
| successful | BOOLEAN |
| login_at | TIMESTAMP |

---

## Retention

365 days.

---

# 31. organization_settings Table

## Purpose

Stores tenant configuration.

---

## Columns

| Column | Type |
|----------|------|
| organization_id | UUID |
| settings | JSONB |
| updated_at | TIMESTAMP |

---

## Example JSON

```json
{
  "timezone":"UTC",
  "language":"en",
  "theme":"dark",
  "allowPublicJobs":true
}
```

---

# 32. licenses Table

## Purpose

Stores organization subscriptions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| plan | VARCHAR(50) |
| user_limit | INTEGER |
| storage_limit_gb | INTEGER |
| ai_tokens | BIGINT |
| expires_at | TIMESTAMP |

---

## Supported Plans

- Free
- Starter
- Professional
- Business
- Enterprise
- Enterprise Plus

---

# 33. feature_flags Table

## Purpose

Controls feature rollout.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| feature_name | VARCHAR(150) |
| enabled | BOOLEAN |
| created_at | TIMESTAMP |

---

## Examples

- AI Resume Ranking
- AI Interview Analysis
- Knowledge Graph
- Semantic Search
- Voice Interviews

---

# 34. Relationships Summary

```text
Organizations

├── Users

│      ├── Sessions

│      ├── MFA

│      ├── API Keys

│      └── Login History

│

├── Roles

│      └── Permissions

│

├── Licenses

│

├── Settings

│

└── Feature Flags
```

---

# 35. Global Constraints

- UUID primary keys only.
- Soft delete enabled.
- Tenant isolation mandatory.
- Email unique within organization.
- Passwords hashed.
- API keys hashed.
- MFA optional but recommended.
- Audit logging required.

---

# 36. Performance Targets

| Operation | Target |
|------------|---------|
| User Login | <100 ms |
| Permission Check | <20 ms |
| Role Lookup | <10 ms |
| Session Validation | <30 ms |
| API Key Lookup | <20 ms |

---

# 37. Security Standards

Core identity tables enforce:

- RBAC
- MFA
- JWT Authentication
- OAuth 2.0
- Passkeys
- Session Rotation
- Rate Limiting
- Audit Logging
- Encryption at Rest
- TLS 1.3

---

# 38. Part 2 Summary

Part 2 establishes the identity and tenant management layer of RecruitGPT. It defines organizations, users, authentication, authorization, licensing, feature management, and security tables. These entities serve as the foundation for all application modules and enforce enterprise-grade multi-tenancy, RBAC, compliance, and secure access control.

---

## Next

**PART 3 — Candidate Management Tables (Candidates, Skills, Experience, Education, Certifications, Languages, Documents, Notes, Activity Timeline & AI Profile).**
# DATABASE_SCHEMA.md

# PART 3 — Candidate Management Tables

---

# PART 3 Overview

This section defines the Candidate domain, the central entity within RecruitGPT. It stores comprehensive candidate information, including personal details, professional experience, education, certifications, skills, languages, documents, AI-generated insights, and recruitment activity.

The schema is designed to support:

- End-to-End Candidate Lifecycle
- AI Resume Parsing
- Candidate Search
- Skill Matching
- Talent Pool Management
- Recruitment Analytics
- Compliance
- Auditability

---

# 39. Candidate Domain Architecture

```text
Organizations
      │
      └──────── Candidates
                 │
                 ├── Skills
                 ├── Experience
                 ├── Education
                 ├── Certifications
                 ├── Languages
                 ├── Documents
                 ├── Notes
                 ├── Timeline
                 ├── Social Profiles
                 ├── AI Profile
                 └── Resume
```

---

# 40. candidates Table

## Purpose

Stores the master profile of every candidate.

---

## Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| organization_id | UUID | No | Tenant ID |
| first_name | VARCHAR(100) | No | First Name |
| last_name | VARCHAR(100) | No | Last Name |
| email | VARCHAR(320) | No | Email Address |
| phone | VARCHAR(30) | Yes | Contact Number |
| date_of_birth | DATE | Yes | Birth Date |
| gender | VARCHAR(30) | Yes | Gender |
| nationality | VARCHAR(100) | Yes | Nationality |
| current_title | VARCHAR(150) | Yes | Current Job Title |
| current_company | VARCHAR(255) | Yes | Current Employer |
| total_experience | DECIMAL(4,1) | Yes | Years of Experience |
| expected_salary | DECIMAL(12,2) | Yes | Expected Salary |
| notice_period | INTEGER | Yes | Days |
| status | VARCHAR(50) | No | Recruitment Stage |
| source | VARCHAR(100) | Yes | Candidate Source |
| ai_score | DECIMAL(5,2) | Yes | AI Ranking |
| profile_completion | DECIMAL(5,2) | Yes | Completion % |
| created_at | TIMESTAMP | No | Created |
| updated_at | TIMESTAMP | No | Updated |
| deleted_at | TIMESTAMP | Yes | Soft Delete |

---

## Foreign Keys

```
organization_id → organizations.id
```

---

## Indexes

```
idx_candidate_email

idx_candidate_status

idx_candidate_ai_score

idx_candidate_company

idx_candidate_created
```

---

## Business Rules

- Email unique per organization.
- AI score ranges from 0–100.
- Soft delete enabled.
- Every candidate belongs to one organization.

---

# 41. candidate_skills Table

## Purpose

Stores candidate skills.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| skill_name | VARCHAR(120) |
| proficiency | VARCHAR(30) |
| years_experience | DECIMAL(4,1) |
| verified | BOOLEAN |

---

## Example Skills

- Python
- Java
- React
- Docker
- Kubernetes
- AWS

---

## Indexes

```
idx_candidate_skill

idx_candidate_skill_name
```

---

# 42. candidate_experience Table

## Purpose

Employment history.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| company_name | VARCHAR(255) |
| designation | VARCHAR(150) |
| employment_type | VARCHAR(50) |
| start_date | DATE |
| end_date | DATE |
| currently_working | BOOLEAN |
| description | TEXT |

---

## Business Rules

Experiences ordered chronologically.

---

# 43. candidate_education Table

## Purpose

Academic records.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| institution | VARCHAR(255) |
| degree | VARCHAR(150) |
| specialization | VARCHAR(150) |
| graduation_year | INTEGER |
| cgpa | DECIMAL(4,2) |

---

# 44. candidate_certifications Table

## Purpose

Professional certifications.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| certification_name | VARCHAR(255) |
| issuing_authority | VARCHAR(255) |
| issue_date | DATE |
| expiry_date | DATE |
| credential_url | TEXT |

---

# 45. candidate_languages Table

## Purpose

Known languages.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| language | VARCHAR(100) |
| proficiency | VARCHAR(30) |

---

## Proficiency Levels

- Native
- Fluent
- Advanced
- Intermediate
- Basic

---

# 46. candidate_documents Table

## Purpose

Links uploaded documents.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| document_id | UUID |
| category | VARCHAR(100) |
| uploaded_at | TIMESTAMP |

---

## Categories

- Resume
- Cover Letter
- Passport
- Certificate
- Portfolio

---

# 47. candidate_notes Table

## Purpose

Recruiter notes.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| created_by | UUID |
| note | TEXT |
| visibility | VARCHAR(30) |
| created_at | TIMESTAMP |

---

## Visibility

- Private
- Team
- Organization

---

# 48. candidate_timeline Table

## Purpose

Chronological activity history.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| activity | VARCHAR(150) |
| performed_by | UUID |
| performed_at | TIMESTAMP |
| metadata | JSONB |

---

## Activities

- Applied
- Resume Uploaded
- Interview Scheduled
- Interview Completed
- Offer Sent
- Offer Accepted
- Hired
- Rejected

---

# 49. candidate_social_profiles Table

## Purpose

Professional profiles.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| linkedin | TEXT |
| github | TEXT |
| portfolio | TEXT |
| website | TEXT |

---

# 50. candidate_ai_profiles Table

## Purpose

Stores AI-generated candidate insights.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| summary | TEXT |
| strengths | JSONB |
| weaknesses | JSONB |
| recommended_roles | JSONB |
| embedding_id | UUID |
| confidence | DECIMAL(5,2) |
| generated_at | TIMESTAMP |

---

## AI Outputs

- Candidate Summary
- Skill Analysis
- Career Path
- Fit Score
- Risk Indicators
- Strength Analysis

---

# 51. Relationships

```text
Candidate
    │
    ├── Skills
    ├── Experience
    ├── Education
    ├── Certifications
    ├── Languages
    ├── Documents
    ├── Notes
    ├── Timeline
    ├── Social Profiles
    └── AI Profile
```

---

# 52. Index Strategy

Common indexes include:

```
candidate_id

organization_id

email

status

ai_score

skill_name

created_at
```

Composite indexes:

```
organization_id + status

organization_id + ai_score

candidate_id + created_at
```

---

# 53. Data Integrity Rules

- Candidate must belong to an organization.
- Duplicate email not allowed within a tenant.
- Experience dates must not overlap for the same job.
- Certification expiry must be later than issue date.
- Timeline entries are immutable.
- AI profiles are regenerated after resume updates.

---

# 54. Security & Compliance

Candidate tables enforce:

- Tenant Isolation
- Row-Level Security (RLS)
- AES-256 Encryption
- Soft Deletes
- GDPR Compliance
- Audit Logging
- PII Protection

Sensitive fields such as email, phone, and personal identifiers are protected according to organizational security policies.

---

# 55. Performance Targets

| Operation | Target |
|------------|---------|
| Candidate Insert | <30 ms |
| Candidate Lookup | <50 ms |
| Skill Search | <100 ms |
| AI Profile Fetch | <150 ms |
| Timeline Retrieval | <100 ms |

---

# 56. Part 3 Summary

Part 3 defines the complete Candidate domain for RecruitGPT. It includes candidate master records, skills, experience, education, certifications, languages, documents, recruiter notes, activity timelines, social profiles, and AI-generated candidate intelligence. Together, these tables provide a comprehensive and extensible model for talent management, AI-powered recruitment, and enterprise-scale candidate lifecycle tracking.

---

## Next

**PART 4 — Job Management Tables (Jobs, Job Requirements, Skills, Locations, Salary Bands, Hiring Teams, Job Workflow, Applications & AI Matching).**
# DATABASE_SCHEMA.md

# PART 4 — Job Management Tables

---

# PART 4 Overview

This section defines the Job Management domain for RecruitGPT. It models job requisitions, hiring requirements, skills, locations, salary structures, hiring teams, workflow stages, candidate applications, and AI-powered job matching.

These tables support the complete recruitment lifecycle from job creation through hiring.

Core capabilities include:

- Job Requisition Management
- Multi-Location Jobs
- Required Skills
- Salary Bands
- Hiring Teams
- Custom Hiring Workflow
- Candidate Applications
- AI Job Matching
- Job Analytics
- Publishing Channels

---

# 57. Job Domain Architecture

```text
Organization
      │
      └──── Jobs
              │
              ├── Requirements
              ├── Skills
              ├── Locations
              ├── Salary Bands
              ├── Hiring Team
              ├── Workflow
              ├── Applications
              ├── Publishing
              ├── AI Matching
              └── Analytics
```

---

# 58. jobs Table

## Purpose

Stores job requisitions.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| organization_id | UUID | Tenant |
| title | VARCHAR(255) | Job Title |
| department | VARCHAR(150) | Department |
| employment_type | VARCHAR(50) | Full-Time, Contract |
| workplace_type | VARCHAR(50) | Remote, Hybrid, Onsite |
| experience_min | DECIMAL(4,1) | Minimum Experience |
| experience_max | DECIMAL(4,1) | Maximum Experience |
| description | TEXT | Job Description |
| responsibilities | TEXT | Responsibilities |
| qualifications | TEXT | Qualifications |
| openings | INTEGER | Number of Positions |
| status | VARCHAR(50) | Draft, Published, Closed |
| created_by | UUID | Creator |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |
| deleted_at | TIMESTAMP | Soft Delete |

---

## Foreign Keys

```
organization_id → organizations.id

created_by → users.id
```

---

## Indexes

```
idx_jobs_title

idx_jobs_department

idx_jobs_status

idx_jobs_created
```

---

# 59. job_requirements Table

## Purpose

Stores mandatory and optional requirements.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| requirement | TEXT |
| required | BOOLEAN |
| priority | INTEGER |

---

## Example

- Bachelor's Degree
- AWS Certification
- 5 Years Experience
- React Knowledge

---

# 60. job_skills Table

## Purpose

Required skills.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| skill_name | VARCHAR(120) |
| proficiency | VARCHAR(30) |
| mandatory | BOOLEAN |
| weight | DECIMAL(5,2) |

---

## Example

```
Python

Docker

AWS

Kubernetes
```

---

# 61. job_locations Table

## Purpose

Stores supported job locations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| country | VARCHAR(120) |
| state | VARCHAR(120) |
| city | VARCHAR(120) |
| address | TEXT |
| remote_allowed | BOOLEAN |

---

# 62. job_salary_bands Table

## Purpose

Salary information.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| currency | VARCHAR(10) |
| minimum_salary | DECIMAL(12,2) |
| maximum_salary | DECIMAL(12,2) |
| salary_visible | BOOLEAN |

---

# 63. hiring_team Table

## Purpose

Hiring members assigned to jobs.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| user_id | UUID |
| role | VARCHAR(100) |

---

## Roles

- Recruiter
- Hiring Manager
- Interviewer
- HR
- Observer

---

# 64. job_workflow Table

## Purpose

Defines hiring workflow.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| stage_name | VARCHAR(120) |
| sequence | INTEGER |
| ai_enabled | BOOLEAN |

---

## Default Workflow

```
Application

↓

Screening

↓

Interview

↓

Technical

↓

HR

↓

Offer

↓

Hired
```

---

# 65. job_applications Table

## Purpose

Links candidates to jobs.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| job_id | UUID |
| current_stage | VARCHAR(100) |
| application_source | VARCHAR(120) |
| ai_match_score | DECIMAL(5,2) |
| applied_at | TIMESTAMP |

---

## Relationships

```
Candidate

↓

Application

↓

Job
```

---

# 66. job_publishing Table

## Purpose

Tracks publishing channels.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| platform | VARCHAR(120) |
| external_job_id | VARCHAR(255) |
| published_at | TIMESTAMP |
| status | VARCHAR(50) |

---

## Platforms

- LinkedIn
- Indeed
- Greenhouse
- Company Website
- Internal Portal

---

# 67. ai_job_matching Table

## Purpose

Stores AI-generated job matching.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| candidate_id | UUID |
| match_score | DECIMAL(5,2) |
| strengths | JSONB |
| weaknesses | JSONB |
| recommendation | VARCHAR(50) |
| generated_at | TIMESTAMP |

---

## Recommendation Values

- Strong Match
- Good Match
- Moderate Match
- Weak Match

---

# 68. job_analytics Table

## Purpose

Aggregated job metrics.

---

## Columns

| Column | Type |
|----------|------|
| job_id | UUID |
| views | INTEGER |
| applications | INTEGER |
| shortlisted | INTEGER |
| interviewed | INTEGER |
| offers | INTEGER |
| hires | INTEGER |
| updated_at | TIMESTAMP |

---

# 69. Relationships

```text
Jobs

├── Requirements

├── Skills

├── Locations

├── Salary Bands

├── Hiring Team

├── Workflow

├── Applications

├── Publishing

├── AI Matching

└── Analytics
```

---

# 70. Index Strategy

Indexes include:

```
job_id

organization_id

department

status

title

created_at

candidate_id
```

Composite indexes

```
organization_id + status

department + status

candidate_id + job_id

job_id + ai_match_score
```

---

# 71. Business Rules

- Every job belongs to one organization.
- Job title is required.
- At least one workflow stage is mandatory.
- Applications cannot exist for archived jobs.
- AI matching is recalculated after job updates.
- Published jobs cannot be permanently deleted.

---

# 72. Security Policies

Job tables enforce:

- Tenant Isolation
- Row-Level Security
- RBAC Authorization
- Audit Logging
- Soft Deletes
- Encryption at Rest

Only authorized recruiters and administrators may create or modify jobs.

---

# 73. Performance Targets

| Operation | Target |
|------------|---------|
| Job Creation | <40 ms |
| Job Search | <100 ms |
| AI Match Retrieval | <150 ms |
| Workflow Lookup | <50 ms |
| Application Insert | <40 ms |

---

# 74. Part 4 Summary

Part 4 defines the complete Job Management domain, including job requisitions, requirements, skills, locations, salary bands, hiring teams, workflows, applications, AI-powered candidate matching, publishing channels, and analytics. These tables provide the structural foundation for enterprise recruitment workflows and intelligent candidate-job matching.

---

## Next

**PART 5 — Resume & Document Management Tables (Resumes, Resume Parsing, OCR Results, Embeddings, Resume Sections, Attachments, Storage Metadata & AI Resume Intelligence).**
# DATABASE_SCHEMA.md

# PART 5 — Resume & Document Management Tables

---

# PART 5 Overview

This section defines the Resume and Document Management domain for RecruitGPT. It manages resume uploads, document storage, OCR processing, resume parsing, AI-generated metadata, semantic embeddings, document versioning, and storage references.

These tables support the complete document lifecycle from upload to AI-powered resume analysis and retrieval.

Core capabilities include:

- Resume Upload
- Document Storage
- OCR Processing
- Resume Parsing
- Resume Versioning
- AI Resume Intelligence
- Embedding Generation
- Semantic Search
- Document Metadata
- Secure Storage Management

---

# 75. Resume Domain Architecture

```text
Candidate
      │
      └──── Resumes
              │
              ├── Resume Sections
              ├── Resume Skills
              ├── OCR Results
              ├── Parsing Results
              ├── Embeddings
              ├── AI Analysis
              ├── Document Versions
              ├── Storage Objects
              └── Attachments
```

---

# 76. resumes Table

## Purpose

Stores uploaded resume records.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| organization_id | UUID | Tenant ID |
| candidate_id | UUID | Candidate |
| original_filename | VARCHAR(255) | Uploaded File |
| file_type | VARCHAR(30) | PDF, DOCX |
| file_size | BIGINT | Bytes |
| checksum | VARCHAR(128) | SHA-256 Hash |
| upload_status | VARCHAR(30) | Upload Status |
| parsing_status | VARCHAR(30) | Parsing Status |
| storage_object_id | UUID | Storage Reference |
| uploaded_by | UUID | User |
| uploaded_at | TIMESTAMP | Upload Time |
| updated_at | TIMESTAMP | Last Updated |

---

## Foreign Keys

```
organization_id → organizations.id

candidate_id → candidates.id

storage_object_id → storage_objects.id
```

---

## Business Rules

- Maximum file size configurable.
- Duplicate detection via checksum.
- One candidate may have multiple resume versions.

---

# 77. resume_versions Table

## Purpose

Tracks resume revisions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| version_number | INTEGER |
| uploaded_by | UUID |
| change_summary | TEXT |
| created_at | TIMESTAMP |

---

## Business Rules

Latest version marked as active.

---

# 78. resume_sections Table

## Purpose

Stores parsed resume sections.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| section_name | VARCHAR(120) |
| section_content | TEXT |
| sequence | INTEGER |

---

## Supported Sections

- Personal Information
- Summary
- Skills
- Experience
- Education
- Certifications
- Projects
- Languages
- Awards

---

# 79. resume_skills Table

## Purpose

Normalized skills extracted from resumes.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| skill_name | VARCHAR(120) |
| confidence_score | DECIMAL(5,2) |
| source | VARCHAR(50) |

---

## Sources

- AI Parser
- OCR
- Manual
- Import

---

# 80. ocr_results Table

## Purpose

Stores OCR output.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| engine | VARCHAR(100) |
| extracted_text | TEXT |
| confidence | DECIMAL(5,2) |
| processing_time_ms | INTEGER |
| processed_at | TIMESTAMP |

---

## OCR Engines

- Tesseract
- Azure OCR
- Google Vision
- AWS Textract

---

# 81. resume_parsing_results Table

## Purpose

Stores structured parsing output.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| parser_version | VARCHAR(50) |
| parsed_json | JSONB |
| confidence_score | DECIMAL(5,2) |
| parsed_at | TIMESTAMP |

---

## JSON Content

Contains structured candidate information extracted from the resume.

---

# 82. resume_embeddings Table

## Purpose

Links resumes to vector embeddings.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| embedding_provider | VARCHAR(100) |
| vector_id | VARCHAR(255) |
| dimensions | INTEGER |
| model_name | VARCHAR(120) |
| created_at | TIMESTAMP |

---

## Supported Models

- OpenAI text-embedding
- BAAI BGE
- E5 Large
- Instructor XL

---

# 83. resume_ai_analysis Table

## Purpose

Stores AI-generated resume insights.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| candidate_summary | TEXT |
| strengths | JSONB |
| weaknesses | JSONB |
| missing_skills | JSONB |
| recommended_roles | JSONB |
| ai_score | DECIMAL(5,2) |
| generated_at | TIMESTAMP |

---

## Outputs

- Resume Summary
- Skill Gap Analysis
- Career Progression
- AI Score
- Suggested Roles

---

# 84. storage_objects Table

## Purpose

Stores physical object metadata.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| bucket_name | VARCHAR(120) |
| object_key | TEXT |
| storage_provider | VARCHAR(50) |
| region | VARCHAR(50) |
| encrypted | BOOLEAN |
| checksum | VARCHAR(128) |
| uploaded_at | TIMESTAMP |

---

## Supported Storage

- Amazon S3
- Azure Blob
- Google Cloud Storage
- MinIO

---

# 85. document_attachments Table

## Purpose

Stores supporting documents linked to resumes.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| document_type | VARCHAR(100) |
| storage_object_id | UUID |
| uploaded_at | TIMESTAMP |

---

## Document Types

- Cover Letter
- Portfolio
- Certificates
- Recommendation Letter
- Transcript

---

# 86. resume_processing_queue Table

## Purpose

Tracks asynchronous processing.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resume_id | UUID |
| task_name | VARCHAR(120) |
| status | VARCHAR(50) |
| retry_count | INTEGER |
| started_at | TIMESTAMP |
| completed_at | TIMESTAMP |

---

## Processing Tasks

- Virus Scan
- OCR
- Resume Parsing
- Embedding Generation
- AI Analysis
- Search Indexing

---

# 87. Relationships

```text
Resume
   │
   ├── Versions
   ├── Sections
   ├── Skills
   ├── OCR Results
   ├── Parsing Results
   ├── Embeddings
   ├── AI Analysis
   ├── Attachments
   ├── Storage Objects
   └── Processing Queue
```

---

# 88. Index Strategy

Indexes include:

```
resume_id

candidate_id

organization_id

upload_status

parsing_status

uploaded_at
```

Composite indexes:

```
candidate_id + uploaded_at

organization_id + parsing_status

resume_id + version_number
```

---

# 89. Business Rules

- Every resume belongs to one candidate.
- Resume checksum prevents duplicate uploads.
- Parsing begins after successful upload.
- OCR is skipped for text-based PDFs when possible.
- AI analysis runs after parsing completes.
- Embeddings regenerate whenever a new resume version is uploaded.
- Storage objects cannot be deleted while referenced.

---

# 90. Security & Compliance

Resume tables enforce:

- Tenant Isolation
- AES-256 Encryption at Rest
- TLS 1.3
- Virus Scanning
- Audit Logging
- Soft Deletes
- GDPR Right-to-Erasure
- Secure Object Storage

Personally identifiable information (PII) extracted from resumes is protected according to enterprise security policies.

---

# 91. Performance Targets

| Operation | Target |
|------------|---------|
| Resume Upload | <2 sec |
| OCR Processing | <15 sec |
| Resume Parsing | <10 sec |
| Embedding Generation | <5 sec |
| AI Analysis | <8 sec |
| Resume Retrieval | <100 ms |

---

# 92. Part 5 Summary

Part 5 defines the Resume & Document Management domain, covering resume uploads, versioning, OCR processing, structured parsing, AI-generated insights, vector embeddings, document storage, and asynchronous processing workflows. These tables form the foundation for RecruitGPT's AI-powered resume intelligence and semantic search capabilities.

---

## Next

**PART 6 — Interview Management Tables (Interviews, Interview Schedules, Interviewers, Questions, Responses, Scorecards, AI Analysis, Meeting Integrations & Feedback).**
# DATABASE_SCHEMA.md

# PART 6 — Interview Management Tables

---

# PART 6 Overview

This section defines the Interview Management domain of RecruitGPT. It manages interview scheduling, interview rounds, interviewers, questions, candidate responses, scorecards, AI-generated analysis, meeting integrations, recordings, and interviewer feedback.

These tables support the complete interview lifecycle from scheduling to hiring decisions.

Core capabilities include:

- Interview Scheduling
- Multi-Round Interviews
- Technical Assessments
- AI Interview Analysis
- Video Meeting Integration
- Interview Scorecards
- Candidate Feedback
- Interview Recordings
- Calendar Synchronization
- Hiring Recommendations

---

# 93. Interview Domain Architecture

```text
Job Application
        │
        └──────── Interviews
                     │
                     ├── Interviewers
                     ├── Questions
                     ├── Responses
                     ├── Scorecards
                     ├── AI Analysis
                     ├── Meeting Details
                     ├── Recordings
                     ├── Feedback
                     └── Decisions
```

---

# 94. interviews Table

## Purpose

Stores interview sessions.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| organization_id | UUID | Tenant |
| candidate_id | UUID | Candidate |
| job_id | UUID | Job |
| application_id | UUID | Job Application |
| interview_type | VARCHAR(50) | Technical, HR |
| interview_round | INTEGER | Round Number |
| scheduled_start | TIMESTAMP | Start Time |
| scheduled_end | TIMESTAMP | End Time |
| timezone | VARCHAR(100) | Time Zone |
| status | VARCHAR(50) | Scheduled |
| created_by | UUID | Recruiter |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

---

## Status Values

- Scheduled
- Confirmed
- Rescheduled
- Cancelled
- Completed
- No Show

---

## Foreign Keys

```
organization_id → organizations.id

candidate_id → candidates.id

job_id → jobs.id

application_id → job_applications.id
```

---

# 95. interview_panel Table

## Purpose

Stores interview panel members.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| interviewer_id | UUID |
| role | VARCHAR(100) |
| mandatory | BOOLEAN |

---

## Panel Roles

- Technical Interviewer
- Hiring Manager
- HR Manager
- Team Lead
- Observer

---

# 96. interview_questions Table

## Purpose

Stores interview questions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| category | VARCHAR(100) |
| difficulty | VARCHAR(30) |
| question | TEXT |
| expected_answer | TEXT |
| ai_generated | BOOLEAN |

---

## Categories

- Technical
- HR
- Behavioral
- Coding
- Leadership
- Communication

---

# 97. interview_responses Table

## Purpose

Stores candidate answers.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| question_id | UUID |
| response_text | TEXT |
| response_duration | INTEGER |
| answered_at | TIMESTAMP |

---

# 98. interview_scorecards Table

## Purpose

Stores interviewer evaluations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| interviewer_id | UUID |
| technical_score | DECIMAL(5,2) |
| communication_score | DECIMAL(5,2) |
| problem_solving_score | DECIMAL(5,2) |
| culture_fit_score | DECIMAL(5,2) |
| overall_score | DECIMAL(5,2) |
| recommendation | VARCHAR(50) |
| comments | TEXT |
| submitted_at | TIMESTAMP |

---

## Recommendation Values

- Strong Hire
- Hire
- Hold
- No Hire
- Strong No Hire

---

# 99. interview_ai_analysis Table

## Purpose

Stores AI interview analysis.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| transcript_summary | TEXT |
| sentiment | VARCHAR(30) |
| confidence_score | DECIMAL(5,2) |
| strengths | JSONB |
| weaknesses | JSONB |
| communication_rating | DECIMAL(5,2) |
| technical_rating | DECIMAL(5,2) |
| recommendation | VARCHAR(50) |
| generated_at | TIMESTAMP |

---

## AI Outputs

- Interview Summary
- Candidate Strengths
- Skill Gap Analysis
- Communication Assessment
- Hiring Recommendation

---

# 100. interview_meetings Table

## Purpose

Stores meeting integration details.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| provider | VARCHAR(50) |
| meeting_id | VARCHAR(255) |
| meeting_url | TEXT |
| calendar_event_id | VARCHAR(255) |
| created_at | TIMESTAMP |

---

## Providers

- Google Meet
- Microsoft Teams
- Zoom
- Webex

---

# 101. interview_recordings Table

## Purpose

Stores recording metadata.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| storage_object_id | UUID |
| duration_seconds | INTEGER |
| transcript_available | BOOLEAN |
| uploaded_at | TIMESTAMP |

---

# 102. interview_feedback Table

## Purpose

Stores interviewer comments.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| interviewer_id | UUID |
| feedback_type | VARCHAR(50) |
| feedback | TEXT |
| visibility | VARCHAR(30) |
| created_at | TIMESTAMP |

---

## Visibility

- Private
- Hiring Team
- Organization

---

# 103. interview_decisions Table

## Purpose

Stores final hiring decisions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| interview_id | UUID |
| decision | VARCHAR(50) |
| decided_by | UUID |
| decision_reason | TEXT |
| decided_at | TIMESTAMP |

---

## Decision Values

- Advance
- Reject
- Hold
- Offer
- Re-Interview

---

# 104. Relationships

```text
Interview
     │
     ├── Panel
     ├── Questions
     ├── Responses
     ├── Scorecards
     ├── AI Analysis
     ├── Meeting
     ├── Recording
     ├── Feedback
     └── Decision
```

---

# 105. Index Strategy

Indexes include

```
interview_id

candidate_id

job_id

status

scheduled_start

interviewer_id
```

Composite indexes

```
candidate_id + scheduled_start

job_id + interview_round

organization_id + status
```

---

# 106. Business Rules

- Every interview belongs to one candidate.
- At least one interviewer is required.
- Interview round numbers must be sequential.
- Scorecards are immutable after submission.
- AI analysis runs only after interview completion.
- Recordings are retained according to organization policy.
- Interview decisions require completed scorecards.

---

# 107. Security & Compliance

Interview tables enforce:

- Tenant Isolation
- RBAC Authorization
- Audit Logging
- Encryption at Rest
- Secure Meeting URLs
- GDPR Compliance
- Recording Access Control

Only authorized recruiters, interviewers, and hiring managers may access interview records.

---

# 108. Performance Targets

| Operation | Target |
|------------|---------|
| Interview Scheduling | <100 ms |
| Scorecard Submission | <80 ms |
| Meeting Retrieval | <50 ms |
| AI Analysis Retrieval | <150 ms |
| Interview History | <100 ms |

---

# 109. Part 6 Summary

Part 6 defines the complete Interview Management domain, including interview scheduling, interviewer assignments, interview questions, candidate responses, evaluation scorecards, AI-powered interview analysis, meeting integrations, recordings, interviewer feedback, and hiring decisions. Together, these tables provide a scalable and intelligent interview management framework for enterprise recruitment.

---

## Next

**PART 7 — Offer & Hiring Management Tables (Offers, Offer Versions, Compensation, Approvals, Contracts, Onboarding, Employment Records & Offer Analytics).**
# DATABASE_SCHEMA.md

# PART 7 — Offer & Hiring Management Tables

---

# PART 7 Overview

This section defines the Offer & Hiring domain of RecruitGPT. It manages offer generation, compensation, approval workflows, offer documents, employment contracts, onboarding, employee conversion, and AI-assisted hiring recommendations.

These tables support the transition from a successful candidate to a hired employee while ensuring compliance, auditability, and configurable approval workflows.

Core capabilities include:

- Offer Management
- Compensation Packages
- Multi-Level Approvals
- Offer Versioning
- Employment Contracts
- Digital Signatures
- Candidate Onboarding
- Employee Conversion
- Offer Analytics
- AI Hiring Insights

---

# 110. Offer Domain Architecture

```text
Candidate
      │
      └──── Job Application
                │
                └──── Offer
                        │
                        ├── Compensation
                        ├── Versions
                        ├── Approvals
                        ├── Documents
                        ├── Contracts
                        ├── Status History
                        ├── Onboarding
                        ├── Employee Record
                        ├── AI Analysis
                        └── Analytics
```

---

# 111. offers Table

## Purpose

Stores employment offers.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| organization_id | UUID | Tenant |
| candidate_id | UUID | Candidate |
| job_id | UUID | Job |
| application_id | UUID | Job Application |
| offer_number | VARCHAR(50) | Unique Offer Number |
| offer_title | VARCHAR(255) | Offer Title |
| start_date | DATE | Joining Date |
| expiry_date | DATE | Offer Expiration |
| status | VARCHAR(50) | Offer Status |
| created_by | UUID | Recruiter |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

---

## Status Values

- Draft
- Pending Approval
- Approved
- Sent
- Viewed
- Accepted
- Rejected
- Expired
- Withdrawn

---

## Foreign Keys

```
organization_id → organizations.id

candidate_id → candidates.id

job_id → jobs.id

application_id → job_applications.id
```

---

# 112. offer_versions Table

## Purpose

Tracks offer revisions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| version_number | INTEGER |
| change_summary | TEXT |
| created_by | UUID |
| created_at | TIMESTAMP |

---

## Business Rules

- Every modification creates a new version.
- Previous versions remain immutable.

---

# 113. offer_compensation Table

## Purpose

Stores compensation details.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| currency | VARCHAR(10) |
| base_salary | DECIMAL(12,2) |
| bonus | DECIMAL(12,2) |
| joining_bonus | DECIMAL(12,2) |
| stock_options | DECIMAL(12,2) |
| allowances | DECIMAL(12,2) |
| total_compensation | DECIMAL(12,2) |

---

## Compensation Types

- Base Salary
- Bonus
- Variable Pay
- Stock Options
- Joining Bonus
- Travel Allowance
- Housing Allowance

---

# 114. offer_approvals Table

## Purpose

Tracks approval workflow.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| approver_id | UUID |
| approval_level | INTEGER |
| status | VARCHAR(30) |
| comments | TEXT |
| approved_at | TIMESTAMP |

---

## Status

- Pending
- Approved
- Rejected

---

# 115. offer_documents Table

## Purpose

Stores generated offer letters.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| document_type | VARCHAR(100) |
| storage_object_id | UUID |
| generated_at | TIMESTAMP |

---

## Document Types

- Offer Letter
- Compensation Sheet
- NDA
- Joining Instructions

---

# 116. employment_contracts Table

## Purpose

Stores employment agreements.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| contract_version | INTEGER |
| signed_by_candidate | BOOLEAN |
| signed_by_company | BOOLEAN |
| signed_at | TIMESTAMP |
| storage_object_id | UUID |

---

## Features

- Version Control
- Digital Signature
- Audit Trail

---

# 117. offer_status_history Table

## Purpose

Tracks status changes.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| previous_status | VARCHAR(50) |
| new_status | VARCHAR(50) |
| changed_by | UUID |
| changed_at | TIMESTAMP |

---

## Example

```
Draft

↓

Pending Approval

↓

Approved

↓

Sent

↓

Accepted
```

---

# 118. candidate_onboarding Table

## Purpose

Tracks onboarding activities.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| onboarding_stage | VARCHAR(100) |
| assigned_to | UUID |
| due_date | DATE |
| completed | BOOLEAN |
| completed_at | TIMESTAMP |

---

## Stages

- Document Submission
- Background Verification
- IT Provisioning
- HR Orientation
- Payroll Setup
- Manager Introduction

---

# 119. employee_records Table

## Purpose

Stores employee information after hiring.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| candidate_id | UUID |
| employee_number | VARCHAR(50) |
| department | VARCHAR(100) |
| designation | VARCHAR(120) |
| joining_date | DATE |
| employment_status | VARCHAR(50) |
| manager_id | UUID |

---

## Status Values

- Active
- Probation
- Resigned
- Terminated
- Retired

---

# 120. offer_ai_analysis Table

## Purpose

Stores AI-generated hiring insights.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| offer_id | UUID |
| hiring_risk | DECIMAL(5,2) |
| salary_competitiveness | DECIMAL(5,2) |
| acceptance_probability | DECIMAL(5,2) |
| market_comparison | JSONB |
| recommendations | JSONB |
| generated_at | TIMESTAMP |

---

## AI Outputs

- Acceptance Probability
- Salary Benchmark
- Hiring Risk
- Compensation Recommendations
- Market Comparison

---

# 121. offer_analytics Table

## Purpose

Stores aggregated offer metrics.

---

## Columns

| Column | Type |
|----------|------|
| offer_id | UUID |
| views | INTEGER |
| downloads | INTEGER |
| acceptance_time_hours | INTEGER |
| updated_at | TIMESTAMP |

---

# 122. Relationships

```text
Offer
   │
   ├── Versions
   ├── Compensation
   ├── Approvals
   ├── Documents
   ├── Contracts
   ├── Status History
   ├── Onboarding
   ├── Employee Record
   ├── AI Analysis
   └── Analytics
```

---

# 123. Index Strategy

Indexes include

```
offer_id

candidate_id

job_id

status

expiry_date

created_at
```

Composite indexes

```
organization_id + status

candidate_id + status

job_id + created_at
```

---

# 124. Business Rules

- Every offer belongs to one candidate.
- Approved offers cannot be edited directly.
- Offer acceptance closes competing offers for the same application.
- Employee records are created only after acceptance.
- Compensation totals are automatically calculated.
- AI analysis refreshes when compensation changes.

---

# 125. Security & Compliance

Offer tables enforce:

- Tenant Isolation
- RBAC Authorization
- Audit Logging
- Digital Signature Validation
- Encryption at Rest
- GDPR Compliance
- Document Access Control

Only authorized recruiters, HR managers, and approvers may modify offer information.

---

# 126. Performance Targets

| Operation | Target |
|------------|---------|
| Offer Creation | <100 ms |
| Approval Submission | <80 ms |
| Offer Retrieval | <50 ms |
| Contract Generation | <2 sec |
| AI Analysis Retrieval | <150 ms |

---

# 127. Part 7 Summary

Part 7 defines the Offer & Hiring Management domain, including employment offers, compensation packages, approval workflows, document generation, employment contracts, onboarding tasks, employee conversion, analytics, and AI-powered hiring insights. Together, these tables complete the end-to-end recruitment lifecycle from candidate application through successful hiring.

---

## Next

**PART 8 — AI & Knowledge Management Tables (LLM Conversations, Prompt Templates, Embeddings, AI Memory, Knowledge Graph, RAG, Model Configuration & AI Feedback).**
# DATABASE_SCHEMA.md

# PART 8 — AI & Knowledge Management Tables

---

# PART 8 Overview

This section defines the Artificial Intelligence, Machine Learning, Vector Search, Retrieval-Augmented Generation (RAG), Knowledge Graph, Prompt Management, and AI Memory components of RecruitGPT.

These tables enable enterprise AI capabilities including semantic search, intelligent candidate ranking, conversational AI, recommendation systems, knowledge graph traversal, prompt engineering, model management, AI evaluation, and long-term memory.

Core capabilities include:

- LLM Conversations
- Prompt Templates
- Embeddings
- AI Memory
- Knowledge Graph
- Retrieval-Augmented Generation (RAG)
- AI Feedback
- Model Registry
- AI Evaluation
- AI Usage Analytics

---

# 128. AI Architecture

```text
Resume
        │
        ├──────── OCR
        │
        ├──────── Resume Parser
        │
        ├──────── Embeddings
        │
        ├──────── Qdrant
        │
        ├──────── RAG
        │
        ├──────── LLM
        │
        ├──────── Knowledge Graph
        │
        └──────── AI Response
```

---

# 129. llm_conversations Table

## Purpose

Stores AI conversations.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| organization_id | UUID | Tenant |
| user_id | UUID | User |
| conversation_title | VARCHAR(255) | Conversation Title |
| model_name | VARCHAR(120) | AI Model |
| total_tokens | INTEGER | Tokens Used |
| total_cost | DECIMAL(12,6) | Estimated Cost |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

---

## Relationships

```
Conversation

↓

Messages
```

---

# 130. llm_messages Table

## Purpose

Stores conversation messages.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| conversation_id | UUID |
| role | VARCHAR(30) |
| message | TEXT |
| token_count | INTEGER |
| created_at | TIMESTAMP |

---

## Roles

- System
- User
- Assistant
- Tool

---

# 131. prompt_templates Table

## Purpose

Reusable AI prompts.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| template_name | VARCHAR(150) |
| category | VARCHAR(100) |
| prompt_text | TEXT |
| version | INTEGER |
| active | BOOLEAN |

---

## Categories

- Resume Parsing
- Candidate Ranking
- Interview Analysis
- Offer Recommendation
- Chat Assistant
- Search

---

# 132. embeddings Table

## Purpose

Stores vector metadata.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| entity_type | VARCHAR(100) |
| entity_id | UUID |
| vector_database | VARCHAR(50) |
| vector_id | VARCHAR(255) |
| embedding_model | VARCHAR(120) |
| dimensions | INTEGER |
| generated_at | TIMESTAMP |

---

## Entity Types

- Resume
- Candidate
- Job
- Conversation
- Knowledge Node

---

# 133. ai_memory Table

## Purpose

Long-term AI memory.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| memory_type | VARCHAR(100) |
| memory_text | TEXT |
| embedding_id | UUID |
| importance_score | DECIMAL(5,2) |
| created_at | TIMESTAMP |

---

## Memory Types

- Preference
- Conversation
- User Behavior
- Recruiter Notes
- AI Learning

---

# 134. rag_documents Table

## Purpose

Documents available for Retrieval-Augmented Generation.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| document_title | VARCHAR(255) |
| source | VARCHAR(120) |
| content | TEXT |
| embedding_id | UUID |
| indexed_at | TIMESTAMP |

---

## Sources

- Policies
- Job Descriptions
- HR Manuals
- Company Wiki
- Candidate Profiles

---

# 135. knowledge_nodes Table

## Purpose

Knowledge graph entities.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| node_type | VARCHAR(100) |
| node_name | VARCHAR(255) |
| metadata | JSONB |
| created_at | TIMESTAMP |

---

## Node Types

- Candidate
- Job
- Skill
- Company
- Interview
- Recruiter

---

# 136. knowledge_edges Table

## Purpose

Knowledge graph relationships.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| source_node | UUID |
| target_node | UUID |
| relationship | VARCHAR(120) |
| confidence | DECIMAL(5,2) |
| created_at | TIMESTAMP |

---

## Relationships

- HAS_SKILL
- APPLIED_FOR
- INTERVIEWED_BY
- WORKED_AT
- MATCHES
- REPORTS_TO

---

# 137. ai_feedback Table

## Purpose

Collects AI response feedback.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| conversation_id | UUID |
| message_id | UUID |
| user_rating | INTEGER |
| comments | TEXT |
| created_at | TIMESTAMP |

---

## Ratings

1–5 Stars

---

# 138. ai_models Table

## Purpose

AI model registry.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| provider | VARCHAR(100) |
| model_name | VARCHAR(120) |
| version | VARCHAR(50) |
| context_window | INTEGER |
| enabled | BOOLEAN |
| created_at | TIMESTAMP |

---

## Providers

- OpenAI
- Anthropic
- Google
- Azure OpenAI
- Ollama
- Hugging Face

---

# 139. ai_evaluations Table

## Purpose

Stores AI evaluation results.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| model_id | UUID |
| evaluation_type | VARCHAR(100) |
| score | DECIMAL(5,2) |
| benchmark | VARCHAR(120) |
| executed_at | TIMESTAMP |

---

## Evaluation Types

- Accuracy
- Latency
- Hallucination
- Toxicity
- Bias
- Cost

---

# 140. ai_usage_metrics Table

## Purpose

Aggregated AI usage.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| model_id | UUID |
| requests | INTEGER |
| prompt_tokens | BIGINT |
| completion_tokens | BIGINT |
| estimated_cost | DECIMAL(12,4) |
| recorded_at | TIMESTAMP |

---

# 141. Relationships

```text
Conversation
      │
      ├── Messages
      ├── Feedback
      │
Prompt Templates

Embeddings

AI Memory

Knowledge Graph
      │
      ├── Nodes
      └── Edges

RAG Documents

AI Models
      │
      ├── Evaluations
      └── Usage Metrics
```

---

# 142. Index Strategy

Indexes include

```
conversation_id

user_id

organization_id

entity_type

entity_id

embedding_id

model_name
```

Composite indexes

```
organization_id + created_at

entity_type + entity_id

model_id + recorded_at
```

---

# 143. Business Rules

- Every embedding references one entity.
- Prompt templates support versioning.
- AI memory entries are ranked by importance.
- Knowledge graph edges require valid nodes.
- AI feedback cannot be modified after submission.
- Model registry maintains active/inactive versions.
- Usage metrics are aggregated hourly.

---

# 144. Security & Compliance

AI tables enforce:

- Tenant Isolation
- Prompt Sanitization
- Encryption at Rest
- Audit Logging
- Model Access Control
- Data Retention Policies
- PII Redaction
- Secure API Keys

---

# 145. Performance Targets

| Operation | Target |
|------------|---------|
| Embedding Lookup | <50 ms |
| Vector Search | <150 ms |
| Prompt Retrieval | <20 ms |
| Knowledge Graph Query | <100 ms |
| AI Conversation Load | <100 ms |

---

# 146. Part 8 Summary

Part 8 defines the AI & Knowledge Management domain of RecruitGPT, including LLM conversations, prompt templates, vector embeddings, AI memory, Retrieval-Augmented Generation (RAG), knowledge graph nodes and relationships, AI feedback, model management, evaluations, and usage metrics. These tables form the intelligent foundation of the platform's AI-powered recruitment capabilities.

---

## Next

**PART 9 — Workflow Automation & Business Process Tables (Workflows, Workflow Steps, Executions, Tasks, Events, Automation Rules, Approvals, Queues & Background Jobs).**
DATABASE_SCHEMA.md

PART 9 — Workflow Automation & Business Process Tables
# DATABASE_SCHEMA.md

# PART 9 — Workflow Automation & Business Process Tables

---

# PART 9 Overview

This section defines the Workflow Automation Engine for RecruitGPT.

The workflow engine orchestrates business processes across recruitment, AI, notifications, approvals, onboarding, integrations, analytics, and scheduled operations.

It supports:

- Custom Recruitment Pipelines
- Business Rules
- Approval Chains
- Event-Driven Automation
- Scheduled Jobs
- Background Workers
- Retry Mechanisms
- Human Tasks
- AI Automation
- Workflow Monitoring

This module acts as the orchestration layer of the RecruitGPT platform.

---

# 147. Workflow Architecture

```text
Event

↓

Workflow Engine

↓

Conditions

↓

Workflow Steps

↓

Actions

↓

Notifications

↓

AI

↓

Analytics

↓

Audit Logs
```

---

# 148. workflows Table

## Purpose

Stores workflow definitions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| workflow_name | VARCHAR(200) |
| description | TEXT |
| category | VARCHAR(100) |
| version | INTEGER |
| active | BOOLEAN |
| created_by | UUID |
| created_at | TIMESTAMP |

---

## Categories

- Hiring
- Candidate
- Interview
- Offer
- Onboarding
- AI
- Notifications
- Custom

---

# 149. workflow_versions Table

## Purpose

Version history.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| workflow_id | UUID |
| version_number | INTEGER |
| definition | JSONB |
| published | BOOLEAN |
| created_at | TIMESTAMP |

---

## Business Rules

Published versions cannot be modified.

---

# 150. workflow_steps Table

## Purpose

Stores workflow nodes.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| workflow_id | UUID |
| step_name | VARCHAR(150) |
| step_type | VARCHAR(80) |
| sequence | INTEGER |
| configuration | JSONB |

---

## Step Types

- Start
- Condition
- Approval
- Task
- AI
- Notification
- API Call
- Wait
- End

---

# 151. workflow_transitions Table

## Purpose

Defines transitions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| source_step | UUID |
| target_step | UUID |
| condition_expression | TEXT |

---

# 152. workflow_executions Table

## Purpose

Runtime execution.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| workflow_id | UUID |
| entity_type | VARCHAR(80) |
| entity_id | UUID |
| status | VARCHAR(40) |
| started_at | TIMESTAMP |
| completed_at | TIMESTAMP |

---

## Status

- Running
- Waiting
- Completed
- Failed
- Cancelled

---

# 153. workflow_execution_logs Table

## Purpose

Execution history.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| execution_id | UUID |
| step_id | UUID |
| event | VARCHAR(150) |
| log_level | VARCHAR(30) |
| message | TEXT |
| logged_at | TIMESTAMP |

---

# 154. workflow_tasks Table

## Purpose

Human approval tasks.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| execution_id | UUID |
| assigned_to | UUID |
| task_name | VARCHAR(200) |
| due_date | TIMESTAMP |
| completed | BOOLEAN |

---

## Examples

- HR Approval
- Salary Approval
- Offer Review
- Document Verification

---

# 155. automation_rules Table

## Purpose

Stores automation rules.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| rule_name | VARCHAR(200) |
| trigger_event | VARCHAR(120) |
| enabled | BOOLEAN |
| created_at | TIMESTAMP |

---

## Example

"When candidate score > 90"

↓

"Automatically schedule interview"

---

# 156. automation_conditions Table

## Purpose

Stores conditions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| rule_id | UUID |
| field_name | VARCHAR(120) |
| operator | VARCHAR(30) |
| comparison_value | TEXT |

---

## Operators

- Equals
- Greater Than
- Less Than
- Contains
- Between
- Regex

---

# 157. automation_actions Table

## Purpose

Stores actions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| rule_id | UUID |
| action_type | VARCHAR(120) |
| configuration | JSONB |

---

## Action Types

- Send Email
- Send SMS
- Schedule Interview
- Generate Offer
- Create Task
- Call API
- AI Analysis

---

# 158. workflow_events Table

## Purpose

System events.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| event_name | VARCHAR(150) |
| entity_type | VARCHAR(80) |
| entity_id | UUID |
| payload | JSONB |
| occurred_at | TIMESTAMP |

---

## Events

- Candidate Created
- Resume Uploaded
- Job Published
- Interview Completed
- Offer Accepted

---

# 159. event_subscriptions Table

## Purpose

Workflow subscriptions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| workflow_id | UUID |
| event_name | VARCHAR(150) |
| active | BOOLEAN |

---

# 160. approval_flows Table

## Purpose

Approval definitions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| flow_name | VARCHAR(200) |
| entity_type | VARCHAR(80) |
| active | BOOLEAN |

---

# 161. approval_steps Table

## Purpose

Approval hierarchy.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| approval_flow_id | UUID |
| sequence | INTEGER |
| approver_role | VARCHAR(120) |
| mandatory | BOOLEAN |

---

# 162. scheduled_jobs Table

## Purpose

Cron scheduler.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_name | VARCHAR(200) |
| cron_expression | VARCHAR(100) |
| enabled | BOOLEAN |
| last_run | TIMESTAMP |
| next_run | TIMESTAMP |

---

# 163. background_jobs Table

## Purpose

Async processing.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| queue_name | VARCHAR(120) |
| payload | JSONB |
| priority | INTEGER |
| status | VARCHAR(50) |
| created_at | TIMESTAMP |

---

## Queues

- OCR
- AI
- Email
- Search
- Analytics
- Export

---

# 164. failed_jobs Table

## Purpose

Retry queue.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| background_job_id | UUID |
| exception | TEXT |
| retry_count | INTEGER |
| failed_at | TIMESTAMP |

---

# 165. retry_policies Table

## Purpose

Retry configuration.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| queue_name | VARCHAR(120) |
| max_attempts | INTEGER |
| retry_interval_seconds | INTEGER |

---

# 166. workflow_notifications Table

## Purpose

Workflow notification mapping.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| workflow_id | UUID |
| notification_template | VARCHAR(200) |
| channel | VARCHAR(50) |

---

## Channels

- Email
- SMS
- Push
- Teams
- Slack
- Webhook

---

# 167. workflow_metrics Table

## Purpose

Workflow analytics.

---

## Columns

| Column | Type |
|----------|------|
| workflow_id | UUID |
| executions | INTEGER |
| success_count | INTEGER |
| failed_count | INTEGER |
| average_execution_ms | INTEGER |

---

# 168. Relationships

```text
Workflow

├── Versions

├── Steps

├── Transitions

├── Executions

│      ├── Logs

│      └── Tasks

├── Events

├── Automation Rules

│      ├── Conditions

│      └── Actions

├── Approval Flows

│      └── Approval Steps

├── Notifications

├── Background Jobs

├── Retry Policies

└── Metrics
```

---

# 169. Index Strategy

Indexes

```
workflow_id

execution_id

organization_id

status

event_name

queue_name

created_at
```

Composite

```
organization_id + active

workflow_id + version

execution_id + status

queue_name + status
```

---

# 170. Business Rules

- Published workflows are immutable.
- Every workflow starts with one Start node.
- Every workflow ends with one End node.
- Failed background jobs enter retry queue.
- Approval steps execute sequentially.
- Events are immutable.
- Workflow executions maintain complete history.
- Automation rules execute inside database transactions.

---

# 171. Security

Workflow Engine supports

- RBAC
- Tenant Isolation
- Audit Logging
- Version Control
- Secure API Execution
- Encrypted Secrets
- Webhook Validation
- Digital Signatures

---

# 172. Performance Targets

| Operation | Target |
|------------|---------|
| Workflow Start | <50 ms |
| Step Execution | <30 ms |
| Background Queue Insert | <20 ms |
| Automation Evaluation | <40 ms |
| Event Dispatch | <25 ms |

---

# 173. Part 9 Summary

Part 9 defines the enterprise workflow orchestration engine that powers RecruitGPT. It includes workflow definitions, execution tracking, automation rules, approval chains, event processing, background jobs, retry mechanisms, scheduling, notifications, and workflow analytics. This layer enables configurable, event-driven business automation across all recruitment modules.

---

## Next

**PART 10 — Analytics & Reporting Tables (Dashboards, KPIs, Metrics, Reports, Forecasting, Data Warehouse, AI Analytics & Executive Reporting).**
# DATABASE_SCHEMA.md

# PART 10 — Analytics & Reporting Tables

---

# PART 10 Overview

This section defines the Analytics & Reporting domain for RecruitGPT.

The Analytics module provides real-time dashboards, executive reporting, AI-powered insights, KPI tracking, historical trend analysis, forecasting, and data warehouse support.

It enables organizations to monitor recruitment performance, hiring efficiency, recruiter productivity, candidate pipeline health, AI effectiveness, and business outcomes.

Core capabilities include:

- Executive Dashboards
- KPI Tracking
- Recruitment Analytics
- Candidate Analytics
- Job Analytics
- Recruiter Performance
- AI Performance Metrics
- Forecasting
- Custom Reports
- Data Warehouse Integration

---

# 174. Analytics Architecture

```text
Recruitment Events

↓

ETL Pipeline

↓

Analytics Database

↓

Data Warehouse

↓

Dashboards

↓

Reports

↓

Executive KPIs

↓

Forecasting

↓

AI Insights
```

---

# 175. dashboards Table

## Purpose

Stores dashboard definitions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| dashboard_name | VARCHAR(200) |
| description | TEXT |
| dashboard_type | VARCHAR(100) |
| created_by | UUID |
| created_at | TIMESTAMP |

---

## Dashboard Types

- Executive
- Recruiter
- HR
- AI
- Hiring Manager
- Custom

---

# 176. dashboard_widgets Table

## Purpose

Stores dashboard widgets.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| dashboard_id | UUID |
| widget_name | VARCHAR(150) |
| widget_type | VARCHAR(80) |
| configuration | JSONB |
| display_order | INTEGER |

---

## Widget Types

- KPI Card
- Chart
- Table
- Funnel
- Heatmap
- Gauge
- Timeline

---

# 177. recruitment_metrics Table

## Purpose

Stores recruitment KPIs.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| metric_name | VARCHAR(150) |
| metric_value | DECIMAL(18,4) |
| calculation_date | DATE |
| created_at | TIMESTAMP |

---

## KPIs

- Time to Hire
- Time to Fill
- Cost per Hire
- Offer Acceptance Rate
- Interview Success Rate
- Candidate Drop-off Rate

---

# 178. recruiter_performance Table

## Purpose

Tracks recruiter productivity.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| recruiter_id | UUID |
| jobs_managed | INTEGER |
| interviews_scheduled | INTEGER |
| hires_completed | INTEGER |
| average_time_to_hire | INTEGER |
| updated_at | TIMESTAMP |

---

# 179. candidate_pipeline_metrics Table

## Purpose

Candidate funnel analytics.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| stage_name | VARCHAR(120) |
| candidate_count | INTEGER |
| conversion_rate | DECIMAL(5,2) |
| recorded_at | TIMESTAMP |

---

## Stages

- Applied
- Screening
- Interview
- Offer
- Hired
- Rejected

---

# 180. job_performance_metrics Table

## Purpose

Measures job performance.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| job_id | UUID |
| views | INTEGER |
| applications | INTEGER |
| shortlisted | INTEGER |
| interviews | INTEGER |
| hires | INTEGER |
| recorded_at | TIMESTAMP |

---

# 181. ai_analytics Table

## Purpose

AI effectiveness metrics.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| ai_module | VARCHAR(120) |
| requests | INTEGER |
| average_latency_ms | INTEGER |
| average_confidence | DECIMAL(5,2) |
| total_cost | DECIMAL(12,4) |
| recorded_at | TIMESTAMP |

---

## AI Modules

- Resume Parser
- Candidate Ranking
- Interview Analysis
- Chat Assistant
- Semantic Search
- Knowledge Graph

---

# 182. reports Table

## Purpose

Stores report definitions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| report_name | VARCHAR(200) |
| report_type | VARCHAR(100) |
| query_definition | JSONB |
| created_by | UUID |
| created_at | TIMESTAMP |

---

# 183. report_executions Table

## Purpose

Tracks report generation.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| report_id | UUID |
| generated_by | UUID |
| output_format | VARCHAR(30) |
| execution_time_ms | INTEGER |
| generated_at | TIMESTAMP |

---

## Formats

- PDF
- Excel
- CSV
- JSON

---

# 184. forecast_models Table

## Purpose

Hiring forecasts.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| forecast_type | VARCHAR(120) |
| prediction_period | VARCHAR(50) |
| prediction_result | JSONB |
| confidence_score | DECIMAL(5,2) |
| generated_at | TIMESTAMP |

---

## Forecast Types

- Hiring Demand
- Attrition
- Recruitment Budget
- Talent Availability
- AI Usage

---

# 185. data_warehouse_sync Table

## Purpose

Tracks warehouse synchronization.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| table_name | VARCHAR(150) |
| sync_status | VARCHAR(50) |
| records_processed | INTEGER |
| started_at | TIMESTAMP |
| completed_at | TIMESTAMP |

---

# 186. executive_scorecards Table

## Purpose

Executive KPI snapshots.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| reporting_period | VARCHAR(50) |
| overall_hiring_score | DECIMAL(5,2) |
| ai_efficiency_score | DECIMAL(5,2) |
| recruiter_efficiency | DECIMAL(5,2) |
| generated_at | TIMESTAMP |

---

# 187. Relationships

```text
Dashboards
     │
     ├── Widgets

Reports
     │
     └── Executions

Recruitment Metrics

Recruiter Performance

Candidate Pipeline

Job Performance

AI Analytics

Forecast Models

Executive Scorecards

Data Warehouse Sync
```

---

# 188. Index Strategy

Indexes

```
organization_id

dashboard_id

report_id

job_id

recruiter_id

metric_name

recorded_at
```

Composite

```
organization_id + metric_name

organization_id + reporting_period

job_id + recorded_at
```

---

# 189. Business Rules

- Dashboard names must be unique within an organization.
- KPI calculations run on scheduled intervals.
- Reports maintain execution history.
- Forecast models are versioned.
- Historical analytics are immutable.
- Data warehouse synchronization is incremental.

---

# 190. Security

Analytics tables enforce

- Tenant Isolation
- RBAC
- Read-Only Historical Data
- Audit Logging
- Report Access Control
- Data Masking
- Encryption at Rest

---

# 191. Performance Targets

| Operation | Target |
|------------|---------|
| Dashboard Load | <200 ms |
| KPI Retrieval | <100 ms |
| Report Generation | <5 sec |
| Forecast Retrieval | <300 ms |
| Warehouse Sync | 100k+ rows/min |

---

# 192. Part 10 Summary

Part 10 defines the Analytics & Reporting domain, including dashboards, widgets, KPIs, recruiter performance, candidate pipelines, job analytics, AI metrics, reporting, forecasting, executive scorecards, and data warehouse synchronization. These tables provide enterprise-grade business intelligence and decision support for RecruitGPT.

---

## Next

**PART 11 — Notification & Communication Tables (Email, SMS, Push Notifications, In-App Notifications, Webhooks, Templates, Delivery Logs & Communication Preferences).**
# DATABASE_SCHEMA.md

# PART 11 — Notification & Communication Tables

---

# PART 11 Overview

This section defines the Notification & Communication domain for RecruitGPT.

The communication subsystem provides a centralized platform for delivering notifications across multiple channels, managing communication templates, tracking delivery status, handling webhooks, and respecting user communication preferences.

Core capabilities include:

- Email Notifications
- SMS Notifications
- Push Notifications
- In-App Notifications
- Webhooks
- Notification Templates
- Communication Preferences
- Delivery Tracking
- Event-Based Messaging
- Communication Analytics

---

# 193. Communication Architecture

```text
System Events
      │
      ▼
Notification Engine
      │
      ├── Email
      ├── SMS
      ├── Push
      ├── In-App
      ├── Webhooks
      │
      ▼
Delivery Tracking
      │
      ▼
Analytics
```

---

# 194. notification_templates Table

## Purpose

Stores reusable notification templates.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| template_name | VARCHAR(200) |
| channel | VARCHAR(50) |
| subject | VARCHAR(255) |
| body | TEXT |
| language | VARCHAR(20) |
| active | BOOLEAN |
| version | INTEGER |
| created_at | TIMESTAMP |

---

## Supported Channels

- Email
- SMS
- Push
- In-App
- Webhook

---

# 195. notifications Table

## Purpose

Stores notification requests.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| recipient_id | UUID |
| template_id | UUID |
| channel | VARCHAR(50) |
| priority | VARCHAR(30) |
| status | VARCHAR(30) |
| scheduled_at | TIMESTAMP |
| created_at | TIMESTAMP |

---

## Priority Levels

- Low
- Normal
- High
- Critical

---

## Status

- Pending
- Queued
- Sent
- Delivered
- Failed
- Cancelled

---

# 196. notification_delivery_logs Table

## Purpose

Tracks notification delivery.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| notification_id | UUID |
| provider | VARCHAR(100) |
| provider_message_id | VARCHAR(255) |
| delivery_status | VARCHAR(50) |
| error_message | TEXT |
| delivered_at | TIMESTAMP |

---

# 197. email_messages Table

## Purpose

Stores email-specific information.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| notification_id | UUID |
| sender_email | VARCHAR(320) |
| recipient_email | VARCHAR(320) |
| cc_addresses | JSONB |
| bcc_addresses | JSONB |
| attachment_count | INTEGER |
| opened_at | TIMESTAMP |
| clicked_at | TIMESTAMP |

---

# 198. sms_messages Table

## Purpose

Stores SMS delivery information.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| notification_id | UUID |
| sender_number | VARCHAR(30) |
| recipient_number | VARCHAR(30) |
| provider | VARCHAR(100) |
| message_segments | INTEGER |
| delivered_at | TIMESTAMP |

---

# 199. push_notifications Table

## Purpose

Stores mobile and desktop push notifications.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| notification_id | UUID |
| device_id | UUID |
| platform | VARCHAR(30) |
| title | VARCHAR(255) |
| message | TEXT |
| clicked | BOOLEAN |
| clicked_at | TIMESTAMP |

---

## Platforms

- Android
- iOS
- Web

---

# 200. in_app_notifications Table

## Purpose

Stores notifications displayed inside RecruitGPT.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| notification_id | UUID |
| recipient_id | UUID |
| title | VARCHAR(255) |
| message | TEXT |
| read_status | BOOLEAN |
| read_at | TIMESTAMP |

---

# 201. webhook_endpoints Table

## Purpose

Stores external webhook endpoints.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| endpoint_name | VARCHAR(150) |
| url | TEXT |
| secret_key_hash | TEXT |
| active | BOOLEAN |
| created_at | TIMESTAMP |

---

# 202. webhook_deliveries Table

## Purpose

Tracks webhook requests.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| webhook_id | UUID |
| event_name | VARCHAR(120) |
| request_payload | JSONB |
| response_code | INTEGER |
| response_time_ms | INTEGER |
| delivered_at | TIMESTAMP |

---

# 203. communication_preferences Table

## Purpose

Stores user notification preferences.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| email_enabled | BOOLEAN |
| sms_enabled | BOOLEAN |
| push_enabled | BOOLEAN |
| in_app_enabled | BOOLEAN |
| marketing_enabled | BOOLEAN |
| updated_at | TIMESTAMP |

---

# 204. communication_events Table

## Purpose

Stores communication-triggering events.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| event_name | VARCHAR(150) |
| entity_type | VARCHAR(100) |
| entity_id | UUID |
| payload | JSONB |
| occurred_at | TIMESTAMP |

---

## Example Events

- Candidate Applied
- Interview Scheduled
- Offer Sent
- Offer Accepted
- Password Reset
- Account Created

---

# 205. communication_analytics Table

## Purpose

Stores communication KPIs.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| channel | VARCHAR(50) |
| total_sent | INTEGER |
| delivered | INTEGER |
| failed | INTEGER |
| open_rate | DECIMAL(5,2) |
| click_rate | DECIMAL(5,2) |
| recorded_at | TIMESTAMP |

---

# 206. Relationships

```text
Notification Templates
        │
        ▼
Notifications
        │
        ├── Delivery Logs
        ├── Email Messages
        ├── SMS Messages
        ├── Push Notifications
        ├── In-App Notifications
        │
        ▼
Communication Analytics

Webhook Endpoints
        │
        ▼
Webhook Deliveries

Communication Preferences

Communication Events
```

---

# 207. Index Strategy

Indexes include

```
notification_id

organization_id

recipient_id

channel

status

created_at

event_name
```

Composite indexes

```
organization_id + status

recipient_id + read_status

channel + delivery_status

event_name + occurred_at
```

---

# 208. Business Rules

- Notification templates are versioned.
- Delivery logs are immutable.
- User communication preferences override notification rules.
- Failed notifications may be retried according to retry policies.
- Webhook payloads are signed before delivery.
- Analytics are aggregated daily.

---

# 209. Security & Compliance

Communication tables enforce:

- Tenant Isolation
- RBAC Authorization
- TLS Encryption
- Webhook Signature Validation
- Audit Logging
- Data Retention Policies
- GDPR Compliance
- Opt-In / Opt-Out Management

---

# 210. Performance Targets

| Operation | Target |
|------------|---------|
| Notification Queue | <20 ms |
| Email Dispatch | <2 sec |
| SMS Dispatch | <5 sec |
| Push Notification | <1 sec |
| Webhook Delivery | <2 sec |
| Analytics Update | <100 ms |

---

# 211. Part 11 Summary

Part 11 defines the Notification & Communication domain, including templates, notification requests, delivery tracking, email, SMS, push, in-app messaging, webhooks, communication preferences, communication events, and analytics. These tables provide a scalable, secure, and event-driven messaging infrastructure for RecruitGPT.

---

## Next

**PART 12 — Search, Vector Index & Data Discovery Tables (Search Indexes, Elasticsearch Metadata, Vector Collections, Semantic Search, Indexing Jobs, Synonyms, Search Analytics & Discovery).**
# DATABASE_SCHEMA.md

# PART 12 — Search, Vector Index & Data Discovery Tables

---

# PART 12 Overview

This section defines the Search & Vector Index domain for RecruitGPT.

The search subsystem enables high-performance keyword search, semantic search, vector retrieval, hybrid search, autocomplete, indexing pipelines, search analytics, and AI-powered discovery across candidates, resumes, jobs, interviews, and organizational knowledge.

Core capabilities include:

- Full-Text Search
- Semantic Search
- Hybrid Search
- Vector Database Integration
- Elasticsearch/OpenSearch Metadata
- Search Suggestions
- Synonyms
- Search Analytics
- Index Management
- Search Quality Monitoring

---

# 212. Search Architecture

```text
Application Data
      │
      ▼
Indexing Pipeline
      │
      ├── Search Index
      ├── Vector Database
      ├── Embedding Service
      │
      ▼
Search Engine
      │
      ├── Keyword Search
      ├── Semantic Search
      ├── Hybrid Search
      ▼
Search Results
```

---

# 213. search_indexes Table

## Purpose

Stores searchable index definitions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| index_name | VARCHAR(150) |
| entity_type | VARCHAR(80) |
| search_engine | VARCHAR(50) |
| version | INTEGER |
| status | VARCHAR(30) |
| created_at | TIMESTAMP |

---

## Supported Engines

- PostgreSQL FTS
- Elasticsearch
- OpenSearch
- Meilisearch

---

# 214. indexed_documents Table

## Purpose

Maps entities to search indexes.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| index_id | UUID |
| entity_type | VARCHAR(80) |
| entity_id | UUID |
| indexed_at | TIMESTAMP |
| checksum | VARCHAR(128) |

---

# 215. vector_collections Table

## Purpose

Stores vector collection metadata.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| collection_name | VARCHAR(150) |
| vector_provider | VARCHAR(50) |
| embedding_model | VARCHAR(120) |
| dimensions | INTEGER |
| created_at | TIMESTAMP |

---

## Supported Providers

- Qdrant
- Pinecone
- Weaviate
- Milvus
- pgvector

---

# 216. vector_documents Table

## Purpose

Maps business entities to vectors.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| collection_id | UUID |
| entity_type | VARCHAR(80) |
| entity_id | UUID |
| vector_id | VARCHAR(255) |
| embedding_version | VARCHAR(50) |
| indexed_at | TIMESTAMP |

---

# 217. semantic_search_queries Table

## Purpose

Stores semantic search requests.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| user_id | UUID |
| query_text | TEXT |
| embedding_id | UUID |
| execution_time_ms | INTEGER |
| searched_at | TIMESTAMP |

---

# 218. search_results_cache Table

## Purpose

Caches frequently executed searches.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| query_hash | VARCHAR(128) |
| search_type | VARCHAR(50) |
| cached_results | JSONB |
| expires_at | TIMESTAMP |

---

# 219. search_synonyms Table

## Purpose

Stores synonym mappings.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| keyword | VARCHAR(150) |
| synonyms | JSONB |
| active | BOOLEAN |

---

## Example

```json
{
  "Developer": [
    "Programmer",
    "Software Engineer",
    "Engineer"
  ]
}
```

---

# 220. autocomplete_dictionary Table

## Purpose

Supports autocomplete suggestions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| entity_type | VARCHAR(80) |
| suggestion | VARCHAR(255) |
| popularity_score | INTEGER |
| updated_at | TIMESTAMP |

---

# 221. indexing_jobs Table

## Purpose

Tracks indexing operations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| index_id | UUID |
| job_type | VARCHAR(50) |
| records_processed | INTEGER |
| status | VARCHAR(30) |
| started_at | TIMESTAMP |
| completed_at | TIMESTAMP |

---

## Job Types

- Full Index
- Incremental
- Rebuild
- Delete
- Optimize

---

# 222. search_analytics Table

## Purpose

Stores search performance metrics.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| query | TEXT |
| result_count | INTEGER |
| execution_time_ms | INTEGER |
| clicked_result | BOOLEAN |
| searched_at | TIMESTAMP |

---

# 223. search_quality_metrics Table

## Purpose

Measures search quality.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| index_id | UUID |
| precision_score | DECIMAL(5,2) |
| recall_score | DECIMAL(5,2) |
| relevance_score | DECIMAL(5,2) |
| evaluated_at | TIMESTAMP |

---

# 224. discovery_collections Table

## Purpose

Defines curated discovery groups.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| collection_name | VARCHAR(150) |
| entity_type | VARCHAR(80) |
| description | TEXT |
| created_at | TIMESTAMP |

---

## Example Collections

- Top Candidates
- Urgent Jobs
- Recently Updated Resumes
- High AI Score Profiles

---

# 225. Relationships

```text
Search Indexes
      │
      ├── Indexed Documents
      ├── Indexing Jobs
      └── Search Quality Metrics

Vector Collections
      │
      └── Vector Documents

Semantic Search Queries

Search Results Cache

Search Synonyms

Autocomplete Dictionary

Search Analytics

Discovery Collections
```

---

# 226. Index Strategy

Indexes include

```
organization_id

index_id

collection_id

entity_type

entity_id

query_hash

searched_at
```

Composite indexes

```
organization_id + entity_type

collection_id + entity_id

query_hash + expires_at

organization_id + searched_at
```

---

# 227. Business Rules

- Each indexed entity belongs to one search index.
- Vector embeddings are regenerated after significant content changes.
- Cache entries expire automatically.
- Search synonyms support organization-specific customization.
- Index rebuilds do not interrupt active searches.
- Search analytics are retained according to reporting policies.

---

# 228. Security & Compliance

Search tables enforce:

- Tenant Isolation
- RBAC Authorization
- Query Logging
- Encryption at Rest
- Audit Logging
- PII Protection
- Search Rate Limiting
- Secure Vector Storage

---

# 229. Performance Targets

| Operation | Target |
|------------|---------|
| Full-Text Search | <100 ms |
| Semantic Search | <200 ms |
| Hybrid Search | <250 ms |
| Autocomplete | <50 ms |
| Cache Retrieval | <20 ms |
| Incremental Index Update | <500 ms |

---

# 230. Part 12 Summary

Part 12 defines the Search, Vector Index & Data Discovery domain, including search indexes, indexed documents, vector collections, semantic search, search caching, synonyms, autocomplete, indexing jobs, analytics, search quality metrics, and curated discovery collections. Together, these tables provide enterprise-grade search and AI-powered knowledge discovery capabilities for RecruitGPT.

---

## Next

**PART 13 — Security, Authentication & Audit Tables (Authentication, Authorization, API Tokens, Secrets, Audit Logs, Compliance, Access Policies & Security Monitoring).**
# DATABASE_SCHEMA.md

# PART 13 — Security, Authentication & Audit Tables

---

# PART 13 Overview

This section defines the Security, Authentication & Audit domain for RecruitGPT.

The security subsystem provides enterprise-grade identity protection, authentication, authorization, API security, secrets management, audit logging, compliance monitoring, and threat detection.

It ensures that all platform activities are secure, traceable, and compliant with enterprise and regulatory requirements.

Core capabilities include:

- Authentication
- Authorization
- API Key Management
- OAuth Integration
- JWT Session Management
- Secrets Management
- Audit Logging
- Security Events
- Compliance Tracking
- Threat Detection

---

# 231. Security Architecture

```text
User Login
      │
      ▼
Authentication
      │
      ▼
Authorization
      │
      ▼
Application Access
      │
      ├── API
      ├── Database
      ├── Files
      └── AI Services
      │
      ▼
Audit Logging
      │
      ▼
Security Monitoring
```

---

# 232. authentication_sessions Table

## Purpose

Stores active user sessions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| session_token | TEXT |
| refresh_token | TEXT |
| device_name | VARCHAR(150) |
| ip_address | INET |
| user_agent | TEXT |
| expires_at | TIMESTAMP |
| created_at | TIMESTAMP |

---

# 233. api_keys Table

## Purpose

Stores API credentials.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| key_name | VARCHAR(150) |
| api_key_hash | TEXT |
| permissions | JSONB |
| expires_at | TIMESTAMP |
| active | BOOLEAN |
| created_at | TIMESTAMP |

---

## Permission Examples

- Read Candidates
- Manage Jobs
- Search AI
- Reports
- Admin

---

# 234. oauth_providers Table

## Purpose

Stores OAuth integrations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| provider_name | VARCHAR(100) |
| client_id | TEXT |
| client_secret_reference | TEXT |
| enabled | BOOLEAN |
| created_at | TIMESTAMP |

---

## Providers

- Google
- Microsoft
- GitHub
- LinkedIn
- Okta
- Auth0

---

# 235. access_policies Table

## Purpose

Defines authorization policies.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| policy_name | VARCHAR(150) |
| resource | VARCHAR(120) |
| action | VARCHAR(80) |
| conditions | JSONB |
| created_at | TIMESTAMP |

---

# 236. role_permissions Table

## Purpose

Maps roles to permissions.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| role_id | UUID |
| permission_name | VARCHAR(150) |
| granted | BOOLEAN |

---

# 237. secrets_store Table

## Purpose

Stores encrypted secret references.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| secret_name | VARCHAR(150) |
| vault_reference | TEXT |
| secret_type | VARCHAR(80) |
| rotated_at | TIMESTAMP |

---

## Secret Types

- API Keys
- OAuth Secrets
- Database Passwords
- SMTP Credentials
- AI Keys

---

# 238. audit_logs Table

## Purpose

Stores immutable audit records.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| user_id | UUID |
| entity_type | VARCHAR(80) |
| entity_id | UUID |
| action | VARCHAR(100) |
| old_values | JSONB |
| new_values | JSONB |
| ip_address | INET |
| created_at | TIMESTAMP |

---

## Actions

- Create
- Update
- Delete
- Login
- Export
- Approve

---

# 239. security_events Table

## Purpose

Stores security-related events.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| event_type | VARCHAR(120) |
| severity | VARCHAR(30) |
| user_id | UUID |
| description | TEXT |
| detected_at | TIMESTAMP |

---

## Event Types

- Failed Login
- MFA Failure
- Permission Denied
- API Abuse
- Data Export
- Password Reset

---

# 240. mfa_devices Table

## Purpose

Stores registered MFA devices.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| device_type | VARCHAR(50) |
| secret_reference | TEXT |
| verified | BOOLEAN |
| registered_at | TIMESTAMP |

---

## Device Types

- Authenticator App
- SMS
- Email
- Hardware Token

---

# 241. compliance_records Table

## Purpose

Tracks compliance requirements.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| regulation | VARCHAR(100) |
| status | VARCHAR(50) |
| review_date | DATE |
| notes | TEXT |

---

## Regulations

- GDPR
- ISO 27001
- SOC 2
- HIPAA
- CCPA

---

# 242. security_incidents Table

## Purpose

Stores incident reports.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| incident_name | VARCHAR(200) |
| severity | VARCHAR(30) |
| status | VARCHAR(50) |
| assigned_to | UUID |
| resolved_at | TIMESTAMP |

---

## Severity Levels

- Low
- Medium
- High
- Critical

---

# 243. data_access_logs Table

## Purpose

Tracks sensitive data access.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID |
| entity_type | VARCHAR(80) |
| entity_id | UUID |
| access_type | VARCHAR(50) |
| accessed_at | TIMESTAMP |

---

## Access Types

- Read
- Export
- Download
- Print

---

# 244. Relationships

```text
Authentication Sessions

API Keys

OAuth Providers

Access Policies
      │
      └── Role Permissions

Secrets Store

Audit Logs

Security Events

MFA Devices

Compliance Records

Security Incidents

Data Access Logs
```

---

# 245. Index Strategy

Indexes include

```
organization_id

user_id

role_id

entity_type

entity_id

event_type

created_at
```

Composite indexes

```
organization_id + created_at

user_id + created_at

entity_type + entity_id

event_type + severity
```

---

# 246. Business Rules

- Sessions expire automatically.
- API keys are stored only as hashes.
- Audit logs are immutable.
- Secrets reference external vaults rather than storing plaintext values.
- MFA is required for privileged roles.
- Compliance reviews occur on scheduled intervals.
- Security incidents maintain a complete lifecycle history.

---

# 247. Security & Compliance

Security tables implement:

- Row-Level Security (RLS)
- Tenant Isolation
- AES-256 Encryption
- TLS 1.3
- RBAC
- MFA Enforcement
- Audit Trails
- Key Rotation
- Secure Secret Storage
- Compliance Monitoring

---

# 248. Performance Targets

| Operation | Target |
|------------|---------|
| Login Validation | <100 ms |
| Session Lookup | <20 ms |
| API Key Validation | <30 ms |
| Audit Log Insert | <20 ms |
| Security Event Recording | <50 ms |
| Compliance Report Query | <500 ms |

---

# 249. Part 13 Summary

Part 13 defines the Security, Authentication & Audit domain, including authentication sessions, API keys, OAuth providers, authorization policies, secrets management, audit logs, security events, MFA devices, compliance records, security incidents, and sensitive data access logs. These tables provide the security foundation required for enterprise-grade recruitment platforms.

---

## Next

**PART 14 — System Configuration & Operations Tables (Configuration, Feature Flags, Integrations, Monitoring, Health Checks, Backups, Maintenance, System Logs & Operational Metrics).**
# DATABASE_SCHEMA.md

# PART 14 — System Configuration & Operations Tables

---

# PART 14 Overview

This section defines the **System Configuration & Operations** domain for RecruitGPT.

These tables manage global configuration, organization-specific settings, feature flags, third-party integrations, monitoring, backups, operational logs, maintenance windows, and infrastructure health.

This domain enables RecruitGPT to operate as a scalable, observable, configurable, and cloud-native enterprise platform.

Core capabilities include:

- Global Configuration
- Organization Configuration
- Feature Flags
- Third-Party Integrations
- API Integrations
- Monitoring
- Health Checks
- Backups
- Maintenance
- Operational Metrics

---

# 250. Operations Architecture

```text
Application

↓

Configuration

↓

Feature Flags

↓

Integrations

↓

Monitoring

↓

Health Checks

↓

Metrics

↓

Alerts

↓

Backups

↓

Maintenance
```

---

# 251. system_configuration Table

## Purpose

Stores global platform configuration.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| config_key | VARCHAR(200) |
| config_value | JSONB |
| category | VARCHAR(100) |
| editable | BOOLEAN |
| updated_at | TIMESTAMP |

---

## Categories

- Authentication
- Email
- AI
- Search
- Storage
- Billing
- Security

---

# 252. organization_configuration Table

## Purpose

Organization-level configuration.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| config_key | VARCHAR(200) |
| config_value | JSONB |
| updated_at | TIMESTAMP |

---

# 253. feature_flags Table

## Purpose

Controls feature rollout.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| feature_name | VARCHAR(200) |
| description | TEXT |
| enabled | BOOLEAN |
| rollout_percentage | INTEGER |
| created_at | TIMESTAMP |

---

## Examples

- AI Candidate Ranking
- Semantic Search
- Voice Interviews
- Resume Copilot
- Analytics V2

---

# 254. organization_features Table

## Purpose

Maps enabled features to organizations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| feature_flag_id | UUID |
| enabled | BOOLEAN |

---

# 255. integrations Table

## Purpose

Stores third-party integrations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID |
| integration_name | VARCHAR(150) |
| provider | VARCHAR(100) |
| status | VARCHAR(50) |
| configuration | JSONB |
| created_at | TIMESTAMP |

---

## Integration Types

- ATS
- HRMS
- Payroll
- Email
- Calendar
- AI Provider
- Video Meeting
- Storage

---

# 256. integration_logs Table

## Purpose

Tracks integration activity.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| integration_id | UUID |
| request_type | VARCHAR(50) |
| status | VARCHAR(50) |
| response_time_ms | INTEGER |
| created_at | TIMESTAMP |

---

# 257. system_health_checks Table

## Purpose

Stores infrastructure health.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| component | VARCHAR(120) |
| status | VARCHAR(30) |
| response_time_ms | INTEGER |
| checked_at | TIMESTAMP |

---

## Components

- Database
- Redis
- AI Gateway
- Search Engine
- Object Storage
- Queue Service

---

# 258. monitoring_metrics Table

## Purpose

Stores infrastructure metrics.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| metric_name | VARCHAR(150) |
| metric_value | DECIMAL(18,4) |
| metric_unit | VARCHAR(30) |
| recorded_at | TIMESTAMP |

---

## Examples

- CPU Usage
- Memory Usage
- Queue Length
- API Latency
- Error Rate

---

# 259. alert_rules Table

## Purpose

Defines operational alerts.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| rule_name | VARCHAR(200) |
| metric_name | VARCHAR(120) |
| threshold | DECIMAL(18,4) |
| comparison_operator | VARCHAR(20) |
| active | BOOLEAN |

---

# 260. alert_history Table

## Purpose

Stores triggered alerts.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| alert_rule_id | UUID |
| severity | VARCHAR(30) |
| triggered_at | TIMESTAMP |
| resolved_at | TIMESTAMP |

---

## Severity

- Info
- Warning
- Error
- Critical

---

# 261. backup_history Table

## Purpose

Tracks database backups.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| backup_type | VARCHAR(50) |
| storage_location | TEXT |
| backup_size | BIGINT |
| status | VARCHAR(30) |
| created_at | TIMESTAMP |

---

## Backup Types

- Full
- Incremental
- Snapshot

---

# 262. maintenance_windows Table

## Purpose

Stores scheduled maintenance.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| maintenance_name | VARCHAR(200) |
| start_time | TIMESTAMP |
| end_time | TIMESTAMP |
| description | TEXT |
| status | VARCHAR(50) |

---

# 263. system_logs Table

## Purpose

Stores platform operational logs.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| log_level | VARCHAR(20) |
| service_name | VARCHAR(120) |
| message | TEXT |
| metadata | JSONB |
| logged_at | TIMESTAMP |

---

## Levels

- Debug
- Info
- Warning
- Error
- Fatal

---

# 264. scheduled_tasks Table

## Purpose

Stores recurring operational tasks.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| task_name | VARCHAR(200) |
| cron_expression | VARCHAR(120) |
| last_run | TIMESTAMP |
| next_run | TIMESTAMP |
| active | BOOLEAN |

---

# 265. Relationships

```text
System Configuration

Organization Configuration

Feature Flags
      │
      └── Organization Features

Integrations
      │
      └── Integration Logs

Monitoring Metrics
      │
      ├── Alert Rules
      └── Alert History

Health Checks

Backups

Maintenance Windows

System Logs

Scheduled Tasks
```

---

# 266. Index Strategy

Indexes include

```
organization_id

integration_id

metric_name

component

status

recorded_at

logged_at
```

Composite indexes

```
organization_id + config_key

metric_name + recorded_at

service_name + logged_at

status + created_at
```

---

# 267. Business Rules

- Global configuration changes are audited.
- Feature flags support gradual rollouts.
- Organization settings override global defaults.
- Health checks execute periodically.
- Monitoring metrics are retained according to retention policies.
- Backup history is immutable.
- Maintenance windows prevent conflicting deployments.

---

# 268. Security & Compliance

Operations tables enforce:

- Tenant Isolation (organization-specific settings)
- RBAC Authorization
- Encryption at Rest
- Audit Logging
- Secure Secret References
- Configuration Versioning
- Infrastructure Monitoring
- Operational Compliance

---

# 269. Performance Targets

| Operation | Target |
|------------|---------|
| Configuration Lookup | <20 ms |
| Feature Flag Evaluation | <10 ms |
| Health Check | <100 ms |
| Metric Recording | <20 ms |
| Alert Evaluation | <50 ms |
| Backup Registration | <50 ms |

---

# 270. Part 14 Summary

Part 14 defines the System Configuration & Operations domain, including configuration management, feature flags, organization settings, integrations, monitoring, health checks, alerts, backups, maintenance windows, operational logs, and scheduled tasks. These tables provide the operational backbone for managing RecruitGPT in enterprise production environments.

---

## Next

**PART 15 — Complete Database Relationships, ER Diagrams, Naming Standards, Index Reference, Partitioning Strategy & Final Database Blueprint.**
# DATABASE_SCHEMA.md

# PART 15 — Complete Database Blueprint, ER Diagrams & Reference

---

# PART 15 Overview

This final section consolidates the RecruitGPT database architecture into a complete enterprise blueprint. It documents the overall Entity Relationship (ER) model, naming conventions, indexing standards, partitioning strategy, archival policies, backup strategy, migration guidelines, and production best practices.

This serves as the reference guide for database administrators, backend engineers, DevOps teams, AI engineers, and solution architects.

---

# 271. High-Level Database Architecture

```text
                         RecruitGPT Platform
                                 │
 ┌───────────────────────────────────────────────────────────────┐
 │                       Identity & Security                     │
 │ Organizations ─ Users ─ Roles ─ Permissions ─ Audit Logs     │
 └───────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────┐
 │                     Recruitment Core                          │
 │ Candidates ─ Resumes ─ Jobs ─ Applications ─ Interviews       │
 │                                   │                           │
 │                                   ▼                           │
 │                             Offers ─ Employees               │
 └───────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────┐
 │                     Artificial Intelligence                   │
 │ Embeddings ─ RAG ─ Knowledge Graph ─ LLM ─ AI Analytics       │
 └───────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────┐
 │ Workflow │ Notifications │ Search │ Analytics │ Operations    │
 └───────────────────────────────────────────────────────────────┘
```

---

# 272. Core Entity Relationships

```text
Organization
    │
    ├──────── Users
    │
    ├──────── Candidates
    │               │
    │               ├── Resumes
    │               ├── Applications
    │               ├── Interviews
    │               ├── Offers
    │               └── Employee Records
    │
    ├──────── Jobs
    │               ├── Skills
    │               ├── Workflow
    │               └── Hiring Team
    │
    ├──────── AI
    │
    ├──────── Analytics
    │
    ├──────── Notifications
    │
    └──────── Integrations
```

---

# 273. Primary Key Strategy

All business tables use UUID primary keys.

```sql
id UUID PRIMARY KEY
```

Advantages:

- Globally unique
- Distributed-system friendly
- No sequence conflicts
- Safer for multi-tenant deployments

---

# 274. Foreign Key Standards

Every relationship enforces referential integrity.

Example:

```sql
candidate_id
REFERENCES candidates(id)

ON UPDATE CASCADE

ON DELETE RESTRICT
```

---

# 275. Naming Conventions

## Tables

Plural, snake_case.

Examples:

```text
candidates

job_applications

resume_embeddings

workflow_executions
```

---

## Columns

```text
id

organization_id

created_at

updated_at

deleted_at
```

Foreign keys always end with `_id`.

---

## Index Names

```text
idx_candidates_email

idx_jobs_status

idx_resume_embeddings

idx_workflow_status
```

---

## Constraint Names

```text
pk_candidates

fk_job_applications_candidate

uq_offer_number

chk_salary_positive
```

---

# 276. Standard Audit Columns

Every business table includes:

| Column | Purpose |
|---------|----------|
| created_at | Record creation |
| updated_at | Last update |
| deleted_at | Soft delete |
| created_by | User reference |
| updated_by | User reference |

---

# 277. Soft Delete Strategy

Business records are never permanently removed.

```sql
deleted_at TIMESTAMP NULL
```

Queries filter:

```sql
WHERE deleted_at IS NULL
```

---

# 278. Multi-Tenant Strategy

Every tenant-owned table contains:

```sql
organization_id UUID
```

Policies:

- Row-Level Security (RLS)
- Tenant isolation
- Cross-tenant access prohibited
- Organization-scoped indexes

---

# 279. Partitioning Strategy

Large tables are partitioned by date.

Examples:

```text
audit_logs

notifications

workflow_events

search_analytics

ai_usage_metrics

system_logs
```

Recommended partition:

```text
Monthly
```

---

# 280. Archival Strategy

Records eligible for archival:

- Closed jobs
- Completed interviews
- Historical offers
- Old notifications
- Audit logs
- AI conversations
- Workflow logs

Archive destination:

- Cold PostgreSQL
- Amazon S3
- Data Warehouse

---

# 281. Backup Strategy

| Backup Type | Frequency |
|--------------|-----------|
| Full | Weekly |
| Incremental | Daily |
| WAL Archive | Continuous |
| Snapshot | Before Releases |

Retention:

```text
Production

365 days

Development

30 days
```

---

# 282. Migration Standards

Migration tool recommendations:

- Flyway
- Liquibase
- Prisma Migrate
- Alembic

Rules:

- Forward-only migrations
- Version-controlled
- Idempotent scripts
- Rollback plans for production releases

---

# 283. Performance Optimization

Recommended indexes:

```text
organization_id

candidate_id

job_id

status

created_at

updated_at

email

phone

vector_id
```

Composite indexes:

```text
organization_id + status

candidate_id + job_id

organization_id + created_at

job_id + ai_score
```

---

# 284. Database Security

Enterprise recommendations:

- AES-256 encryption at rest
- TLS 1.3 in transit
- Row-Level Security
- Least-Privilege RBAC
- Immutable audit logs
- Secrets in external vaults
- MFA for administrators
- API key hashing

---

# 285. Data Retention Policy

| Data Type | Retention |
|------------|-----------|
| Audit Logs | 7 Years |
| AI Conversations | Configurable |
| Notifications | 2 Years |
| Search Logs | 1 Year |
| Analytics | 5 Years |
| Candidate Records | Organization Policy |
| Backups | 1 Year |

---

# 286. Recommended PostgreSQL Extensions

```text
pgcrypto

uuid-ossp

pgvector

pg_trgm

citext

btree_gin

btree_gist

pg_stat_statements
```

---

# 287. Scalability Recommendations

- PostgreSQL 16+
- Read replicas
- Connection pooling (PgBouncer)
- Partitioned tables
- Redis caching
- Horizontal application scaling
- Object storage for files
- Vector database for embeddings

---

# 288. Database Module Summary

| Module | Status |
|---------|--------|
| Foundation | Complete |
| Identity & Organizations | Complete |
| Candidates | Complete |
| Jobs | Complete |
| Resume Management | Complete |
| Interview Management | Complete |
| Offer & Hiring | Complete |
| AI & Knowledge | Complete |
| Workflow Automation | Complete |
| Analytics | Complete |
| Notifications | Complete |
| Search & Discovery | Complete |
| Security & Audit | Complete |
| Operations | Complete |

---

# 289. Overall Entity Count

Approximate database scope:

| Category | Estimated Tables |
|-----------|------------------:|
| Identity & Security | 20+ |
| Recruitment Core | 40+ |
| Resume & Documents | 15+ |
| AI & Knowledge | 15+ |
| Workflow Automation | 15+ |
| Analytics | 10+ |
| Notifications | 10+ |
| Search | 10+ |
| Operations | 10+ |
| **Total** | **140–160 Tables** |

---

# 290. Final Database Blueprint Summary

The RecruitGPT database is designed as a modular, multi-tenant, AI-native architecture capable of supporting enterprise-scale recruitment workflows. It provides comprehensive support for candidate lifecycle management, AI-powered resume analysis, semantic search, workflow automation, analytics, security, notifications, and operational management while maintaining strong data integrity, scalability, observability, and compliance.

This schema serves as the foundational data model for building RecruitGPT as a production-ready SaaS platform with support for modern AI features, distributed deployments, and enterprise governance.

---

# DATABASE_SCHEMA.md Status

✅ Part 1 — Foundation

✅ Part 2 — Identity & Organizations

✅ Part 3 — Candidate Management

✅ Part 4 — Job Management

✅ Part 5 — Resume & Document Management

✅ Part 6 — Interview Management

✅ Part 7 — Offer & Hiring

✅ Part 8 — AI & Knowledge Management

✅ Part 9 — Workflow Automation

✅ Part 10 — Analytics & Reporting

✅ Part 11 — Notifications & Communication

✅ Part 12 — Search & Vector Index

✅ Part 13 — Security, Authentication & Audit

✅ Part 14 — System Configuration & Operations

✅ Part 15 — Complete Database Blueprint & Reference

---

# DATABASE_SCHEMA.md COMPLETE