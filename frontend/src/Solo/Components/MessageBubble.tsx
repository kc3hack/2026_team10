import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
    text: string;
    isUser: boolean;
    icon?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isUser, icon }) => {
    const defaultIconUrl = "https://knsoza1.com/wp-content/uploads/2025/02/4cbc0aab7c6d44a4559d83b2d733d166.png";

    const renderIcon = () => {
        if (icon) {
            return <span className="icon">{icon}</span>;
        }
        return <img src={DEFAULT_ICON_URL} className="icon" alt="icon" />;
    };

    return (
        <div className={`message-container ${isUser ? 'user' : 'system'}`}>
            {!isUser && renderIcon()}
            <div className="bubble">
                {text}
            </div>
            {isUser && renderIcon()}
        </div>
    );
};

export default MessageBubble;
