import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InterviewJoin: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate(`/video-room/${roomId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Interview Room</h1>
      <p className="text-lg text-gray-600">Room ID: {roomId}</p>
      <button
        onClick={handleJoinClick}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Join Interview
      </button>
    </div>
  );
};

export default InterviewJoin;
