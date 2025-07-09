import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const VideoRoom: React.FC = () => {
  const { roomId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ask for camera and mic permissions
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Failed to access media devices:', err);
        alert('Camera or microphone permission denied.');
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-bold mb-4">You're in the Interview Room</h2>
      <p className="text-gray-600 mb-4">Room ID: {roomId}</p>
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-lg" />
    </div>
  );
};

export default VideoRoom;
