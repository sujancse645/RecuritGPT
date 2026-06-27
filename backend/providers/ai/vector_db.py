from abc import ABC, abstractmethod
from typing import List

class IVectorDBProvider(ABC):
    @abstractmethod
    async def insert_vectors(self, collection_name: str, vectors: List[dict]):
        """Insert vectors into the database"""
        pass

    @abstractmethod
    async def search_similar(self, collection_name: str, query_vector: List[float], top_k: int = 5):
        """Search for similar vectors"""
        pass

class FAISSProvider(IVectorDBProvider):
    async def insert_vectors(self, collection_name: str, vectors: List[dict]):
        raise NotImplementedError("FAISS Provider placeholder")

    async def search_similar(self, collection_name: str, query_vector: List[float], top_k: int = 5):
        raise NotImplementedError("FAISS Provider placeholder")

class QdrantProvider(IVectorDBProvider):
    async def insert_vectors(self, collection_name: str, vectors: List[dict]):
        raise NotImplementedError("Qdrant Provider placeholder")

    async def search_similar(self, collection_name: str, query_vector: List[float], top_k: int = 5):
        raise NotImplementedError("Qdrant Provider placeholder")
