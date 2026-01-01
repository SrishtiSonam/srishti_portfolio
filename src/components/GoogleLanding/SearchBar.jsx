import { useState } from 'react';
import { Search, Mic, Sparkles } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onSearch, onVoiceSearch, onAIChat }) {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleVoiceClick = () => {
        setIsListening(true);
        onVoiceSearch();
        // Voice search will update the query
        setTimeout(() => setIsListening(false), 3000);
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-bar">
                <Search className="search-icon" size={20} />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search portfolio..."
                    className="search-input"
                />

                <button
                    type="button"
                    onClick={handleVoiceClick}
                    className={`voice-button ${isListening ? 'listening' : ''}`}
                    aria-label="Voice search"
                >
                    <Mic size={20} />
                </button>

                <button
                    type="button"
                    onClick={onAIChat}
                    className="ai-button"
                    aria-label="AI Chat"
                >
                    <Sparkles size={20} />
                </button>
            </form>
        </div>
    );
}
