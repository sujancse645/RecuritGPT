import os
from providers.ai.llm import ILLMProvider, GeminiProvider, OpenAIProvider, OllamaProvider, MockLLMProvider

class LLMFactory:
    @staticmethod
    def get_provider() -> ILLMProvider:
        gemini_key = os.getenv("GEMINI_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        ollama_url = os.getenv("OLLAMA_URL")

        if gemini_key:
            return GeminiProvider(api_key=gemini_key)
        elif openai_key:
            return OpenAIProvider(api_key=openai_key)
        elif ollama_url:
            return OllamaProvider(base_url=ollama_url)
        else:
            return MockLLMProvider()
