from typing import Dict, Any, Type, Optional
from providers.base import VectorEmbeddingProvider, VectorSearchProvider, LLMProvider
from providers.sentence_transformer import SentenceTransformerProvider
from providers.faiss import FAISSProvider
from providers.qdrant import QdrantProvider
from providers.openai import OpenAIProvider
from providers.gemini import GeminiProvider
from providers.ollama import OllamaProvider
from providers.deepseek import DeepSeekProvider
from providers.llama import LlamaProvider

class ProviderManager:
    def __init__(self):
        self._embeddings: Dict[str, VectorEmbeddingProvider] = {
            "sentence_transformer": SentenceTransformerProvider(),
            "openai": OpenAIProvider(),
            "ollama": OllamaProvider()
        }
        self._vector_search: Dict[str, VectorSearchProvider] = {
            "faiss": FAISSProvider(),
            "qdrant": QdrantProvider()
        }
        self._llms: Dict[str, LLMProvider] = {
            "openai": OpenAIProvider(),
            "gemini": GeminiProvider(),
            "ollama": OllamaProvider(),
            "deepseek": DeepSeekProvider(),
            "llama": LlamaProvider()
        }

    def get_embedding_provider(self, name: str) -> VectorEmbeddingProvider:
        if name not in self._embeddings:
            raise ValueError(f"Embedding provider '{name}' not found.")
        return self._embeddings[name]

    def get_vector_search_provider(self, name: str) -> VectorSearchProvider:
        if name not in self._vector_search:
            raise ValueError(f"Vector search provider '{name}' not found.")
        return self._vector_search[name]

    def get_llm_provider(self, name: str) -> LLMProvider:
        if name not in self._llms:
            raise ValueError(f"LLM provider '{name}' not found.")
        return self._llms[name]

    def register_embedding_provider(self, name: str, provider: VectorEmbeddingProvider):
        self._embeddings[name] = provider

    def register_vector_search_provider(self, name: str, provider: VectorSearchProvider):
        self._vector_search[name] = provider

    def register_llm_provider(self, name: str, provider: LLMProvider):
        self._llms[name] = provider

# Global injection entrypoint
providers = ProviderManager()
