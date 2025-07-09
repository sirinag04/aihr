import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Clock } from 'lucide-react';
import { LiveAnalysis } from '../types/interview';

interface InsightsPanelProps {
  analysis: LiveAnalysis;
  analysisHistory: LiveAnalysis[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ analysis, analysisHistory }) => {
  const getScoreTrend = () => {
    if (analysisHistory.length < 2) return null;
    
    const current = analysis.overallScore;
    const previous = analysisHistory[analysisHistory.length - 2].overallScore;
    const change = current - previous;
    
    return {
      change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.abs(change)
    };
  };

  const trend = getScoreTrend();

  return (
    <div className="h-96 overflow-y-auto space-y-6">
      {/* Score Trend */}
      {trend && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h5 className="font-medium text-gray-800">Performance Trend</h5>
          </div>
          <div className="flex items-center gap-2">
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : trend.direction === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            )}
            <span className={`text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-700' : 
              trend.direction === 'down' ? 'text-red-700' : 'text-gray-700'
            }`}>
              {trend.direction === 'up' ? 'Improving' : 
               trend.direction === 'down' ? 'Declining' : 'Stable'} 
              {trend.percentage > 0 && ` (${trend.change > 0 ? '+' : ''}${trend.change} points)`}
            </span>
          </div>
        </div>
      )}

      {/* Key Insights */}
      {analysis.keyInsights.length > 0 && (
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Key Insights
          </h5>
          <div className="space-y-2">
            {analysis.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Identified Strengths
          </h5>
          <div className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-800">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Areas of Concern
          </h5>
          <div className="space-y-2">
            {analysis.redFlags.map((flag, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-800">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 1 && (
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            Analysis History
          </h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {analysisHistory.slice(-5).reverse().map((historyItem, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-600">
                  {historyItem.lastUpdated.toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-blue-600">Job: {historyItem.jobFitScore}</span>
                  <span className="text-purple-600">Culture: {historyItem.cultureFitScore}</span>
                  <span className="font-medium">Overall: {historyItem.overallScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {analysis.keyInsights.length === 0 && analysis.strengths.length === 0 && analysis.redFlags.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>AI insights will appear here as the interview progresses</p>
          <p className="text-sm mt-1">Continue the conversation to generate analysis</p>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;