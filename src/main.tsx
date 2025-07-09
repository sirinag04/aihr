import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import InterviewJoin from './pages/interviewjoin.tsx';
import VideoRoom from './pages/videoroom.tsx'; // ✅ import this
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/interview/join/:roomId" element={<InterviewJoin />} />
        <Route path="/video-room/:roomId" element={<VideoRoom />} /> {/* ✅ new route */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
