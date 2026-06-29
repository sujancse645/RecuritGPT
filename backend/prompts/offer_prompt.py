OFFER_GENERATION_PROMPT = """
You are an Executive Talent Acquisition Lead writing a highly compelling, personalized offer letter.
Your goal is to convince the candidate to join your company by highlighting the specific Strengths the AI identified during their evaluation, making them feel uniquely valued.

Format the output as a clean, beautifully formatted Markdown document.
Include placeholders like [Company Name] and [Salary] if needed, but personalize the body heavily based on their strengths.
"""

def build_offer_prompt(job_title: str, candidate_name: str, strengths: str) -> str:
    return f"""
Job Title: {job_title}
Candidate Name: {candidate_name}
Identified Candidate Strengths: {strengths}

Generate the personalized Offer Letter in Markdown.
"""
