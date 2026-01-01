from typing import List, Dict, Any
from .knowledge_base import knowledge_base
from config import settings


class ChatHandler:
    """Handle ChatGPT-style conversations using RAG"""
    
    def __init__(self):
        """Initialize chat handler"""
        self.system_prompt = """You are an AI assistant for a personal portfolio website. 
You can only answer questions about the portfolio owner's professional information, including:
- Resume and work experience
- Projects and technical skills
- Education and certifications
- Blog posts and articles

If asked about anything outside this scope, politely decline and redirect to portfolio-related topics.
Always be professional, concise, and helpful."""
    
    def generate_response(self, query: str, chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generate a response to a user query using RAG
        
        Args:
            query: User's question or message
            chat_history: Optional list of previous messages
            
        Returns:
            Dictionary with response and sources
        """
        # Search knowledge base for relevant context
        relevant_docs = knowledge_base.search(query, n_results=5)
        
        # Build context from retrieved documents
        context_parts = []
        sources = []
        
        for doc in relevant_docs:
            context_parts.append(f"[{doc['metadata'].get('type', 'info')}] {doc['text']}")
            sources.append({
                "type": doc['metadata'].get('type'),
                "title": doc['metadata'].get('title', 'Unknown'),
                "id": doc['id']
            })
        
        context = "\n\n".join(context_parts)
        
        # Generate response (simple template-based for now)
        # In production, this would use an LLM like OpenAI GPT
        response = self._generate_template_response(query, context, relevant_docs)
        
        return {
            "response": response,
            "sources": sources[:3],  # Top 3 sources
            "context_used": len(relevant_docs) > 0
        }
    
    def _generate_template_response(self, query: str, context: str, docs: List[Dict]) -> str:
        """
        Generate a template-based response
        (In production, replace with actual LLM call)
        
        Args:
            query: User query
            context: Retrieved context
            docs: Retrieved documents
            
        Returns:
            Generated response string
        """
        query_lower = query.lower()
        
        # Check if we have relevant context
        if not docs:
            return ("I don't have specific information about that in my knowledge base. "
                   "Feel free to ask me about projects, skills, experience, or blog posts!")
        
        # Simple keyword-based responses
        if any(word in query_lower for word in ["project", "projects", "built", "created"]):
            project_docs = [d for d in docs if d['metadata'].get('type') == 'project']
            if project_docs:
                response = "Here are some relevant projects:\n\n"
                for doc in project_docs[:3]:
                    response += f"• {doc['metadata'].get('title', 'Project')}: {doc['text'][:150]}...\n\n"
                return response
        
        elif any(word in query_lower for word in ["skill", "skills", "technology", "tech"]):
            skill_docs = [d for d in docs if d['metadata'].get('type') == 'skill']
            if skill_docs:
                response = "Here are relevant skills:\n\n"
                for doc in skill_docs[:5]:
                    response += f"• {doc['text']}\n"
                return response
        
        elif any(word in query_lower for word in ["experience", "work", "job", "worked"]):
            exp_docs = [d for d in docs if d['metadata'].get('type') == 'experience']
            if exp_docs:
                response = "Here's relevant work experience:\n\n"
                for doc in exp_docs[:3]:
                    response += f"• {doc['text']}\n\n"
                return response
        
        elif any(word in query_lower for word in ["blog", "article", "wrote", "writing"]):
            blog_docs = [d for d in docs if d['metadata'].get('type') == 'blog']
            if blog_docs:
                response = "Here are some relevant blog posts:\n\n"
                for doc in blog_docs[:3]:
                    response += f"• {doc['metadata'].get('title', 'Post')}: {doc['text'][:100]}...\n\n"
                return response
        
        # Default response with context
        return f"Based on the portfolio information:\n\n{docs[0]['text'][:300]}...\n\nWould you like to know more about specific projects, skills, or experience?"


# Global instance
chat_handler = ChatHandler()
