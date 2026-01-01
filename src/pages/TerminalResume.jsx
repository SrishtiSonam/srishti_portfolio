import { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { publicService } from '../../services/public.service';
import './TerminalResume.css';

export default function TerminalResume() {
    const [resume, setResume] = useState(null);
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Show welcome message
        addToHistory('Welcome to Interactive Resume Terminal', 'system');
        addToHistory('Type "help" for available commands', 'system');
    }, []);

    const loadData = async () => {
        try {
            const [resumeData, expData, skillsData] = await Promise.all([
                publicService.getResume(),
                publicService.getExperience(),
                publicService.getSkills()
            ]);
            setResume(resumeData);
            setExperience(expData);
            setSkills(skillsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToHistory = (text, type = 'output') => {
        setCommandHistory(prev => [...prev, { text, type, timestamp: Date.now() }]);
    };

    const executeCommand = (cmd) => {
        const command = cmd.trim().toLowerCase();
        addToHistory(`$ ${cmd}`, 'command');

        switch (command) {
            case 'help':
                addToHistory('Available commands:', 'output');
                addToHistory('  about     - Display personal information', 'output');
                addToHistory('  skills    - List technical skills', 'output');
                addToHistory('  experience - Show work experience', 'output');
                addToHistory('  education - Display education', 'output');
                addToHistory('  contact   - Show contact information', 'output');
                addToHistory('  download  - Download resume PDF', 'output');
                addToHistory('  clear     - Clear terminal', 'output');
                break;

            case 'about':
                if (resume) {
                    addToHistory(`Name: ${resume.full_name}`, 'output');
                    addToHistory(`Title: ${resume.title || 'Professional'}`, 'output');
                    addToHistory(`Location: ${resume.location || 'N/A'}`, 'output');
                    addToHistory('', 'output');
                    addToHistory(resume.summary || 'No summary available', 'output');
                }
                break;

            case 'skills':
                if (skills.length > 0) {
                    const grouped = skills.reduce((acc, skill) => {
                        if (!acc[skill.category]) acc[skill.category] = [];
                        acc[skill.category].push(skill);
                        return acc;
                    }, {});

                    Object.entries(grouped).forEach(([category, categorySkills]) => {
                        addToHistory(`\n${category}:`, 'output');
                        categorySkills.forEach(skill => {
                            const proficiency = Math.round(skill.proficiency * 100);
                            const bar = '█'.repeat(proficiency / 10) + '░'.repeat(10 - proficiency / 10);
                            addToHistory(`  ${skill.name.padEnd(20)} ${bar} ${proficiency}%`, 'output');
                        });
                    });
                } else {
                    addToHistory('No skills data available', 'output');
                }
                break;

            case 'experience':
                const workExp = experience.filter(e => e.type === 'work');
                if (workExp.length > 0) {
                    workExp.forEach((exp, idx) => {
                        addToHistory(`\n[${idx + 1}] ${exp.title} @ ${exp.organization}`, 'output');
                        addToHistory(`    ${exp.start_date} - ${exp.end_date || 'Present'}`, 'output');
                        if (exp.description) {
                            addToHistory(`    ${exp.description}`, 'output');
                        }
                    });
                } else {
                    addToHistory('No work experience data available', 'output');
                }
                break;

            case 'education':
                const edu = experience.filter(e => e.type === 'education');
                if (edu.length > 0) {
                    edu.forEach((e, idx) => {
                        addToHistory(`\n[${idx + 1}] ${e.degree || e.title}`, 'output');
                        addToHistory(`    ${e.organization}`, 'output');
                        addToHistory(`    ${e.start_date} - ${e.end_date || 'Present'}`, 'output');
                        if (e.gpa) {
                            addToHistory(`    GPA: ${e.gpa}`, 'output');
                        }
                    });
                } else {
                    addToHistory('No education data available', 'output');
                }
                break;

            case 'contact':
                if (resume) {
                    addToHistory('Contact Information:', 'output');
                    if (resume.email) addToHistory(`  Email: ${resume.email}`, 'output');
                    if (resume.phone) addToHistory(`  Phone: ${resume.phone}`, 'output');
                    if (resume.github) addToHistory(`  GitHub: ${resume.github}`, 'output');
                    if (resume.linkedin) addToHistory(`  LinkedIn: ${resume.linkedin}`, 'output');
                    if (resume.website) addToHistory(`  Website: ${resume.website}`, 'output');
                }
                break;

            case 'download':
                if (resume?.pdf_url) {
                    addToHistory('Opening resume PDF...', 'output');
                    window.open(resume.pdf_url, '_blank');
                } else {
                    addToHistory('Resume PDF not available', 'error');
                }
                break;

            case 'clear':
                setCommandHistory([]);
                addToHistory('Terminal cleared', 'system');
                break;

            case '':
                break;

            default:
                addToHistory(`Command not found: ${cmd}`, 'error');
                addToHistory('Type "help" for available commands', 'error');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentCommand.trim()) {
            executeCommand(currentCommand);
            setCurrentCommand('');
        }
    };

    if (loading) {
        return (
            <div className="terminal-container">
                <div className="loading">Loading terminal...</div>
            </div>
        );
    }

    return (
        <div className="terminal-container">
            <div className="terminal-window">
                <div className="terminal-header">
                    <div className="terminal-buttons">
                        <span className="btn-close"></span>
                        <span className="btn-minimize"></span>
                        <span className="btn-maximize"></span>
                    </div>
                    <div className="terminal-title">
                        <TerminalIcon size={16} />
                        <span>resume.sh - Interactive Resume</span>
                    </div>
                </div>

                <div className="terminal-body">
                    <div className="terminal-output">
                        {commandHistory.map((item, idx) => (
                            <div key={idx} className={`terminal-line ${item.type}`}>
                                {item.type === 'command' && <ChevronRight size={16} className="prompt-icon" />}
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="terminal-input-form">
                        <ChevronRight size={16} className="prompt-icon" />
                        <input
                            type="text"
                            value={currentCommand}
                            onChange={(e) => setCurrentCommand(e.target.value)}
                            className="terminal-input"
                            placeholder="Type a command..."
                            autoFocus
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
