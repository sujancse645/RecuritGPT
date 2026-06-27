from typing import Dict, Any, Optional
import logging
from providers.base import LLMProvider

logger = logging.getLogger("providers.deepseek")

class DeepSeekProvider(LLMProvider):
    def __init__(self, api_key: str = "mock-key", model_name: str = "deepseek-chat"):
        self.api_key = api_key
        self.model_name = model_name

    async def generate_completion(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        logger.info(f"DeepSeek({self.model_name}): Mock generating completion.")
        return "Mock completion from DeepSeek"

    async def generate_json(self, prompt: str, schema: Any, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"DeepSeek({self.model_name}): Mock generating JSON.")
        return {"status": "mock", "source": "DeepSeek"}
