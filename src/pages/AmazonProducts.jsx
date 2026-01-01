import { useState, useEffect } from 'react';
import { Star, ShoppingCart, ExternalLink, Github, Filter } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './AmazonProducts.css';

export default function AmazonProducts() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === selectedCategory));
        }
    }, [selectedCategory, projects]);

    const loadProjects = async () => {
        try {
            const data = await publicService.getProjects();
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

    const ProductCard = ({ project }) => {
        const rating = 4.5 + Math.random() * 0.5;
        const reviews = Math.floor(Math.random() * 500) + 100;

        return (
            <div className="product-card">
                <div className="product-image">
                    {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.title} />
                    ) : (
                        <div className="image-placeholder">
                            <ShoppingCart size={48} />
                        </div>
                    )}
                    {project.featured && <div className="badge">Featured</div>}
                </div>

                <div className="product-info">
                    <h3 className="product-title">{project.title}</h3>

                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.floor(rating) ? '#FFA41C' : 'none'}
                                    color="#FFA41C"
                                />
                            ))}
                        </div>
                        <span className="rating-text">{rating.toFixed(1)}</span>
                        <span className="review-count">({reviews})</span>
                    </div>

                    <p className="product-description">
                        {project.description.substring(0, 100)}...
                    </p>

                    {project.tech_stack && (
                        <div className="tech-list">
                            {project.tech_stack.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="tech-item">{tech}</span>
                            ))}
                        </div>
                    )}

                    <div className="product-actions">
                        {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                <ExternalLink size={16} />
                                <span>View Live</span>
                            </a>
                        )}
                        {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                <Github size={16} />
                                <span>Source Code</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="amazon-container">
                <div className="loading">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="amazon-container">
            <header className="amazon-header">
                <div className="header-content">
                    <h1>Project Marketplace</h1>
                    <p>Discover innovative projects and solutions</p>
                </div>
            </header>

            <div className="amazon-content">
                {/* Sidebar Filters */}
                <aside className="sidebar">
                    <div className="filter-section">
                        <h3 className="filter-title">
                            <Filter size={20} />
                            <span>Categories</span>
                        </h3>
                        <div className="filter-options">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                    <span className="count">
                                        ({category === 'All' ? projects.length : projects.filter(p => p.category === category).length})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">Featured</h3>
                        <div className="filter-options">
                            <label className="checkbox-option">
                                <input type="checkbox" />
                                <span>Featured Projects Only</span>
                            </label>
                            <label className="checkbox-option">
                                <input type="checkbox" />
                                <span>With Live Demo</span>
                            </label>
                            <label className="checkbox-option">
                                <input type="checkbox" />
                                <span>Open Source</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="products-main">
                    <div className="results-header">
                        <h2>
                            {selectedCategory === 'All' ? 'All Projects' : selectedCategory}
                            <span className="result-count">({filteredProjects.length} results)</span>
                        </h2>
                    </div>

                    <div className="products-grid">
                        {filteredProjects.map((project) => (
                            <ProductCard key={project.id} project={project} />
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="no-results">
                            <ShoppingCart size={64} />
                            <p>No projects found in this category</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
