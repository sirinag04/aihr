import { useState, useRef, useCallback, useEffect } from 'react';
import { TranscriptSegment } from '../types/interview';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognition = useRef<SpeechRecognition | null>(null);
  const segmentCounter = useRef(0);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      recognition.current.maxAlternatives = 1;

      recognition.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentText(interimTranscript);

        if (finalTranscript) {
          const newSegment: TranscriptSegment = {
            id: `segment-${segmentCounter.current++}`,
            timestamp: new Date(),
            speaker: 'candidate', // In a real app, this would be determined by voice recognition
            text: finalTranscript.trim(),
            confidence: event.results[event.results.length - 1][0].confidence || 0.9,
            analyzed: false
          };

          setTranscript(prev => [...prev, newSegment]);
          setCurrentText('');
        }
      };

      recognition.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition.current && !isListening) {
      try {
        recognition.current.start();
      } catch (error) {
        setError('Failed to start speech recognition');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognition.current && isListening) {
      recognition.current.stop();
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    setCurrentText('');
    segmentCounter.current = 0;
  }, []);

  return {
    isListening,
    transcript,
    currentText,
    error,
    startListening,
    stopListening,
    clearTranscript,
    isSupported: !!recognition.current
  };
};