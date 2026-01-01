# API Documentation

Complete API reference for the AI-Powered Portfolio Platform.

**Base URL:** `http://localhost:8000/api`  
**Production:** `https://your-backend.onrender.com/api`

---

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Public Endpoints

### Get All Projects
```http
GET /api/public/projects
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "AI Portfolio Platform",
    "description": "Google-inspired portfolio with AI features",
    "long_description": "...",
    "theme": "netflix",
    "tech_stack": ["React", "FastAPI", "ChromaDB"],
    "category": "Web App",
    "github_url": "https://github.com/...",
    "live_url": "https://...",
    "demo_video_url": "https://...",
    "thumbnail_url": "https://...",
    "featured": 1,
    "tags": ["AI", "Web"],
    "created_at": "2026-01-01T00:00:00"
  }
]
```

### Get All Skills
```http
GET /api/public/skills
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "React",
    "category": "Frontend",
    "proficiency": 0.9,
    "playlist_name": "Frontend Favorites",
    "icon_url": "https://...",
    "color": "#61dafb",
    "years_experience": 3.5,
    "order_index": 1
  }
]
```

### Get Experience & Education
```http
GET /api/public/experience
```

**Response:**
```json
[
  {
    "id": 1,
    "type": "work",
    "title": "Senior Developer",
    "organization": "Tech Corp",
    "location": "San Francisco, CA",
    "start_date": "Jan 2022",
    "end_date": null,
    "is_current": true,
    "description": "Leading development team...",
    "achievements": ["Built scalable platform", "Mentored 5 developers"],
    "skills_used": ["React", "Python", "AWS"]
  }
]
```

### Get Blog Posts
```http
GET /api/public/blogs?published=true
```

**Query Parameters:**
- `published` (boolean, optional) - Filter by publish status (default: true)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Building AI-Powered Apps",
    "slug": "building-ai-powered-apps",
    "content": "# Introduction\n\n...",
    "excerpt": "Learn how to build AI apps...",
    "cover_image_url": "https://...",
    "tags": ["AI", "Tutorial"],
    "read_time": 8,
    "is_published": true,
    "published_at": "2026-01-01T00:00:00",
    "meta_description": "SEO description"
  }
]
```

### Get Resume
```http
GET /api/public/resume
```

**Response:**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "title": "Full Stack Developer",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "summary": "Experienced developer with...",
  "pdf_url": "https://example.com/resume.pdf"
}
```

---

## Authentication Endpoints

### Admin Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "changeme123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

---

## Admin Endpoints (Protected)

### Projects

#### Create Project
```http
POST /api/admin/projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "long_description": "Detailed description",
  "theme": "netflix",
  "tech_stack": ["React", "Python"],
  "category": "Web App",
  "github_url": "https://github.com/...",
  "live_url": "https://...",
  "featured": 0,
  "tags": ["AI", "Web"]
}
```

#### Update Project
```http
PUT /api/admin/projects/{id}
Authorization: Bearer <token>
```

#### Delete Project
```http
DELETE /api/admin/projects/{id}
Authorization: Bearer <token>
```

### Skills

#### Create Skill
```http
POST /api/admin/skills
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Python",
  "category": "Programming",
  "proficiency": 0.85,
  "playlist_name": "Backend Beats",
  "color": "#3572A5",
  "years_experience": 4.0
}
```

#### Update/Delete Skill
```http
PUT /api/admin/skills/{id}
DELETE /api/admin/skills/{id}
Authorization: Bearer <token>
```

### Experience

#### Create Experience
```http
POST /api/admin/experience
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "work",
  "title": "Software Engineer",
  "organization": "Tech Company",
  "location": "Remote",
  "start_date": "Jan 2023",
  "end_date": null,
  "is_current": true,
  "description": "Working on...",
  "achievements": ["Achievement 1", "Achievement 2"],
  "skills_used": ["React", "Node.js"]
}
```

### Blogs

#### Create Blog
```http
POST /api/admin/blogs
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "content": "# Heading\n\nContent...",
  "excerpt": "Brief summary",
  "cover_image_url": "https://...",
  "tags": ["Tutorial", "AI"],
  "read_time": 5,
  "is_published": true,
  "meta_description": "SEO description"
}
```

### Resume

#### Update Resume
```http
PUT /api/admin/resume
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "title": "Full Stack Developer",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "summary": "Experienced developer...",
  "pdf_url": "https://example.com/resume.pdf"
}
```

### Reindex Knowledge Base
```http
POST /api/admin/reindex
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Knowledge base reindexed successfully",
  "documents_indexed": 42
}
```

---

## AI Endpoints

### Chat
```http
POST /api/ai/chat
```

**Request Body:**
```json
{
  "message": "Tell me about your projects",
  "chat_history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

**Response:**
```json
{
  "response": "I have several interesting projects...",
  "sources": [
    {
      "title": "AI Portfolio Platform",
      "type": "project",
      "relevance": 0.95
    }
  ]
}
```

### Search
```http
POST /api/ai/search
```

**Request Body:**
```json
{
  "query": "machine learning projects",
  "filters": {
    "type": "project",
    "category": "AI"
  },
  "limit": 10
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "ML Project",
      "content": "Description...",
      "type": "project",
      "relevance": 0.92
    }
  ]
}
```

### Get Suggestions
```http
GET /api/ai/suggestions
```

**Response:**
```json
{
  "suggestions": [
    "What projects have you worked on?",
    "Tell me about your skills",
    "What's your experience with AI?"
  ]
}
```

---

## Health Check

### System Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_system": "ready",
  "version": "1.0.0"
}
```

---

## Error Responses

All endpoints return standard HTTP status codes:

**400 Bad Request**
```json
{
  "detail": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "detail": "Not authenticated"
}
```

**404 Not Found**
```json
{
  "detail": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

- Public endpoints: 100 requests/minute
- Admin endpoints: 60 requests/minute
- AI endpoints: 20 requests/minute

---

## CORS

Allowed origins configured in backend `.env`:
```env
CORS_ORIGINS=http://localhost:5173,https://yourapp.vercel.app
```

---

**API Version:** 1.0.0  
**Last Updated:** January 2026
