// Mock analysis engine - in production, this would integrate with actual AI services
export interface AnalysisResult {
  job_fit_score: number;
  culture_fit_score: number;
  verdict: 'Hire' | 'Consider' | 'Pass';
  summary: string;
  strengths: string[];
  concerns: string[];
}

export const analyzeResponse = async (response: string, jobRole: string): Promise<AnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate latency

  const words = response.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const sentenceCount = response.split(/[.!?]/).length;

  // 🧠 Expanded Technical Keywords for Multiple Roles
  const technicalKeywords: Record<string, string[]> = {
    'Software Engineer': [
      'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'node', 'api', 'docker', 'kubernetes', 'git',
      'algorithm', 'data structure', 'debugging', 'deployment', 'unit test', 'ci/cd', 'graphql', 'rest', 'sql', 'nosql'
    ],
    'Data Scientist': [
      'machine learning', 'data analysis', 'pandas', 'numpy', 'regression', 'classification', 'modeling', 'nlp',
      'clustering', 'python', 'statistics', 'deep learning', 'data cleaning', 'feature engineering', 'visualization', 'jupyter'
    ],
    'UX Designer': [
      'wireframe', 'prototype', 'figma', 'user flow', 'accessibility', 'usability', 'interaction', 'personas',
      'a/b testing', 'design thinking', 'sketch', 'ui', 'journey map', 'heuristics'
    ],
    'Product Manager': [
      'roadmap', 'agile', 'backlog', 'scrum', 'stakeholder', 'okrs', 'kpi', 'requirements', 'feature', 'analytics',
      'user story', 'priority', 'customer', 'value proposition', 'market research'
    ],
    'Sales Manager': [
      'quota', 'pipeline', 'lead', 'crm', 'conversion', 'prospecting', 'negotiation', 'follow-up', 'target',
      'revenue', 'closing', 'demo', 'client', 'presentation', 'deal'
    ],
    'Marketing Director': [
      'branding', 'seo', 'sem', 'content', 'strategy', 'campaign', 'roi', 'analytics', 'target audience', 'engagement',
      'reach', 'click-through', 'social media', 'email marketing', 'conversion rate'
    ],
    'HR Manager': [
      'recruitment', 'onboarding', 'employee engagement', 'training', 'compliance', 'benefits', 'hiring',
      'policy', 'feedback', 'appraisal', 'diversity', 'inclusion', 'performance'
    ],
    'Finance Analyst': [
      'forecast', 'budget', 'cost', 'variance', 'balance sheet', 'p&l', 'cash flow', 'financial model',
      'excel', 'kpi', 'trend analysis', 'investment', 'valuation'
    ],
    'Customer Support': [
      'ticket', 'resolution', 'empathy', 'response time', 'faq', 'support', 'escalation', 'live chat',
      'follow-up', 'satisfaction', 'issue tracking'
    ]
  };

  const softSkillsKeywords = [
    'communication', 'teamwork', 'collaboration', 'adaptability', 'problem solving',
    'leadership', 'time management', 'empathy', 'creativity', 'critical thinking',
    'initiative', 'resilience', 'accountability', 'motivation', 'listening', 'emotional intelligence'
  ];

  const roleKeywords = technicalKeywords[jobRole] || [];

  const technicalMatches = roleKeywords.filter(k =>
    response.toLowerCase().includes(k.toLowerCase())
  ).length;

  const softSkillMatches = softSkillsKeywords.filter(k =>
    response.toLowerCase().includes(k.toLowerCase())
  ).length;

  // 🧮 Scoring System
  let jobFitScore = Math.min(100, technicalMatches * 10 + Math.min(wordCount / 10, 20) + Math.random() * 20);
  let cultureFitScore = Math.min(100, softSkillMatches * 10 + sentenceCount + Math.random() * 20);

  jobFitScore = Math.round(jobFitScore);
  cultureFitScore = Math.round(cultureFitScore);
  const avg = (jobFitScore + cultureFitScore) / 2;

  const verdict: AnalysisResult['verdict'] =
    avg >= 75 ? 'Hire' : avg >= 55 ? 'Consider' : 'Pass';

  const summary = {
    Hire: 'Strong candidate with excellent domain knowledge and strong interpersonal fit.',
    Consider: 'Potential candidate with promise. May need additional guidance or development.',
    Pass: 'Candidate does not currently meet expectations for this role.'
  }[verdict];

  const strengths: string[] = [];
  if (technicalMatches >= 5) strengths.push('Excellent domain expertise and technical terminology.');
  if (softSkillMatches >= 5) strengths.push('Strong interpersonal and communication skills.');
  if (wordCount > 100) strengths.push('Thorough and well-articulated responses.');

  const concerns: string[] = [];
  if (technicalMatches <= 2) concerns.push('Lack of technical depth in answers.');
  if (softSkillMatches <= 2) concerns.push('Limited demonstration of soft skills.');
  if (wordCount < 40) concerns.push('Response too brief for reliable evaluation.');

  if (strengths.length === 0) strengths.push('Basic knowledge of the domain is visible.');
  if (concerns.length === 0) concerns.push('Could benefit from deeper insights and clarity.');

  return {
    job_fit_score: jobFitScore,
    culture_fit_score: cultureFitScore,
    verdict,
    summary,
    strengths,
    concerns
  };
};
