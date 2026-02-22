import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Board.css";
import MessageBubble from "./Components/MessageBubble";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

// ==========================================
// 定数
// ==========================================

/** ヒントに交互に表示するアイコン（京都と大阪） */
const HINT_ICONS = ["/Image/Kyoto.jpg", "/Image/Osaka.jpg"];

// ==========================================
// 型定義
// ==========================================

/** APIレスポンスの形 */
type RoundResponse = {
	round: {
		id: number;
		answer: string;
		hints: string[];
		updated_at: string;
	};
};

/** チャット表示用のメッセージ */
type Message = {
	messageId: number;
	hint: string;
	isUser: boolean;
	icon?: string;
};

// ==========================================
// メインコンポーネント
// ==========================================

function Board() {
	const navigate = useNavigate();

	// URLからラウンドIDを取得（例: /board/12 → id = "12"）
	const { id } = useParams<{ id: string }>();

	// 正解の文字列
	const [answer, setAnswer] = useState("");
	// チャット形式のメッセージ一覧
	const [messages, setMessages] = useState<Message[]>([]);
	// ローディング状態
	const [isLoading, setIsLoading] = useState(true);
	// エラー状態
	const [fetchError, setFetchError] = useState(false);
	// 答えの表示/非表示
	const [isAnswerVisible, setIsAnswerVisible] = useState(false);

	// スクロール制御用の参照
	const messagesAreaRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(false);
	// 二重フェッチ防止用
	const hasFetchedRef = useRef(false);

	// ページ表示時にAPIからラウンドデータを取得する
	useEffect(() => {
		// StrictModeでの二重実行を防ぐ
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchRoundData = async () => {
			try {
				const response = await fetch(`/api/solo/board/${id}`);
				if (!response.ok) {
					throw new Error(`サーバーエラー: ${response.status}`);
				}
				const data: RoundResponse = await response.json();

				// 正解をセット
				setAnswer(data.round.answer);

				// ヒントをチャット表示用のメッセージに変換
				const formattedMessages: Message[] = data.round.hints.map(
					(hintText, index) => ({
						messageId: index,
						hint: hintText,
						isUser: false,
						icon: HINT_ICONS[index % HINT_ICONS.length],
					}),
				);
				setMessages(formattedMessages);
			} catch (error) {
				console.error("ラウンドデータの取得に失敗しました:", error);
				setFetchError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRoundData();
	}, [id]);

	// スクロール位置の判定（最下部にいるかどうか）
	const handleScroll = () => {
		if (messagesAreaRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = messagesAreaRef.current;
			// 画面の下端から10px以内なら「最下部にいる」と判定
			isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 10;
		}
	};

	// メッセージが増えたとき、最下部にいる場合のみ自動スクロール
	// biome-ignore lint: messagesの変更でスクロールするためだけに使用
	useEffect(() => {
		if (isAtBottomRef.current && messagesAreaRef.current) {
			messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
		}
	}, [messages]);

	// ローディング中の表示
	if (isLoading) {
		return <div className="loading-container">読み込み中...</div>;
	}

	if (fetchError) {
		return (
			<div className="loading-container">
				<div className="error-icon-container">
					<img src="/Image/Kyoto.jpg" alt="Error" />
				</div>
				<p className="error-message">データの読み込みに失敗しました</p>
				<div className="error-actions">
					<Button
						variant="contained"
						onClick={() => window.location.reload()}
						style={{
							width: "200px",
							padding: "10px 20px",
							borderRadius: "8px",
							backgroundColor: "#ed6c02",
							color: "#ffffff",
							fontWeight: "bold",
							textTransform: "none",
						}}
					>
						もう一度試す
					</Button>
					<Button
						variant="outlined"
						onClick={() => navigate("/board")}
						style={{
							width: "200px",
							padding: "10px 20px",
							borderRadius: "8px",
							borderColor: "#ed6c02",
							color: "#ed6c02",
							backgroundColor: "#ffffff",
							fontWeight: "bold",
							textTransform: "none",
						}}
					>
						一覧に戻る
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="board-page-container">
			{/* チャット形式のメッセージ表示エリア */}
			<div
				className="messages-area board-message-wrapper"
				ref={messagesAreaRef}
				onScroll={handleScroll}
			>
				{messages.map((msg) => (
					<MessageBubble
						key={msg.messageId}
						text={msg.hint}
						isUser={msg.isUser}
						icon={msg.icon}
					/>
				))}
			</div>

			{/* 画面下部の固定バー */}
			<div className="fixed-answer-bar">
				{/* 一覧に戻るボタン */}
				<Button
					variant="outlined"
					onClick={() => navigate("/board")}
					className="square-icon-button back-to-title-btn"
				>
					<ArrowBackIcon fontSize="medium" />
					<span>
						一覧に
						<br />
						戻る
					</span>
				</Button>

				{/* 答えの表示/非表示トグルボタン */}
				<Button
					variant="outlined"
					onClick={() => setIsAnswerVisible(!isAnswerVisible)}
					className={`square-icon-button answer-toggle-btn ${isAnswerVisible ? "visible" : ""}`}
				>
					{isAnswerVisible ? (
						<VisibilityIcon fontSize="medium" />
					) : (
						<HelpOutlineIcon fontSize="medium" />
					)}
					<span>
						{isAnswerVisible ? (
							<>
								答え:
								<br />
								{answer}
							</>
						) : (
							<>
								タップで
								<br />
								答えを確認
							</>
						)}
					</span>
				</Button>
			</div>
		</div>
	);
}

export default Board;
