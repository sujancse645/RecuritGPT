from typing import List, Dict, Any
import logging
from providers.base import VectorSearchProvider

logger = logging.getLogger("providers.qdrant")

class QdrantProvider(VectorSearchProvider):
    def __init__(self, host: str = "localhost", port: int = 6333):
        self.host = host
        self.port = port

    async def index_vectors(self, vectors: List[List[float]], payloads: List[Dict[str, Any]]) -> bool:
        logger.info(f"Qdrant({self.host}:{self.port}): Mock indexing {len(vectors)} vectors.")
        return True

    async def search_vectors(self, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        logger.info(f"Qdrant({self.host}:{self.port}): Mock searching vectors.")
        return []
