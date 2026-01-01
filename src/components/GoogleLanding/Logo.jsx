import './Logo.css';

export default function Logo({ name = "Your Name" }) {
    return (
        <div className="google-logo">
            <h1 className="logo-text">
                {name.split('').map((char, index) => (
                    <span key={index} className={`letter letter-${index % 4}`}>
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
}
