import { useState } from "react";
import "../Styles/Result.css";
import ResultButtons from "./ResultButtons";
import ShareModal from "./ShareModal";
import { useNavigate } from "react-router-dom";
import ThanksConfetti from "./ThanksConfetti";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
	readonly gameId: number;
	readonly onClose?: () => void;
}

export default function ResultOverlay({ gameId, onClose }: Props) {
	const navigate = useNavigate();
	const [isShareOpen, setIsShareOpen] = useState(false);

	const handleTitle = () => navigate("/");
	const handleRetry = () => window.location.reload();
	const handleShare = () => setIsShareOpen(true);

	return (
		<button
			className="overlay"
			onClick={onClose}
			onKeyDown={(e) => e.key === "Escape" && onClose}
			type="button"
			tabIndex={0}
		>
			<ThanksConfetti />

			<div
				className="result-card"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="dialog"
				tabIndex={-1}
			>
				<IconButton
					className="result-card-close"
					onClick={(e) => {
						e.stopPropagation();
						if (onClose) onClose();
					}}
					size="small"
				>
					<CloseIcon />
				</IconButton>

				<h1 className="seikai-text">正解</h1>

				<ResultButtons
					onBackToTitle={handleTitle}
					onSNS={handleShare}
					onRetry={handleRetry}
				/>
			</div>

			{isShareOpen && (
				<ShareModal gameId={gameId} onClose={() => setIsShareOpen(false)} />
			)}
		</button>
	);
}
