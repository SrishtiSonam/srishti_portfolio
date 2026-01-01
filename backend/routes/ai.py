from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from ai.chat_handler import chat_handler
from ai.search_handler import search_handler

router = APIRouter(prefix="/api/ai", tags=["AI"])


class ChatRequest(BaseModel):
    message: str
    chat_history: List[Dict[str, str]] | None = None


class ChatResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]]
    context_used: bool


class SearchRequest(BaseModel):
    query: str
    filters: Dict[str, Any] | None = None


class SearchResult(BaseModel):
    id: str
    type: str
    title: str
    excerpt: str
    relevance: float
    metadata: Dict[str, Any]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    ChatGPT-style AI chat endpoint
    
    Processes user messages and returns AI-generated responses
    based on portfolio knowledge base
    """
    result = chat_handler.generate_response(
        query=request.message,
        chat_history=request.chat_history
    )
    
    return ChatResponse(**result)


@router.post("/search", response_model=List[SearchResult])
async def search(request: SearchRequest):
    """
    AI-powered semantic search endpoint
    
    Performs vector similarity search across portfolio content
    """
    results = search_handler.search(
        query=request.query,
        filters=request.filters
    )
    
    return [SearchResult(**result) for result in results]


@router.get("/suggestions")
async def get_suggestions(q: str, limit: int = 5):
    """
    Get search suggestions based on partial query
    """
    suggestions = search_handler.suggest(q, limit=limit)
    return {"suggestions": suggestions}
