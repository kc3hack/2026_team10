import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Board.css";
import MessageBubble from "./Components/MessageBubble";
import ResultOverlay from "../Result/Components/ResultOverlay";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

const HINT_ICONS = ["/Image/Kyoto.jpg", "/Image/Osaka.jpg"];

function Solo() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const gameId = Number(id);
	const [showResultOverlay, setShowResultOverlay] = useState(false);

	const [answer, setAnswer] = useState("");
	const [messages, setMessages] = useState<
		{ messageId: number; hint: string; isUser: boolean; icon?: string }[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		if (hasFetchedRef.current) return;
		const fetchGameData = async () => {
			try {
				const res = await fetch(`/api/solo/bookmark/random`);
				const data = await res.json();
				console.log("APIから取得した生データ:", data);

				if (data.result) {
					const fetchedHints = data.result.hints;
					const fetchedAnswer = data.result.answer;

					setAnswer(fetchedAnswer);

					const formattedMessages = fetchedHints.map(
						(hintText: string, index: number) => ({
							messageId: index,
							hint: hintText,
							isUser: false,
							icon: HINT_ICONS[index % HINT_ICONS.length],
						}),
					);

					setMessages(formattedMessages);
				}
			} catch (e) {
				console.error("データの取得に失敗しました:", e);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGameData();
	}, []);

	const messagesAreaRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);

	const [isAnswerVisible, setIsAnswerVisible] = useState(false);

	//スクロールされたときに、画面の最も下にあるかどうかを判定する
	const handleScroll = () => {
		if (messagesAreaRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = messagesAreaRef.current;
			//画面から10px下以内にあれば、画面の最も下にあると判定する
			isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 10;
		}
	};

	//画面の最も下にある場合にのみ自動スクロールする
	// biome-ignore lint: messageが変更された時点で下にスクロールするためだけなのでmessageは使っていない
	useEffect(() => {
		if (isAtBottomRef.current && messagesAreaRef.current) {
			messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
		}
	}, [messages]);

	if (isLoading) {
		return <div className="loading-container">ロード中．．．</div>;
	}

	return (
		<div className="solo-container">
			{showResultOverlay && (
				<ResultOverlay
					gameId={gameId}
					onClose={() => setShowResultOverlay(false)}
				/>
			)}
			{/* {!hasAnswered && <Timer seconds={timeLeft} />} */}
			<div className="messages-area" ref={messagesAreaRef} onScroll={handleScroll}>
				{messages.map((msg) => (
					<MessageBubble
						key={msg.messageId}
						text={msg.hint}
						isUser={msg.isUser}
						icon={msg.icon}
					/>
				))}
			</div>
			<div className="fixed-answer-bar">
				<Button
					variant="outlined"
					onClick={() => navigate("/")}
					className="square-icon-button back-to-title-btn"
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

export default Solo;
