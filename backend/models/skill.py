from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Skill(Base):
    """Skill model with proficiency levels"""
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)  # "Programming", "Framework", "Tool", "Soft Skill"
    proficiency = Column(Float, default=0.0)  # 0.0 to 1.0 (0% to 100%)
    
    # For Spotify-style playlist grouping
    playlist_name = Column(String, nullable=True)  # "Backend Beats", "Frontend Favorites"
    
    # Visual
    icon_url = Column(String, nullable=True)
    color = Column(String, nullable=True)  # Hex color for UI
    
    # Metadata
    years_experience = Column(Float, nullable=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
