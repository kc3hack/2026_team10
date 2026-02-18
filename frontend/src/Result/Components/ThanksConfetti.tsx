import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import "../Styles/Result.css";

interface Props {
	onClose?: () => void; // アニメーション終了時に実行する関数
}

const ThanksConfetti = ({ onClose }: Props) => {
	const { width, height } = useWindowSize();
	const [isVisible, setIsVisible] = useState<boolean>(true);

	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				setIsVisible(false);
				if (onClose) onClose();
			}, 4000);

			return () => clearTimeout(timer);
		}
	}, [isVisible, onClose]);

	const handleDismiss = () => {
		setIsVisible(false);
		if (onClose) onClose();
	};

	if (!isVisible) return null;

	return (
		<div className="confetti-overlay" onClick={handleDismiss}>
			<Confetti
				width={width}
				height={height}
				recycle={true}
				numberOfPieces={500}
				gravity={0.2}
				style={{ position: "fixed", pointerEvents: "none" }}
			/>

			<div className="confetti-content">
				<h1 className="seikai-text">正解！</h1>
			</div>
		</div>
	);
};

export default ThanksConfetti;
