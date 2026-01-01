from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from database import Base

class Blog(Base):
    """Blog post model with markdown support"""
    __tablename__ = "blogs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    
    # Content
    excerpt = Column(Text, nullable=True)  # Short summary
    content = Column(Text, nullable=False)  # Full markdown content
    
    # Media
    cover_image_url = Column(String, nullable=True)
    
    # Metadata
    tags = Column(JSON, nullable=True)  # ["AI", "Tutorial", "Web Dev"]
    read_time = Column(Integer, nullable=True)  # Minutes
    published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # SEO
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
