import { useState, useEffect } from 'react'
import './Solo.css'
import MessageBubble from './Components/MessageBubble'
import InputArea from './Components/InputArea'
import Timer from './Components/Timer'

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  icon?: string;
}


const initialMessages: Message[] = [
  { id: 1, text: "みんなノリ良さそうだよね！", isUser: false, icon: "😀" },
  { id: 2, text: "賑やかなイメージ！", isUser: false, icon: "🤯" },
  { id: 3, text: "みんな粉物食べてそう", isUser: false, icon: "😇" },
  { id: 4, text: "あ", isUser: false, icon: "" },
  { id: 5, text: "い", isUser: false, icon: "" },
  { id: 6, text: "う", isUser: false, icon: "" },
  { id: 7, text: "え", isUser: false, icon: "" },
  { id: 8, text: "お", isUser: false, icon: "" },
  { id: 9, text: "か", isUser: false, icon: "" },
  { id: 10, text: "き", isUser: false, icon: "" },
  { id: 11, text: "く", isUser: false, icon: "" },
  { id: 12, text: "け", isUser: false, icon: "" },
];

function Solo() {
  const [messages, setMessages] = useState<Message[]>([initialMessages[0]]);
  const [inputValue, setInputValue] = useState("");

  const [timeLeft, setTimeLeft] = useState(10);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const timers: number[] = [];

    for (let i = 1; i < initialMessages.length; i++) {
      const delay = i * 10000;

      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, initialMessages[i]]);

        if (i < initialMessages.length - 1) {
          setTimeLeft(11);
        } else {
          setTimeLeft(0);
        }
      }, delay);

      timers.push(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      icon: "😎"
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setHasAnswered(true);
  };

  return (
    <div className="solo-container">
      <Timer seconds={timeLeft} />
      <div className="messages-area">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
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
        showResultButton={hasAnswered}
      />
    </div>
  )
}

export default Solo
