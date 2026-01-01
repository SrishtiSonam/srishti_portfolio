import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader, Volume2, VolumeX } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { voiceService } from '../../services/voice.service';
import ReactMarkdown from 'react-markdown';
import './ChatModal.css';

export default function ChatModal({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your AI assistant. Ask me anything about the portfolio, projects, skills, or experience!',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Get chat history for context
            const chatHistory = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            // Call AI service
            const response = await aiService.chat(userMessage, chatHistory);

            // Add assistant response
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: response.response,
                    sources: response.sources,
                },
            ]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeak = (text, messageIndex) => {
        if (isSpeaking && currentSpeakingIndex === messageIndex) {
            // Stop speaking
            voiceService.stop();
            setIsSpeaking(false);
            setCurrentSpeakingIndex(null);
        } else {
            // Start speaking
            voiceService.stop(); // Stop any current speech
            voiceService.speak(text, {
                onStart: () => {
                    setIsSpeaking(true);
                    setCurrentSpeakingIndex(messageIndex);
                },
                onEnd: () => {
                    setIsSpeaking(false);
                    setCurrentSpeakingIndex(null);
                },
                onError: (error) => {
                    console.error('Speech error:', error);
                    setIsSpeaking(false);
                    setCurrentSpeakingIndex(null);
                }
            });
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            voiceService.stop();
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="chat-overlay" onClick={onClose}>
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chat-header">
                    <h2>AI Assistant</h2>
                    <button onClick={onClose} className="chat-close" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            <div className="message-content">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                                {message.sources && message.sources.length > 0 && (
                                    <div className="message-sources">
                                        <p className="sources-label">Sources:</p>
                                        {message.sources.map((source, idx) => (
                                            <span key={idx} className="source-tag">
                                                {source.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {message.role === 'assistant' && voiceService.isTextToSpeechSupported() && (
                                <button
                                    onClick={() => handleSpeak(message.content, index)}
                                    className="voice-control-btn"
                                    title={isSpeaking && currentSpeakingIndex === index ? 'Stop' : 'Listen'}
                                >
                                    {isSpeaking && currentSpeakingIndex === index ? (
                                        <VolumeX size={16} />
                                    ) : (
                                        <Volume2 size={16} />
                                    )}
                                </button>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content typing-indicator">
                                <Loader className="spinner" size={16} />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="chat-input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="chat-send"
                        disabled={!input.trim() || isLoading}
                        aria-label="Send"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
