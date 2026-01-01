from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models import Project, Skill, Experience, Blog, Resume
from auth.dependencies import get_current_user
from models.user import User
from ai.knowledge_base import knowledge_base

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# Request/Response models
class ProjectCreate(BaseModel):
    title: str
    description: str
    long_description: str | None = None
    theme: str = "netflix"
    tech_stack: list | None = None
    category: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    demo_video_url: str | None = None
    thumbnail_url: str | None = None
    images: list | None = None
    featured: int = 0
    tags: list | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    long_description: str | None = None
    theme: str | None = None
    tech_stack: list | None = None
    category: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    demo_video_url: str | None = None
    thumbnail_url: str | None = None
    images: list | None = None
    featured: int | None = None
    tags: list | None = None


class SkillCreate(BaseModel):
    name: str
    category: str
    proficiency: float = 0.0
    playlist_name: str | None = None
    icon_url: str | None = None
    color: str | None = None
    years_experience: float | None = None


class SkillUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    proficiency: float | None = None
    playlist_name: str | None = None
    icon_url: str | None = None
    color: str | None = None
    years_experience: float | None = None


# Helper function to reindex knowledge base
def reindex_knowledge_base(db: Session):
    """Reindex all portfolio data in the knowledge base"""
    # Clear existing data
    knowledge_base.clear_all()
    
    documents = []
    
    # Index projects
    projects = db.query(Project).all()
    for project in projects:
        text = f"{project.title}. {project.description}"
        if project.long_description:
            text += f" {project.long_description}"
        if project.tech_stack:
            text += f" Technologies: {', '.join(project.tech_stack)}"
        
        documents.append({
            "id": f"project_{project.id}",
            "text": text,
            "metadata": {
                "type": "project",
                "title": project.title,
                "category": project.category,
                "tags": project.tags or []
            }
        })
    
    # Index skills
    skills = db.query(Skill).all()
    for skill in skills:
        text = f"{skill.name} - {skill.category} skill with {skill.proficiency*100}% proficiency"
        if skill.years_experience:
            text += f", {skill.years_experience} years of experience"
        
        documents.append({
            "id": f"skill_{skill.id}",
            "text": text,
            "metadata": {
                "type": "skill",
                "title": skill.name,
                "category": skill.category
            }
        })
    
    # Index experience
    experiences = db.query(Experience).all()
    for exp in experiences:
        text = f"{exp.title} at {exp.organization}"
        if exp.description:
            text += f". {exp.description}"
        if exp.achievements:
            text += f" Achievements: {' '.join(exp.achievements)}"
        
        documents.append({
            "id": f"experience_{exp.id}",
            "text": text,
            "metadata": {
                "type": "experience",
                "title": f"{exp.title} at {exp.organization}",
                "organization": exp.organization
            }
        })
    
    # Index blogs
    blogs = db.query(Blog).filter(Blog.published == True).all()
    for blog in blogs:
        text = f"{blog.title}. {blog.excerpt or ''} {blog.content[:500]}"
        
        documents.append({
            "id": f"blog_{blog.id}",
            "text": text,
            "metadata": {
                "type": "blog",
                "title": blog.title,
                "tags": blog.tags or []
            }
        })
    
    # Index resume
    resume = db.query(Resume).first()
    if resume:
        text = f"{resume.full_name} - {resume.title or 'Professional'}. {resume.summary or ''}"
        if resume.pdf_text:
            text += f" {resume.pdf_text[:1000]}"
        
        documents.append({
            "id": "resume_1",
            "text": text,
            "metadata": {
                "type": "resume",
                "title": "Resume"
            }
        })
    
    # Add all documents to knowledge base
    if documents:
        knowledge_base.add_documents_batch(documents)


# Project endpoints
@router.post("/projects")
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Reindex knowledge base
    reindex_knowledge_base(db)
    
    return db_project


@router.put("/projects/{project_id}")
async def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update fields
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    
    # Reindex knowledge base
    reindex_knowledge_base(db)
    
    return db_project


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    
    # Reindex knowledge base
    reindex_knowledge_base(db)
    
    return {"message": "Project deleted successfully"}


# Skill endpoints
@router.post("/skills")
async def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new skill"""
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    
    reindex_knowledge_base(db)
    return db_skill


@router.put("/skills/{skill_id}")
async def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a skill"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    for key, value in skill.dict(exclude_unset=True).items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    
    reindex_knowledge_base(db)
    return db_skill


@router.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a skill"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(db_skill)
    db.commit()
    
    reindex_knowledge_base(db)
    return {"message": "Skill deleted successfully"}


# Trigger manual reindex
@router.post("/reindex")
async def trigger_reindex(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually trigger knowledge base reindexing"""
    reindex_knowledge_base(db)
    stats = knowledge_base.get_stats()
    return {"message": "Knowledge base reindexed successfully", "stats": stats}
