# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier)

### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Set Environment Variables**
   In Vercel dashboard, add:
   ```
   VITE_API_URL=<your-backend-url>
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

---

## Backend Deployment (Render)

### Prerequisites
- GitHub account
- Render account (free tier)

### Steps

1. **Prepare for deployment**
   - Ensure `requirements.txt` is up to date
   - Ensure `Dockerfile` is present in backend directory

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `portfolio-backend`
     - Root Directory: `backend`
     - Environment: `Docker`
     - Instance Type: Free

3. **Set Environment Variables**
   In Render dashboard, add:
   ```
   DATABASE_URL=<your-database-url>
   SECRET_KEY=<generate-random-string>
   ADMIN_EMAIL=<your-admin-email>
   ADMIN_PASSWORD=<your-admin-password>
   GITHUB_REPO_URL=<your-github-repo>
   CORS_ORIGINS=<your-frontend-url>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

---

## Database Setup (Supabase - Free)

### Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the connection string

2. **Update Backend Environment**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Initialize Database**
   - The app will create tables automatically on first run

---

## Alternative: Railway Deployment

### Backend on Railway

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Configure:
     - Root Directory: `backend`
     - Start Command: `python main.py`

2. **Set Environment Variables**
   Same as Render configuration

3. **Add PostgreSQL**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set DATABASE_URL

---

## Post-Deployment

### 1. Update Frontend API URL
Update `.env` in frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 2. Test the Application
- Visit your frontend URL
- Test AI chat functionality
- Login to admin panel
- Create test content

### 3. Update CORS
In backend `config.py`, add your frontend URL to CORS_ORIGINS:
```python
CORS_ORIGINS = [
    "https://your-app.vercel.app",
    "http://localhost:5173"
]
```

---

## Monitoring & Maintenance

### Health Checks
- Frontend: Check if pages load
- Backend: Visit `/api/health` endpoint
- Database: Check connection in admin panel

### Logs
- **Vercel**: Dashboard → Deployments → View logs
- **Render**: Dashboard → Logs tab
- **Railway**: Dashboard → Deployments → View logs

### Troubleshooting

**Issue: Backend not responding**
- Check environment variables
- Check logs for errors
- Verify database connection

**Issue: CORS errors**
- Add frontend URL to CORS_ORIGINS
- Redeploy backend

**Issue: AI features not working**
- Check if vector store initialized
- Trigger reindex via admin panel
- Check sentence-transformers installation

---

## Cost Estimate (Free Tier)

- **Frontend (Vercel)**: Free
- **Backend (Render)**: Free (with limitations)
- **Database (Supabase)**: Free (500MB)
- **Total**: $0/month

### Limitations
- Render free tier: 750 hours/month, sleeps after 15 min inactivity
- Supabase: 500MB storage, 2GB bandwidth
- Vercel: 100GB bandwidth

---

## Scaling (Paid Tiers)

When you need more:
- **Render**: $7/month for always-on
- **Supabase**: $25/month for 8GB
- **Vercel**: $20/month for team features

---

## GitHub Fallback

The app includes automatic fallback to GitHub if backend is down:
1. Frontend checks backend health every 30 seconds
2. After 3 failures, shows notification
3. Redirects to GitHub repository after 5 seconds

Configure in `config.py`:
```python
GITHUB_REPO_URL = "https://github.com/yourusername/portfolio"
```
