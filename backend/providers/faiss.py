from typing import List, Dict, Any
import logging
import numpy as np
from providers.base import VectorSearchProvider

logger = logging.getLogger("providers.faiss")

class FAISSProvider(VectorSearchProvider):
    def __init__(self, dimension: int = 384):
        import faiss
        self.dimension = dimension
        # Use L2 distance (Inner Product is IndexFlatIP if normalized)
        self.index = faiss.IndexFlatL2(dimension)
        # We need to map FAISS integer IDs to our string UUID payloads
        self.id_to_payload: Dict[int, Dict[str, Any]] = {}
        self.current_id = 0

    async def index_vectors(self, vectors: List[List[float]], payloads: List[Dict[str, Any]]) -> bool:
        if not vectors:
            return True
            
        import faiss
        
        vectors_np = np.array(vectors).astype('float32')
        
        # Add to index
        self.index.add(vectors_np)
        
        # Map IDs to payloads
        for payload in payloads:
            self.id_to_payload[self.current_id] = payload
            self.current_id += 1
            
        logger.info(f"FAISS: Indexed {len(vectors)} vectors. Total: {self.index.ntotal}")
        return True

    async def search_vectors(self, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        if self.index.ntotal == 0:
            return []
            
        import faiss
        
        query_np = np.array([query_vector]).astype('float32')
        distances, indices = self.index.search(query_np, limit)
        
        results = []
        for i in range(len(indices[0])):
            idx = int(indices[0][i])
            if idx != -1 and idx in self.id_to_payload:
                # distance is L2, smaller is better. Let's convert to a similarity score 0-1
                dist = float(distances[0][i])
                similarity = max(0.0, 1.0 - (dist / 100.0)) # Naive scaling for demo
                
                payload = self.id_to_payload[idx].copy()
                payload["_score"] = similarity
                payload["_distance"] = dist
                results.append(payload)
                
        return results
