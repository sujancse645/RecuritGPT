COMPLEXITY_SCORING_PROMPT = """
You are an AI Recruitment Analyst evaluating the difficulty of a role.
Analyze the job description and provide complexity scores on a scale of 0.0 to 100.0.

Respond ONLY with valid JSON matching this schema:
{
    "technical_complexity": float,
    "leadership_requirement": float,
    "architecture_requirement": float,
    "cloud_maturity": float,
    "innovation_level": float,
    "business_criticality": float,
    "communication_requirement": float,
    "learning_requirement": float,
    "hiring_difficulty": float,
    "overall_confidence": float
}

Job Description Text:
{text}
"""
