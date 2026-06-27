from typing import Dict, Any, Optional
import logging
from providers.base import LLMProvider

logger = logging.getLogger("providers.llama")

class LlamaProvider(LLMProvider):
    def __init__(self, model_path: str = "mock-path", model_name: str = "Llama-3-8B-Instruct"):
        self.model_path = model_path
        self.model_name = model_name

    async def generate_completion(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        logger.info(f"Llama({self.model_name}): Mock generating completion.")
        return "Mock completion from local Llama"

    async def generate_json(self, prompt: str, schema: Any, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Llama({self.model_name}): Mock generating JSON.")
        return {"status": "mock", "source": "Llama"}
