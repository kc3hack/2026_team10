import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
    text: string;
    isUser: boolean;
    icon?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isUser, icon }) => {
    return (
        <div className={`message-container ${isUser ? 'user' : 'system'}`}>
            {!isUser && icon && <span className="icon">{icon}</span>}
            <div className="bubble">
                {text}
            </div>
            {isUser && icon && <span className="icon">{icon}</span>}
        </div>
    );
};

export default MessageBubble;
