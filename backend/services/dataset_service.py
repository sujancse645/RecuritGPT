import asyncio
import io
import zipfile
import gzip
import uuid
import json
import csv
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from database.models import Dataset, Job, ProcessingStatus, ProcessingLog
from repositories.candidate_repository import CandidateRepository
from services.job_service import JobService
from validation.validator import ValidationService
from events.event_bus import event_bus
from events.event_types import EventType
from events.dispatcher import create_event
from ingestion.parsers import ParserFactory

async def process_dataset_async(client_id: str, filename: str, content: bytes, db: AsyncSession):
    status_row = None
    dataset_id = uuid.uuid4()
    job_id = None
    
    try:
        # Initial status logging
        status_row = ProcessingStatus(
            dataset_name=filename,
            status="PROCESSING",
            total_records=0,
            processed_records=0,
            failed_records=0
        )
        db.add(status_row)
        await db.commit()
        await db.refresh(status_row)
        
        # Log to db logs
        log_entry = ProcessingLog(
            processing_status_id=status_row.id,
            level="INFO",
            message=f"Queue picked up dataset {filename} for client {client_id}"
        )
        db.add(log_entry)
        await db.commit()
        
        # 1. Determine dataset version
        version_stmt = select(func.count(Dataset.id))
        version_res = await db.execute(version_stmt)
        version_count = version_res.scalar() or 0
        version_str = f"v{version_count + 1}.0.0"
        
        # Create dataset row
        dataset = Dataset(
            id=dataset_id,
            name=filename,
            version=version_str,
            uploaded_at=datetime.utcnow(),
            source="RecruitGPT Platform",
            status="PROCESSING",
            record_count=0,
            job_count=1
        )
        db.add(dataset)
        await db.commit()
        
        # 2. Check zip archive
        is_zip = filename.lower().endswith('.zip')
        candidates_filename = filename
        extracted_files = {}
        
        if is_zip:
            await event_bus.publish(create_event(client_id, EventType.ArchiveDetected, 15, "Archive ZIP detected. Accessing streaming reader..."))
            try:
                zip_ref = zipfile.ZipFile(io.BytesIO(content))
                for name in zip_ref.namelist():
                    if name.endswith('/') or '__MACOSX' in name or '.DS_Store' in name or name.split('/')[-1].startswith('.'):
                        continue
                    basename = name.split('/')[-1]
                    extracted_files[basename] = zip_ref.read(name)
            except Exception as e:
                raise ValueError(f"Invalid or corrupted ZIP archive: {e}")
        else:
            extracted_files[filename] = content
            
        # Identify Job Description and Candidates
        job_desc_content = None
        job_desc_filename = None
        candidates_content = None
        
        for name, file_bytes in extracted_files.items():
            name_lower = name.lower()
            if "job_description" in name_lower or "job-description" in name_lower or "jd" in name_lower:
                if name_lower.endswith(('.docx', '.pdf', '.txt', '.md')):
                    job_desc_content = file_bytes
                    job_desc_filename = name
            elif "candidates" in name_lower or "candidate_profiles" in name_lower:
                if name_lower.endswith(('.jsonl', '.json', '.csv', '.jsonl.gz', '.gz')):
                    if "sample" in name_lower and candidates_content is not None:
                        continue
                    candidates_content = file_bytes
                    candidates_filename = name

        # 3. Job Description Parsing & DB Insertion
        job_title = "Senior AI Engineer"
        job_desc_text = "Senior AI Engineer Founding Team role at Redrob AI."
        
        await event_bus.publish(create_event(client_id, EventType.ParsingStarted, 30, "Parsing job description parameters..."))
        if job_desc_content:
            try:
                parser = ParserFactory.get_parser(job_desc_filename)
                parsed_res = parser.parse(job_desc_content)
                if isinstance(parsed_res, str):
                    job_desc_text = parsed_res
                    lines = [l.strip() for l in job_desc_text.splitlines() if l.strip()]
                    if lines:
                        first_line = lines[0]
                        if ":" in first_line:
                            job_title = first_line.split(":", 1)[1].strip()
                        else:
                            job_title = first_line
                        job_title = job_title.replace("**", "").replace("#", "").strip()
            except Exception as e:
                log_err = ProcessingLog(processing_status_id=status_row.id, level="WARN", message=f"Failed to parse job description: {e}")
                db.add(log_err)
                await db.commit()
                
        # Save Job in DB
        await event_bus.publish(create_event(client_id, EventType.ParsingCompleted, 45, f"Saving job parameters: '{job_title}'"))
        job = Job(
            title=job_title,
            description=job_desc_text,
            department="AI Engineering",
            location="Pune/Noida, India",
            employment_type="Full-time"
        )
        db.add(job)
        await db.commit()
        await db.refresh(job)
        job_id = job.id
        
        # 5. Stream & Parse Candidates in chunks
        if not candidates_content:
            await event_bus.publish(create_event(client_id, EventType.ValidationStarted, 55, "No candidate data provided, proceeding with zero candidates..."))
            total_processed = 0
            total_valid = 0
            total_failed = 0
        else:
            await event_bus.publish(create_event(client_id, EventType.ValidationStarted, 55, "Beginning streaming batch ingestion..."))
            
            # Define stream reader from candidates_content bytes
            stream = io.BytesIO(candidates_content)
        if candidates_filename.endswith('.gz') or candidates_filename.endswith('.jsonl.gz'):
            stream = gzip.GzipFile(fileobj=stream)
            
        repo = CandidateRepository(db)
        
        batch = []
        batch_size = 100
        total_valid = 0
        total_processed = 0
        total_failed = 0
        
        # If it's JSONL
        if candidates_filename.endswith('.jsonl') or candidates_filename.endswith('.jsonl.gz') or candidates_filename.endswith('.gz') or candidates_filename.endswith('.jsonl'):
            for idx, line in enumerate(stream):
                line_str = line.decode('utf-8').strip()
                if not line_str:
                    continue
                try:
                    record = json.loads(line_str)
                except json.JSONDecodeError as e:
                    record = {"_corrupted_row_idx": idx, "_decode_error": str(e), "line": line_str}
                batch.append(record)
                
                if len(batch) >= batch_size:
                    val_count, ins_count, fail_count = await validate_and_insert_batch(
                        client_id, db, repo, batch, job_id, dataset_id, total_valid
                    )
                    total_processed += len(batch)
                    total_valid += ins_count
                    total_failed += fail_count
                    batch = []
                    await asyncio.sleep(0.05)
        # If it's JSON
        elif candidates_filename.endswith('.json'):
            raw_data = json.loads(stream.read().decode('utf-8'))
            records = raw_data if isinstance(raw_data, list) else [raw_data]
            for record in records:
                batch.append(record)
                if len(batch) >= batch_size:
                    val_count, ins_count, fail_count = await validate_and_insert_batch(
                        client_id, db, repo, batch, job_id, dataset_id, total_valid
                    )
                    total_processed += len(batch)
                    total_valid += ins_count
                    total_failed += fail_count
                    batch = []
                    await asyncio.sleep(0.05)
        # If it's CSV
        elif candidates_filename.endswith('.csv'):
            text = stream.read().decode('utf-8')
            reader = csv.DictReader(io.StringIO(text))
            for row in reader:
                batch.append(row)
                if len(batch) >= batch_size:
                    val_count, ins_count, fail_count = await validate_and_insert_batch(
                        client_id, db, repo, batch, job_id, dataset_id, total_valid
                    )
                    total_processed += len(batch)
                    total_valid += ins_count
                    total_failed += fail_count
                    batch = []
                    await asyncio.sleep(0.05)
                    
        # Flush remaining batch
        if batch:
            val_count, ins_count, fail_count = await validate_and_insert_batch(
                client_id, db, repo, batch, job_id, dataset_id, total_valid
            )
            total_processed += len(batch)
            total_valid += ins_count
            total_failed += fail_count
            
        # 6. Finalize processing status
        status_row.status = "COMPLETED"
        status_row.total_records = total_processed
        status_row.processed_records = total_valid
        status_row.failed_records = total_failed
        await db.commit()
        
        # Update dataset row
        dataset.status = "COMPLETED"
        dataset.record_count = total_processed
        await db.commit()
        
        # Publish final success event
        await event_bus.publish(create_event(
            client_id, 
            EventType.Completed, 
            100, 
            f"Successfully processed challenge dataset. Ingested {total_valid} candidates."
        ))
        
    except Exception as e:
        import traceback
        error_msg = f"Ingestion aborted: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        
        # Update dataset row
        try:
            dataset_stmt = select(Dataset).where(Dataset.id == dataset_id)
            res = await db.execute(dataset_stmt)
            ds_row = res.scalar_one_or_none()
            if ds_row:
                ds_row.status = "FAILED"
                await db.commit()
        except Exception:
            pass
            
        # Update processing status
        if status_row:
            try:
                status_row.status = "FAILED"
                status_row.error_log = error_msg[:1000]
                await db.commit()
                
                log_err = ProcessingLog(
                    processing_status_id=status_row.id,
                    level="ERROR",
                    message=f"Ingestion crashed: {str(e)}"
                )
                db.add(log_err)
                await db.commit()
            except Exception:
                pass
                
        from streaming.websocket_manager import manager
        await manager.stream_progress(client_id, "ERROR", 0, f"Processing failed: {str(e)}")

async def validate_and_insert_batch(
    client_id: str, 
    db: AsyncSession, 
    repo: CandidateRepository, 
    batch: List[Dict[str, Any]], 
    job_id: Any, 
    dataset_id: Any, 
    running_total: int
) -> tuple:
    # 1. Validation Started
    await event_bus.publish(create_event(client_id, EventType.ValidationStarted, 65, f"Validating batch of {len(batch)} candidates..."))
    
    report = ValidationService.validate(batch)
    valid_records = report["valid_records"]
    errors = report["errors"]
    
    # 2. Validation Completed
    await event_bus.publish(create_event(client_id, EventType.ValidationCompleted, 75, f"Validated: {len(valid_records)} valid, {len(errors)} failed."))
    
    # 3. Mapping and Insert
    inserted_count = 0
    if valid_records:
        await event_bus.publish(create_event(client_id, EventType.MappingStarted, 80, f"Mapping database relations..."))
        
        # Capacity limit: Ingest up to 1000 candidates for command center display performance
        allowed_to_insert = max(0, 1000 - running_total)
        records_to_insert = valid_records[:allowed_to_insert]
        
        if records_to_insert:
            await event_bus.publish(create_event(client_id, EventType.DatabaseInsertStarted, 85, f"Inserting {len(records_to_insert)} records to DB..."))
            inserted_count = await repo.bulk_insert(records_to_insert, job_id=job_id, dataset_id=dataset_id)
            await event_bus.publish(create_event(client_id, EventType.DatabaseInsertCompleted, 95, f"Database insert completed for batch."))
            
    return len(batch), inserted_count, len(errors)
