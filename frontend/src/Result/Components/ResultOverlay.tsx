import '../Styles/Result.css';
import ResultButtons from './ResultButtons';

type Props = {
    onClose?: () => void;
    // 将来的に、おそらくここに「正解のデータ（画像URLやテキスト）」を受け取るPropsを追加
};

export default function ResultOverlay({ onClose }: Props) {

    const handleTitle = () => alert("タイトルへ戻ります");
    const handleRetry = () => alert("ゲームをリスタートします");

    return (
        <div className="overlay" onClick={onClose}>

            <div
                onClick={(e) => e.stopPropagation()}
                className="result-content-wrapper"
            >

                <div className="result-card">

                    <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5em', color: '#333' }}>
                        大阪
                    </h2>

                    <div style={{
                        width: '100%',
                        height: '150px',
                        backgroundColor: '#eee',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '15px',
                        overflow: 'hidden'
                    }}>
                        {/*本来は<img src={画像URL} alt="正解画像" style={{width:'100%', height:'100%', objectFit:'cover'}} />*/}
                        <span style={{ color: '#888', fontSize: '0.9em' }}>
                            （ここに画像が表示されます）
                        </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '1em', color: '#555', lineHeight: '1.4' }}>
                        ここに解説文などが入ります。
                    </p>
                </div>

                <ResultButtons
                    onBackToLog={() => onClose?.()}
                    onBackToTitle={handleTitle}
                    onRetry={handleRetry}
                />
            </div>

        </div>
    );
}