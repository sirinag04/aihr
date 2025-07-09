import React, { useEffect, useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Phone, PhoneOff, 
  Users, Clock, TrendingUp, AlertTriangle, 
  MessageSquare, BarChart3, Download, Pause, Play, Save
} from 'lucide-react';
import { useWebRTC } from '../hooks/useWebRTC';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useLiveAnalysis } from '../hooks/useLiveAnalysis';
import LiveScoreDisplay from './LiveScoreDisplay';
import TranscriptPanel from './TranscriptPanel';
import InsightsPanel from './InsightsPanel';
import PostInterviewDecision from './PostInterviewDecision';
import { saveCandidateRecord } from '../utils/candidateStorage';
import { updateInterviewStatus } from '../utils/interviewStorage';
import { CandidateRecord } from '../types/interview';

interface LiveInterviewDashboardProps {
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  interviewType: 'virtual' | 'live';
  onEndInterview: () => void;
  scheduledId?: string;
}

const LiveInterviewDashboard: React.FC<LiveInterviewDashboardProps> = ({
  candidateName,
  candidateEmail,
  jobRole,
  interviewType,
  onEndInterview,
  scheduledId
}) => {
  const [startTime] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activePanel, setActivePanel] = useState<'transcript' | 'insights'>('transcript');
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const webRTC = useWebRTC();
  const speechRecognition = useSpeechRecognition();
  const liveAnalysis = useLiveAnalysis(jobRole);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !interviewCompleted) {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused, interviewCompleted]);

  // Initialize WebRTC for virtual interviews only
  useEffect(() => {
    if (interviewType === 'virtual') {
      console.log('Initializing WebRTC for virtual interview...');
      webRTC.initializeConnection();
    }
  }, [interviewType]);

  // Start speech recognition when ready
  useEffect(() => {
    const shouldStartRecognition = interviewType === 'live' || 
      (interviewType === 'virtual' && webRTC.isInitialized);
    
    if (shouldStartRecognition && !speechRecognition.isListening) {
      console.log('Starting speech recognition...');
      speechRecognition.startListening();
    }
  }, [webRTC.isInitialized, interviewType]);

  // Analyze transcript segments
  useEffect(() => {
    if (speechRecognition.transcript.length > 0) {
      liveAnalysis.analyzeSegments(speechRecognition.transcript);
    }
  }, [speechRecognition.transcript]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteInterview = () => {
    setInterviewCompleted(true);
    speechRecognition.stopListening();
    if (interviewType === 'virtual') {
      webRTC.endCall();
    }
    
    // Update scheduled interview status if applicable
    if (scheduledId) {
      updateInterviewStatus(scheduledId, 'completed');
    }
    
    setShowDecisionModal(true);
  };

  const handleSaveCandidate = (decision: 'hire' | 'reject' | 'pending', notes?: string) => {
    const candidateRecord: CandidateRecord = {
      id: `candidate-${Date.now()}`,
      name: candidateName,
      email: candidateEmail,
      jobRole,
      interviewDate: startTime,
      interviewType,
      analysis: liveAnalysis.analysis,
      transcript: speechRecognition.transcript,
      finalDecision: decision,
      notes,
      interviewer: 'Current User', // In a real app, this would come from auth
      status: 'completed'
    };

    saveCandidateRecord(candidateRecord);
    setShowDecisionModal(false);
    onEndInterview();
  };

  const exportSession = () => {
    const sessionData = {
      candidateName,
      candidateEmail,
      jobRole,
      interviewType,
      startTime,
      duration,
      transcript: speechRecognition.transcript,
      finalAnalysis: liveAnalysis.analysis,
      analysisHistory: liveAnalysis.analysisHistory
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${candidateName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">{candidateName}</h1>
                  <p className="text-sm text-gray-600">{jobRole} • {interviewType === 'virtual' ? 'Virtual' : 'Live'} Interview</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatDuration(duration)}</span>
                </div>
                {interviewType === 'virtual' && (
                  <div className={`flex items-center gap-1 ${
                    webRTC.isConnected ? 'text-green-600' : 
                    webRTC.isInitialized ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      webRTC.isConnected ? 'bg-green-500' : 
                      webRTC.isInitialized ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span>
                      {webRTC.isConnected ? 'Connected' : 
                       webRTC.isInitialized ? 'Waiting for candidate...' : 'Initializing...'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={exportSession}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Export Session"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleCompleteInterview}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Complete Interview
              </button>
              <button
                onClick={() => {
                  speechRecognition.stopListening();
                  if (interviewType === 'virtual') webRTC.endCall();
                  onEndInterview();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                End Interview
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className={`${interviewType === 'virtual' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            {/* Video Panel - Only for Virtual Interviews */}
            {interviewType === 'virtual' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Video Conference</h3>
                
                {webRTC.error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">Video Error: {webRTC.error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Candidate Video */}
                  <div className="relative">
                    <video
                      ref={webRTC.remoteVideoRef}
                      autoPlay
                      playsInline
                      muted={false}
                      className="w-full h-64 bg-gray-900 rounded-xl object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {candidateName} (Candidate)
                    </div>
                    
                    {!webRTC.isConnected && webRTC.isInitialized && (
                      <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <Video className="w-8 h-8 mx-auto mb-2" />
                          <p>Waiting for candidate to join...</p>
                          <p className="text-sm opacity-75 mt-1">Share the meeting link with the candidate</p>
                        </div>
                      </div>
                    )}
                    
                    {!webRTC.isInitialized && (
                      <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p>Initializing video connection...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Controls Only */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={webRTC.toggleAudio}
                    className={`p-3 rounded-full transition-colors ${
                      webRTC.isAudioEnabled 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    title={webRTC.isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
                  >
                    {webRTC.isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    Audio: {webRTC.isAudioEnabled ? 'On' : 'Off'}
                  </div>
                </div>
              </div>
            )}

            {/* Live Scores */}
            <LiveScoreDisplay analysis={liveAnalysis.analysis} isAnalyzing={liveAnalysis.isAnalyzing} />

            {/* Transcript/Insights Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActivePanel('transcript')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activePanel === 'transcript'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Live Transcript
                </button>
                <button
                  onClick={() => setActivePanel('insights')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activePanel === 'insights'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  AI Insights
                </button>
              </div>

              <div className="p-6">
                {activePanel === 'transcript' ? (
                  <TranscriptPanel 
                    transcript={speechRecognition.transcript}
                    currentText={speechRecognition.currentText}
                    isListening={speechRecognition.isListening}
                  />
                ) : (
                  <InsightsPanel 
                    analysis={liveAnalysis.analysis}
                    analysisHistory={liveAnalysis.analysisHistory}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Only for Virtual Interviews */}
          {interviewType === 'virtual' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-gray-800 mb-4">Session Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-mono text-sm font-medium">{formatDuration(duration)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Transcript Lines</span>
                    <span className="font-mono text-sm font-medium">{speechRecognition.transcript.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Analysis Updates</span>
                    <span className="font-mono text-sm font-medium">{liveAnalysis.analysisHistory.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Video Status</span>
                    <span className={`text-sm font-medium ${webRTC.isConnected ? 'text-green-600' : 'text-yellow-600'}`}>
                      {webRTC.isConnected ? 'Connected' : 'Waiting'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => speechRecognition.isListening ? speechRecognition.stopListening() : speechRecognition.startListening()}
                    className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      speechRecognition.isListening
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    {speechRecognition.isListening ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  
                  <button
                    onClick={speechRecognition.clearTranscript}
                    className="w-full p-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    Clear Transcript
                  </button>
                  
                  <button
                    onClick={liveAnalysis.resetAnalysis}
                    className="w-full p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg transition-colors hover:bg-blue-100"
                  >
                    Reset Analysis
                  </button>
                </div>
              </div>

              {/* Status Indicators */}
              {speechRecognition.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Speech Recognition Error</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{speechRecognition.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Interview Decision Modal */}
      {showDecisionModal && (
        <PostInterviewDecision
          candidateName={candidateName}
          jobRole={jobRole}
          analysis={liveAnalysis.analysis}
          onSave={handleSaveCandidate}
          onCancel={() => setShowDecisionModal(false)}
        />
      )}
    </div>
  );
};

export default LiveInterviewDashboard;