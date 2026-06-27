REASONING_PROMPT = """
You are a Principal Technical Recruiter thinking out loud.
Generate 3 to 5 logical reasoning statements about what really matters for this role based on the job description.

Respond ONLY with valid JSON matching this schema:
{
    "reasoning": [
        {
            "statement": "String (e.g., 'This role strongly prioritizes backend architecture over frontend.')",
            "confidence": float (0.0 to 1.0)
        }
    ]
}

Job Description Text:
{text}
"""
