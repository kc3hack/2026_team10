import React from "react";
import SendIcon from "@mui/icons-material/Send";
import "./InputArea.css";

interface InputAreaProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	placeholder?: string;
	hidden?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
	value,
	onChange,
	onSubmit,
	placeholder,
	hidden,
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !hidden) {
			onSubmit();
		}
	};

	return (
		<div className="input-area-container">
			<input
				type="text"
				className="input-field"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				style={{ visibility: hidden ? "hidden" : "visible" }}
			/>
			<div
				className="button-group"
				style={{ visibility: hidden ? "hidden" : "visible" }}
			>
				<button type="button" className="send-button" onClick={onSubmit}>
					<SendIcon className="send-button-icon" />
				</button>
			</div>
		</div>
	);
};

export default InputArea;
