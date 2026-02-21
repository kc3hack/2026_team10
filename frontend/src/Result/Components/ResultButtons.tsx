import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReplayIcon from "@mui/icons-material/Replay";

interface Props {
	gameId: number;
	onBackToTitle: () => void;
	onShare: () => void;
	onRetry: () => void;
}

export default function ResultButtons({
	gameId,
	onBackToTitle,
	onShare,
	onRetry,
}: Props) {
	const [isBookmarked, setIsBookmarked] = useState(false);

	const handleBookmark = async () => {
		if (!isBookmarked) {
			setIsBookmarked(true);
			try {
				await fetch(`/api/solo/${gameId}/bookmark`, { method: "POST" });
			} catch (e) {
				console.error("ブックマーク登録に失敗しました:", e);
				setIsBookmarked(false);
				return;
			}
		}
		onShare();
	};
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
				onClick={handleBookmark}
				sx={{ ...baseButtonSx, ...blackStyle }}
			>
				{isBookmarked ? <BookmarkIcon fontSize="medium" /> : <BookmarkBorderIcon fontSize="medium" />}
				<span>
					ええやん
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