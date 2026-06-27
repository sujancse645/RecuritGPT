import asyncio
from typing import Callable, List, Dict, Awaitable, Any
from pydantic import BaseModel
from datetime import datetime
from events.event_types import EventType

class Event(BaseModel):
    event_id: str
    event_type: EventType
    client_id: str
    timestamp: datetime
    data: Dict[str, Any]

# Define event handler type
EventHandler = Callable[[Event], Awaitable[None]]

class EventBus:
    def __init__(self):
        self._handlers: Dict[EventType, List[EventHandler]] = {}
        self._global_handlers: List[EventHandler] = []
        self._lock = asyncio.Lock()

    async def register(self, event_type: EventType, handler: EventHandler):
        async with self._lock:
            if event_type not in self._handlers:
                self._handlers[event_type] = []
            self._handlers[event_type].append(handler)

    async def register_global(self, handler: EventHandler):
        async with self._lock:
            self._global_handlers.append(handler)

    async def publish(self, event: Event):
        tasks = []
        
        # Get specific handlers
        handlers = self._handlers.get(event.event_type, [])
        for handler in handlers:
            tasks.append(asyncio.create_task(self._safe_run(handler, event)))
            
        # Get global handlers
        for handler in self._global_handlers:
            tasks.append(asyncio.create_task(self._safe_run(handler, event)))
            
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _safe_run(self, handler: EventHandler, event: Event):
        try:
            await handler(event)
        except Exception as e:
            import traceback
            print(f"Error executing event handler: {e}\n{traceback.format_exc()}")

# Global singleton
event_bus = EventBus()
