import { useState, useRef, useCallback, useEffect } from 'react';

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  connectionState: RTCPeerConnectionState;
  isInitialized: boolean;
  error: string | null;
}

export const useWebRTC = () => {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    isConnected: false,
    isAudioEnabled: true,
    isVideoEnabled: true,
    connectionState: 'new',
    isInitialized: false,
    error: null
  });

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const initializeConnection = useCallback(async () => {
    try {
      console.log('Initializing WebRTC connection...');
      
      // Check for media device support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      // Get user media with proper constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      console.log('Got user media stream:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      console.log('Audio tracks:', stream.getAudioTracks());

      setState(prev => ({ 
        ...prev, 
        localStream: stream,
        isInitialized: true,
        error: null
      }));

      // Set local video immediately
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => {
          console.log('Local video metadata loaded');
          localVideoRef.current?.play().catch(e => console.log('Local video play error:', e));
        };
      }

      // Initialize peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      });

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log('Adding track to peer connection:', track.kind, track.label);
        peerConnection.current?.addTrack(track, stream);
      });

      // Handle remote stream (when actual peer connects)
      peerConnection.current.ontrack = (event) => {
        console.log('Received remote track:', event);
        const [remoteStream] = event.streams;
        
        setState(prev => ({ 
          ...prev, 
          remoteStream,
          isConnected: true 
        }));
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log('Remote video metadata loaded');
            remoteVideoRef.current?.play().catch(e => console.log('Remote video play error:', e));
          };
        }
      };

      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        const connectionState = peerConnection.current?.connectionState || 'new';
        console.log('Connection state changed:', connectionState);
        setState(prev => ({ 
          ...prev, 
          connectionState,
          isConnected: connectionState === 'connected'
        }));
      };

      // Handle ICE connection state
      peerConnection.current.oniceconnectionstatechange = () => {
        const iceState = peerConnection.current?.iceConnectionState;
        console.log('ICE connection state:', iceState);
      };

      // Simulate candidate joining after 3 seconds for demo
      setTimeout(() => {
        console.log('Simulating candidate joining...');
        
        // Create a simulated remote stream (clone of local for demo)
        const simulatedRemoteStream = new MediaStream();
        
        // Add video track
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const clonedVideoTrack = videoTrack.clone();
          simulatedRemoteStream.addTrack(clonedVideoTrack);
        }
        
        // Add audio track
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          const clonedAudioTrack = audioTrack.clone();
          simulatedRemoteStream.addTrack(clonedAudioTrack);
        }

        setState(prev => ({ 
          ...prev, 
          remoteStream: simulatedRemoteStream,
          isConnected: true,
          connectionState: 'connected'
        }));
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = simulatedRemoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log('Simulated remote video metadata loaded');
            remoteVideoRef.current?.play().catch(e => console.log('Simulated remote video play error:', e));
          };
        }
        
        console.log('Candidate simulation complete');
      }, 3000);

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setState(prev => ({ 
        ...prev, 
        connectionState: 'failed',
        isInitialized: false,
        error: error instanceof Error ? error.message : 'Failed to initialize video'
      }));
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setState(prev => ({ ...prev, isAudioEnabled: audioTrack.enabled }));
        console.log('Audio toggled:', audioTrack.enabled);
      }
    }
  }, [state.localStream]);

  const toggleVideo = useCallback(() => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
        console.log('Video toggled:', videoTrack.enabled);
      }
    }
  }, [state.localStream]);

  const endCall = useCallback(() => {
    console.log('Ending call...');
    
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
    }
    
    if (state.remoteStream) {
      state.remoteStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setState({
      localStream: null,
      remoteStream: null,
      isConnected: false,
      isAudioEnabled: true,
      isVideoEnabled: true,
      connectionState: 'closed',
      isInitialized: false,
      error: null
    });
  }, [state.localStream, state.remoteStream]);

  return {
    ...state,
    localVideoRef,
    remoteVideoRef,
    initializeConnection,
    toggleAudio,
    toggleVideo,
    endCall
  };
};