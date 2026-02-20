import "../Styles/Result.css";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import XIcon from "@mui/icons-material/X";
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
				<XIcon fontSize="medium" />
				<span>
					Xで
					<br />
					シェア
				</span>
			</Button>

			<Button variant="outlined" onClick={onRetry} className="square-icon-button">
				<ReplayIcon fontSize="medium" />
				<span>もう一度遊ぶ</span>
			</Button>
		</div>
	);
}
