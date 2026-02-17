import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Solo from "./Solo/index.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				{/* localhost:5173 */}
				<Route path="/" element={<App />} />
				{/* localhost:5173/solo */}
				<Route path="/solo" element={<Solo />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
