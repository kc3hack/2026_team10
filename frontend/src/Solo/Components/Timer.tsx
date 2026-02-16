import React from 'react';
import './Timer.css';

interface TimerProps {
    seconds: number;
    label?: string;
}

const Timer: React.FC<TimerProps> = ({ seconds, label = "次のヒントまで" }) => {
    return (
        <div className="timer-container">
            <div className="timer-label">{label}</div>
            <div className="timer-circle">
                <span className="timer-value">{seconds}</span>
            </div>
        </div>
    );
};

export default Timer;
