import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from './components/GoogleLanding/Logo';
import SearchBar from './components/GoogleLanding/SearchBar';
import ShortcutTiles from './components/GoogleLanding/ShortcutTiles';
import AppGrid from './components/GoogleLanding/AppGrid';
import ChatModal from './components/AIChat/ChatModal';

// Themed Pages
import NetflixProjects from './pages/NetflixProjects';
import YouTubeDemos from './pages/YouTubeDemos';
import AmazonProducts from './pages/AmazonProducts';
import TerminalResume from './pages/TerminalResume';
import SpotifySkills from './pages/SpotifySkills';
import LinkedInExperience from './pages/LinkedInExperience';
import MediumBlogs from './pages/MediumBlogs';
import GitHubRepos from './pages/GitHubRepos';
import GmailContact from './pages/GmailContact';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProjectsManager from './admin/ProjectsManager';
import SkillsManager from './admin/SkillsManager';
import BlogsManager from './admin/BlogsManager';
import ExperienceManager from './admin/ExperienceManager';
import ResumeManager from './admin/ResumeManager';

import './App.css';

function LandingPage({ onAIChat }) {
  const handleSearch = (query) => {
    console.log('Search:', query);
  };

  const handleVoiceSearch = () => {
    console.log('Voice search activated');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        handleSearch(transcript);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left"></div>
        <div className="header-right">
          <AppGrid />
        </div>
      </header>

      <main className="app-main">
        <Logo name="Srishti Sonam" />
        <SearchBar
          onSearch={handleSearch}
          onVoiceSearch={handleVoiceSearch}
          onAIChat={onAIChat}
        />
        <ShortcutTiles />
      </main>

      <footer className="app-footer">
        <p>AI-Powered Portfolio Platform</p>
      </footer>
    </div>
  );
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onAIChat={() => setIsChatOpen(true)} />} />
        <Route path="/projects" element={<NetflixProjects />} />
        <Route path="/demos" element={<YouTubeDemos />} />
        <Route path="/products" element={<AmazonProducts />} />
        <Route path="/resume" element={<TerminalResume />} />
        <Route path="/skills" element={<SpotifySkills />} />
        <Route path="/experience" element={<LinkedInExperience />} />
        <Route path="/blog" element={<MediumBlogs />} />
        <Route path="/repos" element={<GitHubRepos />} />
        <Route path="/contact" element={<GmailContact />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<ProjectsManager />} />
        <Route path="/admin/projects/new" element={<ProjectsManager />} />
        <Route path="/admin/skills" element={<SkillsManager />} />
        <Route path="/admin/skills/new" element={<SkillsManager />} />
        <Route path="/admin/blogs" element={<BlogsManager />} />
        <Route path="/admin/blogs/new" element={<BlogsManager />} />
        <Route path="/admin/experience" element={<ExperienceManager />} />
        <Route path="/admin/experience/new" element={<ExperienceManager />} />
        <Route path="/admin/resume" element={<ResumeManager />} />

        {/* Redirect /admin to /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </Router>
  );
}

export default App;
