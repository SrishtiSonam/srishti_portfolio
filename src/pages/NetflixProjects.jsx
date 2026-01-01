import { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './NetflixProjects.css';

export default function NetflixProjects() {
    const [projects, setProjects] = useState([]);
    const [featuredProject, setFeaturedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await publicService.getProjects();
            setProjects(data);

            // Set featured project (first one or marked as featured)
            const featured = data.find(p => p.featured) || data[0];
            setFeaturedProject(featured);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const ProjectRow = ({ title, projects, category }) => {
        const [scrollPosition, setScrollPosition] = useState(0);
        const rowRef = useState(null);

        const scroll = (direction) => {
            const container = rowRef.current;
            if (!container) return;

            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        };

        const filteredProjects = category
            ? projects.filter(p => p.category === category)
            : projects;

        if (filteredProjects.length === 0) return null;

        return (
            <div className="netflix-row">
                <h2 className="row-title">{title}</h2>
                <div className="row-container">
                    <button className="row-nav left" onClick={() => scroll('left')}>
                        <ChevronLeft size={40} />
                    </button>

                    <div className="row-content" ref={rowRef}>
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="project-card">
                                <div className="card-image">
                                    {project.thumbnail_url ? (
                                        <img src={project.thumbnail_url} alt={project.title} />
                                    ) : (
                                        <div className="placeholder-image">
                                            <Play size={48} />
                                        </div>
                                    )}
                                    <div className="card-overlay">
                                        <button className="play-button">
                                            <Play size={24} />
                                        </button>
                                        <div className="card-info">
                                            <h3>{project.title}</h3>
                                            <div className="card-meta">
                                                {project.tech_stack && project.tech_stack.slice(0, 3).map((tech, idx) => (
                                                    <span key={idx} className="tech-badge">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="row-nav right" onClick={() => scroll('right')}>
                        <ChevronRight size={40} />
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="netflix-container">
                <div className="loading">Loading projects...</div>
            </div>
        );
    }

    return (
        <div className="netflix-container">
            {/* Hero Banner */}
            {featuredProject && (
                <div className="hero-banner">
                    <div className="hero-content">
                        <h1 className="hero-title">{featuredProject.title}</h1>
                        <p className="hero-description">
                            {featuredProject.long_description || featuredProject.description}
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary">
                                <Play size={24} />
                                <span>View Project</span>
                            </button>
                            <button className="btn-secondary">
                                <Info size={24} />
                                <span>More Info</span>
                            </button>
                        </div>
                        {featuredProject.tech_stack && (
                            <div className="hero-tech">
                                {featuredProject.tech_stack.map((tech, idx) => (
                                    <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="hero-fade"></div>
                </div>
            )}

            {/* Project Rows */}
            <div className="netflix-content">
                <ProjectRow title="Featured Projects" projects={projects.filter(p => p.featured)} />
                <ProjectRow title="Web Applications" projects={projects} category="Web App" />
                <ProjectRow title="Machine Learning" projects={projects} category="ML" />
                <ProjectRow title="Mobile Apps" projects={projects} category="Mobile" />
                <ProjectRow title="All Projects" projects={projects} />
            </div>
        </div>
    );
}
