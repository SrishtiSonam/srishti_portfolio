import { useState, useEffect } from 'react';
import { Play, ThumbsUp, Share2, Clock } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './YouTubeDemos.css';

export default function YouTubeDemos() {
    const [projects, setProjects] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await publicService.getProjects();
            // Filter projects with demo videos
            const videosProjects = data.filter(p => p.demo_video_url);
            setProjects(videosProjects);
            if (videosProjects.length > 0) {
                setSelectedVideo(videosProjects[0]);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes = 5) => {
        return `${minutes}:00`;
    };

    if (loading) {
        return (
            <div className="youtube-container">
                <div className="loading">Loading demos...</div>
            </div>
        );
    }

    return (
        <div className="youtube-container">
            <header className="youtube-header">
                <div className="header-left">
                    <Play className="youtube-logo" size={32} />
                    <h1>Project Demos</h1>
                </div>
            </header>

            <div className="youtube-content">
                {/* Main Video Player */}
                <div className="video-section">
                    {selectedVideo ? (
                        <>
                            <div className="video-player">
                                {selectedVideo.demo_video_url ? (
                                    <iframe
                                        src={selectedVideo.demo_video_url}
                                        title={selectedVideo.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="video-placeholder">
                                        <Play size={80} />
                                        <p>Demo Video</p>
                                    </div>
                                )}
                            </div>

                            <div className="video-info">
                                <h2 className="video-title">{selectedVideo.title}</h2>

                                <div className="video-meta">
                                    <div className="meta-left">
                                        <span className="view-count">1.2K views</span>
                                        <span className="upload-date">2 weeks ago</span>
                                    </div>
                                    <div className="meta-right">
                                        <button className="action-btn">
                                            <ThumbsUp size={20} />
                                            <span>Like</span>
                                        </button>
                                        <button className="action-btn">
                                            <Share2 size={20} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="video-description">
                                    <p>{selectedVideo.long_description || selectedVideo.description}</p>

                                    {selectedVideo.tech_stack && (
                                        <div className="tech-stack">
                                            <h4>Technologies Used:</h4>
                                            <div className="tech-tags">
                                                {selectedVideo.tech_stack.map((tech, idx) => (
                                                    <span key={idx} className="tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedVideo.github_url && (
                                        <div className="links">
                                            <a href={selectedVideo.github_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                                                View on GitHub
                                            </a>
                                            {selectedVideo.live_url && (
                                                <a href={selectedVideo.live_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-videos">
                            <Play size={64} />
                            <p>No demo videos available</p>
                        </div>
                    )}
                </div>

                {/* Sidebar with video list */}
                <div className="sidebar">
                    <h3 className="sidebar-title">More Demos</h3>
                    <div className="video-list">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={`video-item ${selectedVideo?.id === project.id ? 'active' : ''}`}
                                onClick={() => setSelectedVideo(project)}
                            >
                                <div className="video-thumbnail">
                                    {project.thumbnail_url ? (
                                        <img src={project.thumbnail_url} alt={project.title} />
                                    ) : (
                                        <div className="thumbnail-placeholder">
                                            <Play size={24} />
                                        </div>
                                    )}
                                    <div className="duration">{formatDuration()}</div>
                                </div>
                                <div className="video-details">
                                    <h4 className="video-item-title">{project.title}</h4>
                                    <p className="video-item-meta">
                                        <span>{project.category || 'Project'}</span>
                                        <span>•</span>
                                        <span>1.2K views</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
