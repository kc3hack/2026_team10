import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../Styles/Result.css";

interface Props {
	readonly isBookmarked: boolean;
	readonly isAnimating?: boolean;
	readonly onClick?: () => void;
}

export default function BookmarkButton({
	isBookmarked,
	isAnimating = false,
	onClick,
}: Props) {
	return (
		<IconButton
			className={`bookmark-button ${isBookmarked ? "bookmarked" : ""} ${isAnimating ? "bookmark-pop" : ""}`}
			onClick={onClick}
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
