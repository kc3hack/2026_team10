import "../Styles/Result.css";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import ReplayIcon from "@mui/icons-material/Replay";

interface Props {
	onBackToTitle: () => void;
	onSNS: () => void;
	onRetry: () => void;
}

export default function ResultButtons({
	onBackToTitle,
	onSNS,
	onRetry,
}: Props) {
	return (
		<div className="button-container">
			<Button
				variant="outlined"
				onClick={onBackToTitle}
				className="square-icon-button"
			>
				<ArrowBackIcon fontSize="medium" />
				<span>
					タイトルに
					<br />
					戻る
				</span>
			</Button>

			<Button variant="outlined" onClick={onSNS} className="square-icon-button">
				<ShareIcon fontSize="medium" />
				<span>SNS</span>
			</Button>

			<Button variant="outlined" onClick={onRetry} className="square-icon-button">
				<ReplayIcon fontSize="medium" />
				<span>もう一度遊ぶ</span>
			</Button>
		</div>
	);
}
