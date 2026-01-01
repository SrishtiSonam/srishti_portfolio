from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np
from config import settings


class EmbeddingGenerator:
    """Generate embeddings for text using sentence-transformers"""
    
    def __init__(self):
        """Initialize the embedding model"""
        self.model = SentenceTransformer(settings.AI_MODEL_NAME)
        self.dimension = settings.EMBEDDING_DIMENSION
    
    def generate(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        
        Args:
            text: Input text string
            
        Returns:
            List of floats representing the embedding vector
        """
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    
    def generate_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts
        
        Args:
            texts: List of input text strings
            
        Returns:
            List of embedding vectors
        """
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()
    
    def similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Similarity score between 0 and 1
        """
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        
        # Cosine similarity
        similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
        return float(similarity)


# Global instance
embedding_generator = EmbeddingGenerator()
