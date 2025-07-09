import React, { useState } from 'react';
import { Brain, Sparkles, Video, Users, Database, Calendar } from 'lucide-react';
import InterviewSetup from './components/InterviewSetup';
import LiveInterviewDashboard from './components/LiveInterviewDashboard';
import CandidateManagement from './components/CandidateManagement';
import ScheduledInterviews from './components/ScheduledInterviews';

interface InterviewSession {
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  interviewType: 'virtual' | 'live';
  isActive: boolean;
  scheduledId?: string;
}

type AppView = 'home' | 'interview' | 'candidates' | 'scheduled';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);

  const handleStartInterview = (candidateName: string, candidateEmail: string, jobRole: string, interviewType: 'virtual' | 'live', scheduledId?: string) => {
    setCurrentSession({
      candidateName,
      candidateEmail,
      jobRole,
      interviewType,
      isActive: true,
      scheduledId
    });
    setCurrentView('interview');
  };

  const handleEndInterview = () => {
    setCurrentSession(null);
    setCurrentView('home');
  };

  const handleViewCandidates = () => {
    setCurrentView('candidates');
  };

  const handleViewScheduled = () => {
    setCurrentView('scheduled');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'candidates') {
    return <CandidateManagement onBack={handleBackToHome} />;
  }

  if (currentView === 'scheduled') {
    return <ScheduledInterviews onStartInterview={handleStartInterview} onBack={handleBackToHome} />;
  }

  if (currentView === 'interview' && currentSession) {
    return (
      <LiveInterviewDashboard
        candidateName={currentSession.candidateName}
        candidateEmail={currentSession.candidateEmail}
        jobRole={currentSession.jobRole}
        interviewType={currentSession.interviewType}
        onEndInterview={handleEndInterview}
        scheduledId={currentSession.scheduledId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Interview Platform</h1>
                <p className="text-gray-600">Real-time AI-powered interview analysis with Gmail integration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleViewScheduled}
                className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Scheduled Interviews
              </button>
              <button
                onClick={handleViewCandidates}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                Manage Candidates
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Advanced AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Next-Generation Interview Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conduct live and virtual interviews with real-time AI analysis, Gmail integration, 
              continuous scoring, and comprehensive candidate management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Virtual & Live Interviews</h3>
              <p className="text-gray-600">
                Support for both virtual video calls and in-person live interviews with real-time analysis
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Continuous evaluation of responses with job fit and culture fit scoring
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gmail Integration</h3>
              <p className="text-gray-600">
                Send professional interview invitations directly through Gmail with meeting links
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Interview Scheduling</h3>
              <p className="text-gray-600">
                Schedule interviews, send invitations, and manage all interview sessions
              </p>
            </div>
          </div>

          <InterviewSetup onStartInterview={handleStartInterview} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 AI Interview Platform. Advanced AI-powered hiring technology with Gmail integration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;