import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
	const navigate = useNavigate();

	return (
		<div className="container">
			<h1 className="title">偏見で遊ぼう（仮）</h1>
			<div className="button-group">
				<button
					type="button"
					className="menu-button"
					onClick={() => navigate("/solo")}
				>
					スタート
				</button>
				<button type="button" className="menu-button">
					共有されたストーリーを見る
				</button>
			</div>
		</div>
	);
}

export default App;
