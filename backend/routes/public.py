from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Project, Skill, Experience, Blog, Resume
from pydantic import BaseModel

router = APIRouter(prefix="/api/public", tags=["Public"])


# Response models
class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    long_description: str | None
    theme: str
    tech_stack: list | None
    category: str | None
    github_url: str | None
    live_url: str | None
    demo_video_url: str | None
    thumbnail_url: str | None
    images: list | None
    featured: int
    tags: list | None
    
    class Config:
        from_attributes = True


class SkillResponse(BaseModel):
    id: int
    name: str
    category: str
    proficiency: float
    playlist_name: str | None
    icon_url: str | None
    color: str | None
    years_experience: float | None
    
    class Config:
        from_attributes = True


class ExperienceResponse(BaseModel):
    id: int
    type: str
    title: str
    organization: str
    location: str | None
    description: str | None
    start_date: str
    end_date: str | None
    is_current: bool
    achievements: list | None
    skills_used: list | None
    degree: str | None
    field_of_study: str | None
    gpa: str | None
    logo_url: str | None
    
    class Config:
        from_attributes = True


class BlogResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str | None
    content: str
    cover_image_url: str | None
    tags: list | None
    read_time: int | None
    published: bool
    published_at: str | None
    
    class Config:
        from_attributes = True


class ResumeResponse(BaseModel):
    id: int
    full_name: str
    title: str | None
    email: str | None
    phone: str | None
    location: str | None
    website: str | None
    github: str | None
    linkedin: str | None
    twitter: str | None
    leetcode: str | None
    summary: str | None
    pdf_url: str | None
    
    class Config:
        from_attributes = True


@router.get("/projects", response_model=List[ProjectResponse])
async def get_projects(db: Session = Depends(get_db)):
    """Get all projects"""
    projects = db.query(Project).order_by(Project.order_index).all()
    return projects


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific project by ID"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/skills", response_model=List[SkillResponse])
async def get_skills(db: Session = Depends(get_db)):
    """Get all skills"""
    skills = db.query(Skill).order_by(Skill.category, Skill.order_index).all()
    return skills


@router.get("/experience", response_model=List[ExperienceResponse])
async def get_experience(db: Session = Depends(get_db)):
    """Get all work experience and education"""
    experiences = db.query(Experience).order_by(Experience.order_index).all()
    return experiences


@router.get("/blogs", response_model=List[BlogResponse])
async def get_blogs(published_only: bool = True, db: Session = Depends(get_db)):
    """Get all blog posts"""
    query = db.query(Blog)
    if published_only:
        query = query.filter(Blog.published == True)
    blogs = query.order_by(Blog.published_at.desc()).all()
    return blogs


@router.get("/blogs/{slug}", response_model=BlogResponse)
async def get_blog(slug: str, db: Session = Depends(get_db)):
    """Get a specific blog post by slug"""
    blog = db.query(Blog).filter(Blog.slug == slug).first()
    if not blog:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog


@router.get("/resume", response_model=ResumeResponse)
async def get_resume(db: Session = Depends(get_db)):
    """Get resume data"""
    resume = db.query(Resume).first()
    if not resume:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
