import { CandidateRecord } from '../types/interview';

const STORAGE_KEY = 'hr_interview_candidates';

export const saveCandidateRecord = (candidate: CandidateRecord): void => {
  try {
    const existingRecords = getCandidateRecords();
    const updatedRecords = existingRecords.filter(record => record.id !== candidate.id);
    updatedRecords.push(candidate);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Error saving candidate record:', error);
  }
};

export const getCandidateRecords = (): CandidateRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const records = JSON.parse(stored);
    return records.map((record: any) => ({
      ...record,
      interviewDate: new Date(record.interviewDate),
      analysis: {
        ...record.analysis,
        lastUpdated: new Date(record.analysis.lastUpdated)
      },
      transcript: record.transcript.map((segment: any) => ({
        ...segment,
        timestamp: new Date(segment.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading candidate records:', error);
    return [];
  }
};

export const getCandidateById = (id: string): CandidateRecord | null => {
  const records = getCandidateRecords();
  return records.find(record => record.id === id) || null;
};

export const updateCandidateDecision = (id: string, decision: 'hire' | 'reject' | 'pending', notes?: string): void => {
  const records = getCandidateRecords();
  const candidateIndex = records.findIndex(record => record.id === id);
  
  if (candidateIndex !== -1) {
    records[candidateIndex].finalDecision = decision;
    if (notes) {
      records[candidateIndex].notes = notes;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const deleteCandidateRecord = (id: string): void => {
  const records = getCandidateRecords();
  const filteredRecords = records.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
};

export const exportCandidateData = (): void => {
  const records = getCandidateRecords();
  const dataStr = JSON.stringify(records, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `candidate-records-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};