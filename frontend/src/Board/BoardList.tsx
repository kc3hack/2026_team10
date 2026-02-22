import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageBubble from "./Components/MessageBubble";
import "./BoardList.css";

// ==========================================
// 型定義：APIから受け取るデータの形
// ==========================================

/** 1つのラウンド（お題）のデータ */
type Round = {
	id: number;
	answer: string;
	hints: string[];
	updated_at: string;
};

/** APIレスポンス全体の形 */
type ApiResponse = {
	results: Round[];
};

// ==========================================
// 定数
// ==========================================

/** 一覧で表示するヒントの数 */
const PREVIEW_HINT_COUNT = 4;

/** ヒントに交互に表示するアイコン（京都と大阪） */
const HINT_ICONS = ["/Image/Kyoto.jpg", "/Image/Osaka.jpg"];

// ==========================================
// メインコンポーネント
// ==========================================

function BoardList() {
	const navigate = useNavigate();

	// ラウンド一覧のデータ
	const [rounds, setRounds] = useState<Round[]>([]);
	// ローディング状態
	const [isLoading, setIsLoading] = useState(true);
	// エラー状態
	const [fetchError, setFetchError] = useState(false);

	// ページ表示時にAPIからデータを取得する
	useEffect(() => {
		const fetchRounds = async () => {
			try {
				const response = await fetch("/api/solo/bookmark/all");
				if (!response.ok) {
					throw new Error(`サーバーエラー: ${response.status}`);
				}
				const data: ApiResponse = await response.json();

				// results配列をそのままセット
				setRounds(data.results);
			} catch (error) {
				console.error("ラウンド一覧の取得に失敗しました:", error);
				setFetchError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRounds();
	}, []);

	// 日付を「2026/02/19 19:38」の形式に変換する関数
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// ローディング中の表示
	if (isLoading) {
		return <div className="board-list-loading">読み込み中...</div>;
	}

	// エラー時の表示
	if (fetchError) {
		return (
			<div className="board-list-empty">
				<p>データの読み込みに失敗しました</p>
				<Button
					variant="contained"
					onClick={() => window.location.reload()}
					className="board-list-back-button"
				>
					もう一度試す
				</Button>
				<Button
					variant="outlined"
					onClick={() => navigate("/")}
					className="board-list-back-button"
					style={{ marginTop: "8px" }}
				>
					タイトルに戻る
				</Button>
			</div>
		);
	}

	// データが空の場合の表示
	if (rounds.length === 0) {
		return (
			<div className="board-list-empty">
				<p>まだラウンドがありません</p>
				<Button
					variant="contained"
					onClick={() => navigate("/")}
					className="board-list-back-button"
				>
					タイトルに戻る
				</Button>
			</div>
		);
	}

	return (
		<div className="board-list-page">
			{/* ページヘッダー */}
			<header className="board-list-header">
				<Button
					variant="text"
					onClick={() => navigate("/")}
					startIcon={<ArrowBackIcon />}
					className="board-list-back-link"
				>
					戻る
				</Button>
				<h1 className="board-list-title">みんなのストーリー</h1>
			</header>

			{/* ラウンドカードの一覧 */}
			<div className="board-list-cards">
				{rounds.map((round) => (
					<button
						type="button"
						key={round.id}
						className="board-card"
						onClick={() => navigate(`/board/${round.id}`)}
					>
						{/* ヒントのプレビュー（チャット形式で最初の数個を表示） */}
						<div className="board-card-hints">
							{round.hints.slice(0, PREVIEW_HINT_COUNT).map((hint, index) => (
								<MessageBubble
									key={`hint-${round.id}-${index}`}
									text={hint}
									isUser={false}
									icon={HINT_ICONS[index % HINT_ICONS.length]}
								/>
							))}
						</div>

						{/* フッター：日付と「続きを読む」 */}
						<div className="board-card-footer">
							<span className="board-card-date">{formatDate(round.updated_at)}</span>
							<span className="board-card-read-more">続きを読む →</span>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

export default BoardList;
