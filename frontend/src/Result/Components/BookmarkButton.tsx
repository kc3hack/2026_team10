import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../Styles/Result.css";

interface Props {
	readonly gameId: number;
}

export default function BookmarkButton({ gameId }: Props) {
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleBookmark = async () => {
		if (isBookmarked) return;

		setIsAnimating(true);
		setIsBookmarked(true);

		try {
			await fetch(`/api/solo/${gameId}/bookmark`, { method: "POST" });
		} catch (e) {
			console.error("ブックマーク登録に失敗しました:", e);
			setIsBookmarked(false);
		}

		setTimeout(() => setIsAnimating(false), 600);
	};

	return (
		<IconButton
			className={`bookmark-button ${isBookmarked ? "bookmarked" : ""} ${isAnimating ? "bookmark-pop" : ""}`}
			onClick={handleBookmark}
			size="small"
		>
			{isBookmarked ? (
				<FavoriteIcon className="bookmark-icon-filled" />
			) : (
				<FavoriteBorderIcon className="bookmark-icon-outline" />
			)}
		</IconButton>
	);
}
