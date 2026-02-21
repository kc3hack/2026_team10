import React, { useState, useEffect, useRef } from "react";
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
		{
			messageId: number;
			hint: string;
			isUser: boolean;
			icon?: string;
			isDivider?: boolean;
		}[]
	>([]);
	const [hints, setHints] = useState<string[]>([]);
	const [gameId, setGameId] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState("");

	const [timeLeft, setTimeLeft] = useState(10);
	const [hasAnswered, setHasAnswered] = useState(false);
	const [showResultOverlay, setShowResultOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [pendingHints, setPendingHints] = useState<any[]>([]);
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
	const handleBookmark = async () => {
		if (!isBookmarked) {
			setIsAnimating(true);
			setIsBookmarked(true);
			try {
				await fetch(`/api/solo/${gameId ?? 0}/bookmark`, { method: "POST" });
			} catch (e) {
				console.error("ブックマーク登録に失敗しました:", e);
				setIsBookmarked(false);
			}
			setTimeout(() => setIsAnimating(false), 600);
		}
	};
	const handleBookmarkAndShare = async () => {
		await handleBookmark();
		handleShare();
	};

	const handleCloseResult = () => {
		setShowResultOverlay(false);

		const shownHints = messages.filter(
			(m) => !m.isUser && m.hint !== "正解やで！" && m.hint !== "不正解どす..."
		);
		const shownCount = shownHints.length;

		if (shownCount < hints.length) {
			const remaining = hints.slice(shownCount).map((hint, index) => ({
				messageId: Date.now() + 1000 + index,
				hint: hint,
				isUser: false,
				icon: HINT_ICONS[(shownCount + index) % HINT_ICONS.length],
			}));
			setPendingHints(remaining);
		}
	};

	const handleShowStory = () => {
		setMessages((prev) => {
			const newMessages = [...prev];
			const divider = {
				messageId: Date.now() + 999,
				hint: "DIVIDER",
				isUser: false,
				isDivider: true,
			};

			if (newMessages.length >= 2) {
				newMessages.splice(newMessages.length - 2, 0, divider, ...pendingHints);
			} else {
				newMessages.push(divider, ...pendingHints);
			}
			return newMessages;
		});
		setPendingHints([]);
	};

	const handleHideStory = () => {
		setMessages((prev) => {
			const dividerIndex = prev.findIndex((m) => m.isDivider);
			if (dividerIndex === -1) return prev;

			const newMessages = [...prev];
			// Extractstory hints to put back in pendingHints
			const storyHints = newMessages.slice(dividerIndex + 1, newMessages.length - 2);
			setPendingHints(storyHints);

			// Remove divider and the hints
			newMessages.splice(dividerIndex, storyHints.length + 1);
			return newMessages;
		});
	};

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
					isBookmarked={isBookmarked}
					isAnimating={isAnimating}
					onBookmark={handleBookmark}
					onClose={handleCloseResult}
				/>
			)}
			{isShareOpen && gameId !== null && (
				<ShareModal gameId={gameId} onClose={() => setIsShareOpen(false)} />
			)}
			{!hasAnswered && <Timer seconds={timeLeft} />}
			<div className="messages-area" ref={messagesAreaRef} onScroll={handleScroll}>
				{messages.map((msg, index) => (
					<React.Fragment key={msg.messageId}>
						{msg.isDivider ? (
							<div
								className="story-start-divider"
								onClick={handleHideStory}
								onKeyDown={(e) => e.key === "Enter" && handleHideStory()}
								tabIndex={0}
								role="button"
							>
								<span>物語の続きを閉じる ▲</span>
							</div>
						) : (
							<>
								{pendingHints.length > 0 && index === messages.length - 2 && (
									<div
										className="show-story-trigger"
										onClick={handleShowStory}
										onKeyDown={(e) => e.key === "Enter" && handleShowStory()}
										tabIndex={0}
										role="button"
									>
										<span>物語の続きを見る ▼</span>
									</div>
								)}
								<MessageBubble text={msg.hint} isUser={msg.isUser} icon={msg.icon} />
							</>
						)}
					</React.Fragment>
				))}
			</div>
			<div className="solo-footer">
				{!hasAnswered || showResultOverlay ? (
					<InputArea
						value={inputValue}
						onChange={setInputValue}
						onSubmit={handleSubmit}
						placeholder="回答を記入してください"
						hidden={hasAnswered}
					/>
				) : (
					<div className="result-buttons-container">
						<ResultButtons
							gameId={gameId ?? 0}
							isBookmarked={isBookmarked}
							isAnimating={isAnimating}
							onBackToTitle={handleTitle}
							onRetry={handleRetry}
							onBookmark={handleBookmarkAndShare}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Solo;
