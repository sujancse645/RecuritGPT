from typing import Dict, Any, Optional
import logging
from providers.base import LLMProvider

logger = logging.getLogger("providers.gemini")

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str = "mock-key", model_name: str = "gemini-1.5-pro"):
        self.api_key = api_key
        self.model_name = model_name

    async def generate_completion(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        logger.info(f"Gemini({self.model_name}): Mock generating completion.")
        return "Mock completion from Google Gemini"

    async def generate_json(self, prompt: str, schema: Any, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Gemini({self.model_name}): Mock generating JSON.")
        return {"status": "mock", "source": "Gemini"}
