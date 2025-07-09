import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Download, TrendingUp, TrendingDown, Star, AlertTriangle } from 'lucide-react';

interface AnalysisResult {
  job_fit_score: number;
  culture_fit_score: number;
  verdict: 'Hire' | 'Consider' | 'Pass';
  summary: string;
  strengths: string[];
  concerns: string[];
}

interface ResultsDisplayProps {
  result: AnalysisResult;
  jobRole: string;
  response: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, jobRole, response }) => {
  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Hire':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Consider':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'Pass':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Hire':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Consider':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Pass':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const exportResults = () => {
    const exportData = {
      jobRole,
      candidateResponse: response,
      analysisDate: new Date().toISOString(),
      results: result
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-analysis-${jobRole.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            <p className="text-gray-600">Position: {jobRole}</p>
          </div>
          <button
            onClick={exportResults}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Verdict */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${getVerdictColor(result.verdict)}`}>
          {getVerdictIcon(result.verdict)}
          <div>
            <div className="font-semibold text-lg">Recommendation: {result.verdict}</div>
            <div className="text-sm opacity-75">{result.summary}</div>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Fit Score */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Job Role Fit</h3>
              <p className="text-sm text-gray-600">Technical & functional alignment</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full ${getScoreBackground(result.job_fit_score)} transition-all duration-1000`}
                style={{ width: `${result.job_fit_score}%` }}
              ></div>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(result.job_fit_score)}`}>
              {result.job_fit_score}/100
            </div>
          </div>
        </div>

        {/* Culture Fit Score */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Culture Fit</h3>
              <p className="text-sm text-gray-600">Personality & behavioral alignment</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full ${getScoreBackground(result.culture_fit_score)} transition-all duration-1000`}
                style={{ width: `${result.culture_fit_score}%` }}
              ></div>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(result.culture_fit_score)}`}>
              {result.culture_fit_score}/100
            </div>
          </div>
        </div>
      </div>

      {/* Strengths and Concerns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Key Strengths</h3>
          </div>
          <div className="space-y-3">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Concerns */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Areas of Concern</h3>
          </div>
          <div className="space-y-3">
            {result.concerns.map((concern, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{concern}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;