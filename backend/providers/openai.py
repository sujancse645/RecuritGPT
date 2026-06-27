from typing import List, Dict, Any, Optional
import logging
from providers.base import LLMProvider, VectorEmbeddingProvider

logger = logging.getLogger("providers.openai")

class OpenAIProvider(LLMProvider, VectorEmbeddingProvider):
    def __init__(self, api_key: str = "mock-key", model_name: str = "gpt-4-turbo"):
        self.api_key = api_key
        self.model_name = model_name

    async def generate_completion(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        logger.info(f"OpenAI({self.model_name}): Mock generating completion.")
        return "Mock completion from OpenAI"

    async def generate_json(self, prompt: str, schema: Any, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"OpenAI({self.model_name}): Mock generating JSON.")
        return {"status": "mock", "source": "OpenAI"}

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        logger.info(f"OpenAI(text-embedding-3-small): Mock generating embeddings for {len(texts)} texts.")
        return [[0.0] * 1536 for _ in texts]
