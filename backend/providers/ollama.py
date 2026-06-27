from typing import List, Dict, Any, Optional
import logging
from providers.base import LLMProvider, VectorEmbeddingProvider

logger = logging.getLogger("providers.ollama")

class OllamaProvider(LLMProvider, VectorEmbeddingProvider):
    def __init__(self, endpoint: str = "http://localhost:11434", model_name: str = "llama3"):
        self.endpoint = endpoint
        self.model_name = model_name

    async def generate_completion(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        logger.info(f"Ollama({self.model_name}): Mock generating completion.")
        return "Mock completion from Ollama"

    async def generate_json(self, prompt: str, schema: Any, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Ollama({self.model_name}): Mock generating JSON.")
        return {"status": "mock", "source": "Ollama"}

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        logger.info(f"Ollama({self.model_name}): Mock generating embeddings for {len(texts)} texts.")
        return [[0.0] * 4096 for _ in texts]
