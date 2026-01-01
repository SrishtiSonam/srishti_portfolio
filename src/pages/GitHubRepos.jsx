import { useState, useEffect } from 'react';
import { Star, GitFork, Code, ExternalLink, Search } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './GitHubRepos.css';

export default function GitHubRepos() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await publicService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const RepoCard = ({ project }) => {
        const stars = Math.floor(Math.random() * 100) + 10;
        const forks = Math.floor(Math.random() * 20) + 1;
        const language = project.tech_stack?.[0] || 'JavaScript';

        return (
            <div className="repo-card">
                <div className="repo-header">
                    <div className="repo-title-section">
                        <Code size={16} className="repo-icon" />
                        <h3 className="repo-title">
                            <a href={project.github_url || '#'} target="_blank" rel="noopener noreferrer">
                                {project.title}
                            </a>
                        </h3>
                        <span className="repo-visibility">Public</span>
                    </div>
                </div>

                <p className="repo-description">{project.description}</p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="repo-topics">
                        {project.tech_stack.slice(0, 5).map((tech, idx) => (
                            <span key={idx} className="topic-tag">{tech}</span>
                        ))}
                    </div>
                )}

                <div className="repo-footer">
                    <div className="repo-stats">
                        <span className="language-indicator">
                            <span className="language-dot" style={{ background: getLanguageColor(language) }}></span>
                            {language}
                        </span>
                        <span className="stat">
                            <Star size={14} />
                            {stars}
                        </span>
                        <span className="stat">
                            <GitFork size={14} />
                            {forks}
                        </span>
                    </div>
                    {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="demo-link">
                            <ExternalLink size={14} />
                            <span>Live Demo</span>
                        </a>
                    )}
                </div>
            </div>
        );
    };

    const getLanguageColor = (language) => {
        const colors = {
            JavaScript: '#f1e05a',
            Python: '#3572A5',
            TypeScript: '#2b7489',
            React: '#61dafb',
            Java: '#b07219',
            Go: '#00ADD8',
            Rust: '#dea584',
            CSS: '#563d7c',
            HTML: '#e34c26'
        };
        return colors[language] || '#8257e5';
    };

    if (loading) {
        return (
            <div className="github-container">
                <div className="loading">Loading repositories...</div>
            </div>
        );
    }

    return (
        <div className="github-container">
            <header className="github-header">
                <div className="header-content">
                    <h1>Repositories</h1>
                    <p>Open source projects and code</p>
                </div>
            </header>

            <div className="github-content">
                <div className="search-section">
                    <div className="search-input-wrapper">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Find a repository..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="repo-search"
                        />
                    </div>
                    <div className="repo-count">
                        {filteredProjects.length} {filteredProjects.length === 1 ? 'repository' : 'repositories'}
                    </div>
                </div>

                <div className="repos-list">
                    {filteredProjects.map((project) => (
                        <RepoCard key={project.id} project={project} />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="no-repos">
                        <Code size={64} />
                        <p>No repositories found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
