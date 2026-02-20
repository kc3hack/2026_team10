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
		backgroundColor: "#ff9800",
		color: "white",
		"&:hover": {
			backgroundColor: "#f57c00",
		},
	};

	return (
		<Stack direction="row" spacing={2} justifyContent="center" width="100%">
			<Button
				variant="contained"
				onClick={onBackToTitle}
				sx={baseButtonSx}
			>
				<ArrowBackIcon fontSize="medium" />
				<span>
					タイトルに
					<br />
					戻る
				</span>
			</Button>

			<Button
				variant="contained"
				onClick={onSNS}
				sx={baseButtonSx}
			>
				<XIcon fontSize="medium" />
				<span>
					Xで
					<br />
					シェア
				</span>
			</Button>

			<Button
				variant="contained"
				onClick={onRetry}
				sx={baseButtonSx}
			>
				<ReplayIcon fontSize="medium" />
				<span>もう一度遊ぶ</span>
			</Button>
		</Stack>
	);
}