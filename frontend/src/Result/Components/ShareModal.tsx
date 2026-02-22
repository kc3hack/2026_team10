import CloseIcon from "@mui/icons-material/Close";
import XIcon from "@mui/icons-material/X";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import "../Styles/Result.css";

interface Props {
	readonly gameId: number;
	readonly onClose: () => void;
}

function buildShareText(gameId: number): string {
	const shareUrl = `${globalThis.location.origin}/board/${gameId}`;
	return `「あれちゃう？知らんけど。」で遊んだで！みんなも遊ばへん？\n${shareUrl}\n\n#あれ知ら #KC3Hack`;
}

export default function ShareModal({ gameId, onClose }: Props) {
	const shareText = buildShareText(gameId);

	const handlePostToX = () => {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
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
				<IconButton className="share-modal-close" onClick={onClose} size="small">
					<CloseIcon />
				</IconButton>

				<p className="share-modal-label">ぜひポストしてな！</p>
				<div className="share-modal-preview">{shareText}</div>

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
					Xにポスト
				</Button>
			</div>
		</div>
	);
}
