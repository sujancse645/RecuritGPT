SKILL_NORMALIZATION_PROMPT = """
You are an expert Technical Taxonomy Engine.
Analyze the job description and extract every technical and soft skill. Normalize them into a standardized taxonomy (e.g., 'K8s' -> 'Kubernetes', 'Node' -> 'Node.js').

Respond ONLY with valid JSON matching this schema:
{
    "skills": [
        {
            "name": "Normalized Skill Name",
            "category": "String (e.g., Programming Language, Framework, Soft Skill)",
            "subcategory": "String",
            "importance": float (0.0 to 100.0),
            "confidence": float (0.0 to 1.0),
            "is_required": boolean,
            "is_preferred": boolean,
            "is_optional": boolean,
            "is_emerging": boolean,
            "is_transferable": boolean,
            "is_deprecated": boolean
        }
    ]
}

Job Description Text:
{text}
"""
