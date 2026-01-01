import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase, GraduationCap } from 'lucide-react';
import { publicService } from '../../services/public.service';
import { adminService } from '../../services/admin.service';
import '../admin/ProjectsManager.css';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        try {
            const data = await publicService.getExperience();
            setExperiences(data);
        } catch (error) {
            console.error('Error loading experience:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        try {
            await adminService.deleteExperience(id);
            setExperiences(experiences.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting experience:', error);
            alert('Failed to delete experience');
        }
    };

    const ExperienceForm = ({ experience, onClose, onSave }) => {
        const [formData, setFormData] = useState(experience || {
            type: 'work',
            title: '',
            organization: '',
            location: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            achievements: [],
            skills_used: [],
            // Education specific
            degree: '',
            field_of_study: '',
            gpa: ''
        });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (experience) {
                    await adminService.updateExperience(experience.id, formData);
                } else {
                    await adminService.createExperience(formData);
                }
                onSave();
                onClose();
                loadExperiences();
            } catch (error) {
                console.error('Error saving experience:', error);
                alert('Failed to save experience');
            }
        };

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                    <h2>{experience ? 'Edit Experience' : 'New Experience'}</h2>
                    <form onSubmit={handleSubmit} className="project-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="work">Work Experience</option>
                                    <option value="education">Education</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Current Position</label>
                                <input
                                    type="checkbox"
                                    checked={formData.is_current}
                                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{formData.type === 'work' ? 'Job Title' : 'Degree'} *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{formData.type === 'work' ? 'Company' : 'Institution'} *</label>
                                <input
                                    type="text"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input
                                    type="text"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    placeholder="Jan 2020"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="text"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    placeholder="Dec 2022 or leave empty if current"
                                    disabled={formData.is_current}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City, Country"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                placeholder="Brief description of role/program"
                            />
                        </div>

                        {formData.type === 'work' && (
                            <>
                                <div className="form-group">
                                    <label>Achievements (comma-separated)</label>
                                    <textarea
                                        value={Array.isArray(formData.achievements) ? formData.achievements.join('\n') : ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            achievements: e.target.value.split('\n').filter(Boolean)
                                        })}
                                        rows="3"
                                        placeholder="One achievement per line"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Skills Used (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={Array.isArray(formData.skills_used) ? formData.skills_used.join(', ') : ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            skills_used: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                        })}
                                        placeholder="Python, React, AWS"
                                    />
                                </div>
                            </>
                        )}

                        {formData.type === 'education' && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Field of Study</label>
                                        <input
                                            type="text"
                                            value={formData.field_of_study}
                                            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                                            placeholder="Computer Science"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>GPA</label>
                                        <input
                                            type="text"
                                            value={formData.gpa}
                                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                            placeholder="3.8/4.0"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                {experience ? 'Update' : 'Create'} Entry
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const filteredExperiences = filter === 'all'
        ? experiences
        : experiences.filter(e => e.type === filter);

    if (loading) {
        return <div className="loading">Loading experience...</div>;
    }

    return (
        <div className="projects-manager">
            <div className="manager-header">
                <div>
                    <h1>Experience & Education</h1>
                    <p>Manage your professional history</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus size={20} />
                    <span>New Entry</span>
                </button>
            </div>

            <div className="filter-tabs" style={{ marginBottom: '24px' }}>
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                    style={{ padding: '8px 16px', marginRight: '8px', border: '1px solid #e0e0e0', borderRadius: '8px', background: filter === 'all' ? '#667eea' : 'white', color: filter === 'all' ? 'white' : '#666', cursor: 'pointer' }}
                >
                    All ({experiences.length})
                </button>
                <button
                    className={filter === 'work' ? 'active' : ''}
                    onClick={() => setFilter('work')}
                    style={{ padding: '8px 16px', marginRight: '8px', border: '1px solid #e0e0e0', borderRadius: '8px', background: filter === 'work' ? '#667eea' : 'white', color: filter === 'work' ? 'white' : '#666', cursor: 'pointer' }}
                >
                    Work ({experiences.filter(e => e.type === 'work').length})
                </button>
                <button
                    className={filter === 'education' ? 'active' : ''}
                    onClick={() => setFilter('education')}
                    style={{ padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', background: filter === 'education' ? '#667eea' : 'white', color: filter === 'education' ? 'white' : '#666', cursor: 'pointer' }}
                >
                    Education ({experiences.filter(e => e.type === 'education').length})
                </button>
            </div>

            <div className="projects-grid">
                {filteredExperiences.map((exp) => (
                    <div key={exp.id} className="project-card">
                        <div className="card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {exp.type === 'work' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                                <h3>{exp.title}</h3>
                            </div>
                            {exp.is_current && <span className="featured-badge" style={{ background: '#34a853' }}>Current</span>}
                        </div>
                        <p style={{ fontWeight: '600', color: '#666', margin: '8px 0' }}>{exp.organization}</p>
                        <p className="card-description">
                            {exp.start_date} - {exp.end_date || 'Present'}
                            {exp.location && ` • ${exp.location}`}
                        </p>
                        {exp.description && (
                            <p className="card-description" style={{ marginTop: '8px' }}>{exp.description}</p>
                        )}
                        <div className="card-actions">
                            <button onClick={() => { setEditingExp(exp); setShowForm(true); }} className="btn-icon">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(exp.id)} className="btn-icon btn-danger">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <ExperienceForm
                    experience={editingExp}
                    onClose={() => { setShowForm(false); setEditingExp(null); }}
                    onSave={() => { setEditingExp(null); }}
                />
            )}
        </div>
    );
}
