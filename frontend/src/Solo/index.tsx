import { useState, useEffect } from 'react'
import './Solo.css'
import MessageBubble from './Components/MessageBubble'
import InputArea from './Components/InputArea'
import Timer from './Components/Timer'

const topicData = {
  "ID": 0,
  "Hints": [
    { "icon": "http://flat-icon-design.com/f/f_object_174/s512_f_object_174_0bg.png", "text": "ヒント1" },
    { "icon": "http://flat-icon-design.com/f/f_object_112/s512_f_object_112_0bg.png", "text": "ヒント2" },
    { "icon": "http://flat-icon-design.com/f/f_object_151/s256_f_object_151_0bg.png", "text": "ヒント3" }
  ]
};


function Solo() {
  const [messages, setMessages] = useState<{ messageId: number; hint: string; isUser: boolean; icon?: string; }[]>([
    { messageId: 1, hint: topicData.Hints[0].text, isUser: false, icon: topicData.Hints[0].icon }
  ]);
  const [inputValue, setInputValue] = useState("");

  const [timeLeft, setTimeLeft] = useState(10);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    const hints = topicData.Hints;

    for (let i = 1; i < hints.length; i++) {
      const delay = i * 10000;

      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, {
          messageId: i + 1,
          hint: hints[i].text,
          isUser: false,
          icon: hints[i].icon
        }]);

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
      timers.forEach((t) => clearTimeout(t));
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      messageId: Date.now(),
      hint: inputValue,
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
        showResultButton={hasAnswered}
      />
    </div>
  )
}

export default Solo
