import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { publicService } from '../../services/public.service';
import { adminService } from '../../services/admin.service';
import './ProjectsManager.css';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await adminService.deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    const ProjectForm = ({ project, onClose, onSave }) => {
        const [formData, setFormData] = useState(project || {
            title: '',
            description: '',
            long_description: '',
            theme: 'netflix',
            tech_stack: [],
            category: '',
            github_url: '',
            live_url: '',
            demo_video_url: '',
            thumbnail_url: '',
            featured: 0,
            tags: []
        });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (project) {
                    await adminService.updateProject(project.id, formData);
                } else {
                    await adminService.createProject(formData);
                }
                onSave();
                onClose();
                loadProjects();
            } catch (error) {
                console.error('Error saving project:', error);
                alert('Failed to save project');
            }
        };

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{project ? 'Edit Project' : 'New Project'}</h2>
                    <form onSubmit={handleSubmit} className="project-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Theme</label>
                                <select
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                >
                                    <option value="netflix">Netflix</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="amazon">Amazon</option>
                                    <option value="github">GitHub</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Long Description</label>
                            <textarea
                                value={formData.long_description}
                                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                                rows="5"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Web App, ML, Mobile"
                                />
                            </div>

                            <div className="form-group">
                                <label>Featured</label>
                                <input
                                    type="checkbox"
                                    checked={formData.featured === 1}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tech Stack (comma-separated)</label>
                            <input
                                type="text"
                                value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    tech_stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                })}
                                placeholder="React, Python, FastAPI"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>GitHub URL</label>
                                <input
                                    type="url"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Live URL</label>
                                <input
                                    type="url"
                                    value={formData.live_url}
                                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                {project ? 'Update' : 'Create'} Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading projects...</div>;
    }

    return (
        <div className="projects-manager">
            <div className="manager-header">
                <div>
                    <h1>Projects</h1>
                    <p>Manage your project portfolio</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="card-header">
                            <h3>{project.title}</h3>
                            {project.featured === 1 && <span className="featured-badge">Featured</span>}
                        </div>
                        <p className="card-description">{project.description}</p>
                        <div className="card-meta">
                            <span className="theme-badge">{project.theme}</span>
                            {project.category && <span className="category-badge">{project.category}</span>}
                        </div>
                        {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="tech-tags">
                                {project.tech_stack.slice(0, 3).map((tech, idx) => (
                                    <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        )}
                        <div className="card-actions">
                            <button onClick={() => { setEditingProject(project); setShowForm(true); }} className="btn-icon">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="btn-icon btn-danger">
                                <Trash2 size={16} />
                            </button>
                            {project.live_url && (
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-icon">
                                    <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <ProjectForm
                    project={editingProject}
                    onClose={() => { setShowForm(false); setEditingProject(null); }}
                    onSave={() => { setEditingProject(null); }}
                />
            )}
        </div>
    );
}
