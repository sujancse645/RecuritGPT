from typing import List, Dict, Any
from schemas.candidate_schema import CandidateSchema
from pydantic import ValidationError

class ValidationService:
    @staticmethod
    def validate(raw_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        valid_records = []
        errors = []
        seen_candidate_ids = set()
        
        for idx, row in enumerate(raw_data):
            # Check if this row was marked corrupted by the JSONL parser
            if "_corrupted_row_idx" in row:
                errors.append({
                    "row": row["_corrupted_row_idx"],
                    "error": f"JSON decode error: {row['_decode_error']}",
                    "type": "MALFORMED_JSON"
                })
                continue
                
            try:
                candidate_id = row.get("candidate_id")
                if not candidate_id:
                    errors.append({
                        "row": idx,
                        "error": "Field 'candidate_id' is missing.",
                        "type": "MISSING_FIELD"
                    })
                    continue
                
                # Check for duplicate records in the incoming batch
                if candidate_id in seen_candidate_ids:
                    errors.append({
                        "row": idx,
                        "error": f"Duplicate candidate_id: '{candidate_id}' is defined multiple times in the dataset.",
                        "type": "DUPLICATE_RECORD"
                    })
                    continue
                
                # Validate schema
                valid_candidate = CandidateSchema(**row)
                valid_records.append(valid_candidate.model_dump())
                seen_candidate_ids.add(candidate_id)
                
            except ValidationError as e:
                # Capture clean error messages from Pydantic
                for err in e.errors():
                    field_path = " -> ".join(str(loc) for loc in err["loc"])
                    errors.append({
                        "row": idx,
                        "error": f"Validation failed at '{field_path}': {err['msg']}",
                        "type": "INVALID_TYPE_OR_VALUE"
                    })
            except Exception as e:
                errors.append({
                    "row": idx,
                    "error": f"Unknown error during validation: {str(e)}",
                    "type": "UNKNOWN_ERROR"
                })
                
        return {
            "valid_records": valid_records,
            "errors": errors,
            "total_processed": len(raw_data),
            "total_valid": len(valid_records),
            "total_failed": len(errors)
        }
