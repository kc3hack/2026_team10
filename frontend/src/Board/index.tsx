import { useState, useEffect, useRef } from "react";
import "./Board.css";
import MessageBubble from "./Components/MessageBubble";

const HINT_ICONS = [
	"http://flat-icon-design.com/f/f_object_174/s512_f_object_174_0bg.png",
	"http://flat-icon-design.com/f/f_object_112/s512_f_object_112_0bg.png",
	"http://flat-icon-design.com/f/f_object_151/s256_f_object_151_0bg.png",
];

// import ThanksConfetti from "../Result/Components/ThanksConfetti";
import ResultOverlay from "../Result/Components/ResultOverlay";

function Solo() {
	const [showResultOverlay, setShowResultOverlay] = useState(false);

	const [answer, setAnswer] = useState(""); 
	const [hints, setHints] = useState<string[]>([]);
	const [messages, setMessages] = useState<{ messageId: number; hint: string; isUser: boolean; icon?: string }[]>([]); 
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
				console.log("APIから取得した生データ:", data);
				
				if (data.round) {
					const fetchedHints = data.round.hints; 
					const fetchedAnswer = data.round.answer;

					setHints(fetchedHints);
					setAnswer(fetchedAnswer);

					const formattedMessages = fetchedHints.map((hintText: string, index: number) => ({
						messageId: index,                 
						hint: hintText,                   // JSONから来たヒント本文
						isUser: false,                  
						icon: HINT_ICONS[index % HINT_ICONS.length],
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
