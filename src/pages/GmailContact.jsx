import { useState } from 'react';
import { Send, Paperclip, Star, Archive, Trash2, Mail } from 'lucide-react';
import './GmailContact.css';

export default function GmailContact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        // Simulate sending email
        setTimeout(() => {
            setSending(false);
            setSent(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({ name: '', email: '', subject: '', message: '' });
                setSent(false);
            }, 3000);
        }, 1500);
    };

    return (
        <div className="gmail-container">
            <aside className="gmail-sidebar">
                <button className="compose-button">
                    <Mail size={20} />
                    <span>Compose</span>
                </button>

                <nav className="gmail-nav">
                    <a href="#" className="nav-item">
                        <Mail size={18} />
                        <span>Inbox</span>
                        <span className="count">3</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Star size={18} />
                        <span>Starred</span>
                    </a>
                    <a href="#" className="nav-item active">
                        <Send size={18} />
                        <span>Sent</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Archive size={18} />
                        <span>Archive</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Trash2 size={18} />
                        <span>Trash</span>
                    </a>
                </nav>
            </aside>

            <main className="gmail-main">
                <header className="gmail-header">
                    <h1>Contact Me</h1>
                    <p>Send me a message and I'll get back to you soon</p>
                </header>

                <div className="email-compose">
                    {sent ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h2>Message Sent!</h2>
                            <p>Thank you for reaching out. I'll respond as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="compose-form">
                            <div className="form-field">
                                <label>From</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="What's this about?"
                                    required
                                />
                            </div>

                            <div className="form-field message-field">
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Type your message here..."
                                    rows="12"
                                    required
                                />
                            </div>

                            <div className="compose-footer">
                                <button type="submit" className="send-button" disabled={sending}>
                                    <Send size={16} />
                                    <span>{sending ? 'Sending...' : 'Send'}</span>
                                </button>
                                <button type="button" className="icon-button" title="Attach file">
                                    <Paperclip size={18} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
