# AI-Powered Portfolio Platform

A Google-inspired, AI-powered personal portfolio platform with 9 themed pages, voice I/O, and a complete admin CMS. Built with React, FastAPI, and RAG-based AI.

![Portfolio Platform](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌟 Features

### 🎨 **Google-Style Landing Page**
- Minimalist search interface with animated logo
- Voice search with speech-to-text
- App grid with 9 themed applications
- Fully responsive design

### 🎭 **9 Themed Platform Pages**
Each page authentically recreates its platform's design:
1. **Netflix** - Cinematic project showcase with hero banners
2. **YouTube** - Video demos with player and sidebar
3. **Amazon** - Product grid with filters and ratings
4. **GitHub** - Dark theme repository cards with stats
5. **Gmail** - Contact form with sidebar navigation
6. **Terminal** - Interactive CLI resume
7. **Spotify** - Skills playlists with now playing bar
8. **LinkedIn** - Professional experience timeline
9. **Medium** - Clean blog with serif typography

### 🤖 **AI Features**
- **ChatGPT-Style Chat** - Conversational AI trained on your portfolio data
- **Voice Input** - Speech-to-text for queries
- **Voice Output** - Text-to-speech for AI responses
- **Semantic Search** - RAG-based intelligent search
- **Source Citations** - AI responses cite portfolio content

### 🔐 **Admin Panel**
Complete content management system:
- Secure JWT authentication
- Dashboard with analytics
- Full CRUD for all content types:
  - Projects (with theme selection)
  - Skills (with proficiency tracking)
  - Experience & Education
  - Blog posts (markdown editor)
  - Resume information
- Auto knowledge base reindexing

### 🚀 **Production Ready**
- Free-tier deployment configurations
- Docker support
- Health check monitoring
- GitHub fallback system
- Comprehensive documentation

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Markdown** - Markdown rendering

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embeddings
- **Python-JOSE** - JWT tokens
- **Bcrypt** - Password hashing

### AI/ML
- **RAG Architecture** - Retrieval-Augmented Generation
- **all-MiniLM-L6-v2** - Sentence embeddings
- **ChromaDB** - Vector similarity search

---

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your configuration
# Set SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, etc.

# Run the server
python main.py
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🎯 Quick Start

1. **Start Backend**
   ```bash
   cd backend && python main.py
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Landing Page: `http://localhost:5173`
   - Admin Panel: `http://localhost:5173/admin/login`
   - Default Credentials: `admin@example.com` / `changeme123`

4. **Test AI Features**
   - Click AI icon in search bar
   - Ask about your portfolio
   - Try voice input/output

---

## 📁 Project Structure

```
srishti_portfolio/
├── backend/
│   ├── ai/                 # RAG system (embeddings, knowledge base, chat)
│   ├── auth/               # JWT authentication
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── config.py           # Configuration
│   ├── database.py         # Database setup
│   ├── main.py             # FastAPI app
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── admin/              # Admin panel components
│   ├── components/         # Reusable components
│   ├── pages/              # Themed platform pages
│   ├── services/           # API services
│   ├── App.jsx             # Main application
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── DEPLOYMENT.md           # Deployment guide
├── TESTING_CHECKLIST.md    # Testing checklist
└── README.md               # This file
```

---

## 🔌 API Documentation

### Public Endpoints
- `GET /api/public/projects` - Get all projects
- `GET /api/public/skills` - Get all skills
- `GET /api/public/experience` - Get work & education
- `GET /api/public/blogs` - Get blog posts
- `GET /api/public/resume` - Get resume data

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh access token

### Admin Endpoints (Protected)
- `POST/PUT/DELETE /api/admin/projects` - Manage projects
- `POST/PUT/DELETE /api/admin/skills` - Manage skills
- `POST/PUT/DELETE /api/admin/experience` - Manage experience
- `POST/PUT/DELETE /api/admin/blogs` - Manage blogs
- `PUT /api/admin/resume` - Update resume
- `POST /api/admin/reindex` - Reindex knowledge base

### AI Endpoints
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/search` - Semantic search
- `GET /api/ai/suggestions` - Get suggested questions

### Health Check
- `GET /api/health` - System health status

---

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Frontend (Vercel)**
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# Set VITE_API_URL environment variable
```

**Backend (Render)**
```bash
# Connect GitHub repo to Render
# Set environment variables
# Deploy with Docker
```

**Free Tier Stack:**
- Frontend: Vercel (free)
- Backend: Render (free, 750hrs/month)
- Database: Supabase (free, 500MB)
- **Total Cost: $0/month**

---

## 🧪 Testing

See [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for comprehensive testing guide.

**Quick Test:**
```bash
# Backend health check
curl http://localhost:8000/api/health

# Frontend test
# 1. Open http://localhost:5173
# 2. Click AI chat icon
# 3. Send a message
# 4. Test voice features
# 5. Navigate to themed pages
# 6. Login to admin panel
```

---

## 🎨 Themed Pages

### Routes
- `/` - Google-style landing page
- `/projects` - Netflix-style projects
- `/demos` - YouTube-style demos
- `/products` - Amazon-style products
- `/repos` - GitHub-style repositories
- `/contact` - Gmail-style contact
- `/resume` - Terminal-style resume
- `/skills` - Spotify-style skills
- `/experience` - LinkedIn-style experience
- `/blog` - Medium-style blog

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/projects` - Projects manager
- `/admin/skills` - Skills manager
- `/admin/blogs` - Blogs manager
- `/admin/experience` - Experience manager
- `/admin/resume` - Resume manager

---

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000
```

**Backend (.env)**
```env
DATABASE_URL=sqlite:///./portfolio.db
SECRET_KEY=your-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123
AI_MODEL_NAME=all-MiniLM-L6-v2
GITHUB_REPO_URL=https://github.com/yourusername/portfolio
CORS_ORIGINS=http://localhost:5173,https://yourapp.vercel.app
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google** - UI/UX inspiration
- **Platform Designs** - Netflix, YouTube, Amazon, GitHub, Gmail, Spotify, LinkedIn, Medium
- **Open Source Libraries** - React, FastAPI, ChromaDB, and all dependencies

---

## 📧 Contact

For questions or support, please open an issue or contact via the Gmail-style contact page.

---

## 🚀 What's Next?

- [ ] Add sample data seed script
- [ ] Implement real email sending (Gmail contact)
- [ ] Add analytics dashboard
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] Unit and integration tests

---

**Built with ❤️ using AI-powered development**

**Status:** Production Ready | **Version:** 1.0.0 | **Last Updated:** January 2026
