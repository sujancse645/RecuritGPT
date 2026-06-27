from typing import List, Dict, Any
import logging
from providers.base import VectorSearchProvider

logger = logging.getLogger("providers.faiss")

class FAISSProvider(VectorSearchProvider):
    def __init__(self, dimension: int = 384):
        self.dimension = dimension

    async def index_vectors(self, vectors: List[List[float]], payloads: List[Dict[str, Any]]) -> bool:
        logger.info(f"FAISS: Mock indexing {len(vectors)} vectors.")
        return True

    async def search_vectors(self, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        logger.info(f"FAISS: Mock searching vectors.")
        return []
