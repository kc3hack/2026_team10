import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Solo from './Solo/index.tsx'

createRoot(document.getElementById('root')!).render(
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
)