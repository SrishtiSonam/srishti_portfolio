import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { publicService } from '../../services/public.service';
import { adminService } from '../../services/admin.service';
import '../admin/ProjectsManager.css';

export default function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const data = await publicService.getSkills();
            setSkills(data);
        } catch (error) {
            console.error('Error loading skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            await adminService.deleteSkill(id);
            setSkills(skills.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Failed to delete skill');
        }
    };

    const SkillForm = ({ skill, onClose, onSave }) => {
        const [formData, setFormData] = useState(skill || {
            name: '',
            category: '',
            proficiency: 0.5,
            playlist_name: '',
            icon_url: '',
            color: '#667eea',
            years_experience: 0,
            order_index: 0
        });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (skill) {
                    await adminService.updateSkill(skill.id, formData);
                } else {
                    await adminService.createSkill(formData);
                }
                onSave();
                onClose();
                loadSkills();
            } catch (error) {
                console.error('Error saving skill:', error);
                alert('Failed to save skill');
            }
        };

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{skill ? 'Edit Skill' : 'New Skill'}</h2>
                    <form onSubmit={handleSubmit} className="project-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Programming, Framework, Tool"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Proficiency (0-1)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    value={formData.proficiency}
                                    onChange={(e) => setFormData({ ...formData, proficiency: parseFloat(e.target.value) })}
                                />
                                <small>{Math.round(formData.proficiency * 100)}%</small>
                            </div>

                            <div className="form-group">
                                <label>Years Experience</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={formData.years_experience}
                                    onChange={(e) => setFormData({ ...formData, years_experience: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Playlist Name</label>
                                <input
                                    type="text"
                                    value={formData.playlist_name}
                                    onChange={(e) => setFormData({ ...formData, playlist_name: e.target.value })}
                                    placeholder="Backend Beats, Frontend Favorites"
                                />
                            </div>

                            <div className="form-group">
                                <label>Color</label>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                {skill ? 'Update' : 'Create'} Skill
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading skills...</div>;
    }

    return (
        <div className="projects-manager">
            <div className="manager-header">
                <div>
                    <h1>Skills</h1>
                    <p>Manage your technical skills</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus size={20} />
                    <span>New Skill</span>
                </button>
            </div>

            <div className="projects-grid">
                {skills.map((skill) => (
                    <div key={skill.id} className="project-card">
                        <div className="card-header">
                            <h3>{skill.name}</h3>
                        </div>
                        <div className="card-meta">
                            <span className="category-badge">{skill.category}</span>
                            {skill.playlist_name && (
                                <span className="theme-badge">{skill.playlist_name}</span>
                            )}
                        </div>
                        <div className="proficiency-display">
                            <div className="proficiency-bar-full">
                                <div
                                    className="proficiency-fill"
                                    style={{ width: `${skill.proficiency * 100}%`, background: skill.color }}
                                />
                            </div>
                            <span>{Math.round(skill.proficiency * 100)}%</span>
                        </div>
                        {skill.years_experience > 0 && (
                            <p className="card-description">{skill.years_experience} years experience</p>
                        )}
                        <div className="card-actions">
                            <button onClick={() => { setEditingSkill(skill); setShowForm(true); }} className="btn-icon">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(skill.id)} className="btn-icon btn-danger">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <SkillForm
                    skill={editingSkill}
                    onClose={() => { setShowForm(false); setEditingSkill(null); }}
                    onSave={() => { setEditingSkill(null); }}
                />
            )}
        </div>
    );
}
