import asyncio
from typing import NamedTuple, Any

class IngestionJob(NamedTuple):
    client_id: str
    filename: str
    content: bytes
    db_session_factory: Any # Callable returning an AsyncSession local context manager

class JobQueue:
    def __init__(self):
        self._queue = asyncio.Queue()

    async def enqueue(self, job: IngestionJob):
        await self._queue.put(job)

    async def dequeue(self) -> IngestionJob:
        return await self._queue.get()

    def task_done(self):
        self._queue.task_done()

    def size(self) -> int:
        return self._queue.qsize()

# Global job queue
ingestion_queue = JobQueue()
