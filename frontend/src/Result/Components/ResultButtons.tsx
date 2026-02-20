import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
	const baseButtonSx = {
		width: "110px",
		height: "100px",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
		fontWeight: "bold",
		fontSize: "0.85rem",
		lineHeight: 1.2,
		textTransform: "none",
		borderRadius: "8px",
		borderWidth: "1px",
		"&:hover": {
			borderWidth: "1px",
		}
	};

	const orangeStyle = {
		color: "#ed6c02",
		borderColor: "#ed6c02",
		"&:hover": {
			borderColor: "#e65100",
			backgroundColor: "rgba(237, 108, 2, 0.04)",
		},
	};

	const blackStyle = {
		color: "black",
		borderColor: "black",
		"&:hover": {
			borderColor: "#333333",
			backgroundColor: "rgba(0, 0, 0, 0.04)",
		},
	};

	return (
		<Stack direction="row" spacing={2} justifyContent="center" width="100%">
			<Button
				variant="outlined"
				onClick={onBackToTitle}
				sx={{ ...baseButtonSx, ...orangeStyle }}
			>
				<ArrowBackIcon fontSize="medium" />
				<span>
					タイトル
					<br />
					に戻る
				</span>
			</Button>

			<Button
				variant="outlined"
				onClick={onSNS}
				sx={{ ...baseButtonSx, ...blackStyle }}
			>
				<XIcon fontSize="medium" />
				<span>
					Xで
					<br />
					シェア
				</span>
			</Button>

			<Button
				variant="outlined"
				onClick={onRetry}
				sx={{ ...baseButtonSx, ...orangeStyle }}
			>
				<ReplayIcon fontSize="medium" />
				<span>
					もう一度
					<br />
					遊ぶ
				</span>
			</Button>
		</Stack>
	);
}