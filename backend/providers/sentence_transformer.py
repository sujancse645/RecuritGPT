from typing import List
import logging
from providers.base import VectorEmbeddingProvider

logger = logging.getLogger("providers.sentence_transformer")

class SentenceTransformerProvider(VectorEmbeddingProvider):
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        logger.info(f"SentenceTransformer({self.model_name}): Mock generating embeddings for {len(texts)} texts.")
        # Return mock zero vectors matching standard dimensions (384)
        return [[0.0] * 384 for _ in texts]
