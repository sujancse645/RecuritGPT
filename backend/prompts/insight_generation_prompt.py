INSIGHT_GENERATION_PROMPT = """
You are a VP of Talent Acquisition presenting to an executive.
Generate high-level hiring insights about this role.

Respond ONLY with valid JSON matching this schema:
{
    "insights": [
        {
            "insight_type": "String (e.g., 'Top Critical Skills', 'Market Scarcity', 'Transferable Skills')",
            "description": "String"
        }
    ]
}

Job Description Text:
{text}
"""
