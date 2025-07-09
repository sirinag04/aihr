import React, { useEffect, useRef } from 'react';
import { Mic, User, Clock } from 'lucide-react';
import { TranscriptSegment } from '../types/interview';

interface TranscriptPanelProps {
  transcript: TranscriptSegment[];
  currentText: string;
  isListening: boolean;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ 
  transcript, 
  currentText, 
  isListening 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, currentText]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-96">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">Live Transcript</h4>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isListening ? 'Recording...' : 'Not recording'}
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-xl border"
      >
        {transcript.length === 0 && !currentText && (
          <div className="text-center text-gray-500 py-8">
            <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Waiting for speech input...</p>
            <p className="text-sm mt-1">Start speaking to see live transcription</p>
          </div>
        )}

        {transcript.map((segment) => (
          <div key={segment.id} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                segment.speaker === 'candidate' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-medium ${
                  segment.speaker === 'candidate' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {segment.speaker === 'candidate' ? 'Candidate' : 'Interviewer'}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(segment.timestamp)}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(segment.confidence * 100)}% confidence
                </div>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">{segment.text}</p>
              {segment.analyzed && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    ✓ Analyzed
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Current/interim text */}
        {currentText && (
          <div className="flex gap-3 opacity-70">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-blue-700">Candidate</span>
                <span className="text-xs text-gray-500">Speaking...</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                {currentText}
                <span className="animate-pulse">|</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;