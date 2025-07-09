import React from 'react';
import { TrendingUp, TrendingDown, Target, Users, Brain, Zap } from 'lucide-react';
import { LiveAnalysis } from '../types/interview';

interface LiveScoreDisplayProps {
  analysis: LiveAnalysis;
  isAnalyzing: boolean;
}

const LiveScoreDisplay: React.FC<LiveScoreDisplayProps> = ({ analysis, isAnalyzing }) => {
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

  const getScoreBorder = (score: number) => {
    if (score >= 80) return 'border-green-200 bg-green-50';
    if (score >= 60) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Live AI Analysis</h3>
        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-600">Analyzing...</span>
            </>
          )}
          <div className="text-xs text-gray-500">
            Updated: {analysis.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Job Fit Score */}
        <div className={`p-4 rounded-xl border-2 ${getScoreBorder(analysis.jobFitScore)}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Job Fit</h4>
              <p className="text-xs text-gray-600">Role alignment</p>
            </div>
          </div>
          <div className="relative mb-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${getScoreBackground(analysis.jobFitScore)}`}
                style={{ width: `${analysis.jobFitScore}%` }}
              ></div>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(analysis.jobFitScore)}`}>
            {analysis.jobFitScore}/100
          </div>
        </div>

        {/* Culture Fit Score */}
        <div className={`p-4 rounded-xl border-2 ${getScoreBorder(analysis.cultureFitScore)}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Culture Fit</h4>
              <p className="text-xs text-gray-600">Team alignment</p>
            </div>
          </div>
          <div className="relative mb-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${getScoreBackground(analysis.cultureFitScore)}`}
                style={{ width: `${analysis.cultureFitScore}%` }}
              ></div>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(analysis.cultureFitScore)}`}>
            {analysis.cultureFitScore}/100
          </div>
        </div>

        {/* Overall Score */}
        <div className={`p-4 rounded-xl border-2 ${getScoreBorder(analysis.overallScore)}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Overall</h4>
              <p className="text-xs text-gray-600">Combined score</p>
            </div>
          </div>
          <div className="relative mb-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${getScoreBackground(analysis.overallScore)}`}
                style={{ width: `${analysis.overallScore}%` }}
              ></div>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
            {analysis.overallScore}/100
          </div>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-gray-800">Analysis Confidence</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="h-2 bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${analysis.confidence}%` }}
            ></div>
          </div>
          <span className="font-mono text-sm font-medium text-gray-700">
            {analysis.confidence}%
          </span>
        </div>
      </div>

      {/* Quick Insights */}
      {analysis.keyInsights.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h5 className="font-medium text-blue-800 mb-2">Latest Insights</h5>
          <div className="space-y-1">
            {analysis.keyInsights.slice(0, 2).map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h5 className="font-medium text-red-800 mb-2">Areas of Concern</h5>
          <div className="space-y-1">
            {analysis.redFlags.slice(0, 2).map((flag, index) => (
              <div key={index} className="flex items-start gap-2">
                <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveScoreDisplay;