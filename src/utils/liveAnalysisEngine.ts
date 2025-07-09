import { LiveAnalysis } from '../types/interview';

export const analyzeLiveResponse = async (
  text: string,
  jobRole: string,
  previousAnalysis: LiveAnalysis
): Promise<LiveAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay

  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const wordCount = words.length;

  // 🔍 Expanded role-specific keyword sets
  const roleKeywords: Record<string, { technical: string[], soft: string[] }> = {
    'Software Engineer': {
      technical: ['javascript', 'typescript', 'python', 'java', 'c++', 'algorithm', 'code', 'api', 'debug', 'testing', 'database', 'cloud', 'devops', 'docker', 'ci/cd', 'frontend', 'backend', 'architecture'],
      soft: ['problem-solving', 'communication', 'teamwork', 'adaptability', 'learning', 'attention to detail']
    },
    'Product Manager': {
      technical: ['roadmap', 'strategy', 'okrs', 'kpi', 'requirements', 'stakeholder', 'analytics', 'user research', 'feature', 'market', 'launch', 'scrum', 'backlog'],
      soft: ['leadership', 'communication', 'decision-making', 'vision', 'negotiation', 'ownership']
    },
    'UX Designer': {
      technical: ['wireframe', 'prototype', 'accessibility', 'usability', 'ui', 'figma', 'a/b testing', 'journey map', 'interaction', 'interface', 'design thinking'],
      soft: ['empathy', 'creativity', 'user focus', 'feedback', 'iteration']
    },
    'Sales Manager': {
      technical: ['pipeline', 'quota', 'crm', 'target', 'revenue', 'prospecting', 'negotiation', 'conversion', 'lead', 'follow-up', 'closing', 'territory'],
      soft: ['persuasion', 'relationship', 'resilience', 'confidence', 'communication']
    },
    'Data Scientist': {
      technical: ['python', 'machine learning', 'data analysis', 'modeling', 'pandas', 'regression', 'classification', 'nlp', 'clustering', 'deep learning', 'statistics'],
      soft: ['curiosity', 'problem-solving', 'attention to detail', 'communication']
    },
    'Marketing Director': {
      technical: ['seo', 'sem', 'branding', 'analytics', 'roi', 'kpi', 'campaign', 'strategy', 'content marketing', 'conversion', 'email', 'social media'],
      soft: ['creativity', 'audience understanding', 'collaboration', 'vision']
    },
    'HR Manager': {
      technical: ['recruitment', 'onboarding', 'retention', 'policy', 'compliance', 'employee engagement', 'benefits', 'appraisal', 'diversity', 'interview'],
      soft: ['empathy', 'communication', 'leadership', 'integrity', 'conflict resolution']
    }
  };

  const currentRole = roleKeywords[jobRole] || roleKeywords['Software Engineer'];

  const technicalMatches = currentRole.technical.filter(keyword =>
    words.some(word => word.includes(keyword.toLowerCase()))
  ).length;

  const softSkillMatches = currentRole.soft.filter(keyword =>
    words.some(word => word.includes(keyword.toLowerCase()))
  ).length;

  // Communication analysis
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const hasExamples = /example|instance|such as/i.test(text);
  const hasQuestions = /\?/.test(text);

  const momentum = 0.3; // historical score impact

  const jobFitScore = Math.round(Math.min(100, Math.max(0,
    (previousAnalysis.jobFitScore * momentum) +
    (technicalMatches * 8) +
    (wordCount > 50 ? 15 : wordCount * 0.3) +
    (hasExamples ? 10 : 0) +
    (avgWordsPerSentence > 8 && avgWordsPerSentence < 25 ? 10 : 0) +
    (Math.random() * 20)
  )));

  const cultureFitScore = Math.round(Math.min(100, Math.max(0,
    (previousAnalysis.cultureFitScore * momentum) +
    (softSkillMatches * 12) +
    (hasQuestions ? 8 : 0) +
    (sentenceCount > 2 ? 10 : 0) +
    (text.includes('team') ? 8 : 0) +
    (text.includes('learn') ? 6 : 0) +
    (Math.random() * 25)
  )));

  const overallScore = Math.round((jobFitScore + cultureFitScore) / 2);

  const confidence = Math.round(Math.min(100, Math.max(20,
    (wordCount > 30 ? 40 : wordCount * 1.3) +
    (technicalMatches > 0 ? 20 : 0) +
    (softSkillMatches > 0 ? 15 : 0) +
    (sentenceCount > 1 ? 15 : 0) +
    (Math.random() * 10)
  )));

  const keyInsights: string[] = [];
  const redFlags: string[] = [];
  const strengths: string[] = [];

  // 🔍 Analysis feedback
  if (technicalMatches >= 3) {
    strengths.push('Demonstrates solid technical knowledge');
    keyInsights.push(`Strong technical vocabulary with ${technicalMatches} domain keywords`);
  } else if (technicalMatches === 0) {
    redFlags.push('No domain-specific technical terms found');
  }

  if (softSkillMatches >= 2) {
    strengths.push('Displays soft skills like collaboration or communication');
  } else {
    redFlags.push('Could highlight more interpersonal or soft skills');
  }

  if (avgWordsPerSentence > 25) {
    redFlags.push('Sentence complexity may reduce clarity');
  } else if (avgWordsPerSentence < 5) {
    redFlags.push('Responses are too short or vague');
  } else {
    strengths.push('Clear, concise communication');
  }

  if (hasExamples) {
    strengths.push('Uses concrete examples');
    keyInsights.push('Provides relevant examples for better clarity');
  }

  if (hasQuestions) {
    strengths.push('Engaged and curious');
    keyInsights.push('Asks relevant questions during response');
  }

  if (overallScore >= 80) {
    keyInsights.push('Candidate performing consistently well');
  } else if (overallScore >= 60) {
    keyInsights.push('Candidate shows potential with room to grow');
  } else {
    keyInsights.push('Performance needs improvement');
  }

  const scoreTrend = overallScore - previousAnalysis.overallScore;
  if (Math.abs(scoreTrend) > 5) {
    keyInsights.push(scoreTrend > 0 ? `Improving performance (+${scoreTrend})` : `Declining performance (${scoreTrend})`);
  }

  return {
    jobFitScore,
    cultureFitScore,
    overallScore,
    confidence,
    keyInsights: keyInsights.slice(0, 4),
    redFlags: redFlags.slice(0, 3),
    strengths: strengths.slice(0, 4),
    lastUpdated: new Date()
  };
};
