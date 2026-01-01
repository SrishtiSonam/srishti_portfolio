import { Github, Linkedin, Code2, FileText, Briefcase, BookOpen } from 'lucide-react';
import './ShortcutTiles.css';

const defaultShortcuts = [
    { name: 'GitHub', icon: Github, url: 'https://github.com', color: '#333' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: '#0077b5' },
    { name: 'LeetCode', icon: Code2, url: 'https://leetcode.com', color: '#ffa116' },
    { name: 'Resume', icon: FileText, url: '/resume', color: '#ea4335' },
    { name: 'Projects', icon: Briefcase, url: '/projects', color: '#4285f4' },
    { name: 'Blog', icon: BookOpen, url: '/blog', color: '#34a853' },
];

export default function ShortcutTiles({ shortcuts = defaultShortcuts }) {
    const handleClick = (url) => {
        if (url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    };

    return (
        <div className="shortcut-tiles">
            {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon;
                return (
                    <button
                        key={index}
                        className="shortcut-tile"
                        onClick={() => handleClick(shortcut.url)}
                        style={{ '--tile-color': shortcut.color }}
                    >
                        <div className="tile-icon">
                            <Icon size={24} />
                        </div>
                        <span className="tile-name">{shortcut.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
