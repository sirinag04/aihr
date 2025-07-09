import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Download, Trash2, Eye, 
  CheckCircle, XCircle, Clock, Mail, Calendar,
  TrendingUp, BarChart3, User, Briefcase
} from 'lucide-react';
import { getCandidateRecords, deleteCandidateRecord, exportCandidateData, updateCandidateDecision } from '../utils/candidateStorage';
import { CandidateRecord } from '../types/interview';

interface CandidateManagementProps {
  onBack: () => void;
}

const CandidateManagement: React.FC<CandidateManagementProps> = ({ onBack }) => {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState<'all' | 'hire' | 'reject' | 'pending'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, filterDecision]);

  const loadCandidates = () => {
    const records = getCandidateRecords();
    setCandidates(records);
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDecision !== 'all') {
      filtered = filtered.filter(candidate => candidate.finalDecision === filterDecision);
    }

    setFilteredCandidates(filtered);
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm('Are you sure you want to delete this candidate record?')) {
      deleteCandidateRecord(id);
      loadCandidates();
    }
  };

  const handleUpdateDecision = (id: string, decision: 'hire' | 'reject' | 'pending') => {
    updateCandidateDecision(id, decision);
    loadCandidates();
  };

  const getDecisionIcon = (decision?: string) => {
    switch (decision) {
      case 'hire':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'reject':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDecisionColor = (decision?: string) => {
    switch (decision) {
      case 'hire':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'reject':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    total: candidates.length,
    hired: candidates.filter(c => c.finalDecision === 'hire').length,
    rejected: candidates.filter(c => c.finalDecision === 'reject').length,
    pending: candidates.filter(c => c.finalDecision === 'pending').length
  };

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
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Candidate Management</h1>
                <p className="text-gray-600">Review and manage interview records</p>
              </div>
            </div>
            <button
              onClick={exportCandidateData}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Candidates</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.hired}</div>
                <div className="text-sm text-gray-600">Hired</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterDecision}
                onChange={(e) => setFilterDecision(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Decisions</option>
                <option value="hire">Hired</option>
                <option value="reject">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No candidates found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Interview Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Scores</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Decision</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{candidate.name}</div>
                            <div className="text-sm text-gray-600">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-800">{candidate.jobRole}</span>
                        </div>
                        <div className="text-sm text-gray-600 capitalize">{candidate.interviewType} interview</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-800">
                            {candidate.interviewDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {candidate.interviewDate.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Job:</span>
                            <span className={`font-medium ${getScoreColor(candidate.analysis.jobFitScore)}`}>
                              {candidate.analysis.jobFitScore}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Culture:</span>
                            <span className={`font-medium ${getScoreColor(candidate.analysis.cultureFitScore)}`}>
                              {candidate.analysis.cultureFitScore}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Overall:</span>
                            <span className={`font-medium ${getScoreColor(candidate.analysis.overallScore)}`}>
                              {candidate.analysis.overallScore}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getDecisionIcon(candidate.finalDecision)}
                          <select
                            value={candidate.finalDecision || 'pending'}
                            onChange={(e) => handleUpdateDecision(candidate.id, e.target.value as any)}
                            className={`px-3 py-1 border rounded-lg text-sm font-medium ${getDecisionColor(candidate.finalDecision)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="hire">Hire</option>
                            <option value="reject">Reject</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Candidate Details</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Candidate Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg text-gray-800">{selectedCandidate.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg text-gray-800">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <p className="text-lg text-gray-800">{selectedCandidate.jobRole}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Interview Date</label>
                    <p className="text-lg text-gray-800">
                      {selectedCandidate.interviewDate.toLocaleDateString()} at{' '}
                      {selectedCandidate.interviewDate.toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Interview Type</label>
                    <p className="text-lg text-gray-800 capitalize">{selectedCandidate.interviewType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Decision</label>
                    <div className="flex items-center gap-2">
                      {getDecisionIcon(selectedCandidate.finalDecision)}
                      <span className="text-lg text-gray-800 capitalize">
                        {selectedCandidate.finalDecision || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Job Fit Score</h3>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedCandidate.analysis.jobFitScore)}`}>
                    {selectedCandidate.analysis.jobFitScore}/100
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                  <User className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Culture Fit Score</h3>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedCandidate.analysis.cultureFitScore)}`}>
                    {selectedCandidate.analysis.cultureFitScore}/100
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Overall Score</h3>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedCandidate.analysis.overallScore)}`}>
                    {selectedCandidate.analysis.overallScore}/100
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {selectedCandidate.analysis.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {selectedCandidate.analysis.strengths.map((strength, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-sm text-green-800">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCandidate.analysis.redFlags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Areas of Concern
                    </h4>
                    <div className="space-y-2">
                      {selectedCandidate.analysis.redFlags.map((flag, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <span className="text-sm text-red-800">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedCandidate.notes && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-3">Notes</h4>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-700">{selectedCandidate.notes}</p>
                  </div>
                </div>
              )}

              {/* Transcript Preview */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Interview Transcript</h4>
                <div className="max-h-60 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  {selectedCandidate.transcript.length === 0 ? (
                    <p className="text-gray-500 text-center">No transcript available</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedCandidate.transcript.slice(0, 10).map((segment) => (
                        <div key={segment.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              segment.speaker === 'candidate' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {segment.speaker === 'candidate' ? 'C' : 'I'}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">
                              {segment.timestamp.toLocaleTimeString()}
                            </div>
                            <p className="text-sm text-gray-700">{segment.text}</p>
                          </div>
                        </div>
                      ))}
                      {selectedCandidate.transcript.length > 10 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... and {selectedCandidate.transcript.length - 10} more segments
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;