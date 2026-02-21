import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import "./App.css";

function App() {
	const navigate = useNavigate();

	return (
		<div className="app-background">

			{/* ▼ オーロラ背景用の色の塊（これをCSSで強烈にぼかします） ▼ */}
			<div className="aurora-blob aurora-1"></div>
			<div className="aurora-blob aurora-2"></div>
			<div className="aurora-blob aurora-3"></div>
			{/* ▲ ここまで背景装飾 ▲ */}

			<Paper elevation={0} className="title-card">
				<div className="title-logo-area">
					<img
						src="/Image/aresira_logo.png"
						alt="あれちゃう？知らんけど"
						className="title-logo-img"
					/>
				</div>

				<div className="title-button-group">
					<Button
						variant="contained"
						onClick={() => navigate("/solo")}
						className="title-base-button btn-start"
					>
						スタート
					</Button>
					<Button
						variant="outlined"
						onClick={() => navigate("/board")}
						className="title-base-button btn-story"
					>
						共有されたストーリー見る
					</Button>
				</div>
			</Paper>
		</div>
	);
}

export default App;