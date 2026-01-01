import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { publicService } from '../../services/public.service';
import { adminService } from '../../services/admin.service';
import '../admin/ProjectsManager.css';

export default function BlogsManager() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await publicService.getBlogs(false);
            setBlogs(data);
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await adminService.deleteBlog(id);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    const BlogForm = ({ blog, onClose, onSave }) => {
        const [formData, setFormData] = useState(blog || {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            cover_image_url: '',
            tags: [],
            read_time: 5,
            is_published: false,
            meta_description: ''
        });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                // Auto-generate slug if empty
                if (!formData.slug) {
                    formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                }

                if (blog) {
                    await adminService.updateBlog(blog.id, formData);
                } else {
                    await adminService.createBlog(formData);
                }
                onSave();
                onClose();
                loadBlogs();
            } catch (error) {
                console.error('Error saving blog:', error);
                alert('Failed to save blog');
            }
        };

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                    <h2>{blog ? 'Edit Blog Post' : 'New Blog Post'}</h2>
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
                                <label>Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="auto-generated-from-title"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows="2"
                                placeholder="Brief summary for cards"
                            />
                        </div>

                        <div className="form-group">
                            <label>Content (Markdown) *</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows="10"
                                required
                                placeholder="Write your blog post in markdown..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Cover Image URL</label>
                                <input
                                    type="url"
                                    value={formData.cover_image_url}
                                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Read Time (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.read_time}
                                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                })}
                                placeholder="AI, Web Development, Tutorial"
                            />
                        </div>

                        <div className="form-group">
                            <label>Meta Description (SEO)</label>
                            <textarea
                                value={formData.meta_description}
                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                rows="2"
                                placeholder="SEO description"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                />
                                <span style={{ marginLeft: '8px' }}>Published</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                {blog ? 'Update' : 'Create'} Blog Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading blogs...</div>;
    }

    return (
        <div className="projects-manager">
            <div className="manager-header">
                <div>
                    <h1>Blog Posts</h1>
                    <p>Manage your blog articles</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus size={20} />
                    <span>New Post</span>
                </button>
            </div>

            <div className="projects-grid">
                {blogs.map((blog) => (
                    <div key={blog.id} className="project-card">
                        <div className="card-header">
                            <h3>{blog.title}</h3>
                            {blog.is_published ? (
                                <span className="featured-badge" style={{ background: '#34a853' }}>Published</span>
                            ) : (
                                <span className="featured-badge" style={{ background: '#999' }}>Draft</span>
                            )}
                        </div>
                        <p className="card-description">{blog.excerpt || blog.content.substring(0, 100) + '...'}</p>
                        <div className="card-meta">
                            <span className="category-badge">{blog.read_time} min read</span>
                            {blog.tags && blog.tags.length > 0 && (
                                <span className="theme-badge">{blog.tags[0]}</span>
                            )}
                        </div>
                        <div className="card-actions">
                            <button onClick={() => { setEditingBlog(blog); setShowForm(true); }} className="btn-icon">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(blog.id)} className="btn-icon btn-danger">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <BlogForm
                    blog={editingBlog}
                    onClose={() => { setShowForm(false); setEditingBlog(null); }}
                    onSave={() => { setEditingBlog(null); }}
                />
            )}
        </div>
    );
}
