import { useState, useEffect, useRef } from "react";
import "./Solo.css";
import MessageBubble from "./Components/MessageBubble";
import InputArea from "./Components/InputArea";
import Timer from "./Components/Timer";

const HINT_ICONS = [
	"http://flat-icon-design.com/f/f_object_174/s512_f_object_174_0bg.png",
	"http://flat-icon-design.com/f/f_object_112/s512_f_object_112_0bg.png",
	"http://flat-icon-design.com/f/f_object_151/s256_f_object_151_0bg.png",
];

import ThanksConfetti from "../Result/Components/ThanksConfetti";
import ResultOverlay from "../Result/Components/ResultOverlay";

function Solo() {
	// const [messages, setMessages] = useState<
	// 	{ messageId: number; hint: string; isUser: boolean; icon?: string }[]
	// >([]);
	// const [hints, setHints] = useState<string[]>([]);
	// const [hints, setHints] = useState<string[]>(["日本の首都は？", "高いタワーがあります", "雷門が有名です"]);
	const [inputValue, setInputValue] = useState("");

	const [timeLeft, setTimeLeft] = useState(10);
	const [hasAnswered, setHasAnswered] = useState(false);
	const [showResultOverlay, setShowResultOverlay] = useState(false);
	const [animationFinished, setAnimationFinished] = useState(false);
	// const [isLoading, setIsLoading] = useState(true);

	const [hints, setHints] = useState<string[]>([
		"日本の首都は？", 
		"高いタワーがあります", 
		"雷門が有名です",
		"日本の首都は？", 
		"高いタワーがあります", 
		"雷門が有名です",
		"日本の首都は？", 
		"高いタワーがあります", 
		"雷門が有名です",
		"日本の首都は？",
		"高いタワーがあります", 
		"雷門が有名です",
		"日本の首都は？",
		"高いタワーがあります", 
		"雷門が有名です",
		"日本の首都は？",
	]);

	// 2. messagesの初期値で、hintsの中身をすべてメッセージ形式にする
	const [messages, setMessages] = useState(
		hints.map((hint, index) => ({
			messageId: index,
			hint: hint,
			isUser: false,
			icon: HINT_ICONS[index % HINT_ICONS.length],
		}))
	);

	const [isLoading, setIsLoading] = useState(false); // 最初からロード完了にする

	const messagesAreaRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);

	const [isAnswerVisible, setIsAnswerVisible] = useState(false);

	// useEffect(() => {
	// 	const fetchGameData = async () => {
	// 		try {
	// 			const res = await fetch("/api/solo", {
	// 				method: "POST",
	// 				headers: { "Content-Type": "application/json" },
	// 				body: JSON.stringify({}),
	// 			});
	// 			const data = await res.json();
	// 			if (data.result && data.result.hints) {
	// 				setHints(data.result.hints);
	// 				if (data.result.hints.length > 0) {
	// 					setMessages([
	// 						{
	// 							messageId: 1,
	// 							hint: data.result.hints[0],
	// 							isUser: false,
	// 							icon: HINT_ICONS[0],
	// 						},
	// 					]);
	// 				}
	// 			}
	// 		} catch (e) {
	// 			console.error(e);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};
	// 	fetchGameData();
	// }, []);

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

	// useEffect(() => {
	// 	if (hasAnswered || hints.length === 0) return;

	// 	const timers: number[] = [];

	// 	for (let i = 1; i < hints.length; i++) {
	// 		const delay = i * 10000;

	// 		const timer = setTimeout(() => {
	// 			setMessages((prev) => [
	// 				...prev,
	// 				{
	// 					messageId: i + 1,
	// 					hint: hints[i],
	// 					isUser: false,
	// 					icon: HINT_ICONS[i % HINT_ICONS.length],
	// 				},
	// 			]);

	// 			if (i < hints.length - 1) {
	// 				setTimeLeft(11); // Reset timer
	// 			} else {
	// 				setTimeLeft(0); // Stop timer after last message
	// 			}
	// 		}, delay);

	// 		timers.push(timer);
	// 	}

	// 	const interval = setInterval(() => {
	// 		setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
	// 	}, 1000);

	// 	return () => {
	// 		for (const t of timers) {
	// 			clearTimeout(t);
	// 		}
	// 		clearInterval(interval);
	// 	};
	// }, [hasAnswered, hints]);

	const handleSubmit = () => {
		if (!inputValue.trim()) return;
		const newMessage = {
			messageId: Date.now(),
			hint: inputValue,
			isUser: true,
			icon: "😎",
		};
		setMessages((prev) => [...prev, newMessage]);
		setInputValue("");

		//正誤判定
		// setTimeout(() => {
		// 	const isCorrect = newMessage.hint === "大阪";
		// 	const responseMessage = {
		// 		messageId: Date.now() + 1,
		// 		hint: isCorrect ? "正解じゃ！" : "不正解じゃ...",
		// 		isUser: false,
		// 		// biome-ignore format: URLが長いため改行を防止
		// 		icon: "http://flat-icon-design.com/f/f_object_170/s256_f_object_170_0bg.png",
		// 	};
		// 	setMessages((prev) => [...prev, responseMessage]);

		// 	if (isCorrect) {
		// 		setHasAnswered(true);
		// 	}
		// }, 100);
	};

	if (isLoading) {
		return <div className="loading-container">ロード中．．．</div>;
	}

	return (
		<div className="solo-container">
			{hasAnswered && !animationFinished && (
				<ThanksConfetti
					onClose={() => {
						setAnimationFinished(true);
						setShowResultOverlay(true);
					}}
				/>
			)}
			{showResultOverlay && (
				<ResultOverlay onClose={() => setShowResultOverlay(false)} />
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
			{/* <InputArea
				value={inputValue}
				onChange={setInputValue}
				onSubmit={handleSubmit}
				placeholder="回答を記入してください"
				hidden={hasAnswered}
			/> */}
<div className="fixed-answer-bar">
    <div className="answer-section" onClick={() => setIsAnswerVisible(!isAnswerVisible)}>
        <p className="answer-label">答えを確認する</p>
        <div className="answer-container">
            <span className={`answer-mask ${isAnswerVisible ? "visible" : ""}`}>
                東京
            </span>
        </div>
        <p className="answer-sub-text">{isAnswerVisible ? "タップで隠す" : "タップで表示"}</p>
    </div>
</div>
		</div>
	);
}

export default Solo;
