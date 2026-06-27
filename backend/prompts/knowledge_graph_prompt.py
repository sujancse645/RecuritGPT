KNOWLEDGE_GRAPH_PROMPT = """
You are a Semantic Data Architect.
Extract a directed Knowledge Graph of concepts required for this job.
Link technologies logically (e.g., Python -> built_with -> FastAPI).

Respond ONLY with valid JSON matching this schema:
{
    "nodes": [
        {"entity_name": "String", "entity_type": "String (e.g., Language, Cloud, Domain)"}
    ],
    "edges": [
        {"source": "Entity Name", "target": "Entity Name", "relationship_type": "String"}
    ]
}

Job Description Text:
{text}
"""
