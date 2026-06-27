from enum import Enum

class EventType(str, Enum):
    ArchiveDetected = "ArchiveDetected"
    ParsingStarted = "ParsingStarted"
    ParsingCompleted = "ParsingCompleted"
    ValidationStarted = "ValidationStarted"
    ValidationCompleted = "ValidationCompleted"
    MappingStarted = "MappingStarted"
    MappingCompleted = "MappingCompleted"
    DatabaseInsertStarted = "DatabaseInsertStarted"
    DatabaseInsertCompleted = "DatabaseInsertCompleted"
    EmbeddingStarted = "EmbeddingStarted"
    SemanticSearchStarted = "SemanticSearchStarted"
    RankingStarted = "RankingStarted"
    AIReasoningStarted = "AIReasoningStarted"
    DebateStarted = "DebateStarted"
    ExplainabilityStarted = "ExplainabilityStarted"
    Completed = "Completed"
