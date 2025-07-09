import React, { useState } from 'react';
import { Play, User, Briefcase, Clock, Video, Mail, Copy, CheckCircle, Calendar, Users } from 'lucide-react';
import { sendEmailInvitation, generateMeetingLink, copyInvitationText } from '../utils/emailService';
import { saveScheduledInterview } from '../utils/interviewStorage';
import { ScheduledInterview } from '../types/interview';

interface InterviewSetupProps {
  onStartInterview: (candidateName: string, candidateEmail: string, jobRole: string, interviewType: 'virtual' | 'live', scheduledId?: string) => void;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [interviewType, setInterviewType] = useState<'virtual' | 'live'>('live');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [invitationCopied, setInvitationCopied] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateName.trim() && candidateEmail.trim() && jobRole.trim()) {
      onStartInterview(candidateName.trim(), candidateEmail.trim(), jobRole.trim(), interviewType);
    }
  };

  const handleScheduleInterview = async () => {
    if (!candidateName || !candidateEmail || !jobRole || !interviewDate || !interviewTime || !interviewerName) {
      alert('Please fill in all fields before scheduling interview');
      return;
    }

    const meetingLink = generateMeetingLink();
    const scheduledDate = new Date(`${interviewDate}T${interviewTime}`);

    // Create scheduled interview record
    const scheduledInterview: ScheduledInterview = {
      id: `interview-${Date.now()}`,
      candidateName,
      candidateEmail,
      jobRole,
      interviewType,
      scheduledDate,
      interviewerName,
      meetingLink: interviewType === 'virtual' ? meetingLink : undefined,
      status: 'scheduled',
      createdAt: new Date()
    };

    // Save to storage
    saveScheduledInterview(scheduledInterview);

    // Send email if virtual interview
    if (interviewType === 'virtual') {
      const invitation = {
        candidateEmail,
        candidateName,
        jobRole,
        interviewDate: scheduledDate,
        meetingLink,
        interviewerName
      };

      const success = await sendEmailInvitation(invitation);
      if (success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
      }
    }

    setInterviewScheduled(true);
    setTimeout(() => setInterviewScheduled(false), 3000);
  };

  const handleSendInvitation = async () => {
    if (!candidateName || !candidateEmail || !jobRole || !interviewDate || !interviewTime || !interviewerName) {
      alert('Please fill in all fields before sending invitation');
      return;
    }

    const meetingLink = generateMeetingLink();
    const scheduledDate = new Date(`${interviewDate}T${interviewTime}`);

    const invitation = {
      candidateEmail,
      candidateName,
      jobRole,
      interviewDate: scheduledDate,
      meetingLink,
      interviewerName
    };

    const success = await sendEmailInvitation(invitation);
    if (success) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }
  };

  const handleCopyInvitation = () => {
    if (!candidateName || !candidateEmail || !jobRole || !interviewDate || !interviewTime || !interviewerName) {
      alert('Please fill in all fields before copying invitation');
      return;
    }

    const meetingLink = generateMeetingLink();
    const scheduledDate = new Date(`${interviewDate}T${interviewTime}`);

    const invitation = {
      candidateEmail,
      candidateName,
      jobRole,
      interviewDate: scheduledDate,
      meetingLink,
      interviewerName
    };

    const invitationText = copyInvitationText(invitation);
    navigator.clipboard.writeText(invitationText);
    setInvitationCopied(true);
    setTimeout(() => setInvitationCopied(false), 3000);
  };

  const commonRoles = [
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'Sales Manager',
    'Marketing Director',
    'DevOps Engineer',
    'Business Analyst',
    'Customer Success Manager',
    'HR Manager'
  ];

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toTimeString().slice(0, 5);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Video className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Setup Interview Session
        </h2>
        <p className="text-lg text-gray-600">
          Configure interview parameters and schedule interviews with AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interview Type Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Interview Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setInterviewType('live')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                interviewType === 'live'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Live Interview</div>
              <div className="text-sm opacity-75">In-person or same location</div>
            </button>
            
            <button
              type="button"
              onClick={() => setInterviewType('virtual')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                interviewType === 'virtual'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Video className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Virtual Interview</div>
              <div className="text-sm opacity-75">Remote video call</div>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Candidate Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter candidate's full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Briefcase className="w-4 h-4" />
                Job Role
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="Enter the position being interviewed for"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {commonRoles.slice(0, 5).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobRole(role)}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-50 text-sm text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Interview Scheduling */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Schedule Interview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={getTomorrowDate()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                Interview Time
              </label>
              <input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Interviewer Name
              </label>
              <input
                type="text"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleScheduleInterview}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  interviewScheduled
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {interviewScheduled ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Scheduled!
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email Actions for Virtual Interviews */}
          {interviewType === 'virtual' && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleSendInvitation}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                  emailSent
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {emailSent ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Email Sent!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Gmail Invitation
                  </>
                )}
              </button>

              <button
                onClick={handleCopyInvitation}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                  invitationCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {invitationCopied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Invitation
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Start Interview */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
            <p className="mb-6 opacity-90">
              {interviewType === 'virtual' 
                ? 'Start the interview session when the candidate is ready to join the video call.'
                : 'Begin the live interview session with real-time AI analysis and scoring.'
              }
            </p>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                if (candidateName.trim() && candidateEmail.trim() && jobRole.trim()) {
                  onStartInterview(candidateName.trim(), candidateEmail.trim(), jobRole.trim(), interviewType);
                }
              }}
              disabled={!candidateName.trim() || !candidateEmail.trim() || !jobRole.trim()}
              className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              Start {interviewType === 'virtual' ? 'Virtual' : 'Live'} Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;