import '../Styles/Result.css';

interface Props {
    onBackToLog: () => void;
    onBackToTitle: () => void;
    onRetry: () => void;
}

export default function ResultButtons({ onBackToLog, onBackToTitle, onRetry }: Props) {
    return (
        <div className="button-container">
            <button onClick={onBackToLog}>
                ログに戻る
            </button>

            <button onClick={onBackToTitle}>
                タイトルに戻る
            </button>

            <button onClick={onRetry}>
                もう一度遊ぶ
            </button>
        </div>
    );
}