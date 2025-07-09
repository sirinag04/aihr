export interface InterviewSession {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  interviewType: 'virtual' | 'live';
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'waiting' | 'active' | 'paused' | 'completed';
  duration: number;
  meetingLink?: string;
  interviewerName?: string;
  scheduledDate?: Date;
}

export interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  jobRole: string;
  interviewDate: Date;
  interviewType: 'virtual' | 'live';
  analysis: LiveAnalysis;
  transcript: TranscriptSegment[];
  finalDecision?: 'hire' | 'reject' | 'pending';
  notes?: string;
  interviewer: string;
  meetingLink?: string;
  scheduledDate?: Date;
  status: 'scheduled' | 'completed';
}

export interface LiveAnalysis {
  jobFitScore: number;
  cultureFitScore: number;
  overallScore: number;
  confidence: number;
  keyInsights: string[];
  redFlags: string[];
  strengths: string[];
  lastUpdated: Date;
}

export interface TranscriptSegment {
  id: string;
  timestamp: Date;
  speaker: 'interviewer' | 'candidate';
  text: string;
  confidence: number;
  analyzed: boolean;
}

export interface RealTimeMetrics {
  speakingTime: {
    interviewer: number;
    candidate: number;
  };
  sentimentTrend: Array<{
    timestamp: Date;
    sentiment: number;
    confidence: number;
  }>;
  engagementLevel: number;
  communicationClarity: number;
}

export interface ScheduledInterview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  interviewType: 'virtual' | 'live';
  scheduledDate: Date;
  interviewerName: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}