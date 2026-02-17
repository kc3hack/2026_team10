import '../Styles/Result.css';
import ResultButtons from './ResultButtons';

type Props = {
    onClose?: () => void;
};

export default function ResultOverlay({ onClose }: Props) {

    const handleLog = () => {
        onClose?.();
    };
    const handleTitle = () => alert("タイトルへ戻ります");
    const handleRetry = () => alert("ゲームをリスタートします");

    return (
        <div className="overlay" onClick={onClose}>

            <div onClick={(e) => e.stopPropagation()}>
                <ResultButtons
                    onBackToLog={handleLog}
                    onBackToTitle={handleTitle}
                    onRetry={handleRetry}
                />
            </div>
        </div>
    );
}