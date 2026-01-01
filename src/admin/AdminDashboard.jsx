import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Code,
    GraduationCap,
    BookOpen,
    FileText,
    LogOut,
    Plus,
    Edit,
    Trash2
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import { publicService } from '../../services/public.service';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experience: 0,
        blogs: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/admin/login');
            return;
        }
        loadStats();
    }, [navigate]);

    const loadStats = async () => {
        try {
            const [projects, skills, experience, blogs] = await Promise.all([
                publicService.getProjects(),
                publicService.getSkills(),
                publicService.getExperience(),
                publicService.getBlogs(false)
            ]);

            setStats({
                projects: projects.length,
                skills: skills.length,
                experience: experience.length,
                blogs: blogs.length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    const StatCard = ({ icon: Icon, title, count, color, link }) => (
        <Link to={link} className="stat-card" style={{ '--card-color': color }}>
            <div className="stat-icon">
                <Icon size={32} />
            </div>
            <div className="stat-info">
                <h3>{count}</h3>
                <p>{title}</p>
            </div>
        </Link>
    );

    const QuickAction = ({ icon: Icon, title, description, link }) => (
        <Link to={link} className="quick-action">
            <div className="action-icon">
                <Icon size={24} />
            </div>
            <div className="action-info">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <LayoutDashboard size={28} />
                    <h2>Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin/dashboard" className="nav-item active">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/projects" className="nav-item">
                        <Briefcase size={20} />
                        <span>Projects</span>
                    </Link>
                    <Link to="/admin/skills" className="nav-item">
                        <Code size={20} />
                        <span>Skills</span>
                    </Link>
                    <Link to="/admin/experience" className="nav-item">
                        <GraduationCap size={20} />
                        <span>Experience</span>
                    </Link>
                    <Link to="/admin/blogs" className="nav-item">
                        <BookOpen size={20} />
                        <span>Blogs</span>
                    </Link>
                    <Link to="/admin/resume" className="nav-item">
                        <FileText size={20} />
                        <span>Resume</span>
                    </Link>
                </nav>

                <button onClick={handleLogout} className="logout-button">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="admin-main">
                <header className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Manage your portfolio content</p>
                    </div>
                </header>

                <div className="dashboard-content">
                    <section className="stats-section">
                        <h2>Overview</h2>
                        <div className="stats-grid">
                            <StatCard
                                icon={Briefcase}
                                title="Projects"
                                count={stats.projects}
                                color="#667eea"
                                link="/admin/projects"
                            />
                            <StatCard
                                icon={Code}
                                title="Skills"
                                count={stats.skills}
                                color="#1db954"
                                link="/admin/skills"
                            />
                            <StatCard
                                icon={GraduationCap}
                                title="Experience"
                                count={stats.experience}
                                color="#0a66c2"
                                link="/admin/experience"
                            />
                            <StatCard
                                icon={BookOpen}
                                title="Blog Posts"
                                count={stats.blogs}
                                color="#000"
                                link="/admin/blogs"
                            />
                        </div>
                    </section>

                    <section className="quick-actions-section">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <QuickAction
                                icon={Plus}
                                title="Add New Project"
                                description="Create a new project entry"
                                link="/admin/projects/new"
                            />
                            <QuickAction
                                icon={Plus}
                                title="Add New Skill"
                                description="Add a skill to your portfolio"
                                link="/admin/skills/new"
                            />
                            <QuickAction
                                icon={Plus}
                                title="Write Blog Post"
                                description="Create a new blog article"
                                link="/admin/blogs/new"
                            />
                            <QuickAction
                                icon={Edit}
                                title="Update Resume"
                                description="Edit resume information"
                                link="/admin/resume"
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
