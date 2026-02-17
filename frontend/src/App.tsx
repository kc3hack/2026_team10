import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
	const [isStarted, setIsStarted] = useState(false);
	const navigate = useNavigate();

	return (
		<div>
			<h1>偏見で遊ぼう（仮）</h1>
			<h2>モード選択</h2>

			{!isStarted ? (
				<button type="button" onClick={() => setIsStarted(true)}>
					スタート
				</button>
			) : (
				<div>
					<button
						type="button"
						onClick={() => {
							navigate("/solo");
						}}
					>
						ソロモード
					</button>

					<button type="button" onClick={() => alert("複数人モードへ移動！")}>
						複数人モード
					</button>

					<button type="button" onClick={() => setIsStarted(false)}>
						戻る
					</button>
				</div>
			)}
		</div>
	);
}

export default App;
