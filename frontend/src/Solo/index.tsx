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
];

function Solo() {
  const [messages, setMessages] = useState<Message[]>([initialMessages[0]]);
  const [inputValue, setInputValue] = useState("");
  /* 
     Timer logic:
     Total cycle:
     0-10s: Show 1st message, Timer counts 10->0
     At 10s: Show 2nd message, Timer resets to 10
     10-20s: 
     Show 1st & 2nd, Timer counts 10->0
     At 20s: Show 3rd message, Timer resets to 10 (?) or stops?
     
     Assuming the user wants the timer to show "Next hint in..."
     0s: Msg1, Timer 10
     ... countdown ...
     10s: Msg2, Timer 10
     ... countdown ...
     20s: Msg3, Timer ?? (Maybe hide or stay at 0?)
  */

  const [timeLeft, setTimeLeft] = useState(10);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // 10秒後
    const timer1 = setTimeout(() => {
      setMessages((prev) => [...prev, initialMessages[1]]);
      setTimeLeft(10); // Reset timer for next hint
    }, 10000);

    // 20秒後
    const timer2 = setTimeout(() => {
      setMessages((prev) => [...prev, initialMessages[2]]);
      setTimeLeft(0); // Finished or reset again? Let's verify requirement. 
      // User said "timer also matches timing". Assuming countdown for each interval.
    }, 20000);

    // Countdown interval
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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
