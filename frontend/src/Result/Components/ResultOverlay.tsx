import "../Styles/Result.css";
import ResultButtons from "./ResultButtons";
import { useNavigate } from "react-router-dom";
import ThanksConfetti from "./ThanksConfetti";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
	onClose?: () => void;
}

export default function ResultOverlay({ onClose }: Props) {
	const navigate = useNavigate();

	const handleTitle = () => navigate("/");
	const handleRetry = () => alert("ゲームをリスタートします");
	const handleSNS = () => alert("SNSシェア用の処理をここに書きます");

	return (
		<button
			className="overlay"
			onClick={onClose}
			onKeyDown={(e) => e.key === "Escape" && onClose}
			type="button"
			tabIndex={0}
		>
			<IconButton
				className="close-icon-button"
				onClick={(e) => {
					e.stopPropagation();
					if (onClose) onClose();
				}}
			>
				<CloseIcon />
			</IconButton>

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
						onBackToTitle={handleTitle}
						onSNS={handleSNS}
						onRetry={handleRetry}
					/>
				</div>
			</div>
		</button>
	);
}