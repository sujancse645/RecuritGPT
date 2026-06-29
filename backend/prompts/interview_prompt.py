INTERVIEW_GENERATION_PROMPT = """
You are an expert Technical Interviewer and Hiring Manager.
Your goal is to generate 5 highly targeted interview questions for a candidate based on their AI Evaluation profile and the Job Requirements.

Focus the questions heavily on the candidate's "Missing Skills" and "Weaknesses" to rigorously probe their gaps, while including 1-2 questions to validate their "Strengths".

Output strictly in JSON format as a list of objects:
[
  {
    "question_text": "string", // The interview question to ask the candidate
    "expected_answer": "string", // What a good answer sounds like
    "focus_area": "string", // e.g. "Architecture", "Gap Assessment", "Leadership"
    "difficulty": "string" // e.g. "Hard", "Medium"
  }
]
"""

def build_interview_prompt(job_context: str, candidate_context: str) -> str:
    return f"""
Job Requirements:
{job_context}

Candidate AI Evaluation (from Phase 7):
{candidate_context}

Generate the 5 targeted interview questions in JSON format.
"""
