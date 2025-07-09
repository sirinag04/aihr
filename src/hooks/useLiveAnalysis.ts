import { useState, useEffect, useCallback } from 'react';
import { LiveAnalysis, TranscriptSegment } from '../types/interview';
import { analyzeLiveResponse } from '../utils/liveAnalysisEngine';

export const useLiveAnalysis = (jobRole: string) => {
  const [analysis, setAnalysis] = useState<LiveAnalysis>({
    jobFitScore: 0,
    cultureFitScore: 0,
    overallScore: 0,
    confidence: 0,
    keyInsights: [],
    redFlags: [],
    strengths: [],
    lastUpdated: new Date()
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<LiveAnalysis[]>([]);

  const analyzeSegments = useCallback(async (segments: TranscriptSegment[]) => {
    if (segments.length === 0 || !jobRole) return;

    setIsAnalyzing(true);
    
    try {
      const unanalyzedSegments = segments.filter(segment => !segment.analyzed);
      if (unanalyzedSegments.length === 0) return;

      const combinedText = unanalyzedSegments
        .filter(segment => segment.speaker === 'candidate')
        .map(segment => segment.text)
        .join(' ');

      if (combinedText.trim()) {
        const newAnalysis = await analyzeLiveResponse(combinedText, jobRole, analysis);
        
        setAnalysis(newAnalysis);
        setAnalysisHistory(prev => [...prev, newAnalysis]);
        
        // Mark segments as analyzed
        segments.forEach(segment => {
          if (unanalyzedSegments.includes(segment)) {
            segment.analyzed = true;
          }
        });
      }
    } catch (error) {
      console.error('Live analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobRole, analysis]);

  const resetAnalysis = useCallback(() => {
    setAnalysis({
      jobFitScore: 0,
      cultureFitScore: 0,
      overallScore: 0,
      confidence: 0,
      keyInsights: [],
      redFlags: [],
      strengths: [],
      lastUpdated: new Date()
    });
    setAnalysisHistory([]);
  }, []);

  return {
    analysis,
    analysisHistory,
    isAnalyzing,
    analyzeSegments,
    resetAnalysis
  };
};