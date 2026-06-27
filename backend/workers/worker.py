import asyncio
import logging
from jobs.job_queue import ingestion_queue

logger = logging.getLogger("background_worker")

class BackgroundWorker:
    def __init__(self):
        self._running = False
        self._task = None

    async def start(self):
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._worker_loop())
        logger.info("Background worker started.")

    async def stop(self):
        if not self._running:
            return
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Background worker stopped.")

    async def _worker_loop(self):
        from services.dataset_service import process_dataset_async
        while self._running:
            try:
                job = await ingestion_queue.dequeue()
                logger.info(f"Processing job for client {job.client_id}, file {job.filename}")
                
                async with job.db_session_factory() as db:
                    try:
                        await process_dataset_async(
                            client_id=job.client_id,
                            filename=job.filename,
                            content=job.content,
                            db=db
                        )
                    except Exception as e:
                        logger.error(f"Error processing dataset: {e}", exc_info=True)
                
                ingestion_queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Worker loop error: {e}", exc_info=True)
                await asyncio.sleep(1)

# Global worker instance
background_worker = BackgroundWorker()
