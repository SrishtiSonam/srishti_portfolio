import { useState } from 'react';
import { Grid3x3, X } from 'lucide-react';
import {
    Film,
    Youtube,
    ShoppingBag,
    Github,
    Mail,
    Terminal,
    Music,
    Linkedin,
    BookOpen
} from 'lucide-react';
import './AppGrid.css';

const apps = [
    { name: 'Projects', icon: Film, path: '/projects', theme: 'netflix', color: '#e50914' },
    { name: 'Demos', icon: Youtube, path: '/demos', theme: 'youtube', color: '#ff0000' },
    { name: 'Products', icon: ShoppingBag, path: '/products', theme: 'amazon', color: '#ff9900' },
    { name: 'Code', icon: Github, path: '/code', theme: 'github', color: '#333' },
    { name: 'Contact', icon: Mail, path: '/contact', theme: 'gmail', color: '#ea4335' },
    { name: 'Resume', icon: Terminal, path: '/resume', theme: 'terminal', color: '#00ff00' },
    { name: 'Skills', icon: Music, path: '/skills', theme: 'spotify', color: '#1db954' },
    { name: 'Experience', icon: Linkedin, path: '/experience', theme: 'linkedin', color: '#0077b5' },
    { name: 'Blog', icon: BookOpen, path: '/blog', theme: 'medium', color: '#000' },
];

export default function AppGrid() {
    const [isOpen, setIsOpen] = useState(false);

    const handleAppClick = (path) => {
        window.location.href = path;
        setIsOpen(false);
    };

    return (
        <>
            <button
                className="app-grid-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Apps"
            >
                <Grid3x3 size={20} />
            </button>

            {isOpen && (
                <div className="app-grid-overlay" onClick={() => setIsOpen(false)}>
                    <div className="app-grid-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="app-grid-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="app-grid-content">
                            <h2 className="app-grid-title">Explore Portfolio</h2>
                            <div className="app-grid">
                                {apps.map((app, index) => {
                                    const Icon = app.icon;
                                    return (
                                        <button
                                            key={index}
                                            className="app-item"
                                            onClick={() => handleAppClick(app.path)}
                                            style={{ '--app-color': app.color }}
                                        >
                                            <div className="app-icon">
                                                <Icon size={32} />
                                            </div>
                                            <span className="app-name">{app.name}</span>
                                            <span className="app-theme">{app.theme}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
