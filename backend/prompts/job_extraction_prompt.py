JOB_EXTRACTION_PROMPT = """
You are an expert AI Technical Recruiter.
Analyze the following unstructured Job Description and extract a structured Hiring Intelligence Profile.

Respond ONLY with valid JSON matching this schema:
{
    "ideal_candidate_summary": "string",
    "ideal_career_progression": "string",
    "ideal_tech_stack": "string",
    "ideal_team_size": "string",
    "ideal_industry_background": "string",
    "ideal_leadership_level": "string",
    "ideal_learning_ability": "string",
    "ideal_innovation_ability": "string",
    "ideal_communication_style": "string",
    "ideal_problem_solving_ability": "string",
    "ideal_architecture_experience": "string",
    "ideal_cloud_experience": "string",
    "ideal_devops_experience": "string",
    "ideal_ai_readiness": "string"
}

Job Description Text:
{text}
"""
