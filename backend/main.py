from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from config import settings
from database import engine, Base, get_db
from models import User, Project, Skill, Experience, Blog, Resume
from auth.password import hash_password

# Import routes
from routes import auth, public, admin, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting AI Portfolio Platform...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Create default admin user if not exists
    from sqlalchemy.orm import Session
    db = next(get_db())
    try:
        existing_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not existing_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                full_name="Admin User",
                is_active=True,
                is_superuser=True
            )
            db.add(admin_user)
            db.commit()
            print(f"✅ Default admin user created: {settings.ADMIN_EMAIL}")
        else:
            print(f"✅ Admin user already exists: {settings.ADMIN_EMAIL}")
    finally:
        db.close()
    
    print("✅ Server ready!")
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(public.router)
app.include_router(admin.router)
app.include_router(ai.router)

# Static files for uploads
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring and GitHub fallback"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Portfolio Platform API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
