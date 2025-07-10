// src/pages/VideoRoom.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';

const VideoRoom: React.FC = () => {
  const { roomId } = useParams();
  const token = `${import.meta.env.VITE_LIVEKIT_TOKEN}`; // Replace with actual token or fetch from server

  return (
    <div className="min-h-screen">
      <LiveKitRoom
        serverUrl="https://your-livekit-server-url"
        token={token}
        room={roomId!}
        connect
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};

export default VideoRoom;
