import React, { useState } from 'react';
import { Play, User, Briefcase, MessageSquare } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (response: string, jobRole: string) => void;
  isAnalyzing: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isAnalyzing }) => {
  const [response, setResponse] = useState('');
  const [jobRole, setJobRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim() && jobRole.trim()) {
      onAnalyze(response.trim(), jobRole.trim());
    }
  };

  const sampleRoles = [
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'Sales Manager',
    'Marketing Director',
    'DevOps Engineer',
    'Business Analyst'
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Interview Analysis</h2>
          <p className="text-gray-600">Evaluate candidate responses with AI-powered insights</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Briefcase className="w-4 h-4" />
            Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g., Software Engineer, Product Manager"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {sampleRoles.map((role) => (
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

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <User className="w-4 h-4" />
            Candidate Response
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Paste or type the candidate's interview response here..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
          <div className="mt-2 text-sm text-gray-500">
            {response.length} characters • Minimum 50 characters recommended
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !response.trim() || !jobRole.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Response...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Analyze Interview Response
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;