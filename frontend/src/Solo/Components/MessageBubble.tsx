import React from "react";
import "./MessageBubble.css";

interface MessageBubbleProps {
	text: string;
	isUser: boolean;
	icon?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
	text,
	isUser,
	icon,
}) => {
	const DEFAULT_ICON_URL =
		"https://knsoza1.com/wp-content/uploads/2025/02/4cbc0aab7c6d44a4559d83b2d733d166.png";

	const renderIcon = () => {
		const src = icon || DEFAULT_ICON_URL;
		return (
			<div className="icon">
				<img src={src} alt="icon" className="icon-img" />
			</div>
		);
	};

	return (
		<div className={`message-container ${isUser ? "user" : "system"}`}>
			{!isUser && renderIcon()}
			<div className="bubble">{text}</div>
		</div>
	);
};

export default MessageBubble;
