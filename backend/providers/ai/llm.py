import os
import json
from abc import ABC, abstractmethod
from typing import Dict, Any

class ILLMProvider(ABC):
    @abstractmethod
    async def generate_completion(self, prompt: str, **kwargs) -> str:
        """Generate text completion from LLM"""
        pass

    @abstractmethod
    async def get_embeddings(self, text: str) -> list[float]:
        """Generate embeddings for text"""
        pass

class OpenAIProvider(ILLMProvider):
    def __init__(self, api_key: str):
        import openai
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model = "gpt-4-turbo"

    async def generate_completion(self, prompt: str, **kwargs) -> str:
        response = await self.client.chat.completions.create(
            model=kwargs.get("model", self.model),
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"} if kwargs.get("json_mode") else None
        )
        return response.choices[0].message.content

    async def get_embeddings(self, text: str) -> list[float]:
        response = await self.client.embeddings.create(
            input=text, model="text-embedding-3-small"
        )
        return response.data[0].embedding

class GeminiProvider(ILLMProvider):
    def __init__(self, api_key: str):
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def generate_completion(self, prompt: str, **kwargs) -> str:
        response = await self.model.generate_content_async(prompt)
        return response.text

    async def get_embeddings(self, text: str) -> list[float]:
        import google.generativeai as genai
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

class OllamaProvider(ILLMProvider):
    def __init__(self, base_url: str = "http://localhost:11434"):
        import httpx
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=120.0)
        self.model = "llama3"

    async def generate_completion(self, prompt: str, **kwargs) -> str:
        payload = {"model": kwargs.get("model", self.model), "prompt": prompt, "stream": False}
        if kwargs.get("json_mode"):
            payload["format"] = "json"
        response = await self.client.post(f"{self.base_url}/api/generate", json=payload)
        return response.json().get("response", "")

    async def get_embeddings(self, text: str) -> list[float]:
        payload = {"model": self.model, "prompt": text}
        response = await self.client.post(f"{self.base_url}/api/embeddings", json=payload)
        return response.json().get("embedding", [])

class MockLLMProvider(ILLMProvider):
    """Fallback provider that returns perfectly structured deterministic JSON for the hackathon."""
    async def generate_completion(self, prompt: str, **kwargs) -> str:
        # We can inspect the prompt to return specific mock data, but for now we just return a valid dummy JSON.
        if "skill_normalization" in prompt.lower():
            return json.dumps({
                "skills": [
                    {"name": "Python", "category": "Programming Languages", "subcategory": "Backend", "importance": 95, "confidence": 1.0, "is_required": True},
                    {"name": "FastAPI", "category": "Frameworks", "subcategory": "Web", "importance": 90, "confidence": 1.0, "is_required": True}
                ]
            })
        elif "complexity_scoring" in prompt.lower():
            return json.dumps({
                "technical_complexity": 85.0, "leadership_requirement": 70.0, "architecture_requirement": 90.0,
                "cloud_maturity": 80.0, "innovation_level": 85.0, "business_criticality": 95.0,
                "communication_requirement": 75.0, "learning_requirement": 80.0, "hiring_difficulty": 88.0,
                "overall_confidence": 92.0
            })
        elif "hiring_profile" in prompt.lower():
            return json.dumps({
                "ideal_candidate_summary": "A seasoned AI engineer capable of owning the architecture.",
                "ideal_tech_stack": "Python, FastAPI, React, PostgreSQL",
                "ideal_team_size": "2-5 members", "ideal_industry_background": "SaaS / AI / Tech",
                "ideal_leadership_level": "Senior / Lead", "ideal_learning_ability": "Exceptional",
                "ideal_innovation_ability": "High", "ideal_communication_style": "Direct & Technical",
                "ideal_problem_solving_ability": "Architectural", "ideal_architecture_experience": "Microservices",
                "ideal_cloud_experience": "AWS / GCP", "ideal_devops_experience": "Docker, CI/CD",
                "ideal_ai_readiness": "Expert"
            })
        elif "knowledge_graph" in prompt.lower():
            return json.dumps({
                "nodes": [
                    {"entity_name": "Python", "entity_type": "Language"},
                    {"entity_name": "FastAPI", "entity_type": "Framework"}
                ],
                "edges": [
                    {"source": "FastAPI", "target": "Python", "relationship_type": "built_with"}
                ]
            })
        elif "reasoning" in prompt.lower() or "insights" in prompt.lower():
            return json.dumps({
                "reasoning": [
                    {"statement": "Role heavily emphasizes backend architecture over frontend.", "confidence": 0.95}
                ],
                "insights": [
                    {"insight_type": "Top Critical Skills", "description": "FastAPI and PostgreSQL are absolute requirements."}
                ]
            })
        
        return "{}"

    async def get_embeddings(self, text: str) -> list[float]:
        return [0.0] * 1536
