import { useState, useEffect } from 'react';
import { Clock, Tag, BookOpen } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './MediumBlogs.css';

export default function MediumBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [selectedTag, setSelectedTag] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await publicService.getBlogs();
            setBlogs(data);
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all unique tags
    const allTags = ['All', ...new Set(blogs.flatMap(blog => blog.tags || []))];

    const filteredBlogs = selectedTag === 'All'
        ? blogs
        : blogs.filter(blog => blog.tags?.includes(selectedTag));

    const BlogCard = ({ blog }) => {
        return (
            <article className="blog-card">
                {blog.cover_image_url && (
                    <div className="blog-image">
                        <img src={blog.cover_image_url} alt={blog.title} />
                    </div>
                )}

                <div className="blog-content">
                    <h2 className="blog-title">{blog.title}</h2>

                    <p className="blog-excerpt">
                        {blog.excerpt || blog.content.substring(0, 200) + '...'}
                    </p>

                    <div className="blog-meta">
                        <div className="meta-left">
                            {blog.read_time && (
                                <span className="read-time">
                                    <Clock size={14} />
                                    {blog.read_time} min read
                                </span>
                            )}
                            {blog.published_at && (
                                <span className="publish-date">
                                    {new Date(blog.published_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            )}
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="blog-tags">
                                {blog.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="read-more">Read More</button>
                </div>
            </article>
        );
    };

    if (loading) {
        return (
            <div className="medium-container">
                <div className="loading">Loading blogs...</div>
            </div>
        );
    }

    return (
        <div className="medium-container">
            <header className="medium-header">
                <div className="header-content">
                    <BookOpen size={48} className="medium-logo" />
                    <h1>Blog & Articles</h1>
                    <p>Thoughts, stories, and ideas</p>
                </div>
            </header>

            <div className="medium-content">
                {/* Tags Filter */}
                <div className="tags-filter">
                    <Tag size={20} />
                    <div className="tags-list">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="blogs-grid">
                    {filteredBlogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>

                {filteredBlogs.length === 0 && (
                    <div className="no-blogs">
                        <BookOpen size={64} />
                        <p>No blog posts found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
