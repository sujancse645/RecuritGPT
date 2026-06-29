import os
from providers.base import VectorSearchProvider
from providers.faiss import FAISSProvider

class VectorFactory:
    _instance = None
    
    @classmethod
    def get_provider(cls) -> VectorSearchProvider:
        # Singleton pattern to keep FAISS index in memory across requests
        if cls._instance is None:
            provider_type = os.getenv("VECTOR_DB_PROVIDER", "faiss").lower()
            if provider_type == "qdrant":
                from providers.qdrant import QdrantProvider
                cls._instance = QdrantProvider()
            else:
                # Default to FAISS for hackathon / fast local dev
                cls._instance = FAISSProvider(dimension=384) # 384 for all-MiniLM-L6-v2
        return cls._instance
