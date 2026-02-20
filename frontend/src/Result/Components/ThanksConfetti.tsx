import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const ThanksConfetti = () => {
	const { width, height } = useWindowSize();

	return (
		<Confetti
			width={width}
			height={height}
			recycle={true}
			numberOfPieces={500}
			gravity={0.2}
			style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
		/>
	);
};

export default ThanksConfetti;
