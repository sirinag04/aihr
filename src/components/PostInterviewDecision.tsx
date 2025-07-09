import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Briefcase, TrendingUp, MessageSquare } from 'lucide-react';
import { LiveAnalysis } from '../types/interview';

interface PostInterviewDecisionProps {
  candidateName: string;
  jobRole: string;
  analysis: LiveAnalysis;
  onSave: (decision: 'hire' | 'reject' | 'pending', notes?: string) => void;
  onCancel: () => void;
}

const PostInterviewDecision: React.FC<PostInterviewDecisionProps> = ({
  candidateName,
  jobRole,
  analysis,
  onSave,
  onCancel
}) => {
  const [decision, setDecision] = useState<'hire' | 'reject' | 'pending'>('pending');
  const [notes, setNotes] = useState('');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendation = () => {
    const avgScore = (analysis.jobFitScore + analysis.cultureFitScore) / 2;
    if (avgScore >= 75) return 'hire';
    if (avgScore >= 55) return 'pending';
    return 'reject';
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Interview Complete</h2>
            <p className="text-gray-600">Make your final decision for {candidateName}</p>
          </div>

          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-800">Candidate</span>
                </div>
                <p className="text-lg text-gray-700">{candidateName}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-800">Position</span>
                </div>
                <p className="text-lg text-gray-700">{jobRole}</p>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Job Fit Score</h3>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.jobFitScore)}`}>
                {analysis.jobFitScore}/100
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <User className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Culture Fit Score</h3>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.cultureFitScore)}`}>
                {analysis.cultureFitScore}/100
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Overall Score</h3>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}/100
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className={`p-6 rounded-xl border-2 mb-8 ${
            recommendation === 'hire' ? 'bg-green-50 border-green-200' :
            recommendation === 'pending' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold text-gray-800 mb-3">AI Recommendation</h3>
            <div className="flex items-center gap-3">
              {recommendation === 'hire' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : recommendation === 'pending' ? (
                <Clock className="w-6 h-6 text-yellow-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <span className={`font-medium text-lg ${
                recommendation === 'hire' ? 'text-green-700' :
                recommendation === 'pending' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {recommendation === 'hire' ? 'Recommend to Hire' :
                 recommendation === 'pending' ? 'Consider for Further Review' :
                 'Not Recommended'}
              </span>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Key Strengths
                </h4>
                <div className="space-y-2">
                  {analysis.strengths.slice(0, 3).map((strength, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.redFlags.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Areas of Concern
                </h4>
                <div className="space-y-2">
                  {analysis.redFlags.slice(0, 3).map((flag, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-800">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Decision Selection */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Your Decision</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setDecision('hire')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  decision === 'hire'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                }`}
              >
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Hire</div>
                <div className="text-sm opacity-75">Extend job offer</div>
              </button>

              <button
                onClick={() => setDecision('pending')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  decision === 'pending'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-yellow-300'
                }`}
              >
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Consider</div>
                <div className="text-sm opacity-75">Need more evaluation</div>
              </button>

              <button
                onClick={() => setDecision('reject')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  decision === 'reject'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                }`}
              >
                <XCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Reject</div>
                <div className="text-sm opacity-75">Not a good fit</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MessageSquare className="w-4 h-4" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional comments about the candidate..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(decision, notes)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Save Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInterviewDecision;