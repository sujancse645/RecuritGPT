# API_SPECIFICATION.md

# RecruitGPT Enterprise AI Operating System

## Complete API Specification

Version: 1.0.0

Status: Draft

---

# PART 1 — API Overview

---

# 1. Purpose

This document defines every API exposed by the RecruitGPT Enterprise AI Operating System.

It serves as the single source of truth for communication between:

- Frontend Applications
- Backend Services
- AI Agents
- Background Workers
- Mobile Clients
- Third-Party Integrations
- Enterprise Systems
- SDKs

The specification ensures all APIs are:

- Consistent
- Secure
- Versioned
- Documented
- Testable
- Extensible
- Backward Compatible

---

# 2. API Design Principles

RecruitGPT follows RESTful API design principles while supporting WebSockets for realtime communication.

Every API must satisfy the following principles:

## Consistency

Endpoints follow consistent naming conventions.

Example

```
/api/v1/jobs
/api/v1/resumes
/api/v1/candidates
```

---

## Predictability

Requests with identical inputs should produce identical outputs whenever possible.

---

## Statelessness

Every request contains all required context.

No server-side session state is required for API execution.

---

## Security

Every endpoint validates:

- Authentication
- Authorization
- Input
- Rate Limits
- Organization Access
- Permissions

---

## Scalability

APIs support:

- Horizontal Scaling
- Load Balancing
- Caching
- Streaming
- Background Processing

---

## Extensibility

New API versions must not break existing clients.

---

# 3. API Style Guide

RecruitGPT uses REST for CRUD operations.

Standard HTTP verbs:

| Method | Purpose |
|----------|----------|
| GET | Read |
| POST | Create |
| PUT | Replace |
| PATCH | Partial Update |
| DELETE | Remove |

---

# 4. Base URLs

Development

```
http://localhost:8000/api/v1
```

Staging

```
https://staging-api.recruitgpt.com/api/v1
```

Production

```
https://api.recruitgpt.com/api/v1
```

---

# 5. API Versioning

RecruitGPT uses URI versioning.

Example

```
/api/v1/jobs

/api/v2/jobs
```

Rules

- Existing versions remain supported during migration.
- Breaking changes require a new major version.
- Minor improvements remain within the same version.

---

# 6. Request Format

All requests use JSON unless uploading files.

Example

```http
POST /api/v1/jobs
Content-Type: application/json
```

Example payload

```json
{
  "title": "Senior AI Engineer",
  "department": "Engineering"
}
```

---

# 7. Response Format

Every response follows a standard envelope.

Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {},
  "timestamp": "2026-01-15T10:45:00Z"
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required."
  },
  "timestamp": "2026-01-15T10:45:00Z"
}
```

---

# 8. Authentication

Authentication uses JWT Bearer tokens.

Example

```http
Authorization: Bearer <JWT_TOKEN>
```

Protected endpoints require a valid access token.

Public endpoints

- Login
- Register
- Forgot Password
- Reset Password
- Health Check

---

# 9. Authorization

RecruitGPT implements Role-Based Access Control (RBAC).

Default roles

- Super Admin
- Organization Admin
- Recruiter
- Hiring Manager
- Interviewer
- Candidate
- Read-Only User

Permissions are evaluated on every request.

---

# 10. Multi-Tenant Isolation

Every organization is logically isolated.

Rules

- Users access only their organization.
- AI memory is organization scoped.
- Search results are tenant filtered.
- Files are tenant isolated.
- Audit logs are organization specific.

Cross-tenant access is prohibited.

---

# 11. Headers

Required headers

```http
Authorization: Bearer <token>

Content-Type: application/json

Accept: application/json

X-Request-ID: uuid

X-Correlation-ID: uuid
```

Optional headers

```http
Accept-Language

X-Timezone

X-Client-Version
```

---

# 12. HTTP Status Codes

RecruitGPT follows standard HTTP semantics.

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
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

# 13. Pagination

List endpoints use cursor-based pagination.

Example

```
GET /jobs?cursor=abc123&limit=25
```

Response

```json
{
  "data": [],
  "pagination": {
    "nextCursor": "xyz789",
    "hasMore": true
  }
}
```

---

# 14. Filtering

Example

```
GET /jobs?department=Engineering&location=Remote
```

Supported filters

- Department
- Status
- Location
- Experience
- Skills
- Created Date

---

# 15. Sorting

Example

```
GET /jobs?sort=createdAt&order=desc
```

Supported orders

- asc
- desc

---

# 16. Rate Limiting

Default API limits

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 10/min |
| Standard APIs | 100/min |
| Search APIs | 60/min |
| AI Generation | 30/min |
| Upload APIs | 20/min |

Rate limit headers

```http
X-RateLimit-Limit

X-RateLimit-Remaining

X-RateLimit-Reset
```

---

# 17. Idempotency

Create endpoints support idempotency keys.

Example

```http
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

This prevents duplicate resource creation.

---

# 18. Error Handling

All errors follow a consistent structure.

Example

```json
{
  "success": false,
  "error": {
    "code": "JOB_NOT_FOUND",
    "message": "The requested job does not exist.",
    "details": {}
  }
}
```

---

# 19. Correlation IDs

Every request receives a unique correlation ID.

Purpose

- Distributed tracing
- Debugging
- Monitoring
- Incident investigation

---

# 20. API Governance

Every new endpoint must include:

- Purpose
- Authentication
- Authorization
- Request Schema
- Response Schema
- Validation Rules
- Error Responses
- Events Published
- Database Changes
- AI Actions
- Sequence Diagram
- Performance Requirements
- Security Considerations
- Example Requests
- Example Responses

No endpoint may be added without complete documentation.

---

# Part 1 Summary

Part 1 establishes the foundational standards for every API within RecruitGPT. It defines the architectural principles, authentication model, authorization rules, request and response conventions, versioning strategy, pagination, filtering, error handling, rate limiting, and governance requirements that ensure consistency, security, scalability, and maintainability across the entire platform.

---

## Next

**PART 2 — Authentication APIs (Login, Register, Logout, Refresh Tokens, Password Reset, Email Verification, MFA, Sessions & JWT Lifecycle).**
# PART 2 — Authentication APIs

---

# PART 2 Overview

Authentication is the security foundation of the RecruitGPT Enterprise AI Operating System.

This section defines every endpoint involved in identity management, user authentication, authorization, session management, token lifecycle, password recovery, multi-factor authentication (MFA), and account security.

Authentication follows modern enterprise security standards including:

- JWT Access Tokens
- Refresh Tokens
- OAuth 2.0 Ready
- OpenID Connect Compatible
- Multi-Factor Authentication
- Secure Password Hashing
- Session Management
- Device Tracking
- Audit Logging
- Zero Trust Security

---

# 21. Authentication Architecture

```text
User

↓

Frontend

↓

API Gateway

↓

Authentication Service

↓

JWT Provider

↓

Database

↓

Response
```

Every authentication request flows through the Authentication Service before accessing protected resources.

---

# 22. Authentication Endpoints

| Method | Endpoint | Description |
|----------|----------------------------|-------------------------------|
| POST | /auth/login | User Login |
| POST | /auth/logout | User Logout |
| POST | /auth/register | User Registration |
| POST | /auth/refresh | Refresh JWT |
| POST | /auth/forgot-password | Request Password Reset |
| POST | /auth/reset-password | Reset Password |
| POST | /auth/verify-email | Verify Email |
| POST | /auth/resend-verification | Resend Verification Email |
| POST | /auth/change-password | Change Password |
| GET | /auth/me | Current User |
| POST | /auth/mfa/setup | Setup MFA |
| POST | /auth/mfa/verify | Verify MFA |
| DELETE | /auth/mfa | Disable MFA |
| GET | /auth/sessions | Active Sessions |
| DELETE | /auth/sessions/{id} | Revoke Session |

---

# 23. POST /auth/login

## Purpose

Authenticate a user and issue JWT tokens.

---

## Authentication

Public Endpoint

---

## Headers

```http
Content-Type: application/json
```

---

## Request Body

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

---

## Validation Rules

Email

- Required
- Valid email format

Password

- Required
- Minimum 8 characters

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "accessToken": "<JWT>",
    "refreshToken": "<JWT>",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "role": "Recruiter"
    }
  }
}
```

---

## Error Responses

| Code | Reason |
|------|-----------------------|
|400|Invalid Request|
|401|Invalid Credentials|
|403|Account Disabled|
|429|Too Many Attempts|
|500|Internal Server Error|

---

## Events Published

- UserLoggedIn

---

## Database Changes

- user_sessions
- audit_logs

---

## Audit Log

Store

- User ID
- IP Address
- Browser
- Device
- Login Time

---

# 24. POST /auth/logout

## Purpose

Invalidate user session.

---

## Authentication

JWT Required

---

## Headers

```http
Authorization: Bearer <token>
```

---

## Success Response

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## Events

- UserLoggedOut

---

## Database Updates

- user_sessions

---

# 25. POST /auth/register

## Purpose

Register a new organization user.

---

## Authentication

Public

---

## Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123!",
  "organizationName": "RecruitGPT Inc"
}
```

---

## Validation Rules

- Email unique
- Password complexity
- Organization name required

---

## Success Response

HTTP 201

```json
{
  "success": true,
  "message": "Registration successful."
}
```

---

## Events

- UserRegistered
- VerificationEmailRequested

---

# 26. POST /auth/refresh

## Purpose

Generate a new Access Token using a valid Refresh Token.

---

## Authentication

Refresh Token Required

---

## Request

```json
{
  "refreshToken": "<JWT>"
}
```

---

## Success Response

```json
{
  "accessToken":"<JWT>",
  "expiresIn":3600
}
```

---

## Events

- TokenRefreshed

---

# 27. POST /auth/forgot-password

## Purpose

Generate password reset link.

---

## Request

```json
{
  "email":"john@example.com"
}
```

---

## Response

```json
{
  "success":true,
  "message":"Password reset email sent."
}
```

---

## Events

- PasswordResetRequested

---

# 28. POST /auth/reset-password

## Purpose

Reset password using secure reset token.

---

## Request

```json
{
  "token":"reset-token",
  "password":"NewPassword123!"
}
```

---

## Validation

- Token valid
- Token not expired
- Password complexity

---

## Events

- PasswordChanged

---

# 29. POST /auth/verify-email

## Purpose

Verify email ownership.

---

## Request

```json
{
  "token":"verification-token"
}
```

---

## Response

```json
{
  "success":true
}
```

---

## Events

- EmailVerified

---

# 30. POST /auth/resend-verification

## Purpose

Send another email verification link.

---

## Authentication

Public

---

## Request

```json
{
  "email":"john@example.com"
}
```

---

## Events

- VerificationEmailSent

---

# 31. POST /auth/change-password

## Purpose

Change password while logged in.

---

## Authentication

JWT Required

---

## Request

```json
{
  "currentPassword":"OldPassword",
  "newPassword":"NewPassword123!"
}
```

---

## Validation

- Current password correct
- Password complexity
- Password history check

---

## Events

- PasswordUpdated

---

# 32. GET /auth/me

## Purpose

Return authenticated user profile.

---

## Authentication

JWT Required

---

## Response

```json
{
  "id":"uuid",
  "name":"John Doe",
  "email":"john@example.com",
  "role":"Recruiter",
  "organization":"RecruitGPT Inc"
}
```

---

# 33. POST /auth/mfa/setup

## Purpose

Enable Multi-Factor Authentication.

---

## Authentication

JWT Required

---

## Response

```json
{
  "secret":"BASE32SECRET",
  "qrCode":"otpauth://..."
}
```

---

## Events

- MFAEnabled

---

# 34. POST /auth/mfa/verify

## Purpose

Verify MFA code.

---

## Request

```json
{
  "code":"123456"
}
```

---

## Response

```json
{
  "success":true
}
```

---

## Events

- MFAVerified

---

# 35. DELETE /auth/mfa

## Purpose

Disable Multi-Factor Authentication.

---

## Authentication

JWT Required

---

## Events

- MFADisabled

---

# 36. GET /auth/sessions

## Purpose

List active login sessions.

---

## Authentication

JWT Required

---

## Response

```json
[
  {
    "id":"uuid",
    "device":"Chrome",
    "ip":"192.168.1.1",
    "lastActive":"2026-01-15T10:00:00Z"
  }
]
```

---

# 37. DELETE /auth/sessions/{id}

## Purpose

Terminate a specific active session.

---

## Authentication

JWT Required

---

## Response

```json
{
  "success":true
}
```

---

## Events

- SessionRevoked

---

# 38. JWT Lifecycle

```text
Login

↓

Access Token

↓

API Requests

↓

Expires

↓

Refresh Token

↓

New Access Token
```

---

# 39. Security Policies

Authentication enforces

- BCrypt Password Hashing
- JWT Signing
- Token Expiration
- Refresh Token Rotation
- Account Lockout
- MFA Support
- Device Tracking
- Session Revocation
- Audit Logging
- Rate Limiting

---

# 40. Part 2 Summary

RecruitGPT Authentication provides a secure, scalable identity management system supporting JWT authentication, refresh token rotation, email verification, password recovery, MFA, session management, and enterprise-grade auditing. These APIs establish the security foundation for all protected resources across the platform.

---

## Next

**PART 3 — Organization APIs (Organizations, Tenants, Departments, Teams, Invitations, Memberships & Enterprise Settings).**
# PART 3 — Organization APIs

---

# PART 3 Overview

The Organization APIs provide enterprise-grade multi-tenant management for RecruitGPT.

Every organization (tenant) is logically isolated while sharing the same platform infrastructure.

This module manages:

- Organizations
- Departments
- Teams
- Members
- Invitations
- Organization Settings
- Subscription Plans
- Branding
- Security Policies
- Enterprise Preferences

The Organization Service ensures complete tenant isolation while enabling enterprise administration.

---

# 41. Organization Architecture

```text
Enterprise

↓

Organization

↓

Departments

↓

Teams

↓

Users

↓

Roles

↓

Permissions
```

Every resource belongs to exactly one organization.

---

# 42. Organization Endpoints

| Method | Endpoint | Description |
|----------|-------------------------------|-----------------------------|
| GET | /organizations | List Organizations |
| GET | /organizations/{id} | Get Organization |
| POST | /organizations | Create Organization |
| PUT | /organizations/{id} | Update Organization |
| DELETE | /organizations/{id} | Delete Organization |
| GET | /organizations/{id}/members | List Members |
| POST | /organizations/{id}/invite | Invite Member |
| DELETE | /organizations/{id}/members/{id} | Remove Member |
| GET | /organizations/{id}/departments | List Departments |
| POST | /organizations/{id}/departments | Create Department |
| PUT | /organizations/{id}/settings | Update Settings |
| GET | /organizations/{id}/usage | Usage Analytics |

---

# 43. GET /organizations

## Purpose

Return all organizations accessible to the authenticated user.

---

## Authentication

JWT Required

---

## Authorization

Roles

- Super Admin
- Organization Admin

---

## Request

```http
GET /api/v1/organizations
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "RecruitGPT Inc",
      "plan": "Enterprise",
      "status": "Active"
    }
  ]
}
```

---

## Database Tables

- organizations

---

# 44. GET /organizations/{id}

## Purpose

Return organization details.

---

## Authentication

JWT Required

---

## Path Parameters

```text
id

UUID
```

---

## Success Response

```json
{
  "id":"uuid",
  "name":"RecruitGPT Inc",
  "industry":"Technology",
  "employees":250,
  "plan":"Enterprise",
  "timezone":"UTC",
  "createdAt":"2026-01-01"
}
```

---

## Error Responses

404

403

401

---

# 45. POST /organizations

## Purpose

Create a new organization.

---

## Authentication

Super Admin

---

## Request

```json
{
  "name":"Acme Corporation",
  "industry":"Software",
  "timezone":"UTC",
  "country":"India"
}
```

---

## Validation Rules

Organization Name

- Required
- Unique
- Max 150 Characters

Industry

- Required

Country

- ISO Country Code

---

## Success Response

HTTP 201

```json
{
  "success":true,
  "id":"uuid"
}
```

---

## Events

- OrganizationCreated

---

## Database Changes

- organizations
- audit_logs

---

# 46. PUT /organizations/{id}

## Purpose

Update organization information.

---

## Authentication

Organization Admin

---

## Request

```json
{
  "name":"RecruitGPT Technologies",
  "industry":"AI"
}
```

---

## Events

- OrganizationUpdated

---

# 47. DELETE /organizations/{id}

## Purpose

Soft delete an organization.

---

## Authentication

Super Admin

---

## Response

```json
{
  "success":true
}
```

---

## Events

- OrganizationDeleted

---

## Notes

Deletion is soft by default.

All data remains recoverable.

---

# 48. GET /organizations/{id}/members

## Purpose

Retrieve organization members.

---

## Authentication

Organization Admin

---

## Response

```json
[
  {
    "id":"uuid",
    "name":"John Doe",
    "role":"Recruiter",
    "email":"john@example.com"
  }
]
```

---

## Pagination

Supported

Cursor Pagination

---

# 49. POST /organizations/{id}/invite

## Purpose

Invite a new member.

---

## Request

```json
{
  "email":"candidate@example.com",
  "role":"Recruiter"
}
```

---

## Success Response

```json
{
  "success":true,
  "message":"Invitation sent."
}
```

---

## Events

- InvitationCreated
- InvitationEmailSent

---

# 50. DELETE /organizations/{id}/members/{id}

## Purpose

Remove a member.

---

## Authentication

Organization Admin

---

## Response

```json
{
  "success":true
}
```

---

## Events

- MemberRemoved

---

# 51. GET /organizations/{id}/departments

## Purpose

Retrieve departments.

---

## Response

```json
[
  {
    "id":"uuid",
    "name":"Engineering"
  },
  {
    "id":"uuid",
    "name":"Human Resources"
  }
]
```

---

# 52. POST /organizations/{id}/departments

## Purpose

Create department.

---

## Request

```json
{
  "name":"Artificial Intelligence"
}
```

---

## Validation

Department Name

- Required
- Unique per Organization

---

## Events

- DepartmentCreated

---

# 53. PUT /organizations/{id}/settings

## Purpose

Update organization configuration.

---

## Request

```json
{
  "timezone":"Asia/Kolkata",
  "language":"en",
  "branding":{
    "primaryColor":"#2563EB"
  }
}
```

---

## Settings Categories

- Branding
- Localization
- Security
- Notifications
- AI Preferences
- Feature Flags

---

## Events

- OrganizationSettingsUpdated

---

# 54. GET /organizations/{id}/usage

## Purpose

Retrieve organization usage metrics.

---

## Response

```json
{
  "users":120,
  "jobs":540,
  "resumes":18200,
  "aiRequests":92000,
  "storageUsedGB":85
}
```

---

# 55. Organization Branding

Supported branding

- Logo
- Company Name
- Primary Color
- Secondary Color
- Theme
- Email Templates
- Custom Domain

---

# 56. Organization Security Policies

Policies include

- Password Complexity
- Session Timeout
- MFA Enforcement
- IP Restrictions
- Allowed Domains
- Login Attempts
- Device Management

---

# 57. Organization Limits

Enterprise quotas

| Resource | Default Limit |
|-----------|---------------|
| Users | Unlimited |
| Jobs | Unlimited |
| Candidates | Unlimited |
| Storage | Plan Dependent |
| AI Requests | Plan Dependent |

---

# 58. Multi-Tenant Isolation

Every organization has isolated

- Users
- Jobs
- Candidates
- AI Memory
- Knowledge Graph
- Documents
- Audit Logs
- Analytics

No organization can access another tenant's data.

---

# 59. Audit Logging

Organization operations log

- User
- Action
- Timestamp
- IP Address
- Changes
- Resource
- Status

All administrative actions are fully auditable.

---

# 60. Part 3 Summary

The Organization APIs provide enterprise-grade tenant management for RecruitGPT, supporting secure multi-tenancy, organization lifecycle management, member administration, department structures, enterprise settings, branding, usage monitoring, and security policies while maintaining strict tenant isolation and comprehensive auditability.

---

## Next

**PART 4 — User APIs (Users, Profiles, Preferences, Roles, Permissions, Activity Logs, Avatars & Account Management).**
# PART 4 — User APIs

---

# PART 4 Overview

The User APIs manage the complete lifecycle of users within RecruitGPT.

Every user belongs to exactly one organization and is assigned one or more roles that determine access permissions.

The User Service is responsible for

- User Management
- User Profiles
- Preferences
- Avatars
- Activity Logs
- User Status
- Roles
- Permissions
- Account Settings
- User Search

All operations are fully audited and organization-scoped.

---

# 61. User Architecture

```text
Organization

↓

Users

↓

Roles

↓

Permissions

↓

Sessions

↓

Activity
```

Every user is isolated within their organization.

---

# 62. User Endpoints

| Method | Endpoint | Description |
|----------|-------------------------|----------------------|
| GET | /users | List Users |
| GET | /users/{id} | Get User |
| POST | /users | Create User |
| PUT | /users/{id} | Update User |
| PATCH | /users/{id} | Partial Update |
| DELETE | /users/{id} | Delete User |
| GET | /users/{id}/activity | Activity Log |
| GET | /users/{id}/permissions | User Permissions |
| PUT | /users/{id}/preferences | Update Preferences |
| POST | /users/{id}/avatar | Upload Avatar |
| DELETE | /users/{id}/avatar | Remove Avatar |
| GET | /users/search | Search Users |

---

# 63. GET /users

## Purpose

Return paginated organization users.

---

## Authentication

JWT Required

---

## Authorization

- Organization Admin
- Recruiter

---

## Query Parameters

```
?page=1

&limit=25

&role=Recruiter

&status=Active
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "name":"John Doe",
      "email":"john@example.com",
      "role":"Recruiter",
      "status":"Active"
    }
  ]
}
```

---

# 64. GET /users/{id}

## Purpose

Retrieve user profile.

---

## Response

```json
{
  "id":"uuid",
  "firstName":"John",
  "lastName":"Doe",
  "email":"john@example.com",
  "role":"Recruiter",
  "department":"Engineering",
  "avatar":"https://..."
}
```

---

## Error Responses

401

403

404

---

# 65. POST /users

## Purpose

Create user.

---

## Authentication

Organization Admin

---

## Request

```json
{
  "firstName":"John",
  "lastName":"Doe",
  "email":"john@example.com",
  "role":"Recruiter",
  "department":"Engineering"
}
```

---

## Validation

- Email Unique
- Valid Role
- Organization Exists

---

## Events

- UserCreated

---

## Database

- users
- audit_logs

---

# 66. PUT /users/{id}

## Purpose

Replace complete user profile.

---

## Request

```json
{
  "firstName":"John",
  "lastName":"Smith",
  "department":"AI"
}
```

---

## Events

- UserUpdated

---

# 67. PATCH /users/{id}

## Purpose

Partially update user.

---

## Example

```json
{
  "department":"Research"
}
```

---

## Events

- UserPartiallyUpdated

---

# 68. DELETE /users/{id}

## Purpose

Deactivate user account.

---

## Authentication

Organization Admin

---

## Response

```json
{
  "success": true
}
```

---

## Notes

Users are soft deleted.

Historical audit data remains.

---

## Events

- UserDeleted

---

# 69. GET /users/{id}/activity

## Purpose

Retrieve user activity timeline.

---

## Response

```json
[
  {
    "action":"Logged In",
    "time":"2026-01-10T08:00:00Z"
  },
  {
    "action":"Created Job",
    "time":"2026-01-10T09:15:00Z"
  }
]
```

---

# 70. GET /users/{id}/permissions

## Purpose

Return effective permissions.

---

## Response

```json
{
  "permissions":[
    "jobs.read",
    "jobs.write",
    "users.read",
    "analytics.read"
  ]
}
```

---

# 71. PUT /users/{id}/preferences

## Purpose

Update user preferences.

---

## Request

```json
{
  "theme":"dark",
  "language":"en",
  "timezone":"Asia/Kolkata",
  "notifications":true
}
```

---

## Preference Categories

- Theme
- Language
- Timezone
- Notification Settings
- Dashboard Layout
- Accessibility
- AI Preferences

---

## Events

- UserPreferencesUpdated

---

# 72. POST /users/{id}/avatar

## Purpose

Upload avatar image.

---

## Content Type

```
multipart/form-data
```

---

## Supported Formats

- PNG
- JPG
- JPEG
- WEBP

---

## Maximum Size

```
5 MB
```

---

## Response

```json
{
  "url":"https://cdn.recruitgpt.com/avatar.png"
}
```

---

## Events

- AvatarUploaded

---

# 73. DELETE /users/{id}/avatar

## Purpose

Remove profile avatar.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- AvatarDeleted

---

# 74. GET /users/search

## Purpose

Search organization users.

---

## Example

```
GET /users/search?q=john
```

---

## Search Fields

- Name
- Email
- Department
- Role
- Status

---

## Response

```json
[
  {
    "id":"uuid",
    "name":"John Doe"
  }
]
```

---

# 75. User Status

Supported states

- Active
- Inactive
- Invited
- Suspended
- Locked
- Deleted

---

# 76. User Preferences

Users may customize

- Theme
- Language
- Timezone
- Dashboard
- Notifications
- Accessibility
- Default AI Model

Preferences remain organization scoped.

---

# 77. User Activity Logging

Every activity stores

- User
- Action
- Resource
- Timestamp
- Device
- IP Address
- Request ID

All activity is immutable.

---

# 78. User Security

Security controls include

- MFA
- Session Timeout
- Password Rotation
- Device Tracking
- Failed Login Detection
- Audit Trail
- RBAC Enforcement

---

# 79. Performance Requirements

Target latency

| Endpoint | P95 |
|-----------|------|
| GET /users | <200 ms |
| GET /users/{id} | <100 ms |
| POST /users | <300 ms |
| Search Users | <250 ms |

---

# 80. Part 4 Summary

The User APIs provide comprehensive enterprise user management, including user lifecycle operations, profiles, preferences, avatars, permissions, activity tracking, and security controls. All operations are organization-scoped, fully audited, RBAC-protected, and optimized for scalable enterprise deployments.

---

## Next

**PART 5 — Role & Permission APIs (RBAC, ABAC, Roles, Permissions, Policies, Access Control Lists & Authorization Management).**
# PART 5 — Role & Permission APIs

---

# PART 5 Overview

The Role & Permission APIs implement enterprise-grade authorization for RecruitGPT.

RecruitGPT uses a hybrid authorization model combining:

- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Resource Ownership
- Organization Isolation
- Policy Evaluation

Authorization is enforced on every protected API request.

---

# 81. Authorization Architecture

```text
User

↓

Authentication

↓

Role

↓

Permission

↓

Policy Engine

↓

Organization Scope

↓

Resource Access
```

Every request passes through the Authorization Service before reaching business logic.

---

# 82. Authorization Endpoints

| Method | Endpoint | Description |
|----------|--------------------------------|-----------------------------|
| GET | /roles | List Roles |
| GET | /roles/{id} | Get Role |
| POST | /roles | Create Role |
| PUT | /roles/{id} | Update Role |
| DELETE | /roles/{id} | Delete Role |
| GET | /permissions | List Permissions |
| POST | /roles/{id}/permissions | Assign Permissions |
| DELETE | /roles/{id}/permissions/{id} | Remove Permission |
| GET | /policies | List Policies |
| POST | /policies | Create Policy |
| GET | /users/{id}/roles | User Roles |
| PUT | /users/{id}/roles | Assign User Role |

---

# 83. Default System Roles

RecruitGPT provides built-in roles.

| Role | Description |
|------|-------------|
| Super Admin | Full Platform Access |
| Organization Admin | Organization Management |
| Recruiter | Recruitment Operations |
| Hiring Manager | Hiring Decisions |
| Interviewer | Conduct Interviews |
| Candidate | Candidate Portal |
| Viewer | Read Only |

System roles cannot be deleted.

---

# 84. GET /roles

## Purpose

Retrieve available roles.

---

## Authentication

JWT Required

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "name":"Recruiter",
      "description":"Recruitment operations"
    }
  ]
}
```

---

# 85. GET /roles/{id}

## Purpose

Retrieve role details.

---

## Response

```json
{
  "id":"uuid",
  "name":"Recruiter",
  "permissions":[
    "jobs.read",
    "jobs.create",
    "candidates.read"
  ]
}
```

---

# 86. POST /roles

## Purpose

Create custom organization role.

---

## Authentication

Organization Admin

---

## Request

```json
{
  "name":"Senior Recruiter",
  "description":"Advanced recruitment privileges"
}
```

---

## Validation

- Unique Name
- Organization Scoped
- Maximum 100 Roles per Organization

---

## Events

- RoleCreated

---

# 87. PUT /roles/{id}

## Purpose

Update role information.

---

## Request

```json
{
  "description":"Updated description"
}
```

---

## Events

- RoleUpdated

---

# 88. DELETE /roles/{id}

## Purpose

Delete custom role.

---

## Restrictions

Cannot delete

- Super Admin
- Organization Admin
- Default System Roles

---

## Events

- RoleDeleted

---

# 89. GET /permissions

## Purpose

Retrieve available permissions.

---

## Response

```json
{
  "permissions":[
    "users.read",
    "users.write",
    "jobs.read",
    "jobs.write",
    "analytics.read"
  ]
}
```

---

# 90. Permission Categories

User Permissions

```
users.read

users.create

users.update

users.delete
```

Job Permissions

```
jobs.read

jobs.create

jobs.update

jobs.delete

jobs.publish
```

Resume Permissions

```
resumes.read

resumes.upload

resumes.delete
```

Candidate Permissions

```
candidates.read

candidates.update

candidates.rank
```

AI Permissions

```
ai.generate

ai.search

ai.interview

ai.analytics
```

Administration

```
admin.settings

admin.billing

admin.audit
```

---

# 91. POST /roles/{id}/permissions

## Purpose

Assign permissions to a role.

---

## Request

```json
{
  "permissions":[
    "jobs.create",
    "jobs.update",
    "candidates.read"
  ]
}
```

---

## Events

- PermissionAssigned

---

# 92. DELETE /roles/{id}/permissions/{id}

## Purpose

Remove permission from role.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- PermissionRemoved

---

# 93. GET /policies

## Purpose

Retrieve authorization policies.

---

## Response

```json
[
  {
    "name":"Organization Isolation",
    "status":"Enabled"
  }
]
```

---

# 94. POST /policies

## Purpose

Create custom authorization policy.

---

## Request

```json
{
  "name":"HR Access",
  "condition":"department == 'HR'"
}
```

---

## Events

- PolicyCreated

---

# 95. GET /users/{id}/roles

## Purpose

Retrieve roles assigned to a user.

---

## Response

```json
{
  "roles":[
    "Recruiter",
    "Interviewer"
  ]
}
```

---

# 96. PUT /users/{id}/roles

## Purpose

Assign roles to a user.

---

## Request

```json
{
  "roles":[
    "Recruiter",
    "Hiring Manager"
  ]
}
```

---

## Events

- UserRoleUpdated

---

# 97. RBAC Evaluation Flow

```text
Request

↓

Authenticate

↓

Load User

↓

Load Roles

↓

Load Permissions

↓

Authorize

↓

Execute API
```

---

# 98. ABAC Rules

Additional attributes evaluated

- Organization
- Department
- Team
- Resource Owner
- Candidate Ownership
- Time Restrictions
- IP Restrictions
- Device Trust

---

# 99. Security Considerations

Authorization enforces

- Least Privilege
- Tenant Isolation
- Policy Validation
- Permission Inheritance
- Audit Logging
- Immutable System Roles
- Secure Default Policies

Every authorization decision is logged.

---

# 100. Part 5 Summary

The Role & Permission APIs provide enterprise-grade authorization through RBAC, ABAC, and policy-based access control. By combining roles, permissions, organizational boundaries, and dynamic policy evaluation, RecruitGPT ensures secure, auditable, and scalable access management across all platform resources.

---

## Next

**PART 6 — Resume APIs (Resume Upload, Parsing, OCR, Embeddings, Versioning, Search, Metadata & AI Processing).**
# PART 6 — Resume APIs

---

# PART 6 Overview

The Resume APIs manage the complete lifecycle of candidate resumes within RecruitGPT.

This module powers the AI recruitment pipeline by handling resume ingestion, parsing, OCR, semantic embeddings, versioning, metadata extraction, indexing, and AI-powered search.

Every uploaded resume becomes an intelligent, searchable enterprise asset.

---

# 101. Resume Architecture

```text
Upload

↓

Validation

↓

Virus Scan

↓

Storage

↓

OCR

↓

Resume Parser

↓

AI Normalization

↓

Embedding Generation

↓

Vector Database

↓

Knowledge Graph

↓

Search Index

↓

Dashboard
```

Every uploaded resume follows this pipeline before becoming available for AI search and ranking.

---

# 102. Resume Endpoints

| Method | Endpoint | Description |
|----------|-------------------------------|-----------------------------|
| GET | /resumes | List Resumes |
| GET | /resumes/{id} | Get Resume |
| POST | /resumes/upload | Upload Resume |
| PUT | /resumes/{id} | Update Resume |
| DELETE | /resumes/{id} | Delete Resume |
| GET | /resumes/{id}/metadata | Resume Metadata |
| GET | /resumes/{id}/parsed | Parsed Resume |
| POST | /resumes/{id}/reparse | Reparse Resume |
| POST | /resumes/{id}/embedding | Generate Embedding |
| GET | /resumes/search | Search Resumes |
| GET | /resumes/{id}/versions | Resume Versions |

---

# 103. GET /resumes

## Purpose

Retrieve paginated resumes.

---

## Authentication

JWT Required

---

## Query Parameters

```text
?page=1

&limit=25

&status=Processed

&candidate=John
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "candidate":"John Doe",
      "status":"Processed",
      "uploadedAt":"2026-01-10T10:00:00Z"
    }
  ]
}
```

---

# 104. GET /resumes/{id}

## Purpose

Retrieve resume details.

---

## Response

```json
{
  "id":"uuid",
  "candidate":"John Doe",
  "fileName":"resume.pdf",
  "status":"Processed",
  "pages":2
}
```

---

# 105. POST /resumes/upload

## Purpose

Upload a new resume.

---

## Authentication

JWT Required

---

## Content Type

```http
multipart/form-data
```

---

## Request

```text
file: resume.pdf

candidateId: uuid
```

---

## Supported Formats

- PDF
- DOC
- DOCX
- TXT

---

## Maximum File Size

```
25 MB
```

---

## Validation

- File Type
- File Size
- Virus Scan
- Duplicate Detection

---

## Success Response

```json
{
  "success":true,
  "resumeId":"uuid",
  "status":"Processing"
}
```

---

## Events Published

- ResumeUploaded
- ResumeProcessingStarted

---

## Background Jobs

- OCR
- Parsing
- Embedding
- Knowledge Graph Update

---

# 106. PUT /resumes/{id}

## Purpose

Update resume metadata.

---

## Request

```json
{
  "candidateName":"John Doe",
  "notes":"Updated profile"
}
```

---

## Events

- ResumeUpdated

---

# 107. DELETE /resumes/{id}

## Purpose

Soft delete resume.

---

## Authentication

Recruiter

---

## Response

```json
{
  "success":true
}
```

---

## Events

- ResumeDeleted

---

# 108. GET /resumes/{id}/metadata

## Purpose

Retrieve extracted metadata.

---

## Response

```json
{
  "pages":2,
  "language":"English",
  "fileSize":"420 KB",
  "uploadedBy":"Recruiter"
}
```

---

# 109. GET /resumes/{id}/parsed

## Purpose

Retrieve structured resume data.

---

## Response

```json
{
  "candidate":{
    "name":"John Doe",
    "email":"john@example.com"
  },
  "skills":[
    "Python",
    "FastAPI",
    "Docker"
  ],
  "education":[
    {
      "degree":"B.Tech"
    }
  ],
  "experience":[
    {
      "company":"OpenAI"
    }
  ]
}
```

---

# 110. POST /resumes/{id}/reparse

## Purpose

Run AI parser again.

---

## Use Cases

- Parser Upgrade
- OCR Improvement
- Manual Correction
- AI Enhancement

---

## Events

- ResumeReparsed

---

# 111. POST /resumes/{id}/embedding

## Purpose

Generate semantic embedding.

---

## Response

```json
{
  "success":true,
  "embeddingStatus":"Completed"
}
```

---

## Background Tasks

- Embedding Generation
- Vector Storage
- Similarity Index

---

## Events

- EmbeddingGenerated

---

# 112. GET /resumes/search

## Purpose

Perform semantic resume search.

---

## Example

```
GET /resumes/search?q=Python Backend Engineer
```

---

## Filters

- Skills
- Experience
- Education
- Certifications
- Location
- Organization

---

## Response

```json
{
  "results":[
    {
      "candidate":"John Doe",
      "score":0.97
    }
  ]
}
```

---

# 113. GET /resumes/{id}/versions

## Purpose

Retrieve version history.

---

## Response

```json
[
  {
    "version":1,
    "createdAt":"2026-01-01"
  },
  {
    "version":2,
    "createdAt":"2026-02-01"
  }
]
```

---

# 114. Resume Processing Pipeline

```text
Upload

↓

Validation

↓

Virus Scan

↓

Storage

↓

OCR

↓

Parsing

↓

Normalization

↓

Embedding

↓

Knowledge Graph

↓

Search Index
```

---

# 115. AI Processing

Every resume automatically performs

- OCR
- Entity Recognition
- Skill Extraction
- Experience Extraction
- Education Detection
- Certification Detection
- Contact Extraction
- Embedding Generation
- Candidate Summary
- Knowledge Graph Linking

---

# 116. Resume Status

Possible states

- Uploaded
- Validating
- Processing
- Parsed
- Indexed
- Ready
- Failed
- Deleted

---

# 117. Security Policies

Resume APIs enforce

- Tenant Isolation
- Virus Scanning
- File Encryption
- Secure Storage
- Signed Download URLs
- Access Logging
- RBAC Authorization

---

# 118. Performance Targets

| Operation | Target |
|------------|---------|
| Upload | <3 sec |
| Parsing | <10 sec |
| OCR | <15 sec |
| Embedding | <20 sec |
| Search | <300 ms |

---

# 119. Audit Logging

Every resume action records

- User
- Organization
- Resume ID
- Timestamp
- Action
- IP Address
- Request ID

All events are immutable.

---

# 120. Part 6 Summary

The Resume APIs provide a complete AI-powered resume management platform, supporting secure uploads, intelligent parsing, OCR, semantic embeddings, version control, metadata extraction, and enterprise-grade search. By integrating with AI services, vector databases, and the knowledge graph, resumes become structured, searchable assets that drive candidate ranking and recruitment intelligence.

---

## Next

**PART 7 — Job APIs (Job Creation, Publishing, Requirements, AI Matching, Lifecycle Management, Search & Analytics).**
# PART 7 — Job APIs

---

# PART 7 Overview

The Job APIs manage the complete lifecycle of job requisitions within RecruitGPT.

These APIs allow recruiters and hiring managers to create, publish, manage, analyze, and archive job postings while enabling AI-powered candidate matching, semantic search, and recruitment analytics.

Every job becomes an intelligent object that integrates with AI agents, embeddings, the knowledge graph, and enterprise workflows.

---

# 121. Job Architecture

```text
Job Creation

↓

Validation

↓

Approval Workflow

↓

Publishing

↓

AI Analysis

↓

Embedding Generation

↓

Knowledge Graph

↓

Candidate Matching

↓

Analytics

↓

Archiving
```

---

# 122. Job Endpoints

| Method | Endpoint | Description |
|----------|------------------------------|-----------------------------|
| GET | /jobs | List Jobs |
| GET | /jobs/{id} | Get Job |
| POST | /jobs | Create Job |
| PUT | /jobs/{id} | Update Job |
| PATCH | /jobs/{id} | Partial Update |
| DELETE | /jobs/{id} | Delete Job |
| POST | /jobs/{id}/publish | Publish Job |
| POST | /jobs/{id}/archive | Archive Job |
| GET | /jobs/search | Search Jobs |
| GET | /jobs/{id}/analytics | Job Analytics |
| GET | /jobs/{id}/matches | AI Candidate Matches |

---

# 123. GET /jobs

## Purpose

Retrieve paginated jobs.

---

## Authentication

JWT Required

---

## Query Parameters

```text
?page=1

&limit=25

&status=Published

&department=Engineering
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "title":"Senior AI Engineer",
      "department":"Engineering",
      "status":"Published",
      "createdAt":"2026-01-10T09:00:00Z"
    }
  ]
}
```

---

# 124. GET /jobs/{id}

## Purpose

Retrieve complete job information.

---

## Response

```json
{
  "id":"uuid",
  "title":"Senior AI Engineer",
  "department":"Engineering",
  "location":"Remote",
  "employmentType":"Full-Time",
  "status":"Published",
  "description":"..."
}
```

---

# 125. POST /jobs

## Purpose

Create a new job.

---

## Authentication

JWT Required

---

## Authorization

- Recruiter
- Hiring Manager
- Organization Admin

---

## Request

```json
{
  "title":"Senior AI Engineer",
  "department":"Engineering",
  "location":"Remote",
  "employmentType":"Full-Time",
  "experience":5,
  "salary":{
    "min":1800000,
    "max":2800000,
    "currency":"INR"
  },
  "skills":[
    "Python",
    "FastAPI",
    "Docker",
    "Kubernetes",
    "LLM"
  ]
}
```

---

## Validation Rules

- Title Required
- Department Required
- Skills Minimum 1
- Salary Range Valid
- Organization Exists

---

## Success Response

HTTP 201

```json
{
  "success":true,
  "jobId":"uuid",
  "status":"Draft"
}
```

---

## Events Published

- JobCreated

---

## Background Tasks

- Generate Embeddings
- Update Knowledge Graph
- AI Skill Extraction

---

# 126. PUT /jobs/{id}

## Purpose

Replace an existing job.

---

## Request

```json
{
  "title":"Principal AI Engineer",
  "experience":7
}
```

---

## Events

- JobUpdated

---

# 127. PATCH /jobs/{id}

## Purpose

Update selected job fields.

---

## Example

```json
{
  "status":"Paused"
}
```

---

## Events

- JobPartiallyUpdated

---

# 128. DELETE /jobs/{id}

## Purpose

Soft delete job.

---

## Response

```json
{
  "success":true
}
```

---

## Notes

Job remains recoverable.

Applications are preserved.

---

## Events

- JobDeleted

---

# 129. POST /jobs/{id}/publish

## Purpose

Publish a draft job.

---

## Validation

- Required Fields Complete
- Approval Granted
- Department Exists

---

## Response

```json
{
  "status":"Published"
}
```

---

## Events

- JobPublished

---

# 130. POST /jobs/{id}/archive

## Purpose

Archive completed job.

---

## Response

```json
{
  "status":"Archived"
}
```

---

## Events

- JobArchived

---

# 131. GET /jobs/search

## Purpose

Search jobs.

---

## Example

```text
GET /jobs/search?q=Backend Engineer
```

---

## Filters

- Department
- Skills
- Experience
- Employment Type
- Location
- Status
- Salary

---

## Response

```json
{
  "results":[
    {
      "title":"Senior Backend Engineer",
      "score":0.96
    }
  ]
}
```

---

# 132. GET /jobs/{id}/analytics

## Purpose

Retrieve job analytics.

---

## Response

```json
{
  "views":4200,
  "applications":560,
  "qualifiedCandidates":91,
  "interviews":18,
  "offers":4
}
```

---

# 133. GET /jobs/{id}/matches

## Purpose

Retrieve AI-ranked candidates.

---

## Response

```json
{
  "matches":[
    {
      "candidate":"John Doe",
      "score":98.2,
      "reason":"Excellent skill alignment"
    }
  ]
}
```

---

# 134. Job Status

Supported states

- Draft
- Pending Approval
- Published
- Paused
- Closed
- Archived
- Deleted

---

# 135. AI Processing

Every job automatically generates

- Semantic Embedding
- Skill Graph
- Requirement Extraction
- Experience Mapping
- Salary Insights
- Candidate Matching Profile
- Knowledge Graph Nodes

---

# 136. Candidate Matching

AI evaluates

- Skill Similarity
- Experience
- Education
- Certifications
- Location
- Seniority
- Resume Embeddings
- Historical Hiring Patterns

Each candidate receives a relevance score between **0–100**.

---

# 137. Performance Targets

| Operation | Target |
|------------|---------|
| Create Job | <300 ms |
| Update Job | <200 ms |
| Search Jobs | <250 ms |
| AI Match Retrieval | <500 ms |
| Analytics | <400 ms |

---

# 138. Security Policies

Job APIs enforce

- RBAC Authorization
- Tenant Isolation
- Input Validation
- Audit Logging
- Organization Scoping
- Version Tracking
- Soft Deletion

---

# 139. Audit Logging

Every job operation records

- User ID
- Organization ID
- Job ID
- Action
- Timestamp
- IP Address
- Request ID

Administrative actions are immutable.

---

# 140. Part 7 Summary

The Job APIs provide complete lifecycle management for enterprise recruitment, supporting job creation, publishing, updates, AI-powered candidate matching, semantic search, analytics, and secure multi-tenant operations. By integrating with embeddings, the knowledge graph, and AI services, each job becomes an intelligent entity that drives automated recruitment workflows.

---

## Next

**PART 8 — Candidate APIs (Candidate Profiles, Applications, Pipeline Management, AI Ranking, Notes, Tags, Timeline & Activity Tracking).**
# PART 8 — Candidate APIs

---

# PART 8 Overview

The Candidate APIs manage the complete lifecycle of candidates within RecruitGPT.

Candidates are central to the recruitment process and are enriched through AI-powered analysis, resume parsing, semantic search, interview evaluation, and hiring pipeline management.

This module manages:

- Candidate Profiles
- Applications
- Resume Association
- AI Ranking
- Hiring Pipeline
- Notes
- Tags
- Timeline
- Activity History
- Interview Status
- Offer Management

Every candidate becomes an intelligent entity connected to the Knowledge Graph and AI Memory.

---

# 141. Candidate Architecture

```text
Resume Upload

↓

Candidate Creation

↓

AI Parsing

↓

Knowledge Graph

↓

Embeddings

↓

Candidate Ranking

↓

Interview

↓

Offer

↓

Hiring Analytics
```

---

# 142. Candidate Endpoints

| Method | Endpoint | Description |
|----------|------------------------------|----------------------------|
| GET | /candidates | List Candidates |
| GET | /candidates/{id} | Candidate Details |
| POST | /candidates | Create Candidate |
| PUT | /candidates/{id} | Update Candidate |
| PATCH | /candidates/{id} | Partial Update |
| DELETE | /candidates/{id} | Delete Candidate |
| GET | /candidates/search | Search Candidates |
| GET | /candidates/{id}/timeline | Timeline |
| POST | /candidates/{id}/notes | Add Note |
| GET | /candidates/{id}/notes | List Notes |
| POST | /candidates/{id}/tags | Add Tags |
| GET | /candidates/{id}/ranking | AI Ranking |
| GET | /candidates/{id}/applications | Applications |

---

# 143. GET /candidates

## Purpose

Retrieve organization candidates.

---

## Authentication

JWT Required

---

## Query Parameters

```text
?page=1

&limit=25

&status=Interview

&location=Remote
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "name":"John Doe",
      "email":"john@example.com",
      "status":"Interview",
      "score":96.8
    }
  ]
}
```

---

# 144. GET /candidates/{id}

## Purpose

Retrieve candidate profile.

---

## Response

```json
{
  "id":"uuid",
  "name":"John Doe",
  "email":"john@example.com",
  "phone":"+91XXXXXXXXXX",
  "location":"Bangalore",
  "experience":5,
  "skills":[
    "Python",
    "FastAPI",
    "Docker"
  ]
}
```

---

# 145. POST /candidates

## Purpose

Create candidate profile.

---

## Authentication

JWT Required

---

## Request

```json
{
  "firstName":"John",
  "lastName":"Doe",
  "email":"john@example.com",
  "phone":"+91XXXXXXXXXX",
  "location":"Bangalore"
}
```

---

## Validation

- Email Unique
- Valid Phone
- Organization Exists

---

## Success Response

```json
{
  "success":true,
  "candidateId":"uuid"
}
```

---

## Events

- CandidateCreated

---

# 146. PUT /candidates/{id}

## Purpose

Replace candidate profile.

---

## Events

- CandidateUpdated

---

# 147. PATCH /candidates/{id}

## Purpose

Update selected candidate fields.

---

## Example

```json
{
  "location":"Chennai"
}
```

---

## Events

- CandidatePartiallyUpdated

---

# 148. DELETE /candidates/{id}

## Purpose

Soft delete candidate.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- CandidateDeleted

---

# 149. GET /candidates/search

## Purpose

Search candidates.

---

## Example

```
GET /candidates/search?q=Python Developer
```

---

## Filters

- Skills
- Experience
- Education
- Certifications
- Status
- Location
- AI Score

---

## Response

```json
{
  "results":[
    {
      "candidate":"John Doe",
      "score":97.6
    }
  ]
}
```

---

# 150. GET /candidates/{id}/timeline

## Purpose

Retrieve candidate timeline.

---

## Response

```json
[
  {
    "date":"2026-01-01",
    "event":"Resume Uploaded"
  },
  {
    "date":"2026-01-03",
    "event":"Interview Scheduled"
  }
]
```

---

# 151. POST /candidates/{id}/notes

## Purpose

Add recruiter note.

---

## Request

```json
{
  "note":"Excellent communication skills."
}
```

---

## Events

- CandidateNoteAdded

---

# 152. GET /candidates/{id}/notes

## Purpose

Retrieve recruiter notes.

---

## Response

```json
[
  {
    "author":"Recruiter",
    "note":"Strong backend skills."
  }
]
```

---

# 153. POST /candidates/{id}/tags

## Purpose

Assign candidate tags.

---

## Request

```json
{
  "tags":[
    "Top Talent",
    "Python",
    "Backend"
  ]
}
```

---

## Events

- CandidateTagsUpdated

---

# 154. GET /candidates/{id}/ranking

## Purpose

Retrieve AI ranking.

---

## Response

```json
{
  "overallScore":98.4,
  "skillMatch":99,
  "experienceMatch":97,
  "cultureFit":94,
  "recommendation":"Highly Recommended"
}
```

---

## AI Evaluation

Ranking considers

- Skills
- Experience
- Education
- Certifications
- Job Match
- Resume Quality
- Interview Results
- Historical Hiring Success

---

# 155. GET /candidates/{id}/applications

## Purpose

Retrieve candidate applications.

---

## Response

```json
[
  {
    "job":"Senior AI Engineer",
    "status":"Interview",
    "appliedAt":"2026-01-10"
  }
]
```

---

# 156. Candidate Pipeline

Supported stages

- Applied
- Screening
- Shortlisted
- Technical Interview
- HR Interview
- Final Interview
- Offer
- Hired
- Rejected
- Archived

---

# 157. AI Candidate Intelligence

Automatically generated

- Candidate Summary
- Skill Graph
- Resume Embedding
- Interview Readiness
- Job Match Score
- Hiring Recommendation
- Career Progression
- Knowledge Graph Links

---

# 158. Security Policies

Candidate APIs enforce

- Tenant Isolation
- RBAC Authorization
- Audit Logging
- PII Encryption
- Secure File Access
- Data Masking
- GDPR Compliance
- Soft Deletion

---

# 159. Performance Targets

| Operation | Target |
|------------|---------|
| Candidate Search | <250 ms |
| Candidate Details | <150 ms |
| AI Ranking | <500 ms |
| Timeline | <200 ms |
| Notes | <150 ms |

---

# 160. Part 8 Summary

The Candidate APIs provide comprehensive enterprise candidate management, supporting AI-powered ranking, semantic search, application tracking, recruiter collaboration, hiring pipelines, notes, tags, timelines, and intelligent recommendations. Every candidate is securely managed, fully auditable, and enriched through AI to enable faster, data-driven hiring decisions.

---

## Next

**PART 9 — AI APIs (AI Ranking, Resume Analysis, Interview Generation, Summarization, Recommendations, Explainability & Multi-Model Inference).**
# PART 9 — AI APIs

---

# PART 9 Overview

The AI APIs are the intelligence layer of RecruitGPT.

These APIs orchestrate Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), semantic search, embeddings, reasoning agents, and AI workflows to automate and enhance the recruitment lifecycle.

The AI Service supports multiple providers through a unified abstraction layer, enabling seamless switching between OpenAI, Claude, Gemini, DeepSeek, Ollama, and future AI providers.

Core AI capabilities include:

- Resume Analysis
- Candidate Ranking
- Job Matching
- Interview Question Generation
- Candidate Summarization
- Skill Gap Analysis
- Hiring Recommendations
- Explainable AI (XAI)
- AI Chat Assistant
- Multi-Agent Collaboration

Every AI response is traceable, auditable, and organization-scoped.

---

# 161. AI Architecture

```text
User Request

↓

API Gateway

↓

AI Orchestrator

↓

Prompt Builder

↓

Memory Service

↓

Knowledge Graph

↓

Vector Database

↓

Provider Router

↓

LLM

↓

Response Validator

↓

Audit Log

↓

API Response
```

---

# 162. AI Endpoints

| Method | Endpoint | Description |
|----------|-----------------------------------|-----------------------------|
| POST | /ai/rank-candidate | AI Candidate Ranking |
| POST | /ai/match-job | Job Matching |
| POST | /ai/analyze-resume | Resume Analysis |
| POST | /ai/summarize | Candidate Summary |
| POST | /ai/interview/questions | Generate Interview Questions |
| POST | /ai/interview/evaluate | Evaluate Interview |
| POST | /ai/recommendations | Hiring Recommendation |
| POST | /ai/skill-gap | Skill Gap Analysis |
| POST | /ai/chat | AI Assistant |
| POST | /ai/explain | Explain AI Decision |
| GET | /ai/models | Available Models |
| GET | /ai/providers | Available Providers |

---

# 163. POST /ai/rank-candidate

## Purpose

Rank one or more candidates against a job using AI.

---

## Authentication

JWT Required

---

## Request

```json
{
  "jobId":"uuid",
  "candidateIds":[
    "uuid1",
    "uuid2",
    "uuid3"
  ]
}
```

---

## Success Response

```json
{
  "success":true,
  "results":[
    {
      "candidateId":"uuid1",
      "score":98.7,
      "recommendation":"Highly Recommended"
    }
  ]
}
```

---

## AI Pipeline

- Resume Embedding
- Job Embedding
- Semantic Similarity
- Skill Matching
- Experience Analysis
- Education Matching
- Final AI Ranking

---

## Events

- CandidateRanked

---

# 164. POST /ai/match-job

## Purpose

Match a candidate against available jobs.

---

## Request

```json
{
  "candidateId":"uuid"
}
```

---

## Response

```json
{
  "matches":[
    {
      "jobId":"uuid",
      "title":"Senior AI Engineer",
      "score":97.1
    }
  ]
}
```

---

# 165. POST /ai/analyze-resume

## Purpose

Perform AI analysis of a resume.

---

## Request

```json
{
  "resumeId":"uuid"
}
```

---

## Response

```json
{
  "summary":"Experienced backend engineer...",
  "skills":[
    "Python",
    "Docker",
    "FastAPI"
  ],
  "experience":6
}
```

---

## AI Tasks

- Resume Parsing
- Entity Recognition
- Skill Extraction
- Experience Detection
- Career Summary

---

# 166. POST /ai/summarize

## Purpose

Generate AI summary for candidate.

---

## Request

```json
{
  "candidateId":"uuid"
}
```

---

## Response

```json
{
  "summary":"Senior Python engineer with six years of backend development experience specializing in AI infrastructure."
}
```

---

# 167. POST /ai/interview/questions

## Purpose

Generate interview questions.

---

## Request

```json
{
  "jobId":"uuid",
  "difficulty":"Senior",
  "count":10
}
```

---

## Response

```json
{
  "questions":[
    "Explain dependency injection in FastAPI.",
    "How does Docker networking work?"
  ]
}
```

---

## AI Categories

- Technical
- Behavioral
- Leadership
- Coding
- System Design
- HR

---

# 168. POST /ai/interview/evaluate

## Purpose

Evaluate interview responses.

---

## Request

```json
{
  "candidateId":"uuid",
  "transcript":"..."
}
```

---

## Response

```json
{
  "overallScore":91,
  "communication":94,
  "technical":89,
  "recommendation":"Proceed"
}
```

---

## AI Evaluation

- Communication
- Confidence
- Technical Accuracy
- Leadership
- Problem Solving

---

# 169. POST /ai/recommendations

## Purpose

Generate hiring recommendations.

---

## Response

```json
{
  "recommendation":"Hire",
  "confidence":96,
  "reason":"Excellent technical alignment."
}
```

---

# 170. POST /ai/skill-gap

## Purpose

Compare candidate skills against job requirements.

---

## Request

```json
{
  "candidateId":"uuid",
  "jobId":"uuid"
}
```

---

## Response

```json
{
  "matchedSkills":18,
  "missingSkills":[
    "Terraform",
    "AWS Lambda"
  ]
}
```

---

# 171. POST /ai/chat

## Purpose

Enterprise AI Assistant.

---

## Request

```json
{
  "message":"Find the best backend engineers with Kubernetes experience."
}
```

---

## Response

```json
{
  "response":"I found 24 candidates matching your request."
}
```

---

## AI Features

- Context Memory
- RAG
- Tool Calling
- Multi-Agent Planning
- Enterprise Search

---

# 172. POST /ai/explain

## Purpose

Provide explainability for AI decisions.

---

## Request

```json
{
  "candidateId":"uuid",
  "jobId":"uuid"
}
```

---

## Response

```json
{
  "reasoning":[
    "Strong Python experience",
    "Excellent architecture skills",
    "Relevant domain expertise"
  ]
}
```

---

# 173. GET /ai/models

## Purpose

Retrieve supported AI models.

---

## Response

```json
{
  "models":[
    "GPT-5",
    "Claude Opus",
    "Gemini",
    "DeepSeek",
    "Llama",
    "Qwen",
    "Mistral"
  ]
}
```

---

# 174. GET /ai/providers

## Purpose

Retrieve configured AI providers.

---

## Response

```json
{
  "providers":[
    "OpenAI",
    "Anthropic",
    "Google",
    "DeepSeek",
    "Ollama"
  ]
}
```

---

# 175. AI Provider Routing

Provider selection considers

- Cost
- Latency
- Availability
- Model Capability
- Token Limits
- Organization Preferences

Automatic failover is supported.

---

# 176. AI Safety Policies

All AI requests undergo

- Prompt Validation
- Prompt Injection Detection
- PII Redaction
- Output Moderation
- Hallucination Detection
- Organization Isolation
- Audit Logging

---

# 177. Performance Targets

| Operation | Target |
|------------|---------|
| Resume Analysis | <5 sec |
| Candidate Ranking | <3 sec |
| Interview Generation | <4 sec |
| AI Chat | <5 sec |
| Skill Gap Analysis | <2 sec |

---

# 178. Audit Logging

Every AI request stores

- User ID
- Organization ID
- Model Used
- Provider
- Tokens Consumed
- Cost
- Latency
- Request ID
- Timestamp

AI outputs remain fully traceable.

---

# 179. AI Error Codes

| Code | Description |
|--------|-----------------------------|
| AI_PROVIDER_UNAVAILABLE | Provider Offline |
| MODEL_NOT_FOUND | Invalid Model |
| TOKEN_LIMIT_EXCEEDED | Prompt Too Large |
| AI_TIMEOUT | Request Timed Out |
| AI_VALIDATION_FAILED | Unsafe Prompt |
| AI_RATE_LIMIT | Rate Limit Exceeded |

---

# 180. Part 9 Summary

The AI APIs provide RecruitGPT's intelligent capabilities, including resume analysis, candidate ranking, interview generation, hiring recommendations, semantic matching, explainable AI, and conversational assistance. Through a provider-agnostic architecture, robust safety controls, and enterprise-grade observability, these APIs enable scalable, secure, and auditable AI-powered recruitment workflows.

---

## Next

**PART 10 — Multi-Agent APIs (Planner, Reasoner, Reflection, Consensus, Memory, Knowledge Retrieval, Tool Execution & Agent Orchestration).**
# PART 10 — Multi-Agent APIs

---

# PART 10 Overview

The Multi-Agent APIs coordinate autonomous AI agents that collaborate to perform complex recruitment workflows.

Unlike single-model inference, RecruitGPT uses specialized AI agents with distinct responsibilities. These agents communicate, share context, reason collectively, and execute tools to solve multi-step tasks.

The Multi-Agent Service manages:

- Task Planning
- Agent Orchestration
- Tool Execution
- Reflection
- Consensus
- Memory
- Knowledge Retrieval
- Workflow Automation
- Decision Making
- Explainability

Every agent interaction is observable, auditable, and organization-scoped.

---

# 181. Multi-Agent Architecture

```text
User Request

↓

Planner Agent

↓

Task Decomposition

↓

Research Agent

↓

Knowledge Graph

↓

Vector Search

↓

Reasoning Agent

↓

Reflection Agent

↓

Consensus Agent

↓

Response Generator

↓

API Response
```

---

# 182. Multi-Agent Endpoints

| Method | Endpoint | Description |
|----------|------------------------------------|----------------------------|
| POST | /agents/execute | Execute Multi-Agent Workflow |
| POST | /agents/planner | Generate Execution Plan |
| POST | /agents/reason | Reason About Task |
| POST | /agents/reflect | Self Reflection |
| POST | /agents/consensus | Agent Consensus |
| POST | /agents/retrieve | Knowledge Retrieval |
| POST | /agents/tools | Execute Tool |
| POST | /agents/memory | Query Agent Memory |
| GET | /agents | List Agents |
| GET | /agents/status | Agent Status |
| GET | /agents/workflows | Active Workflows |

---

# 183. POST /agents/execute

## Purpose

Execute a complete multi-agent workflow.

---

## Authentication

JWT Required

---

## Request

```json
{
  "goal":"Find the top 10 backend engineers for the Senior AI Engineer position."
}
```

---

## Success Response

```json
{
  "workflowId":"uuid",
  "status":"Completed",
  "result":"10 candidates identified."
}
```

---

## Workflow

- Planning
- Retrieval
- Reasoning
- Tool Execution
- Validation
- Reflection
- Final Response

---

## Events

- WorkflowStarted
- WorkflowCompleted

---

# 184. POST /agents/planner

## Purpose

Generate an execution plan.

---

## Request

```json
{
  "goal":"Rank candidates for Job #123"
}
```

---

## Response

```json
{
  "steps":[
    "Retrieve resumes",
    "Generate embeddings",
    "Rank candidates",
    "Generate report"
  ]
}
```

---

# 185. POST /agents/reason

## Purpose

Perform structured reasoning.

---

## Request

```json
{
  "context":"Candidate ranking results"
}
```

---

## Response

```json
{
  "reasoning":"Candidate A demonstrates stronger alignment due to..."
}
```

---

# 186. POST /agents/reflect

## Purpose

Evaluate and improve AI output.

---

## Response

```json
{
  "reflection":"Response quality is high with minor confidence adjustments."
}
```

---

## Reflection Checks

- Accuracy
- Completeness
- Bias Detection
- Consistency
- Confidence

---

# 187. POST /agents/consensus

## Purpose

Merge decisions from multiple agents.

---

## Response

```json
{
  "decision":"Proceed with Candidate A",
  "confidence":96
}
```

---

# 188. POST /agents/retrieve

## Purpose

Retrieve enterprise knowledge.

---

## Sources

- Knowledge Graph
- Vector Database
- Resume Store
- Job Repository
- Organization Memory

---

## Response

```json
{
  "documents":18
}
```

---

# 189. POST /agents/tools

## Purpose

Execute an external tool.

---

## Request

```json
{
  "tool":"ResumeParser",
  "input":"resume.pdf"
}
```

---

## Response

```json
{
  "status":"Completed"
}
```

---

## Supported Tools

- Resume Parser
- OCR
- Search
- Email
- Calendar
- Analytics
- Database
- Knowledge Graph

---

# 190. POST /agents/memory

## Purpose

Retrieve long-term agent memory.

---

## Request

```json
{
  "query":"Previous hiring decisions for backend engineers"
}
```

---

## Response

```json
{
  "memories":[
    "Backend candidates with Kubernetes experience received higher interview success rates."
  ]
}
```

---

# 191. GET /agents

## Purpose

Retrieve available AI agents.

---

## Response

```json
{
  "agents":[
    "Planner",
    "Research",
    "Reasoning",
    "Reflection",
    "Consensus",
    "Memory",
    "Reporting"
  ]
}
```

---

# 192. GET /agents/status

## Purpose

Retrieve runtime status.

---

## Response

```json
{
  "activeAgents":7,
  "queuedTasks":3,
  "runningWorkflows":2
}
```

---

# 193. GET /agents/workflows

## Purpose

Retrieve workflow executions.

---

## Response

```json
[
  {
    "workflowId":"uuid",
    "status":"Completed",
    "duration":"8.2 sec"
  }
]
```

---

# 194. Agent Types

RecruitGPT includes

- Planner Agent
- Research Agent
- Retrieval Agent
- Resume Agent
- Ranking Agent
- Interview Agent
- Reporting Agent
- Reflection Agent
- Consensus Agent
- Memory Agent

Each agent has specialized responsibilities.

---

# 195. Workflow States

Supported states

- Pending
- Planning
- Running
- Waiting
- Reviewing
- Completed
- Failed
- Cancelled

---

# 196. Agent Communication

Agents communicate through

- Event Bus
- Shared Memory
- Context Store
- Knowledge Graph
- Tool Results

No direct coupling exists between agents.

---

# 197. Security Policies

Multi-Agent APIs enforce

- Organization Isolation
- RBAC Authorization
- Tool Allow Lists
- Memory Isolation
- Prompt Validation
- Audit Logging
- Rate Limiting

Agents never access another organization's context.

---

# 198. Performance Targets

| Operation | Target |
|------------|---------|
| Planning | <1 sec |
| Retrieval | <500 ms |
| Reasoning | <3 sec |
| Reflection | <2 sec |
| Consensus | <1 sec |
| Workflow Completion | <10 sec |

---

# 199. Audit Logging

Every workflow records

- Workflow ID
- User ID
- Organization ID
- Agents Invoked
- Tools Used
- Duration
- Token Usage
- Cost
- Timestamp
- Final Decision

---

# 200. Part 10 Summary

The Multi-Agent APIs provide the orchestration layer for RecruitGPT's autonomous AI ecosystem. By coordinating specialized agents for planning, retrieval, reasoning, reflection, consensus, and memory, these APIs enable complex recruitment workflows that are intelligent, explainable, scalable, and fully auditable while maintaining strict enterprise security and tenant isolation.

---

## Next

**PART 11 — Search APIs (Semantic Search, Hybrid Search, Full-Text Search, Vector Search, Filters, Autocomplete & Enterprise Knowledge Retrieval).**
# PART 11 — Search APIs

---

# PART 11 Overview

The Search APIs provide enterprise-grade search capabilities across all RecruitGPT resources.

RecruitGPT combines multiple search strategies to deliver highly accurate and intelligent results.

Supported search technologies include:

- Full-Text Search
- Semantic Search
- Vector Search
- Hybrid Search
- Metadata Search
- Faceted Search
- Autocomplete
- Knowledge Graph Search
- AI Retrieval (RAG)

Every search request is organization-scoped and respects RBAC permissions.

---

# 201. Search Architecture

```text
Search Query

↓

Query Parser

↓

Permission Filter

↓

Hybrid Search Engine

├── Full Text Search

├── Vector Search

├── Knowledge Graph

└── Metadata Search

↓

Ranking Engine

↓

AI Re-ranking

↓

Response
```

---

# 202. Search Endpoints

| Method | Endpoint | Description |
|----------|------------------------------|----------------------------|
| GET | /search | Global Search |
| GET | /search/jobs | Search Jobs |
| GET | /search/candidates | Search Candidates |
| GET | /search/resumes | Search Resumes |
| GET | /search/users | Search Users |
| GET | /search/knowledge | Search Knowledge Graph |
| GET | /search/vector | Semantic Vector Search |
| GET | /search/autocomplete | Autocomplete |
| POST | /search/hybrid | Hybrid Search |
| POST | /search/rerank | AI Re-ranking |

---

# 203. GET /search

## Purpose

Perform enterprise-wide global search.

---

## Authentication

JWT Required

---

## Example

```http
GET /search?q=Senior Python Developer
```

---

## Query Parameters

```text
q

page

limit

sort

filters
```

---

## Success Response

```json
{
  "success":true,
  "results":[
    {
      "type":"Candidate",
      "id":"uuid",
      "title":"John Doe",
      "score":0.98
    },
    {
      "type":"Job",
      "id":"uuid",
      "title":"Senior AI Engineer",
      "score":0.95
    }
  ]
}
```

---

# 204. GET /search/jobs

## Purpose

Search job postings.

---

## Filters

- Department
- Skills
- Status
- Location
- Employment Type
- Salary

---

## Response

```json
{
  "jobs":[
    {
      "title":"Backend Engineer",
      "score":96
    }
  ]
}
```

---

# 205. GET /search/candidates

## Purpose

Search candidate profiles.

---

## Filters

- Skills
- Experience
- Certifications
- Location
- Interview Status
- AI Score

---

## Response

```json
{
  "candidates":[
    {
      "name":"John Doe",
      "score":98
    }
  ]
}
```

---

# 206. GET /search/resumes

## Purpose

Search uploaded resumes.

---

## Supported Searches

- Keywords
- Skills
- Education
- Companies
- Certifications
- Projects

---

## Response

```json
{
  "results":[
    {
      "resumeId":"uuid",
      "candidate":"John Doe"
    }
  ]
}
```

---

# 207. GET /search/users

## Purpose

Search organization users.

---

## Search Fields

- Name
- Email
- Department
- Role
- Status

---

## Response

```json
{
  "users":[
    {
      "name":"Jane Smith"
    }
  ]
}
```

---

# 208. GET /search/knowledge

## Purpose

Search enterprise knowledge graph.

---

## Response

```json
{
  "entities":[
    {
      "type":"Skill",
      "name":"FastAPI"
    }
  ]
}
```

---

# 209. GET /search/vector

## Purpose

Perform semantic vector search.

---

## Example

```http
GET /search/vector?q=AI Backend Developer
```

---

## Response

```json
{
  "matches":[
    {
      "candidate":"John Doe",
      "similarity":0.97
    }
  ]
}
```

---

# 210. GET /search/autocomplete

## Purpose

Provide real-time autocomplete suggestions.

---

## Example

```http
GET /search/autocomplete?q=py
```

---

## Response

```json
{
  "suggestions":[
    "Python",
    "PyTorch",
    "PySpark"
  ]
}
```

---

# 211. POST /search/hybrid

## Purpose

Execute hybrid search combining keyword and semantic search.

---

## Request

```json
{
  "query":"Senior Python Engineer",
  "filters":{
    "location":"Remote"
  }
}
```

---

## Response

```json
{
  "results":[
    {
      "id":"uuid",
      "score":98.6
    }
  ]
}
```

---

# 212. POST /search/rerank

## Purpose

Re-rank search results using AI.

---

## Request

```json
{
  "query":"Python Engineer",
  "resultIds":[
    "1",
    "2",
    "3"
  ]
}
```

---

## Response

```json
{
  "reranked":[
    {
      "id":"2",
      "score":99.1
    }
  ]
}
```

---

# 213. Search Ranking Factors

Search relevance considers

- Keyword Match
- Semantic Similarity
- Skill Match
- Experience
- Popularity
- Freshness
- User Permissions
- Organization Scope
- AI Confidence

---

# 214. Search Filters

Supported filters

- Organization
- Department
- Status
- Skills
- Experience
- Date Range
- Location
- Tags
- Categories
- AI Score

Filters may be combined.

---

# 215. Search Indexes

RecruitGPT maintains indexes for

- Jobs
- Candidates
- Resumes
- Users
- Interviews
- Knowledge Graph
- Documents
- AI Memory

Indexes are updated asynchronously.

---

# 216. Search Performance

Caching layers

- Redis
- Vector Cache
- Query Cache
- Embedding Cache

Frequently executed queries are automatically cached.

---

# 217. Security Policies

Search APIs enforce

- Tenant Isolation
- RBAC Authorization
- Row-Level Security
- Result Filtering
- Audit Logging
- Query Validation

Users only receive results they are authorized to access.

---

# 218. Performance Targets

| Operation | Target |
|------------|---------|
| Global Search | <300 ms |
| Semantic Search | <500 ms |
| Vector Search | <400 ms |
| Autocomplete | <100 ms |
| AI Re-ranking | <1 sec |

---

# 219. Audit Logging

Every search request records

- User ID
- Organization ID
- Query
- Filters
- Search Type
- Results Count
- Duration
- Timestamp
- Request ID

Search history supports analytics and compliance.

---

# 220. Part 11 Summary

The Search APIs provide intelligent enterprise search capabilities by combining keyword search, semantic vector search, hybrid retrieval, AI re-ranking, and knowledge graph exploration. With organization-aware security, advanced filtering, and high-performance indexing, RecruitGPT delivers fast, relevant, and explainable search experiences across all recruitment data.

---

## Next

**PART 12 — Interview APIs (Interview Scheduling, Question Generation, Evaluation, Feedback, Scoring, Video Integration & AI Interview Analysis).**
# PART 12 — Interview APIs

---

# PART 12 Overview

The Interview APIs manage the complete interview lifecycle within RecruitGPT.

These APIs support scheduling, AI-generated interview questions, interviewer assignments, candidate evaluations, structured feedback, scorecards, video integrations, and AI-powered interview analysis.

The Interview Service integrates with calendars, video conferencing platforms, AI agents, and hiring workflows to streamline enterprise recruitment.

---

# 221. Interview Architecture

```text
Candidate

↓

Interview Scheduling

↓

Calendar Integration

↓

Video Meeting

↓

Question Generation

↓

Interview Session

↓

Evaluation

↓

AI Analysis

↓

Scorecard

↓

Hiring Decision
```

---

# 222. Interview Endpoints

| Method | Endpoint | Description |
|----------|-------------------------------------|----------------------------|
| GET | /interviews | List Interviews |
| GET | /interviews/{id} | Get Interview |
| POST | /interviews | Schedule Interview |
| PUT | /interviews/{id} | Update Interview |
| DELETE | /interviews/{id} | Cancel Interview |
| POST | /interviews/{id}/questions | Generate Questions |
| POST | /interviews/{id}/evaluate | Submit Evaluation |
| GET | /interviews/{id}/scorecard | Interview Scorecard |
| GET | /interviews/{id}/feedback | Interview Feedback |
| POST | /interviews/{id}/analysis | AI Interview Analysis |
| GET | /interviews/calendar | Calendar View |

---

# 223. GET /interviews

## Purpose

Retrieve scheduled interviews.

---

## Authentication

JWT Required

---

## Query Parameters

```text
?page=1

&limit=25

&status=Scheduled

&date=2026-02-10
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "candidate":"John Doe",
      "job":"Senior AI Engineer",
      "status":"Scheduled",
      "scheduledAt":"2026-02-10T10:00:00Z"
    }
  ]
}
```

---

# 224. GET /interviews/{id}

## Purpose

Retrieve interview details.

---

## Response

```json
{
  "id":"uuid",
  "candidate":"John Doe",
  "job":"Senior AI Engineer",
  "type":"Technical",
  "duration":60,
  "status":"Scheduled",
  "meetingUrl":"https://..."
}
```

---

# 225. POST /interviews

## Purpose

Schedule a new interview.

---

## Authentication

JWT Required

---

## Authorization

- Recruiter
- Hiring Manager

---

## Request

```json
{
  "candidateId":"uuid",
  "jobId":"uuid",
  "interviewType":"Technical",
  "scheduledAt":"2026-02-10T10:00:00Z",
  "duration":60,
  "interviewers":[
    "uuid1",
    "uuid2"
  ]
}
```

---

## Validation

- Candidate Exists
- Job Exists
- Interviewers Available
- No Calendar Conflict
- Organization Scope

---

## Success Response

```json
{
  "success":true,
  "interviewId":"uuid",
  "status":"Scheduled"
}
```

---

## Events

- InterviewScheduled
- CalendarInvitesSent

---

# 226. PUT /interviews/{id}

## Purpose

Update interview information.

---

## Request

```json
{
  "scheduledAt":"2026-02-11T11:00:00Z",
  "duration":90
}
```

---

## Events

- InterviewUpdated

---

# 227. DELETE /interviews/{id}

## Purpose

Cancel interview.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- InterviewCancelled
- CalendarInviteCancelled

---

# 228. POST /interviews/{id}/questions

## Purpose

Generate AI interview questions.

---

## Request

```json
{
  "difficulty":"Senior",
  "count":10,
  "categories":[
    "Technical",
    "System Design"
  ]
}
```

---

## Response

```json
{
  "questions":[
    {
      "id":"q1",
      "text":"Explain dependency injection in FastAPI."
    },
    {
      "id":"q2",
      "text":"Describe Kubernetes deployment strategies."
    }
  ]
}
```

---

## AI Categories

- Technical
- Behavioral
- Leadership
- Coding
- Architecture
- HR
- Problem Solving

---

# 229. POST /interviews/{id}/evaluate

## Purpose

Submit interviewer evaluation.

---

## Request

```json
{
  "technicalScore":90,
  "communicationScore":88,
  "problemSolvingScore":92,
  "recommendation":"Proceed",
  "comments":"Strong backend expertise."
}
```

---

## Response

```json
{
  "success":true
}
```

---

## Events

- InterviewEvaluated

---

# 230. GET /interviews/{id}/scorecard

## Purpose

Retrieve interview scorecard.

---

## Response

```json
{
  "overallScore":91,
  "technical":90,
  "communication":88,
  "leadership":85,
  "problemSolving":92
}
```

---

# 231. GET /interviews/{id}/feedback

## Purpose

Retrieve interviewer feedback.

---

## Response

```json
{
  "feedback":[
    {
      "interviewer":"Jane Smith",
      "recommendation":"Hire",
      "comments":"Excellent system design skills."
    }
  ]
}
```

---

# 232. POST /interviews/{id}/analysis

## Purpose

Generate AI interview analysis.

---

## Request

```json
{
  "transcript":"Interview transcript..."
}
```

---

## Response

```json
{
  "summary":"Candidate demonstrated excellent backend engineering knowledge.",
  "strengths":[
    "System Design",
    "Python",
    "Communication"
  ],
  "weaknesses":[
    "Cloud Security"
  ],
  "recommendation":"Strong Hire",
  "confidence":97
}
```

---

## AI Analysis Includes

- Communication Assessment
- Technical Evaluation
- Confidence Estimation
- Skill Coverage
- Behavioral Signals
- Hiring Recommendation

---

# 233. GET /interviews/calendar

## Purpose

Retrieve interview calendar.

---

## Response

```json
{
  "events":[
    {
      "title":"Technical Interview",
      "start":"2026-02-10T10:00:00Z",
      "end":"2026-02-10T11:00:00Z"
    }
  ]
}
```

---

# 234. Interview Types

Supported interview formats

- HR Screening
- Technical Interview
- Coding Interview
- System Design
- Behavioral Interview
- Managerial Round
- Final Round
- Executive Interview

---

# 235. Interview Status

Supported states

- Scheduled
- Confirmed
- In Progress
- Completed
- Cancelled
- Rescheduled
- No Show

---

# 236. Calendar Integrations

Supported integrations

- Google Calendar
- Microsoft Outlook
- Microsoft Teams
- Zoom
- Google Meet
- Webex

Calendar synchronization is automatic.

---

# 237. Security Policies

Interview APIs enforce

- RBAC Authorization
- Tenant Isolation
- Secure Meeting Links
- Transcript Encryption
- Audit Logging
- PII Protection

Interview recordings and transcripts are encrypted at rest.

---

# 238. Performance Targets

| Operation | Target |
|------------|---------|
| Schedule Interview | <500 ms |
| Generate Questions | <3 sec |
| Submit Evaluation | <300 ms |
| AI Analysis | <5 sec |
| Calendar View | <200 ms |

---

# 239. Audit Logging

Every interview operation records

- Interview ID
- Candidate ID
- Job ID
- Interviewer ID
- Organization ID
- Action
- Timestamp
- Request ID

All interview activities are fully traceable.

---

# 240. Part 12 Summary

The Interview APIs provide end-to-end interview management, supporting scheduling, AI-generated questions, structured evaluations, scorecards, feedback, calendar integrations, and intelligent interview analysis. By combining enterprise scheduling with AI-powered assessment and secure workflow management, RecruitGPT enables consistent, efficient, and data-driven hiring decisions.

---

## Next

**PART 13 — Analytics APIs (Dashboards, KPIs, Hiring Metrics, AI Insights, Reports, Forecasting & Executive Analytics).**
# PART 13 — Analytics APIs

---

# PART 13 Overview

The Analytics APIs provide enterprise-grade reporting, dashboards, KPIs, hiring intelligence, AI insights, forecasting, and executive analytics for RecruitGPT.

These APIs aggregate operational and AI-generated data into actionable metrics that help recruiters, hiring managers, and executives optimize hiring performance.

The Analytics Service powers:

- Executive Dashboards
- Hiring KPIs
- Recruitment Funnel Analytics
- AI Insights
- Candidate Analytics
- Recruiter Performance
- Time-to-Hire Metrics
- Diversity Analytics
- Forecasting
- Custom Reports

All analytics are organization-scoped and role-aware.

---

# 241. Analytics Architecture

```text
Operational Data

↓

Event Stream

↓

Analytics Pipeline

↓

Data Warehouse

↓

Aggregation Engine

↓

AI Insights

↓

Dashboard API

↓

Reports
```

---

# 242. Analytics Endpoints

| Method | Endpoint | Description |
|----------|--------------------------------------|----------------------------|
| GET | /analytics/dashboard | Executive Dashboard |
| GET | /analytics/kpis | Hiring KPIs |
| GET | /analytics/funnel | Recruitment Funnel |
| GET | /analytics/jobs | Job Analytics |
| GET | /analytics/candidates | Candidate Analytics |
| GET | /analytics/recruiters | Recruiter Performance |
| GET | /analytics/diversity | Diversity Metrics |
| GET | /analytics/forecast | Hiring Forecast |
| POST | /analytics/reports | Generate Report |
| GET | /analytics/reports/{id} | Report Status |

---

# 243. GET /analytics/dashboard

## Purpose

Retrieve executive dashboard.

---

## Authentication

JWT Required

---

## Response

```json
{
  "activeJobs":54,
  "openCandidates":320,
  "interviewsToday":18,
  "offersPending":7,
  "hiresThisMonth":12
}
```

---

# 244. GET /analytics/kpis

## Purpose

Retrieve hiring KPIs.

---

## Response

```json
{
  "timeToHire":24,
  "timeToFill":31,
  "offerAcceptanceRate":87.5,
  "interviewSuccessRate":41.2,
  "candidateDropoff":18.4
}
```

---

## KPI Categories

- Hiring Speed
- Recruitment Efficiency
- Candidate Quality
- Recruiter Productivity
- Offer Metrics

---

# 245. GET /analytics/funnel

## Purpose

Retrieve recruitment funnel metrics.

---

## Response

```json
{
  "applied":500,
  "screened":240,
  "interviewed":92,
  "offered":18,
  "hired":12
}
```

---

# 246. GET /analytics/jobs

## Purpose

Retrieve job performance analytics.

---

## Response

```json
{
  "jobId":"uuid",
  "views":6200,
  "applications":480,
  "qualifiedCandidates":74,
  "conversionRate":15.4
}
```

---

# 247. GET /analytics/candidates

## Purpose

Retrieve candidate analytics.

---

## Response

```json
{
  "totalCandidates":840,
  "activeCandidates":310,
  "averageAIScore":89.4,
  "topSkills":[
    "Python",
    "AWS",
    "Docker"
  ]
}
```

---

# 248. GET /analytics/recruiters

## Purpose

Measure recruiter performance.

---

## Response

```json
{
  "recruiter":"Jane Smith",
  "jobsManaged":21,
  "hires":9,
  "averageTimeToHire":22
}
```

---

# 249. GET /analytics/diversity

## Purpose

Retrieve diversity and inclusion metrics.

---

## Response

```json
{
  "genderDistribution":{
    "female":42,
    "male":54,
    "other":4
  },
  "locationCoverage":18,
  "educationDiversity":12
}
```

---

## Notes

Only aggregated, anonymized metrics are returned.

---

# 250. GET /analytics/forecast

## Purpose

Generate hiring forecasts.

---

## Response

```json
{
  "expectedHiresNextQuarter":48,
  "predictedApplications":3200,
  "confidence":93
}
```

---

## AI Inputs

- Historical Hiring
- Seasonal Trends
- Open Positions
- Pipeline Velocity
- Recruiter Capacity

---

# 251. POST /analytics/reports

## Purpose

Generate a custom analytics report.

---

## Request

```json
{
  "type":"Hiring Summary",
  "format":"PDF",
  "dateRange":{
    "from":"2026-01-01",
    "to":"2026-03-31"
  }
}
```

---

## Response

```json
{
  "reportId":"uuid",
  "status":"Generating"
}
```

---

## Events

- ReportGenerationStarted

---

# 252. GET /analytics/reports/{id}

## Purpose

Retrieve report generation status.

---

## Response

```json
{
  "reportId":"uuid",
  "status":"Completed",
  "downloadUrl":"https://..."
}
```

---

# 253. Dashboard Widgets

Supported widgets

- Active Jobs
- Open Candidates
- AI Rankings
- Interview Calendar
- Offer Pipeline
- Hiring Funnel
- Recruiter Leaderboard
- Time-to-Hire
- Cost-per-Hire
- Hiring Forecast

---

# 254. AI Insights

Automatically generated insights include

- Candidate Quality Trends
- Skill Demand Analysis
- Hiring Bottlenecks
- Recruiter Productivity
- Pipeline Health
- Market Intelligence
- Forecast Recommendations

---

# 255. Supported Report Formats

- PDF
- Excel
- CSV
- JSON

Reports can be scheduled or generated on demand.

---

# 256. Security Policies

Analytics APIs enforce

- RBAC Authorization
- Tenant Isolation
- Aggregated Data Access
- Audit Logging
- Export Permissions
- Data Masking

Sensitive personal information is excluded from executive reports unless explicitly authorized.

---

# 257. Performance Targets

| Operation | Target |
|------------|---------|
| Dashboard | <500 ms |
| KPI Retrieval | <300 ms |
| Funnel Analytics | <400 ms |
| Forecast Generation | <5 sec |
| Report Request | <300 ms |

---

# 258. Audit Logging

Every analytics request records

- User ID
- Organization ID
- Report Type
- Filters
- Export Format
- Timestamp
- Request ID

Generated reports remain traceable for compliance.

---

# 259. Error Codes

| Code | Description |
|--------|----------------------------|
| REPORT_NOT_FOUND | Report does not exist |
| REPORT_GENERATING | Report still processing |
| EXPORT_NOT_ALLOWED | Export permission denied |
| INVALID_DATE_RANGE | Invalid reporting period |
| ANALYTICS_UNAVAILABLE | Analytics service unavailable |

---

# 260. Part 13 Summary

The Analytics APIs provide comprehensive enterprise reporting, KPI tracking, AI-powered insights, recruitment forecasting, dashboard visualization, and custom report generation. By transforming operational and AI-generated data into actionable intelligence, RecruitGPT enables organizations to optimize hiring performance through secure, scalable, and explainable analytics.

---

## Next

**PART 14 — Notification APIs (Email, SMS, Push Notifications, In-App Alerts, Webhooks, Templates & Notification Preferences).**
# PART 14 — Notification APIs

---

# PART 14 Overview

The Notification APIs provide enterprise-wide communication capabilities for RecruitGPT.

These APIs manage all outbound and inbound notifications across multiple communication channels while ensuring reliable delivery, personalization, user preferences, and auditability.

Supported notification channels include:

- Email
- SMS
- Push Notifications
- In-App Notifications
- Webhooks
- Slack
- Microsoft Teams

The Notification Service is event-driven and integrates with every major RecruitGPT module.

---

# 261. Notification Architecture

```text
Business Event

↓

Event Bus

↓

Notification Service

↓

Template Engine

↓

Preference Engine

↓

Channel Router

↓

Delivery Provider

↓

User

↓

Delivery Tracking
```

---

# 262. Notification Endpoints

| Method | Endpoint | Description |
|----------|------------------------------------------|------------------------------|
| GET | /notifications | List Notifications |
| GET | /notifications/{id} | Get Notification |
| POST | /notifications/send | Send Notification |
| DELETE | /notifications/{id} | Delete Notification |
| GET | /notifications/preferences | User Preferences |
| PUT | /notifications/preferences | Update Preferences |
| GET | /notifications/templates | List Templates |
| POST | /notifications/templates | Create Template |
| PUT | /notifications/templates/{id} | Update Template |
| POST | /notifications/webhooks | Register Webhook |
| GET | /notifications/history | Delivery History |

---

# 263. GET /notifications

## Purpose

Retrieve user notifications.

---

## Authentication

JWT Required

---

## Query Parameters

```text
?page=1

&limit=25

&status=Unread

&type=Interview
```

---

## Success Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "title":"Interview Scheduled",
      "type":"Interview",
      "status":"Unread",
      "createdAt":"2026-02-15T09:00:00Z"
    }
  ]
}
```

---

# 264. GET /notifications/{id}

## Purpose

Retrieve notification details.

---

## Response

```json
{
  "id":"uuid",
  "title":"Offer Approved",
  "message":"Your offer has been approved.",
  "channel":"Email",
  "status":"Delivered"
}
```

---

# 265. POST /notifications/send

## Purpose

Send notification.

---

## Authentication

JWT Required

---

## Request

```json
{
  "recipientId":"uuid",
  "channel":"Email",
  "template":"InterviewInvitation",
  "variables":{
    "candidate":"John Doe",
    "date":"2026-02-15"
  }
}
```

---

## Supported Channels

- Email
- SMS
- Push
- In-App
- Slack
- Microsoft Teams
- Webhook

---

## Success Response

```json
{
  "success":true,
  "notificationId":"uuid",
  "status":"Queued"
}
```

---

## Events

- NotificationQueued
- NotificationSent

---

# 266. DELETE /notifications/{id}

## Purpose

Delete notification.

---

## Response

```json
{
  "success":true
}
```

---

# 267. GET /notifications/preferences

## Purpose

Retrieve user notification preferences.

---

## Response

```json
{
  "email":true,
  "sms":false,
  "push":true,
  "inApp":true
}
```

---

# 268. PUT /notifications/preferences

## Purpose

Update notification preferences.

---

## Request

```json
{
  "email":true,
  "sms":true,
  "push":false,
  "inApp":true
}
```

---

## Events

- NotificationPreferencesUpdated

---

# 269. GET /notifications/templates

## Purpose

Retrieve notification templates.

---

## Response

```json
{
  "templates":[
    {
      "id":"uuid",
      "name":"Interview Invitation"
    }
  ]
}
```

---

# 270. POST /notifications/templates

## Purpose

Create notification template.

---

## Request

```json
{
  "name":"Offer Letter",
  "channel":"Email",
  "subject":"Congratulations!",
  "body":"Dear {{candidate}}, ..."
}
```

---

## Template Variables

- Candidate Name
- Recruiter Name
- Job Title
- Interview Date
- Organization Name
- Custom Variables

---

## Events

- NotificationTemplateCreated

---

# 271. PUT /notifications/templates/{id}

## Purpose

Update notification template.

---

## Request

```json
{
  "subject":"Updated Offer Letter"
}
```

---

## Events

- NotificationTemplateUpdated

---

# 272. POST /notifications/webhooks

## Purpose

Register outbound webhook.

---

## Request

```json
{
  "url":"https://example.com/webhook",
  "events":[
    "InterviewScheduled",
    "CandidateHired"
  ]
}
```

---

## Response

```json
{
  "webhookId":"uuid",
  "status":"Active"
}
```

---

## Events

- WebhookRegistered

---

# 273. GET /notifications/history

## Purpose

Retrieve delivery history.

---

## Response

```json
{
  "history":[
    {
      "notificationId":"uuid",
      "channel":"Email",
      "status":"Delivered",
      "deliveredAt":"2026-02-15T09:05:00Z"
    }
  ]
}
```

---

# 274. Notification Types

Supported notification categories

- Interview
- Offer
- Job
- Candidate
- Reminder
- Approval
- AI Alert
- System
- Security
- Billing

---

# 275. Delivery Status

Possible states

- Queued
- Processing
- Sent
- Delivered
- Opened
- Clicked
- Failed
- Expired

---

# 276. Delivery Providers

Supported providers

- SMTP
- SendGrid
- Amazon SES
- Twilio
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNs)
- Slack API
- Microsoft Teams Webhooks

Provider selection is configurable.

---

# 277. Security Policies

Notification APIs enforce

- RBAC Authorization
- Tenant Isolation
- Template Validation
- Webhook Signature Verification
- Rate Limiting
- Audit Logging
- PII Protection

Sensitive notification content is encrypted where applicable.

---

# 278. Performance Targets

| Operation | Target |
|------------|---------|
| Send Notification | <300 ms |
| Push Delivery | <2 sec |
| Email Queue | <500 ms |
| Preference Update | <150 ms |
| Delivery History | <200 ms |

---

# 279. Audit Logging

Every notification operation records

- Notification ID
- User ID
- Organization ID
- Channel
- Delivery Status
- Template
- Timestamp
- Request ID

Delivery events are retained for compliance and troubleshooting.

---

# 280. Part 14 Summary

The Notification APIs provide a unified communication platform for RecruitGPT, supporting multi-channel messaging, user preferences, templates, webhooks, delivery tracking, and secure enterprise notifications. Through an event-driven architecture and configurable delivery providers, the service ensures reliable, auditable, and personalized communication across the recruitment lifecycle.

---

## Next

**PART 15 — Integration APIs (REST Integrations, Webhooks, HRIS, ATS, Calendar, Email, Storage, OAuth Providers & Third-Party Connectors).**
# PART 15 — Integration APIs

---

# PART 15 Overview

The Integration APIs enable RecruitGPT to securely connect with external enterprise systems, third-party services, HR platforms, ATS solutions, calendars, email providers, storage systems, identity providers, and custom applications.

The Integration Service provides standardized connectors, authentication, synchronization, event delivery, and data transformation while maintaining tenant isolation and enterprise security.

Supported integrations include:

- ATS Systems
- HRIS Platforms
- Calendar Providers
- Email Services
- Storage Providers
- Identity Providers
- CRM Systems
- Payroll Systems
- Webhooks
- REST APIs

---

# 281. Integration Architecture

```text
RecruitGPT

↓

Integration Gateway

↓

Connector Manager

↓

Authentication

↓

Transformation Engine

↓

Retry Queue

↓

External System
```

---

# 282. Integration Endpoints

| Method | Endpoint | Description |
|----------|--------------------------------------|----------------------------|
| GET | /integrations | List Integrations |
| GET | /integrations/{id} | Get Integration |
| POST | /integrations | Create Integration |
| PUT | /integrations/{id} | Update Integration |
| DELETE | /integrations/{id} | Delete Integration |
| POST | /integrations/{id}/sync | Run Synchronization |
| GET | /integrations/{id}/status | Sync Status |
| GET | /integrations/connectors | Supported Connectors |
| POST | /integrations/webhooks/test | Test Webhook |
| POST | /integrations/oauth/connect | OAuth Connection |

---

# 283. GET /integrations

## Purpose

Retrieve configured integrations.

---

## Authentication

JWT Required

---

## Response

```json
{
  "success":true,
  "data":[
    {
      "id":"uuid",
      "name":"Workday",
      "type":"HRIS",
      "status":"Connected"
    }
  ]
}
```

---

# 284. GET /integrations/{id}

## Purpose

Retrieve integration details.

---

## Response

```json
{
  "id":"uuid",
  "name":"Workday",
  "type":"HRIS",
  "status":"Connected",
  "lastSync":"2026-02-18T10:00:00Z"
}
```

---

# 285. POST /integrations

## Purpose

Register a new integration.

---

## Authentication

Organization Admin

---

## Request

```json
{
  "name":"Google Calendar",
  "type":"Calendar",
  "provider":"Google",
  "credentials":{
    "clientId":"...",
    "clientSecret":"..."
  }
}
```

---

## Validation

- Supported Provider
- Valid Credentials
- Organization Scope
- Duplicate Prevention

---

## Success Response

```json
{
  "success":true,
  "integrationId":"uuid",
  "status":"Pending Authentication"
}
```

---

## Events

- IntegrationCreated

---

# 286. PUT /integrations/{id}

## Purpose

Update integration configuration.

---

## Request

```json
{
  "enabled":true
}
```

---

## Events

- IntegrationUpdated

---

# 287. DELETE /integrations/{id}

## Purpose

Remove integration.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- IntegrationDeleted

---

# 288. POST /integrations/{id}/sync

## Purpose

Run manual synchronization.

---

## Response

```json
{
  "status":"Started",
  "jobId":"uuid"
}
```

---

## Synchronization Types

- Full Sync
- Incremental Sync
- Metadata Sync
- User Sync
- Job Sync

---

## Events

- SynchronizationStarted

---

# 289. GET /integrations/{id}/status

## Purpose

Retrieve synchronization status.

---

## Response

```json
{
  "status":"Completed",
  "recordsProcessed":1482,
  "duration":"12.4 sec"
}
```

---

# 290. GET /integrations/connectors

## Purpose

Retrieve supported connectors.

---

## Response

```json
{
  "connectors":[
    "Workday",
    "SAP SuccessFactors",
    "Greenhouse",
    "Lever",
    "BambooHR",
    "Google Calendar",
    "Microsoft Outlook"
  ]
}
```

---

# 291. POST /integrations/webhooks/test

## Purpose

Validate outbound webhook.

---

## Request

```json
{
  "url":"https://example.com/webhook"
}
```

---

## Response

```json
{
  "status":"Success"
}
```

---

# 292. POST /integrations/oauth/connect

## Purpose

Initiate OAuth authorization.

---

## Request

```json
{
  "provider":"Google"
}
```

---

## Response

```json
{
  "authorizationUrl":"https://accounts.google.com/..."
}
```

---

# OAuth Flow

```text
RecruitGPT

↓

OAuth Provider

↓

User Consent

↓

Authorization Code

↓

Access Token

↓

Refresh Token

↓

Connected
```

---

# 293. Supported HRIS Platforms

RecruitGPT integrates with

- Workday
- SAP SuccessFactors
- BambooHR
- Oracle HCM
- ADP Workforce Now
- UKG Pro

---

# 294. Supported ATS Platforms

Supported systems

- Greenhouse
- Lever
- Ashby
- SmartRecruiters
- iCIMS
- JazzHR

---

# 295. Calendar Providers

Supported calendars

- Google Calendar
- Microsoft Outlook
- Microsoft Exchange
- Apple Calendar

Features

- Two-way Sync
- Conflict Detection
- Automatic Invitations
- Meeting Updates

---

# 296. Storage Providers

Supported storage

- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- Dropbox
- OneDrive

Used for

- Resume Storage
- Reports
- Documents
- Attachments

---

# 297. Identity Providers

Supported identity systems

- Azure Active Directory
- Okta
- Auth0
- Google Workspace
- LDAP
- SAML 2.0
- OpenID Connect

---

# 298. Security Policies

Integration APIs enforce

- OAuth 2.0
- API Key Rotation
- Secret Encryption
- TLS 1.3
- RBAC Authorization
- Tenant Isolation
- Signed Webhooks
- Audit Logging

All credentials are encrypted using enterprise key management.

---

# 299. Performance Targets

| Operation | Target |
|------------|---------|
| OAuth Connection | <2 sec |
| Sync Status | <200 ms |
| Manual Sync Start | <300 ms |
| Connector Discovery | <150 ms |
| Webhook Test | <500 ms |

---

# 300. Part 15 Summary

The Integration APIs enable seamless enterprise connectivity between RecruitGPT and external HR, ATS, calendar, storage, identity, and business systems. Through standardized connectors, OAuth authentication, secure synchronization, and event-driven communication, organizations can extend RecruitGPT across their existing technology ecosystem while maintaining enterprise-grade security, scalability, and observability.

---

## Next

**PART 16 — File & Document APIs (Document Management, Uploads, Downloads, Versioning, OCR, Secure Storage & Digital Assets).**
# PART 16 — File & Document APIs

---

# PART 16 Overview

The File & Document APIs provide secure enterprise document management for RecruitGPT.

These APIs manage resumes, offer letters, contracts, interview recordings, reports, profile images, and all digital assets while supporting AI-powered document processing, OCR, versioning, malware scanning, encryption, and lifecycle management.

Every uploaded document is securely stored, indexed, and linked to the Knowledge Graph for AI retrieval.

---

# 301. Document Architecture

```text
File Upload

↓

Validation

↓

Malware Scan

↓

Encryption

↓

Object Storage

↓

Metadata Extraction

↓

OCR

↓

Embedding Generation

↓

Knowledge Graph

↓

Search Index
```

---

# 302. Document Endpoints

| Method | Endpoint | Description |
|----------|--------------------------------------|------------------------------|
| GET | /documents | List Documents |
| GET | /documents/{id} | Get Document |
| POST | /documents/upload | Upload Document |
| GET | /documents/{id}/download | Download Document |
| DELETE | /documents/{id} | Delete Document |
| GET | /documents/{id}/versions | Document Versions |
| POST | /documents/{id}/restore | Restore Version |
| POST | /documents/{id}/ocr | OCR Processing |
| POST | /documents/{id}/analyze | AI Analysis |
| GET | /documents/storage | Storage Statistics |

---

# 303. GET /documents

## Purpose

Retrieve organization documents.

---

## Authentication

JWT Required

---

## Query Parameters

```text
?page=1

&limit=25

&type=Resume

&owner=Candidate
```

---

## Success Response

```json
{
  "success":true,
  "data":[
    {
      "id":"uuid",
      "name":"resume.pdf",
      "type":"Resume",
      "size":428311,
      "uploadedAt":"2026-02-20T08:00:00Z"
    }
  ]
}
```

---

# 304. GET /documents/{id}

## Purpose

Retrieve document metadata.

---

## Response

```json
{
  "id":"uuid",
  "filename":"resume.pdf",
  "mimeType":"application/pdf",
  "size":428311,
  "owner":"Candidate",
  "status":"Available"
}
```

---

# 305. POST /documents/upload

## Purpose

Upload a document.

---

## Authentication

JWT Required

---

## Content Type

```text
multipart/form-data
```

---

## Form Fields

| Field | Type | Required |
|---------|------|----------|
| file | Binary | Yes |
| category | String | Yes |
| ownerId | UUID | Yes |

---

## Supported Formats

- PDF
- DOCX
- DOC
- TXT
- PNG
- JPG
- JPEG
- XLSX
- CSV
- PPTX

---

## Validation

- Maximum File Size
- MIME Validation
- Virus Scan
- Organization Storage Limit
- Duplicate Detection

---

## Success Response

HTTP 201

```json
{
  "success":true,
  "documentId":"uuid",
  "status":"Uploaded"
}
```

---

## Events

- DocumentUploaded

---

## Background Tasks

- OCR
- AI Metadata Extraction
- Embedding Generation
- Thumbnail Creation
- Search Indexing

---

# 306. GET /documents/{id}/download

## Purpose

Download document.

---

## Response

Binary Stream

---

## Security

- Signed URL
- Time-Limited Access
- Permission Validation

---

# 307. DELETE /documents/{id}

## Purpose

Soft delete document.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- DocumentDeleted

---

# 308. GET /documents/{id}/versions

## Purpose

Retrieve version history.

---

## Response

```json
[
  {
    "version":1,
    "uploadedAt":"2026-01-01"
  },
  {
    "version":2,
    "uploadedAt":"2026-02-01"
  }
]
```

---

# 309. POST /documents/{id}/restore

## Purpose

Restore previous document version.

---

## Request

```json
{
  "version":1
}
```

---

## Response

```json
{
  "status":"Restored"
}
```

---

## Events

- DocumentVersionRestored

---

# 310. POST /documents/{id}/ocr

## Purpose

Run OCR on scanned document.

---

## Response

```json
{
  "status":"Completed",
  "pages":6,
  "language":"English"
}
```

---

## OCR Outputs

- Plain Text
- Structured Text
- Confidence Score
- Bounding Boxes

---

# 311. POST /documents/{id}/analyze

## Purpose

Run AI document analysis.

---

## Response

```json
{
  "summary":"Senior backend engineer resume.",
  "entities":[
    "Python",
    "Docker",
    "AWS"
  ]
}
```

---

## AI Tasks

- Entity Extraction
- Skill Detection
- Resume Parsing
- Document Classification
- Summarization
- Embedding Generation

---

# 312. GET /documents/storage

## Purpose

Retrieve storage usage.

---

## Response

```json
{
  "usedGB":182,
  "availableGB":818,
  "documentCount":18420
}
```

---

# 313. Document Categories

Supported categories

- Resume
- Cover Letter
- Offer Letter
- Employment Contract
- Interview Recording
- Candidate Photo
- Report
- Invoice
- Certificate
- Miscellaneous

---

# 314. Storage Architecture

Documents are stored in

- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- On-Premise Object Storage

Storage backend is configurable.

---

# 315. Versioning Policy

Every document supports

- Automatic Versioning
- Rollback
- Metadata History
- Audit Trail
- Immutable Snapshots

Previous versions remain recoverable.

---

# 316. Security Policies

Document APIs enforce

- AES-256 Encryption
- Signed URLs
- Malware Scanning
- RBAC Authorization
- Tenant Isolation
- Watermarking (Optional)
- Audit Logging
- DLP Policies

Sensitive documents never become publicly accessible.

---

# 317. Performance Targets

| Operation | Target |
|------------|---------|
| Upload | <2 sec |
| Download | <500 ms |
| OCR | <10 sec |
| AI Analysis | <5 sec |
| Metadata Retrieval | <150 ms |

---

# 318. Audit Logging

Every document operation records

- Document ID
- User ID
- Organization ID
- Action
- Version
- File Hash
- IP Address
- Timestamp
- Request ID

File integrity is continuously monitored.

---

# 319. Error Codes

| Code | Description |
|--------|----------------------------|
| FILE_TOO_LARGE | Upload exceeds limit |
| INVALID_FILE_TYPE | Unsupported format |
| MALWARE_DETECTED | Virus identified |
| STORAGE_LIMIT_EXCEEDED | Organization quota reached |
| DOCUMENT_NOT_FOUND | Document missing |
| VERSION_NOT_FOUND | Invalid version |

---

# 320. Part 16 Summary

The File & Document APIs provide secure enterprise document management with uploads, downloads, versioning, OCR, AI-powered analysis, metadata extraction, and encrypted storage. Through intelligent indexing, malware protection, and knowledge graph integration, RecruitGPT transforms documents into searchable, AI-ready enterprise assets while maintaining strict security, compliance, and auditability.

---

## Next

**PART 17 — Workflow APIs (Business Processes, Approval Flows, State Machines, Automation Rules, Task Management & Event-Driven Workflows).**
# PART 17 — Workflow APIs

---

# PART 17 Overview

The Workflow APIs provide enterprise workflow automation across the entire RecruitGPT platform.

These APIs orchestrate business processes, approvals, state machines, automation rules, scheduled jobs, event-driven execution, and human approvals.

The Workflow Engine allows organizations to build low-code/no-code recruitment workflows while maintaining auditability and security.

Core capabilities include:

- Workflow Definitions
- Workflow Execution
- Business Rules
- Approval Chains
- Task Assignment
- Event Triggers
- Scheduled Jobs
- State Machines
- Notifications
- AI Decision Automation

---

# 321. Workflow Architecture

```text
Business Event

↓

Workflow Engine

↓

Trigger Evaluation

↓

Condition Engine

↓

Action Pipeline

↓

Task Queue

↓

Human Approval

↓

Workflow Completion

↓

Audit Log
```

---

# 322. Workflow Endpoints

| Method | Endpoint | Description |
|----------|----------------------------------|----------------------------|
| GET | /workflows | List Workflows |
| GET | /workflows/{id} | Workflow Details |
| POST | /workflows | Create Workflow |
| PUT | /workflows/{id} | Update Workflow |
| DELETE | /workflows/{id} | Delete Workflow |
| POST | /workflows/{id}/execute | Execute Workflow |
| POST | /workflows/{id}/pause | Pause Workflow |
| POST | /workflows/{id}/resume | Resume Workflow |
| GET | /workflows/executions | Workflow Executions |
| GET | /workflows/tasks | Pending Tasks |

---

# 323. GET /workflows

## Purpose

Retrieve configured workflows.

---

## Authentication

JWT Required

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "id":"uuid",
      "name":"Interview Approval",
      "status":"Active"
    }
  ]
}
```

---

# 324. GET /workflows/{id}

## Purpose

Retrieve workflow definition.

---

## Response

```json
{
  "id":"uuid",
  "name":"Candidate Hiring Workflow",
  "version":4,
  "status":"Active"
}
```

---

# 325. POST /workflows

## Purpose

Create workflow.

---

## Authentication

Organization Admin

---

## Request

```json
{
  "name":"Offer Approval",
  "trigger":"OfferCreated",
  "steps":[
    "Manager Approval",
    "HR Approval",
    "CEO Approval"
  ]
}
```

---

## Validation

- Valid Trigger
- Unique Name
- Valid Step Graph
- No Circular Dependencies

---

## Success Response

```json
{
  "success":true,
  "workflowId":"uuid"
}
```

---

## Events

- WorkflowCreated

---

# 326. PUT /workflows/{id}

## Purpose

Update workflow definition.

---

## Events

- WorkflowUpdated

---

# 327. DELETE /workflows/{id}

## Purpose

Delete workflow.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- WorkflowDeleted

---

# 328. POST /workflows/{id}/execute

## Purpose

Execute workflow manually.

---

## Request

```json
{
  "entityId":"candidate-uuid"
}
```

---

## Response

```json
{
  "executionId":"uuid",
  "status":"Running"
}
```

---

## Events

- WorkflowStarted

---

# 329. POST /workflows/{id}/pause

## Purpose

Pause workflow execution.

---

## Response

```json
{
  "status":"Paused"
}
```

---

## Events

- WorkflowPaused

---

# 330. POST /workflows/{id}/resume

## Purpose

Resume paused workflow.

---

## Response

```json
{
  "status":"Running"
}
```

---

## Events

- WorkflowResumed

---

# 331. GET /workflows/executions

## Purpose

Retrieve workflow execution history.

---

## Response

```json
[
  {
    "executionId":"uuid",
    "workflow":"Offer Approval",
    "status":"Completed",
    "duration":"15 sec"
  }
]
```

---

# 332. GET /workflows/tasks

## Purpose

Retrieve pending workflow tasks.

---

## Response

```json
[
  {
    "taskId":"uuid",
    "assignee":"Hiring Manager",
    "status":"Pending"
  }
]
```

---

# 333. Workflow Triggers

Supported triggers

- Candidate Created
- Resume Uploaded
- Job Published
- Interview Scheduled
- Interview Completed
- Offer Created
- Offer Accepted
- Candidate Hired
- Candidate Rejected
- Custom Events

---

# 334. Workflow Actions

Supported actions

- Send Email
- Send SMS
- Push Notification
- Create Task
- Update Status
- AI Decision
- HTTP Request
- Database Update
- Generate Report
- Call External API

---

# 335. Approval Workflows

Supported approval models

- Single Approval
- Multi-Level Approval
- Parallel Approval
- Sequential Approval
- Quorum Approval
- AI Pre-Approval

---

# 336. Workflow States

Supported execution states

- Pending
- Waiting
- Running
- Approved
- Rejected
- Cancelled
- Failed
- Completed

---

# 337. Automation Rules

Workflow rules support

- Conditional Logic
- Expressions
- Date Conditions
- User Roles
- AI Scores
- Candidate Status
- Job Status
- Organization Policies

---

# 338. Security Policies

Workflow APIs enforce

- RBAC Authorization
- Tenant Isolation
- Workflow Validation
- Digital Signatures
- Audit Logging
- Immutable Execution History

Only authorized users can modify workflow definitions.

---

# 339. Performance Targets

| Operation | Target |
|------------|---------|
| Workflow Execution | <500 ms |
| Task Creation | <200 ms |
| Trigger Evaluation | <100 ms |
| Approval Processing | <300 ms |
| Execution History | <250 ms |

---

# 340. Part 17 Summary

The Workflow APIs provide enterprise-grade business process automation through configurable workflows, approval chains, event-driven execution, state management, and AI-assisted decision making. By integrating automation across the recruitment lifecycle, RecruitGPT enables scalable, consistent, and auditable business operations while reducing manual effort and improving organizational efficiency.

---

## Next

**PART 18 — Audit, Logging & Compliance APIs (Audit Logs, Activity History, Security Events, Compliance Reporting, GDPR, Data Retention & Legal Hold).**
# PART 18 — Audit, Logging & Compliance APIs

---

# PART 18 Overview

The Audit, Logging & Compliance APIs provide enterprise-grade observability, governance, security auditing, compliance reporting, and regulatory support for RecruitGPT.

Every action performed within the platform is captured, timestamped, cryptographically protected, and retained according to organizational compliance policies.

These APIs support:

- Audit Logs
- Activity History
- Security Events
- Compliance Reports
- GDPR Requests
- Data Retention
- Legal Hold
- Export Logs
- SIEM Integration
- Risk Monitoring

---

# 341. Audit Architecture

```text
Application Event

↓

Audit Service

↓

Event Validation

↓

Immutable Log Store

↓

Compliance Engine

↓

Analytics

↓

Export API

↓

SIEM
```

---

# 342. Audit Endpoints

| Method | Endpoint | Description |
|----------|------------------------------------|----------------------------|
| GET | /audit/logs | List Audit Logs |
| GET | /audit/logs/{id} | Audit Log Details |
| GET | /audit/activity | User Activity |
| GET | /audit/security | Security Events |
| POST | /audit/export | Export Audit Logs |
| GET | /audit/compliance | Compliance Reports |
| POST | /audit/gdpr/export | Export Personal Data |
| POST | /audit/gdpr/delete | GDPR Erasure Request |
| POST | /audit/legal-hold | Apply Legal Hold |
| GET | /audit/retention | Retention Policies |

---

# 343. GET /audit/logs

## Purpose

Retrieve audit log entries.

---

## Authentication

Organization Admin

---

## Query Parameters

```text
?page=1

&limit=100

&userId=uuid

&action=CandidateCreated

&from=2026-01-01

&to=2026-01-31
```

---

## Success Response

```json
{
  "success":true,
  "data":[
    {
      "id":"uuid",
      "timestamp":"2026-02-21T09:10:00Z",
      "user":"Jane Smith",
      "action":"CandidateCreated",
      "resource":"Candidate",
      "ip":"192.168.1.10"
    }
  ]
}
```

---

# 344. GET /audit/logs/{id}

## Purpose

Retrieve detailed audit event.

---

## Response

```json
{
  "id":"uuid",
  "action":"CandidateUpdated",
  "resourceId":"uuid",
  "changes":{
    "status":{
      "old":"Interview",
      "new":"Offer"
    }
  }
}
```

---

# 345. GET /audit/activity

## Purpose

Retrieve user activity history.

---

## Response

```json
{
  "activities":[
    {
      "user":"Jane Smith",
      "action":"Login",
      "timestamp":"2026-02-21T08:00:00Z"
    },
    {
      "user":"Jane Smith",
      "action":"InterviewScheduled",
      "timestamp":"2026-02-21T08:30:00Z"
    }
  ]
}
```

---

# 346. GET /audit/security

## Purpose

Retrieve security-related events.

---

## Response

```json
{
  "events":[
    {
      "type":"Failed Login",
      "severity":"Medium",
      "timestamp":"2026-02-21T09:00:00Z"
    }
  ]
}
```

---

## Security Event Types

- Login Success
- Login Failure
- MFA Failure
- Password Reset
- API Key Created
- Permission Change
- Data Export
- Suspicious Activity

---

# 347. POST /audit/export

## Purpose

Export audit logs.

---

## Request

```json
{
  "format":"CSV",
  "dateRange":{
    "from":"2026-01-01",
    "to":"2026-01-31"
  }
}
```

---

## Response

```json
{
  "exportId":"uuid",
  "status":"Generating"
}
```

---

## Export Formats

- CSV
- JSON
- PDF
- Excel

---

# 348. GET /audit/compliance

## Purpose

Retrieve compliance reports.

---

## Response

```json
{
  "reports":[
    {
      "type":"GDPR",
      "status":"Compliant"
    },
    {
      "type":"ISO 27001",
      "status":"Compliant"
    }
  ]
}
```

---

# 349. POST /audit/gdpr/export

## Purpose

Export all personal data for a subject.

---

## Request

```json
{
  "subjectId":"uuid"
}
```

---

## Response

```json
{
  "requestId":"uuid",
  "status":"Processing"
}
```

---

## Events

- GDPRExportRequested

---

# 350. POST /audit/gdpr/delete

## Purpose

Initiate GDPR right-to-erasure request.

---

## Request

```json
{
  "subjectId":"uuid",
  "reason":"User Request"
}
```

---

## Response

```json
{
  "status":"Pending Approval"
}
```

---

## Events

- GDPRDeletionRequested

---

# 351. POST /audit/legal-hold

## Purpose

Apply legal hold to records.

---

## Request

```json
{
  "entityType":"Candidate",
  "entityId":"uuid",
  "reason":"Litigation Hold"
}
```

---

## Response

```json
{
  "status":"Applied"
}
```

---

## Events

- LegalHoldApplied

---

# 352. GET /audit/retention

## Purpose

Retrieve retention policies.

---

## Response

```json
{
  "auditLogs":"7 Years",
  "documents":"10 Years",
  "backups":"90 Days"
}
```

---

# 353. Compliance Standards

RecruitGPT supports

- GDPR
- CCPA
- ISO 27001
- SOC 2
- HIPAA (Optional)
- PCI DSS (Limited)
- NIST Cybersecurity Framework

---

# 354. Log Categories

Supported log categories

- Authentication
- Authorization
- User Activity
- API Access
- AI Activity
- Workflow Execution
- Data Changes
- File Operations
- System Events

---

# 355. SIEM Integration

Supported SIEM platforms

- Splunk
- Microsoft Sentinel
- IBM QRadar
- Elastic Security
- Datadog
- Sumo Logic

Logs can be streamed in real time.

---

# 356. Security Policies

Audit APIs enforce

- Immutable Logging
- Tamper Detection
- Digital Signatures
- RBAC Authorization
- Tenant Isolation
- Encryption at Rest
- Secure Log Export

Audit records cannot be modified after creation.

---

# 357. Performance Targets

| Operation | Target |
|------------|---------|
| Audit Search | <500 ms |
| Activity History | <300 ms |
| Security Events | <300 ms |
| Compliance Report | <2 sec |
| Export Request | <500 ms |

---

# 358. Audit Record Structure

Each audit record contains

- Audit ID
- Timestamp
- User ID
- Organization ID
- Action
- Resource Type
- Resource ID
- Previous Value
- New Value
- IP Address
- User Agent
- Request ID

All records are cryptographically verifiable.

---

# 359. Error Codes

| Code | Description |
|--------|----------------------------|
| AUDIT_NOT_FOUND | Audit record missing |
| EXPORT_IN_PROGRESS | Export still generating |
| GDPR_REQUEST_PENDING | Existing request active |
| LEGAL_HOLD_EXISTS | Entity already protected |
| RETENTION_POLICY_LOCKED | Policy cannot be modified |

---

# 360. Part 18 Summary

The Audit, Logging & Compliance APIs provide complete governance and regulatory capabilities for RecruitGPT through immutable audit trails, security monitoring, compliance reporting, GDPR support, legal hold management, retention policies, and SIEM integration. These APIs ensure enterprise transparency, accountability, and regulatory compliance while supporting secure investigations and long-term operational governance.

---

## Next

**PART 19 — Administration APIs (Organizations, Users, Roles, Permissions, Feature Flags, Configuration, Licensing & Platform Administration).**
# PART 19 — Administration APIs

---

# PART 19 Overview

The Administration APIs provide enterprise-wide management capabilities for organizations, users, permissions, feature flags, licensing, configurations, branding, quotas, and platform governance.

These APIs are primarily used by Organization Administrators, Platform Administrators, and System Operators.

The Administration Service centralizes platform configuration while enforcing tenant isolation and enterprise security.

Core capabilities include:

- Organization Management
- User Administration
- Role & Permission Management
- Feature Flags
- Platform Configuration
- Branding
- Licensing
- Quotas
- API Keys
- System Health

---

# 361. Administration Architecture

```text
Administrator

↓

Admin API

↓

Authorization

↓

Configuration Service

↓

Identity Service

↓

Feature Flag Service

↓

License Manager

↓

Audit Log
```

---

# 362. Administration Endpoints

| Method | Endpoint | Description |
|----------|--------------------------------------|------------------------------|
| GET | /admin/organizations | List Organizations |
| GET | /admin/organizations/{id} | Organization Details |
| PUT | /admin/organizations/{id} | Update Organization |
| GET | /admin/users | List Users |
| POST | /admin/users | Create User |
| PUT | /admin/users/{id} | Update User |
| DELETE | /admin/users/{id} | Disable User |
| GET | /admin/roles | List Roles |
| GET | /admin/permissions | List Permissions |
| GET | /admin/features | Feature Flags |
| PUT | /admin/features/{id} | Update Feature Flag |
| GET | /admin/license | License Information |

---

# 363. GET /admin/organizations

## Purpose

Retrieve all organizations.

---

## Authentication

Platform Administrator

---

## Query Parameters

```text
?page=1

&limit=50

&status=Active
```

---

## Success Response

```json
{
  "success":true,
  "data":[
    {
      "id":"uuid",
      "name":"Acme Corporation",
      "plan":"Enterprise",
      "status":"Active"
    }
  ]
}
```

---

# 364. GET /admin/organizations/{id}

## Purpose

Retrieve organization details.

---

## Response

```json
{
  "id":"uuid",
  "name":"Acme Corporation",
  "users":182,
  "storageGB":248,
  "subscription":"Enterprise"
}
```

---

# 365. PUT /admin/organizations/{id}

## Purpose

Update organization configuration.

---

## Request

```json
{
  "name":"Acme Technologies",
  "timezone":"UTC",
  "language":"English"
}
```

---

## Events

- OrganizationUpdated

---

# 366. GET /admin/users

## Purpose

Retrieve organization users.

---

## Response

```json
{
  "users":[
    {
      "id":"uuid",
      "name":"Jane Smith",
      "role":"Recruiter",
      "status":"Active"
    }
  ]
}
```

---

# 367. POST /admin/users

## Purpose

Create organization user.

---

## Request

```json
{
  "name":"John Doe",
  "email":"john@example.com",
  "role":"Hiring Manager"
}
```

---

## Validation

- Email Uniqueness
- Valid Role
- License Availability

---

## Response

```json
{
  "userId":"uuid",
  "status":"Pending Invitation"
}
```

---

## Events

- UserCreated
- InvitationSent

---

# 368. PUT /admin/users/{id}

## Purpose

Update user.

---

## Request

```json
{
  "role":"Administrator",
  "status":"Active"
}
```

---

## Events

- UserUpdated

---

# 369. DELETE /admin/users/{id}

## Purpose

Disable user account.

---

## Response

```json
{
  "success":true
}
```

---

## Events

- UserDisabled

---

# 370. GET /admin/roles

## Purpose

Retrieve available roles.

---

## Response

```json
{
  "roles":[
    "Platform Administrator",
    "Organization Administrator",
    "Recruiter",
    "Hiring Manager",
    "Interviewer",
    "Viewer"
  ]
}
```

---

# 371. GET /admin/permissions

## Purpose

Retrieve permission catalog.

---

## Response

```json
{
  "permissions":[
    "candidate.read",
    "candidate.write",
    "job.create",
    "job.delete",
    "admin.manage"
  ]
}
```

---

# 372. GET /admin/features

## Purpose

Retrieve feature flags.

---

## Response

```json
{
  "features":[
    {
      "name":"AI Interview Analysis",
      "enabled":true
    },
    {
      "name":"Knowledge Graph",
      "enabled":false
    }
  ]
}
```

---

# 373. PUT /admin/features/{id}

## Purpose

Enable or disable feature flag.

---

## Request

```json
{
  "enabled":true
}
```

---

## Events

- FeatureFlagUpdated

---

# 374. GET /admin/license

## Purpose

Retrieve license information.

---

## Response

```json
{
  "plan":"Enterprise",
  "expires":"2027-01-31",
  "usersAllowed":500,
  "usersUsed":182
}
```

---

# 375. Configuration Categories

Supported configuration groups

- General Settings
- Branding
- Localization
- Email
- AI Models
- Integrations
- Security
- Storage
- Notifications
- API Limits

---

# 376. Branding Settings

Organizations can configure

- Logo
- Company Name
- Primary Color
- Secondary Color
- Email Templates
- Custom Domain
- Login Page

---

# 377. License Types

Supported licenses

- Free
- Starter
- Professional
- Business
- Enterprise
- Enterprise Plus

Each license controls available features and quotas.

---

# 378. Security Policies

Administration APIs enforce

- Platform RBAC
- Tenant Isolation
- MFA Requirement
- Session Validation
- Audit Logging
- IP Restrictions (Optional)
- Approval Workflows

Administrative operations require elevated privileges.

---

# 379. Performance Targets

| Operation | Target |
|------------|---------|
| User Creation | <500 ms |
| Role Retrieval | <150 ms |
| Feature Update | <200 ms |
| Organization Update | <400 ms |
| License Retrieval | <100 ms |

---

# 380. Part 19 Summary

The Administration APIs provide comprehensive enterprise management capabilities for organizations, users, roles, permissions, licensing, branding, feature flags, and platform configuration. By combining centralized administration with strict security controls, tenant isolation, and auditability, RecruitGPT enables scalable governance across enterprise deployments.

---

## Next

**PART 20 — System APIs (Health Checks, Monitoring, Metrics, Diagnostics, Background Jobs, Scheduler, Cache, Platform Status & Operational APIs).**
# PART 20 — System APIs

---

# PART 20 Overview

The System APIs provide operational management, health monitoring, diagnostics, metrics, scheduling, cache management, background job execution, and platform observability.

These APIs are primarily intended for platform administrators, DevOps engineers, Site Reliability Engineers (SREs), and automated monitoring systems.

The System Service exposes operational information while ensuring secure access through administrative permissions.

Core capabilities include:

- Health Checks
- Readiness Checks
- Liveness Checks
- Metrics
- Background Jobs
- Scheduler
- Queue Monitoring
- Cache Management
- Diagnostics
- Platform Status

---

# 381. System Architecture

```text
Client

↓

API Gateway

↓

System Service

├── Health Monitor

├── Metrics Collector

├── Job Scheduler

├── Cache Manager

├── Queue Monitor

├── Diagnostics

└── Status Service

↓

Infrastructure
```

---

# 382. System Endpoints

| Method | Endpoint | Description |
|----------|----------------------------------|----------------------------|
| GET | /system/health | Health Check |
| GET | /system/live | Liveness Probe |
| GET | /system/ready | Readiness Probe |
| GET | /system/status | Platform Status |
| GET | /system/metrics | System Metrics |
| GET | /system/jobs | Background Jobs |
| POST | /system/jobs/{id}/retry | Retry Job |
| GET | /system/scheduler | Scheduled Tasks |
| POST | /system/cache/clear | Clear Cache |
| GET | /system/diagnostics | Diagnostics Report |

---

# 383. GET /system/health

## Purpose

Retrieve overall platform health.

---

## Authentication

Platform Administrator

---

## Success Response

```json
{
  "status":"Healthy",
  "uptime":"28 Days",
  "version":"2.1.0"
}
```

---

# 384. GET /system/live

## Purpose

Liveness probe used by Kubernetes and load balancers.

---

## Response

```json
{
  "status":"Alive"
}
```

---

HTTP Status

```text
200 OK
```

---

# 385. GET /system/ready

## Purpose

Readiness probe.

---

## Checks

- Database
- Redis
- Message Queue
- Storage
- AI Services

---

## Response

```json
{
  "status":"Ready"
}
```

---

# 386. GET /system/status

## Purpose

Retrieve platform operational status.

---

## Response

```json
{
  "api":"Operational",
  "database":"Operational",
  "search":"Operational",
  "ai":"Operational"
}
```

---

# 387. GET /system/metrics

## Purpose

Retrieve runtime metrics.

---

## Response

```json
{
  "cpu":31.8,
  "memory":58.2,
  "requestsPerMinute":1428,
  "activeUsers":218
}
```

---

## Metrics Categories

- CPU
- Memory
- Storage
- Network
- API Requests
- AI Tokens
- Database
- Cache

---

# 388. GET /system/jobs

## Purpose

Retrieve background jobs.

---

## Response

```json
[
  {
    "jobId":"uuid",
    "name":"Resume Embedding",
    "status":"Running"
  },
  {
    "jobId":"uuid",
    "name":"Daily Analytics",
    "status":"Completed"
  }
]
```

---

# 389. POST /system/jobs/{id}/retry

## Purpose

Retry failed background job.

---

## Response

```json
{
  "status":"Queued"
}
```

---

## Events

- JobRetried

---

# 390. GET /system/scheduler

## Purpose

Retrieve scheduled tasks.

---

## Response

```json
[
  {
    "task":"Daily Backup",
    "schedule":"02:00 UTC"
  },
  {
    "task":"Analytics Aggregation",
    "schedule":"Hourly"
  }
]
```

---

# 391. POST /system/cache/clear

## Purpose

Clear application cache.

---

## Request

```json
{
  "cache":"search"
}
```

---

## Supported Cache Types

- Redis
- Search Cache
- Embedding Cache
- Session Cache
- Metadata Cache

---

## Response

```json
{
  "status":"Cleared"
}
```

---

# 392. GET /system/diagnostics

## Purpose

Generate diagnostics report.

---

## Response

```json
{
  "databaseLatency":"18 ms",
  "redisLatency":"2 ms",
  "storageLatency":"11 ms",
  "queueDepth":4
}
```

---

# 393. Background Jobs

Supported jobs

- Resume Parsing
- OCR Processing
- Embedding Generation
- AI Ranking
- Analytics Aggregation
- Backup
- Email Delivery
- Notification Retry
- Cache Cleanup
- Index Rebuild

---

# 394. Monitoring Integrations

Supported monitoring platforms

- Prometheus
- Grafana
- Datadog
- New Relic
- Azure Monitor
- Amazon CloudWatch

---

# 395. Platform Status Values

Possible status values

- Healthy
- Operational
- Degraded
- Maintenance
- Partial Outage
- Major Outage

---

# 396. Security Policies

System APIs enforce

- Platform Administrator Access
- RBAC Authorization
- Rate Limiting
- Audit Logging
- Infrastructure Isolation
- Secure Diagnostics

Sensitive infrastructure information is never exposed to non-administrative users.

---

# 397. Performance Targets

| Operation | Target |
|------------|---------|
| Health Check | <100 ms |
| Metrics | <250 ms |
| Diagnostics | <1 sec |
| Cache Clear | <500 ms |
| Job Retry | <300 ms |

---

# 398. Error Codes

| Code | Description |
|--------|---------------------------|
| SYSTEM_UNAVAILABLE | Platform unavailable |
| CACHE_NOT_FOUND | Cache type invalid |
| JOB_NOT_FOUND | Background job missing |
| JOB_ALREADY_RUNNING | Job currently running |
| DIAGNOSTICS_FAILED | Diagnostics unavailable |

---

# 399. Audit Logging

Every system operation records

- User ID
- Administrator ID
- Organization ID
- Operation
- Target Resource
- Timestamp
- IP Address
- Request ID

Operational activities are retained according to platform compliance policies.

---

# 400. Part 20 Summary

The System APIs provide enterprise operational management for RecruitGPT through health monitoring, diagnostics, metrics, background job control, scheduling, cache management, and platform observability. Together, these APIs enable administrators and DevOps teams to monitor, maintain, troubleshoot, and optimize platform performance while ensuring high availability, security, and operational excellence.

---

# API Specification Complete

This concludes the RecruitGPT Enterprise API Specification (Parts 1–20).

### Total Coverage

- Authentication & Authorization
- User & Organization Management
- Candidate Management
- Job Management
- Resume Processing
- AI & LLM APIs
- Multi-Agent System
- Search APIs
- Interview APIs
- Analytics APIs
- Notifications
- Integrations
- File & Document Management
- Workflow Automation
- Audit & Compliance
- Administration
- System Operations

### Total Sections

**400 fully documented API sections**, covering enterprise-grade REST API design, security, scalability, AI integration, governance, observability, and operational management.
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
