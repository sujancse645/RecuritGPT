from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class VectorEmbeddingProvider(ABC):
    @abstractmethod
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate vector embeddings for a list of texts."""
        pass

class VectorSearchProvider(ABC):
    @abstractmethod
    async def index_vectors(self, vectors: List[List[float]], payloads: List[Dict[str, Any]]) -> bool:
        """Index vectors with optional payloads."""
        pass

    @abstractmethod
    async def search_vectors(self, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        """Search vector database."""
        pass

class LLMProvider(ABC):
    @abstractmethod
    async def generate_completion(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        """Generate text completion from prompt."""
        pass

    @abstractmethod
    async def generate_json(self, prompt: str, schema: Any, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON response."""
        pass
