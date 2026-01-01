from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class Resume(Base):
    """Resume data model (structured + PDF)"""
    __tablename__ = "resume"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Personal Information
    full_name = Column(String, nullable=False)
    title = Column(String, nullable=True)  # "Full-Stack Developer"
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Social Links
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    leetcode = Column(String, nullable=True)
    
    # Summary
    summary = Column(Text, nullable=True)
    
    # Structured data (for AI indexing)
    skills_summary = Column(JSON, nullable=True)
    experience_summary = Column(JSON, nullable=True)
    education_summary = Column(JSON, nullable=True)
    certifications = Column(JSON, nullable=True)
    
    # PDF
    pdf_url = Column(String, nullable=True)
    pdf_text = Column(Text, nullable=True)  # Extracted text for AI
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
