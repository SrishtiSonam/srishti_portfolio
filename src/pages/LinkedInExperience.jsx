import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './LinkedInExperience.css';

export default function LinkedInExperience() {
    const [experience, setExperience] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExperience();
    }, []);

    const loadExperience = async () => {
        try {
            const data = await publicService.getExperience();
            setExperience(data);
        } catch (error) {
            console.error('Error loading experience:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredExperience = filter === 'all'
        ? experience
        : experience.filter(e => e.type === filter);

    const ExperienceCard = ({ item }) => {
        const isWork = item.type === 'work';
        const Icon = isWork ? Briefcase : GraduationCap;

        return (
            <div className="experience-card">
                <div className="card-icon">
                    <Icon size={24} />
                </div>
                <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-organization">{item.organization}</p>

                    <div className="card-meta">
                        <span className="meta-item">
                            <Calendar size={14} />
                            {item.start_date} - {item.end_date || 'Present'}
                            {item.is_current && <span className="current-badge">Current</span>}
                        </span>
                        {item.location && (
                            <span className="meta-item">
                                <MapPin size={14} />
                                {item.location}
                            </span>
                        )}
                    </div>

                    {item.description && (
                        <p className="card-description">{item.description}</p>
                    )}

                    {item.achievements && item.achievements.length > 0 && (
                        <div className="achievements">
                            <h4>Key Achievements:</h4>
                            <ul>
                                {item.achievements.map((achievement, idx) => (
                                    <li key={idx}>{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {item.skills_used && item.skills_used.length > 0 && (
                        <div className="skills-used">
                            {item.skills_used.map((skill, idx) => (
                                <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    )}

                    {/* Education specific fields */}
                    {!isWork && (
                        <>
                            {item.field_of_study && (
                                <p className="field-of-study">Field: {item.field_of_study}</p>
                            )}
                            {item.gpa && (
                                <p className="gpa">GPA: {item.gpa}</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="linkedin-container">
                <div className="loading">Loading experience...</div>
            </div>
        );
    }

    return (
        <div className="linkedin-container">
            <header className="linkedin-header">
                <div className="header-content">
                    <h1>Professional Experience</h1>
                    <p>Career journey and education</p>
                </div>
            </header>

            <div className="linkedin-content">
                <div className="filter-tabs">
                    <button
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({experience.length})
                    </button>
                    <button
                        className={`tab ${filter === 'work' ? 'active' : ''}`}
                        onClick={() => setFilter('work')}
                    >
                        <Briefcase size={16} />
                        Work Experience ({experience.filter(e => e.type === 'work').length})
                    </button>
                    <button
                        className={`tab ${filter === 'education' ? 'active' : ''}`}
                        onClick={() => setFilter('education')}
                    >
                        <GraduationCap size={16} />
                        Education ({experience.filter(e => e.type === 'education').length})
                    </button>
                </div>

                <div className="timeline">
                    {filteredExperience.map((item) => (
                        <ExperienceCard key={item.id} item={item} />
                    ))}
                </div>

                {filteredExperience.length === 0 && (
                    <div className="no-data">
                        <p>No {filter === 'all' ? 'experience' : filter} data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
