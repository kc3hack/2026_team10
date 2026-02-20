import "../Styles/Result.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import XIcon from "@mui/icons-material/X";

interface Props {
	onClose: () => void;
}

const SHARE_TEXT = "偏見で遊ぼうで遊んだよ！ #偏見で遊ぼう";

export default function ShareModal({ onClose }: Props) {
	const handlePostToX = () => {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
		window.open(url, "_blank", "noopener,noreferrer");
	};

	return (
		<div
			className="share-modal-backdrop"
			onClick={onClose}
			onKeyDown={(e) => e.key === "Escape" && onClose()}
			role="presentation"
		>
			<div
				className="share-modal"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="dialog"
				aria-label="シェアプレビュー"
				tabIndex={-1}
			>
				<IconButton
					className="share-modal-close"
					onClick={onClose}
					size="small"
				>
					<CloseIcon />
				</IconButton>

				<p className="share-modal-label">投稿内容プレビュー</p>
				<div className="share-modal-preview">{SHARE_TEXT}</div>

				<Button
					variant="contained"
					onClick={handlePostToX}
					startIcon={<XIcon />}
					sx={{
						backgroundColor: "#000",
						color: "#fff",
						fontWeight: "bold",
						textTransform: "none",
						borderRadius: "9999px",
						paddingX: 3,
						"&:hover": {
							backgroundColor: "#333",
						},
					}}
				>
					Xに投稿する
				</Button>
			</div>
		</div>
	);
}
