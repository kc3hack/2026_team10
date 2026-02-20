import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import "./App.css";

function App() {
	const navigate = useNavigate();

	return (
		<div className="container">
			<h1 className="title">偏見で遊ぼう（仮）</h1>
			<Stack
				spacing={3}
				direction="column"
				className="button-group"
				alignItems="center"
			>
				<Button
					variant="contained"
					size="large"
					onClick={() => navigate("/solo")}
					sx={{
						width: "300px",
						minHeight: "60px",
						fontWeight: "bold",
						fontSize: "1.2rem",
						backgroundColor: "#ff9800", // Lighter Orange
						"&:hover": {
							backgroundColor: "#f57c00",
						},
					}}
				>
					スタート
				</Button>
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/board")}
					sx={{
						width: "300px",
						minHeight: "60px",
						fontWeight: "bold",
						fontSize: "1rem", // Reduced font size to fit text
						color: "#ed6c02", // Orange
						borderColor: "#ed6c02",
						"&:hover": {
							borderColor: "#e65100",
							backgroundColor: "rgba(237, 108, 2, 0.04)",
						},
					}}
				>
					共有されたストーリーを見る
				</Button>
			</Stack>
		</div>
	);
}

export default App;
