import { useState, useEffect, useRef } from "react";
import "./Board.css";
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

	// 1. 答えを保持するステートを追加
	const [answer, setAnswer] = useState(""); 
	const [hints, setHints] = useState<string[]>([]);
	const [messages, setMessages] = useState<{ messageId: number; hint: string; isUser: boolean; icon?: string }[]>([]); // 👈 ここに持ってくる
	const [isLoading, setIsLoading] = useState(false);
	const hasFetchedRef = useRef(false);

	// 2. データ取得のロジック
useEffect(() => {
	if (hasFetchedRef.current) return;
    const fetchGameData = async () => {
        try {
            // ローカルサーバーのURLを叩く
            const res = await fetch("http://localhost:8080/solo/board/2");
            const data = await res.json();
			console.log("APIから届いた生データ:", data); // 👈 これを追加
            
			if (data.round) {
				const fetchedHints = data.round.hints; // JSONのhints配列を取得
				const fetchedAnswer = data.round.answer;

				setHints(fetchedHints);
				setAnswer(fetchedAnswer);

				// 1. JSONの文字列配列を、messagesの型に合わせてオブジェクトの配列に変換する
				const formattedMessages = fetchedHints.map((hintText: string, index: number) => ({
					messageId: index,                 // 重複しないID（インデックスを利用）
					hint: hintText,                   // JSONから来たヒント本文
					isUser: false,                    // システム（出題者）側なのでfalse
					icon: HINT_ICONS[index % HINT_ICONS.length], // アイコンを順番に割り当て
				}));

				// 2. 整形したデータをステートに保存する
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

	// const [hints, setHints] = useState<string[]>([
	// 	"日本の首都は？",
	// 	"高いタワーがあります",
	// 	"雷門が有名です",
	// 	"日本の首都は？",
	// 	"高いタワーがあります",
	// 	"雷門が有名です",
	// 	"日本の首都は？",
	// 	"高いタワーがあります",
	// 	"雷門が有名です",
	// 	"日本の首都は？",
	// 	"高いタワーがあります",
	// 	"雷門が有名です",
	// 	"日本の首都は？",
	// 	"高いタワーがあります",
	// 	"雷門が有名です",
	// 	"日本の首都は？",
	// ]);

	// 2. messagesの初期値で、hintsの中身をすべてメッセージ形式にする
	// const [messages, setMessages] = useState(
	// 	hints.map((hint, index) => ({
	// 		messageId: index,
	// 		hint: hint,
	// 		isUser: false,
	// 		icon: HINT_ICONS[index % HINT_ICONS.length],
	// 	})),
	// );

	// const [messages, setMessages] = useState<{ messageId: number; hint: string; isUser: boolean; icon?: string }[]>([]);

	// const [isLoading, setIsLoading] = useState(false); // 最初からロード完了にする


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
			<div className="fixed-answer-bar">
				<div
					className="answer-section"
					onClick={() => setIsAnswerVisible(!isAnswerVisible)}
				>
					<p className="answer-label">答えを確認する</p>
			<div className="answer-container">
				<span className={`answer-mask ${isAnswerVisible ? "visible" : ""}`}>
					{answer}
				</span>
			</div>
					<p className="answer-sub-text">
						{isAnswerVisible ? "タップで隠す" : "タップで表示"}
					</p>
				</div>
			</div>
		</div>
	);
}

export default Solo;
