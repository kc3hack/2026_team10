import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplayIcon from "@mui/icons-material/Replay";
import "../Styles/Result.css";

interface Props {
	gameId: number;
	isBookmarked: boolean;
	isAnimating: boolean;
	onBackToTitle: () => void;
	onRetry: () => void;
	onBookmark: () => void;
}

export default function ResultButtons({
	isBookmarked,
	isAnimating,
	onBackToTitle,
	onRetry,
	onBookmark,
}: Props) {
	const baseButtonSx = {
		width: "110px",
		height: "80px",
		display: "flex",
		flexDirection: "column",
		gap: "4px",
		fontWeight: "bold",
		fontSize: "0.85rem",
		lineHeight: 1.2,
		textTransform: "none",
		borderRadius: "8px",
		borderWidth: "1px",
		"&:hover": {
			borderWidth: "1px",
		},
	};

	const orangeStyle = {
		color: "#ed6c02",
		borderColor: "#ed6c02",
		"&:hover": {
			borderColor: "#e65100",
			backgroundColor: "rgba(237, 108, 2, 0.04)",
		},
	};

	const heartStyle = {
		color: isBookmarked ? "#fff" : "#aaa",
		borderColor: isBookmarked ? "#ff4757" : "#ccc",
		backgroundColor: isBookmarked ? "#ff4757" : "transparent",
		"&:hover": {
			borderColor: isBookmarked ? "#e8313f" : "#ff6b81",
			backgroundColor: isBookmarked ? "#e8313f" : "rgba(255, 71, 87, 0.06)",
			color: isBookmarked ? "#fff" : "#ff6b81",
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
				variant={isBookmarked ? "contained" : "outlined"}
				onClick={onBookmark}
				className={isAnimating ? "bookmark-pop" : ""}
				sx={{
					...baseButtonSx,
					...heartStyle,
					transition:
						"color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
				}}
			>
				{isAnimating ? (
					<img
						src={`/chaShibaki.gif?t=${Date.now()}`}
						alt="ええやん"
						style={{ width: "40px", height: "40px", objectFit: "contain" }}
					/>
				) : (
					<img
						src="/chashibaki.png"
						alt="ちゃしばき済"
						style={{ width: "40px", height: "40px", objectFit: "contain" }}
					/>
				)}
				<span>ええやん</span>
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
