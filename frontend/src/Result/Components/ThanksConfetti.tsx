import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const ThanksConfetti = () => {
	const { width, height } = useWindowSize();

	const [isRecycling, setIsRecycling] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsRecycling(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Confetti
			width={width}
			height={height}
			recycle={isRecycling}
			numberOfPieces={500}
			gravity={0.2}
			style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
		/>
	);
};

export default ThanksConfetti;
