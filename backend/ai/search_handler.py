from typing import List, Dict, Any
from .knowledge_base import knowledge_base


class SearchHandler:
    """Handle AI-powered search functionality"""
    
    def search(self, query: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Perform AI-powered semantic search
        
        Args:
            query: Search query text
            filters: Optional filters (type, tags, etc.)
            
        Returns:
            List of search results with relevance scores
        """
        # Perform vector search
        results = knowledge_base.search(query, n_results=10)
        
        # Apply filters if provided
        if filters:
            results = self._apply_filters(results, filters)
        
        # Format results for frontend
        formatted_results = []
        for result in results:
            formatted_results.append({
                "id": result["id"],
                "type": result["metadata"].get("type"),
                "title": result["metadata"].get("title", "Untitled"),
                "excerpt": result["text"][:200] + "..." if len(result["text"]) > 200 else result["text"],
                "relevance": 1 - (result["distance"] or 0),  # Convert distance to similarity
                "metadata": result["metadata"]
            })
        
        return formatted_results
    
    def _apply_filters(self, results: List[Dict], filters: Dict[str, Any]) -> List[Dict]:
        """
        Apply filters to search results
        
        Args:
            results: Search results
            filters: Filter criteria
            
        Returns:
            Filtered results
        """
        filtered = results
        
        # Filter by type
        if "type" in filters and filters["type"]:
            filtered = [r for r in filtered if r["metadata"].get("type") == filters["type"]]
        
        # Filter by tags
        if "tags" in filters and filters["tags"]:
            filtered = [
                r for r in filtered 
                if any(tag in r["metadata"].get("tags", []) for tag in filters["tags"])
            ]
        
        return filtered
    
    def suggest(self, partial_query: str, limit: int = 5) -> List[str]:
        """
        Provide search suggestions based on partial query
        
        Args:
            partial_query: Partial search query
            limit: Maximum number of suggestions
            
        Returns:
            List of suggested queries
        """
        # Simple implementation - in production, use a more sophisticated approach
        suggestions = []
        
        query_lower = partial_query.lower()
        
        # Common portfolio-related suggestions
        all_suggestions = [
            "projects",
            "skills and technologies",
            "work experience",
            "education",
            "blog posts",
            "contact information",
            "resume",
            "certifications",
            "achievements"
        ]
        
        # Filter suggestions that match partial query
        for suggestion in all_suggestions:
            if query_lower in suggestion or suggestion.startswith(query_lower):
                suggestions.append(suggestion)
        
        return suggestions[:limit]


# Global instance
search_handler = SearchHandler()
