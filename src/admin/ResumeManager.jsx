import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { publicService } from '../../services/public.service';
import { adminService } from '../../services/admin.service';
import '../admin/ProjectsManager.css';

export default function ResumeManager() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        summary: '',
        pdf_url: ''
    });

    useEffect(() => {
        loadResume();
    }, []);

    const loadResume = async () => {
        try {
            const data = await publicService.getResume();
            if (data) {
                setResume(data);
                setFormData(data);
            }
        } catch (error) {
            console.error('Error loading resume:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await adminService.updateResume(formData);
            alert('Resume updated successfully!');
            loadResume();
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading resume...</div>;
    }

    return (
        <div className="projects-manager">
            <div className="manager-header">
                <div>
                    <h1>Resume</h1>
                    <p>Manage your resume information</p>
                </div>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} className="project-form" style={{ background: 'white', padding: '32px', borderRadius: '12px' }}>
                    <h3 style={{ marginTop: 0 }}>Personal Information</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Professional Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Full Stack Developer"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
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
                            <label>Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>

                    <h3>Social Links</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="url"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>

                    <h3>Professional Summary</h3>

                    <div className="form-group">
                        <label>Summary</label>
                        <textarea
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            rows="6"
                            placeholder="Brief professional summary..."
                        />
                    </div>

                    <h3>Resume PDF</h3>

                    <div className="form-group">
                        <label>PDF URL</label>
                        <input
                            type="url"
                            value={formData.pdf_url}
                            onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                            placeholder="https://example.com/resume.pdf"
                        />
                        <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                            Upload your PDF to a hosting service (Google Drive, Dropbox, etc.) and paste the public link here
                        </small>
                    </div>

                    {formData.pdf_url && (
                        <div style={{ marginTop: '16px' }}>
                            <a
                                href={formData.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#667eea', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Upload size={16} />
                                View Current Resume PDF
                            </a>
                        </div>
                    )}

                    <div className="form-actions" style={{ marginTop: '32px' }}>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            <Save size={20} />
                            <span>{saving ? 'Saving...' : 'Save Resume'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
