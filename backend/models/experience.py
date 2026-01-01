from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from database import Base

class Experience(Base):
    """Work experience and education model"""
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Type: "work" or "education"
    type = Column(String, nullable=False)
    
    # Common fields
    title = Column(String, nullable=False)  # Job title or Degree
    organization = Column(String, nullable=False)  # Company or University
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    # Dates
    start_date = Column(String, nullable=False)  # "2020-01" or "Jan 2020"
    end_date = Column(String, nullable=True)  # null for current
    is_current = Column(Boolean, default=False)
    
    # Work-specific
    achievements = Column(JSON, nullable=True)  # List of achievement strings
    skills_used = Column(JSON, nullable=True)  # List of skill names
    
    # Education-specific
    degree = Column(String, nullable=True)
    field_of_study = Column(String, nullable=True)
    gpa = Column(String, nullable=True)
    
    # Visual
    logo_url = Column(String, nullable=True)
    
    # Metadata
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
