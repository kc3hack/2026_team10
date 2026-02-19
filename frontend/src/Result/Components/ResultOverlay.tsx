import "../Styles/Result.css";
import ResultButtons from "./ResultButtons";
import { useNavigate } from "react-router-dom";
import ThanksConfetti from "./ThanksConfetti";

interface Props {
	onClose?: () => void;
}

export default function ResultOverlay({ onClose }: Props) {
	const navigate = useNavigate();

	const handleTitle = () => navigate("/");
	//ゲームをリスタートする（ページのリロード？）
	const handleRetry = () => alert("ゲームをリスタートします");

	return (
		<button
			className="overlay"
			onClick={onClose}
			onKeyDown={(e) => e.key === "Escape" && onClose}
			type="button"
			tabIndex={0}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="dialog"
				tabIndex={-1}
				className="result-content-wrapper"
			>
				<ThanksConfetti />

				<div className="result-buttons-wrapper">
					<ResultButtons
						onBackToLog={() => onClose?.()}
						onBackToTitle={handleTitle}
						onRetry={handleRetry}
					/>
				</div>
			</div>
		</button>
	);
}