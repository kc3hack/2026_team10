import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import "../Styles/Result.css";

const ThanksConfetti = () => {
	const { width, height } = useWindowSize();

	return (
		<div className="confetti-overlay" style={{ pointerEvents: 'none' }}>
			<Confetti
				width={width}
				height={height}
				recycle={true}
				numberOfPieces={500}
				gravity={0.2}
				style={{ position: "fixed", top: 0, left: 0 }}
			/>
			<div className="confetti-content">
				<h1 className="seikai-text">正解！</h1>
			</div>
		</div>
	);
};

export default ThanksConfetti;
