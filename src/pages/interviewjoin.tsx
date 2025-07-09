import React from 'react';
import { useParams } from 'react-router-dom';

const InterviewJoin: React.FC = () => {
  const { roomId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Interview Room</h1>
      <p className="text-lg text-gray-600">Room ID: {roomId}</p>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded shadow">
        Join Interview
      </button>
    </div>
  );
};

export default InterviewJoin;
