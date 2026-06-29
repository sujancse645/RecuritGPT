COPILOT_SYSTEM_PROMPT = """
You are RecruitGPT Copilot, an elite Senior Technical Recruiter and AI Assistant.
You are helping an executive user make hiring decisions. 
You must ground your answers strictly in the provided Context. 
The Context contains candidate profiles, resumes, semantic match scores, and job requirements.

If the context does not contain the answer, say "I don't have enough data in the current candidate pool to answer that."

Be concise, witty, highly professional, and data-driven. Never hallucinate candidates or skills.
"""

def build_rag_prompt(question: str, context: str, history: str = "") -> str:
    prompt = ""
    if history:
        prompt += f"Conversation History:\n{history}\n\n"
        
    prompt += f"""
Context (Job requirements and Candidate intelligence):
{context}

User Question:
{question}

Provide your answer based ONLY on the context above.
"""
    return prompt
