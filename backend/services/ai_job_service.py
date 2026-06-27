import json
import uuid
import asyncio
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.models import (
    Job, JobHiringProfile, JobSkill, JobComplexityScore, 
    JobReasoning, JobInsight, JobKnowledgeGraphNode, JobKnowledgeGraphEdge, ProcessingStatus
)
from providers.ai.factory import LLMFactory
from events.event_bus import event_bus
from events.event_types import EventType
from events.dispatcher import create_event

from prompts.job_extraction_prompt import JOB_EXTRACTION_PROMPT
from prompts.skill_normalization_prompt import SKILL_NORMALIZATION_PROMPT
from prompts.complexity_scoring_prompt import COMPLEXITY_SCORING_PROMPT
from prompts.knowledge_graph_prompt import KNOWLEDGE_GRAPH_PROMPT
from prompts.reasoning_prompt import REASONING_PROMPT
from prompts.insight_generation_prompt import INSIGHT_GENERATION_PROMPT

class AIJobService:
    @staticmethod
    async def process_job_description(client_id: str, job_id: uuid.UUID, text: str, db: AsyncSession):
        llm = LLMFactory.get_provider()
        
        # We process in parallel where possible to reduce latency, but stream events chronologically
        
        # 1. Job Extraction (Profile)
        await event_bus.publish(create_event(client_id, EventType.ParsingStarted, 10, "Extracting semantic Job Hiring Profile..."))
        try:
            profile_prompt = JOB_EXTRACTION_PROMPT.replace("{text}", text)
            profile_response = await llm.generate_completion(profile_prompt, json_mode=True)
            profile_data = json.loads(profile_response)
            
            hiring_profile = JobHiringProfile(
                job_id=job_id,
                ideal_candidate_summary=profile_data.get("ideal_candidate_summary"),
                ideal_career_progression=profile_data.get("ideal_career_progression"),
                ideal_tech_stack=profile_data.get("ideal_tech_stack"),
                ideal_team_size=profile_data.get("ideal_team_size"),
                ideal_industry_background=profile_data.get("ideal_industry_background"),
                ideal_leadership_level=profile_data.get("ideal_leadership_level"),
                ideal_learning_ability=profile_data.get("ideal_learning_ability"),
                ideal_innovation_ability=profile_data.get("ideal_innovation_ability"),
                ideal_communication_style=profile_data.get("ideal_communication_style"),
                ideal_problem_solving_ability=profile_data.get("ideal_problem_solving_ability"),
                ideal_architecture_experience=profile_data.get("ideal_architecture_experience"),
                ideal_cloud_experience=profile_data.get("ideal_cloud_experience"),
                ideal_devops_experience=profile_data.get("ideal_devops_experience"),
                ideal_ai_readiness=profile_data.get("ideal_ai_readiness")
            )
            db.add(hiring_profile)
        except Exception as e:
            print(f"Error in profile extraction: {e}")

        # 2. Skill Normalization
        await event_bus.publish(create_event(client_id, EventType.ValidationStarted, 30, "Normalizing technical taxonomy and extracting skills..."))
        try:
            skill_prompt = SKILL_NORMALIZATION_PROMPT.replace("{text}", text)
            skill_response = await llm.generate_completion(skill_prompt, json_mode=True)
            skill_data = json.loads(skill_response)
            skills_list = skill_data.get("skills", [])
            for s in skills_list:
                db.add(JobSkill(
                    job_id=job_id,
                    name=s.get("name"), category=s.get("category"), subcategory=s.get("subcategory"),
                    importance=s.get("importance", 50.0), confidence=s.get("confidence", 1.0),
                    is_required=s.get("is_required", False), is_preferred=s.get("is_preferred", False),
                    is_optional=s.get("is_optional", False), is_emerging=s.get("is_emerging", False),
                    is_transferable=s.get("is_transferable", False), is_deprecated=s.get("is_deprecated", False)
                ))
        except Exception as e:
            print(f"Error in skill normalization: {e}")

        # 3. Complexity Scoring
        await event_bus.publish(create_event(client_id, EventType.MappingStarted, 50, "Evaluating job complexity and hiring difficulty..."))
        try:
            complexity_prompt = COMPLEXITY_SCORING_PROMPT.replace("{text}", text)
            complexity_response = await llm.generate_completion(complexity_prompt, json_mode=True)
            complexity_data = json.loads(complexity_response)
            db.add(JobComplexityScore(
                job_id=job_id,
                technical_complexity=complexity_data.get("technical_complexity"),
                leadership_requirement=complexity_data.get("leadership_requirement"),
                architecture_requirement=complexity_data.get("architecture_requirement"),
                cloud_maturity=complexity_data.get("cloud_maturity"),
                innovation_level=complexity_data.get("innovation_level"),
                business_criticality=complexity_data.get("business_criticality"),
                communication_requirement=complexity_data.get("communication_requirement"),
                learning_requirement=complexity_data.get("learning_requirement"),
                hiring_difficulty=complexity_data.get("hiring_difficulty"),
                overall_confidence=complexity_data.get("overall_confidence")
            ))
        except Exception as e:
            print(f"Error in complexity scoring: {e}")

        # 4. Knowledge Graph
        await event_bus.publish(create_event(client_id, EventType.DatabaseInsertStarted, 70, "Generating Semantic Knowledge Graph..."))
        try:
            kg_prompt = KNOWLEDGE_GRAPH_PROMPT.replace("{text}", text)
            kg_response = await llm.generate_completion(kg_prompt, json_mode=True)
            kg_data = json.loads(kg_response)
            
            node_map = {}
            for node in kg_data.get("nodes", []):
                n = JobKnowledgeGraphNode(job_id=job_id, entity_name=node.get("entity_name"), entity_type=node.get("entity_type"))
                db.add(n)
                node_map[node.get("entity_name")] = n
            
            # Need to flush to get IDs for edges
            await db.flush()
            
            for edge in kg_data.get("edges", []):
                s_name = edge.get("source")
                t_name = edge.get("target")
                if s_name in node_map and t_name in node_map:
                    db.add(JobKnowledgeGraphEdge(
                        source_node_id=node_map[s_name].id,
                        target_node_id=node_map[t_name].id,
                        relationship_type=edge.get("relationship_type")
                    ))
        except Exception as e:
            print(f"Error in knowledge graph generation: {e}")

        # 5. Reasoning & Insights
        await event_bus.publish(create_event(client_id, EventType.AIReasoningStarted, 85, "Generating Recruiter Reasoning and Insights..."))
        try:
            # Run concurrently
            reason_task = llm.generate_completion(REASONING_PROMPT.replace("{text}", text), json_mode=True)
            insight_task = llm.generate_completion(INSIGHT_GENERATION_PROMPT.replace("{text}", text), json_mode=True)
            reason_response, insight_response = await asyncio.gather(reason_task, insight_task)
            
            reason_data = json.loads(reason_response)
            for r in reason_data.get("reasoning", []):
                db.add(JobReasoning(job_id=job_id, statement=r.get("statement"), confidence=r.get("confidence")))
                
            insight_data = json.loads(insight_response)
            for i in insight_data.get("insights", []):
                db.add(JobInsight(job_id=job_id, insight_type=i.get("insight_type"), description=i.get("description")))
        except Exception as e:
            print(f"Error in reasoning/insights: {e}")

        # Commit everything
        await event_bus.publish(create_event(client_id, EventType.DatabaseInsertCompleted, 95, "Committing Intelligence to Database..."))
        await db.commit()
        await event_bus.publish(create_event(client_id, EventType.Completed, 100, "Job Analysis Complete."))
