import React from 'react';
import './InputArea.css';

interface InputAreaProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    showResultButton?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onSubmit, placeholder, showResultButton }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="input-area-container">
            <input
                type="text"
                className="input-field"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
            <div className="button-group">
                <button className="send-button" onClick={onSubmit}>送信</button>
                <button
                    className="result-button"
                    style={{ visibility: showResultButton ? 'visible' : 'hidden' }}
                >
                    結果発表へ進む
                </button>
            </div>
        </div>
    );
};

export default InputArea;
