import uuid
from datetime import datetime
from events.event_bus import event_bus, Event
from events.event_types import EventType
from streaming.websocket_manager import manager

async def ws_event_dispatcher(event: Event):
    progress = event.data.get("progress", 0)
    message = event.data.get("message", "")
    await manager.stream_progress(
        client_id=event.client_id,
        state=event.event_type.value,
        progress=progress,
        message=message
    )

async def initialize_dispatcher():
    await event_bus.register_global(ws_event_dispatcher)

def create_event(client_id: str, event_type: EventType, progress: int, message: str, details: dict = None) -> Event:
    return Event(
        event_id=str(uuid.uuid4()),
        event_type=event_type,
        client_id=client_id,
        timestamp=datetime.utcnow(),
        data={
            "progress": progress,
            "message": message,
            **(details or {})
        }
    )
