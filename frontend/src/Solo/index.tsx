import { useState, useEffect, useRef } from "react";
import "./Solo.css";
import MessageBubble from "./Components/MessageBubble";
import InputArea from "./Components/InputArea";
import Timer from "./Components/Timer";
import ResultOverlay from "../Result/Components/ResultOverlay";
import ResultButtons from "../Result/Components/ResultButtons";
import ShareModal from "../Result/Components/ShareModal";
import { useNavigate } from "react-router-dom";

const HINT_ICONS = ["/Image/Kyoto.jpg", "/Image/Osaka.jpg"];

function Solo() {
	const [messages, setMessages] = useState<
		{ messageId: number; hint: string; isUser: boolean; icon?: string }[]
	>([]);
	const [hints, setHints] = useState<string[]>([]);
	const [gameId, setGameId] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState("");

	const [timeLeft, setTimeLeft] = useState(10);
	const [hasAnswered, setHasAnswered] = useState(false);
	const [showResultOverlay, setShowResultOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
	const loadingMessages = [
		"エスカレーターは右側に立つ",
		"「行けたら行く」は行かない",
		"アメを「アメちゃん」と言う",
		"一家に一台たこ焼き器がある",
		"語尾に「知らんけど」を添える",
		"マクドナルドを「マクド」と言う",
		"「自分」と言って相手を指す",
		"会話のノリがテレビ並み",
		"ナイトスクープは欠かさず見る"
	];

	const navigate = useNavigate();

	const messagesAreaRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);
	const hasFetchedData = useRef(false);

	useEffect(() => {
		if (hasFetchedData.current) return;
		hasFetchedData.current = true;

		const fetchGameData = async () => {
			try {
				const res = await fetch("/api/solo", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({}),
				});
				const data = await res.json();
				if (data.result && data.result.hints) {
					setHints(data.result.hints);
					setGameId(data.result.id);
					if (data.result.hints.length > 0) {
						setMessages([
							{
								messageId: 1,
								hint: data.result.hints[0],
								isUser: false,
								icon: HINT_ICONS[0],
							},
						]);
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		};
		fetchGameData();
	}, []);

	useEffect(() => {
		if (!isLoading) return;
		const interval = setInterval(() => {
			setLoadingMsgIndex(Math.floor(Math.random() * loadingMessages.length));
		}, 3000);
		return () => clearInterval(interval);
	}, [isLoading, loadingMessages.length]);

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

	useEffect(() => {
		if (hasAnswered || hints.length === 0) return;

		const timers: number[] = [];

		for (let i = 1; i < hints.length; i++) {
			const delay = i * 10000;

			const timer = setTimeout(() => {
				setMessages((prev) => [
					...prev,
					{
						messageId: i + 1,
						hint: hints[i],
						isUser: false,
						icon: HINT_ICONS[i % HINT_ICONS.length],
					},
				]);

				if (i < hints.length - 1) {
					setTimeLeft(11); // Reset timer
				} else {
					setTimeLeft(0); // Stop timer after last message
				}
			}, delay);

			timers.push(timer);
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => {
			for (const t of timers) {
				clearTimeout(t);
			}
			clearInterval(interval);
		};
	}, [hasAnswered, hints]);

	const handleSubmit = async () => {
		if (!inputValue.trim()) return;
		const newMessage = {
			messageId: Date.now(),
			hint: inputValue,
			isUser: true,
			icon: "😎",
		};
		setMessages((prev) => [...prev, newMessage]);
		setInputValue("");

		if (gameId === null) return;

		try {
			const res = await fetch(`/api/solo/${gameId}/answer`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ answer: newMessage.hint }),
			});
			const data = await res.json();
			const isCorrect = data.isCorrect;

			const responseMessage = {
				messageId: Date.now() + 1,
				hint: isCorrect ? "正解やで！" : "不正解どす...",
				isUser: false,
				// biome-ignore format: URLが長いため改行を防止
				icon: isCorrect ? "/Image/Osaka.jpg" : "/Image/Kyoto.jpg",
			};
			setMessages((prev) => [...prev, responseMessage]);

			if (isCorrect) {
				setHasAnswered(true);
				setShowResultOverlay(true);
			}
		} catch (error) {
			console.error("Error submitting answer:", error);
		}
	};

	const handleTitle = () => navigate("/");
	const handleRetry = () => window.location.reload();
	const handleShare = () => setIsShareOpen(true);

	if (isLoading) {
		return (
			<div className="loading-container">
				<div className="loading-icon-container">
					<img
						src="/Image/Osaka.jpg"
						alt="Osaka Icon"
						className="loading-icon-img"
					/>
				</div>
				<div className="loading-text-container">
					<div className="loading-text">
						関西あるある
						<br />
						{loadingMessages[loadingMsgIndex]}
					</div>
				</div>
				<div className="spinner" />
			</div>
		);
	}

	return (
		<div className="solo-container">
			{showResultOverlay && gameId !== null && (
				<ResultOverlay
					gameId={gameId}
					onClose={() => setShowResultOverlay(false)}
				/>
			)}
			{isShareOpen && gameId !== null && (
				<ShareModal gameId={gameId} onClose={() => setIsShareOpen(false)} />
			)}
			{!hasAnswered && <Timer seconds={timeLeft} />}
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
			<InputArea
				value={inputValue}
				onChange={setInputValue}
				onSubmit={handleSubmit}
				placeholder="回答を記入してください"
				hidden={hasAnswered}
			/>
			{hasAnswered && !showResultOverlay && (
				<div className="result-buttons-container">
					<ResultButtons
						onBackToTitle={handleTitle}
						onSNS={handleShare}
						onRetry={handleRetry}
					/>
				</div>
			)}
		</div>
	);
}

export default Solo;
