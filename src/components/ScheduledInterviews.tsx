import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Briefcase, Video, Users, 
  Play, Trash2, Mail, Copy, CheckCircle, AlertCircle
} from 'lucide-react';
import { 
  getScheduledInterviews, 
  getUpcomingInterviews, 
  getTodaysInterviews,
  deleteScheduledInterview,
  updateInterviewStatus 
} from '../utils/interviewStorage';
import { ScheduledInterview } from '../types/interview';

interface ScheduledInterviewsProps {
  onStartInterview: (candidateName: string, candidateEmail: string, jobRole: string, interviewType: 'virtual' | 'live', scheduledId: string) => void;
  onBack: () => void;
}

const ScheduledInterviews: React.FC<ScheduledInterviewsProps> = ({ onStartInterview, onBack }) => {
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = () => {
    const interviews = getScheduledInterviews();
    setScheduledInterviews(interviews);
  };

  const getFilteredInterviews = () => {
    switch (filter) {
      case 'today':
        return getTodaysInterviews();
      case 'upcoming':
        return getUpcomingInterviews();
      default:
        return scheduledInterviews.filter(i => i.status === 'scheduled');
    }
  };

  const handleDeleteInterview = (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled interview?')) {
      deleteScheduledInterview(id);
      loadInterviews();
    }
  };

  const handleStartInterview = (interview: ScheduledInterview) => {
    onStartInterview(
      interview.candidateName,
      interview.candidateEmail,
      interview.jobRole,
      interview.interviewType,
      interview.id
    );
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (interview: ScheduledInterview) => {
    const now = new Date();
    const interviewTime = interview.scheduledDate;
    const timeDiff = interviewTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (hoursDiff < 1) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (hoursDiff < 24) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = (interview: ScheduledInterview) => {
    const now = new Date();
    const interviewTime = interview.scheduledDate;
    const timeDiff = interviewTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) return 'Overdue';
    if (hoursDiff < 1) return 'Starting Soon';
    if (hoursDiff < 24) return 'Today';
    return 'Scheduled';
  };

  const filteredInterviews = getFilteredInterviews();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ←
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Scheduled Interviews</h1>
                <p className="text-gray-600">Manage and start scheduled interview sessions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Scheduled
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'today' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'upcoming' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Interviews List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No scheduled interviews</h3>
              <p className="text-gray-600">Schedule interviews from the main setup page</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInterviews.map((interview) => {
                const { date, time } = formatDateTime(interview.scheduledDate);
                return (
                  <div key={interview.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          {interview.interviewType === 'virtual' ? (
                            <Video className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Users className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{interview.candidateName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(interview)}`}>
                              {getStatusText(interview)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{interview.candidateEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              <span>{interview.jobRole}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{date} at {time}</span>
                            </div>
                          </div>
                          
                          {interview.meetingLink && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-gray-500">Meeting Link:</span>
                              <button
                                onClick={() => copyMeetingLink(interview.meetingLink!)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                Copy Link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartInterview(interview)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Start Interview
                        </button>
                        
                        <button
                          onClick={() => handleDeleteInterview(interview.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          title="Delete Interview"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledInterviews;