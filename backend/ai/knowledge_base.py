import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any
import json
from pathlib import Path
from config import settings
from .embeddings import embedding_generator


class KnowledgeBase:
    """Vector store for portfolio knowledge base using ChromaDB"""
    
    def __init__(self):
        """Initialize ChromaDB client and collection"""
        # Create persistent client
        self.client = chromadb.PersistentClient(
            path=settings.VECTOR_STORE_PATH,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="portfolio_knowledge",
            metadata={"description": "Personal portfolio knowledge base"}
        )
    
    def add_document(self, doc_id: str, text: str, metadata: Dict[str, Any]):
        """
        Add a document to the knowledge base
        
        Args:
            doc_id: Unique document identifier
            text: Document text content
            metadata: Document metadata (type, title, etc.)
        """
        # Generate embedding
        embedding = embedding_generator.generate(text)
        
        # Add to collection
        self.collection.add(
            ids=[doc_id],
            embeddings=[embedding],
            documents=[text],
            metadatas=[metadata]
        )
    
    def add_documents_batch(self, documents: List[Dict[str, Any]]):
        """
        Add multiple documents to the knowledge base
        
        Args:
            documents: List of dicts with 'id', 'text', and 'metadata' keys
        """
        ids = [doc["id"] for doc in documents]
        texts = [doc["text"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]
        
        # Generate embeddings in batch
        embeddings = embedding_generator.generate_batch(texts)
        
        # Add to collection
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )
    
    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search the knowledge base for relevant documents
        
        Args:
            query: Search query text
            n_results: Number of results to return
            
        Returns:
            List of relevant documents with metadata and scores
        """
        # Generate query embedding
        query_embedding = embedding_generator.generate(query)
        
        # Search collection
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Format results
        formatted_results = []
        if results["ids"] and len(results["ids"]) > 0:
            for i in range(len(results["ids"][0])):
                formatted_results.append({
                    "id": results["ids"][0][i],
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                })
        
        return formatted_results
    
    def delete_by_type(self, doc_type: str):
        """
        Delete all documents of a specific type
        
        Args:
            doc_type: Document type (e.g., 'project', 'skill', 'blog')
        """
        # Get all documents of this type
        results = self.collection.get(
            where={"type": doc_type}
        )
        
        if results["ids"]:
            self.collection.delete(ids=results["ids"])
    
    def delete_document(self, doc_id: str):
        """
        Delete a specific document
        
        Args:
            doc_id: Document identifier
        """
        self.collection.delete(ids=[doc_id])
    
    def clear_all(self):
        """Clear all documents from the knowledge base"""
        # Delete and recreate collection
        self.client.delete_collection("portfolio_knowledge")
        self.collection = self.client.get_or_create_collection(
            name="portfolio_knowledge",
            metadata={"description": "Personal portfolio knowledge base"}
        )
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the knowledge base
        
        Returns:
            Dictionary with collection statistics
        """
        count = self.collection.count()
        return {
            "total_documents": count,
            "collection_name": self.collection.name
        }


# Global instance
knowledge_base = KnowledgeBase()
