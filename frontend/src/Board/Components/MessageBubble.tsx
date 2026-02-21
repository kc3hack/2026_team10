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
		// ファイル名から拡張子を除いた部分をクラス名として追加
		const iconClassName =
			src.split("/").pop()?.split(".")[0]?.toLowerCase() || "";
		return (
			<div className={`icon ${iconClassName}`}>
				<img src={src} alt="icon" className={`icon-img ${iconClassName}`} />
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
