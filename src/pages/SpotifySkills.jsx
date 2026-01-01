import { useState, useEffect } from 'react';
import { Play, Pause, Music, Heart } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './SpotifySkills.css';

export default function SpotifySkills() {
    const [skills, setSkills] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [currentSkill, setCurrentSkill] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const data = await publicService.getSkills();
            setSkills(data);

            // Group by playlist or category
            const playlists = groupSkillsByPlaylist(data);
            if (playlists.length > 0) {
                setSelectedPlaylist(playlists[0]);
            }
        } catch (error) {
            console.error('Error loading skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupSkillsByPlaylist = (skills) => {
        const grouped = skills.reduce((acc, skill) => {
            const key = skill.playlist_name || skill.category || 'Other';
            if (!acc[key]) {
                acc[key] = {
                    name: key,
                    skills: [],
                    color: skill.color || getRandomColor()
                };
            }
            acc[key].skills.push(skill);
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const getRandomColor = () => {
        const colors = ['#1db954', '#ff6b6b', '#4ecdc4', '#f7b731', '#5f27cd', '#00d2d3'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const playlists = groupSkillsByPlaylist(skills);

    const handlePlaySkill = (skill) => {
        setCurrentSkill(skill);
        setIsPlaying(true);
    };

    if (loading) {
        return (
            <div className="spotify-container">
                <div className="loading">Loading skills...</div>
            </div>
        );
    }

    return (
        <div className="spotify-container">
            <div className="spotify-sidebar">
                <div className="sidebar-header">
                    <Music size={32} className="spotify-logo" />
                    <h1>Skills Library</h1>
                </div>

                <div className="playlists">
                    <h3>Playlists</h3>
                    {playlists.map((playlist, idx) => (
                        <button
                            key={idx}
                            className={`playlist-item ${selectedPlaylist?.name === playlist.name ? 'active' : ''}`}
                            onClick={() => setSelectedPlaylist(playlist)}
                        >
                            <div className="playlist-icon" style={{ background: playlist.color }}>
                                <Music size={20} />
                            </div>
                            <div className="playlist-info">
                                <span className="playlist-name">{playlist.name}</span>
                                <span className="playlist-count">{playlist.skills.length} skills</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="spotify-main">
                {selectedPlaylist && (
                    <>
                        <div className="playlist-header" style={{ background: `linear-gradient(135deg, ${selectedPlaylist.color}dd, ${selectedPlaylist.color}66)` }}>
                            <div className="playlist-cover" style={{ background: selectedPlaylist.color }}>
                                <Music size={64} />
                            </div>
                            <div className="playlist-details">
                                <span className="playlist-label">Playlist</span>
                                <h2 className="playlist-title">{selectedPlaylist.name}</h2>
                                <p className="playlist-meta">{selectedPlaylist.skills.length} skills</p>
                            </div>
                        </div>

                        <div className="skills-list">
                            <div className="list-header">
                                <span className="col-number">#</span>
                                <span className="col-title">Skill</span>
                                <span className="col-proficiency">Proficiency</span>
                                <span className="col-experience">Experience</span>
                            </div>

                            {selectedPlaylist.skills.map((skill, idx) => (
                                <div
                                    key={skill.id}
                                    className={`skill-row ${currentSkill?.id === skill.id ? 'playing' : ''}`}
                                    onClick={() => handlePlaySkill(skill)}
                                >
                                    <span className="col-number">
                                        {currentSkill?.id === skill.id && isPlaying ? (
                                            <Play size={16} className="playing-icon" />
                                        ) : (
                                            idx + 1
                                        )}
                                    </span>
                                    <div className="col-title">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-category">{skill.category}</span>
                                    </div>
                                    <div className="col-proficiency">
                                        <div className="proficiency-bar">
                                            <div
                                                className="proficiency-fill"
                                                style={{ width: `${skill.proficiency * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="proficiency-text">{Math.round(skill.proficiency * 100)}%</span>
                                    </div>
                                    <span className="col-experience">
                                        {skill.years_experience ? `${skill.years_experience} years` : 'N/A'}
                                    </span>
                                    <button className="like-btn">
                                        <Heart size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Now Playing Bar */}
            {currentSkill && (
                <div className="now-playing">
                    <div className="now-playing-info">
                        <Music size={20} />
                        <div className="now-playing-text">
                            <span className="now-playing-skill">{currentSkill.name}</span>
                            <span className="now-playing-category">{currentSkill.category}</span>
                        </div>
                    </div>
                    <div className="now-playing-controls">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="play-btn">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                    </div>
                    <div className="now-playing-proficiency">
                        <span>Proficiency: {Math.round(currentSkill.proficiency * 100)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
