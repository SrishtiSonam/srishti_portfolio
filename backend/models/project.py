from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class Project(Base):
    """Project model with theme selection"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    long_description = Column(Text, nullable=True)
    
    # Theme selection: netflix, youtube, amazon, github, etc.
    theme = Column(String, default="netflix")
    
    # Technical details
    tech_stack = Column(JSON, nullable=True)  # ["Python", "React", "FastAPI"]
    category = Column(String, nullable=True)  # "Web App", "ML", "Mobile"
    
    # Links
    github_url = Column(String, nullable=True)
    live_url = Column(String, nullable=True)
    demo_video_url = Column(String, nullable=True)
    
    # Media
    thumbnail_url = Column(String, nullable=True)
    images = Column(JSON, nullable=True)  # List of image URLs
    
    # Metadata
    featured = Column(Integer, default=False)
    order_index = Column(Integer, default=0)
    tags = Column(JSON, nullable=True)  # ["AI", "Web", "Full-Stack"]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
