import { ScheduledInterview, CandidateRecord } from '../types/interview';

const SCHEDULED_INTERVIEWS_KEY = 'hr_scheduled_interviews';
const COMPLETED_INTERVIEWS_KEY = 'hr_completed_interviews';

// Scheduled Interviews Management
export const saveScheduledInterview = (interview: ScheduledInterview): void => {
  try {
    const existingInterviews = getScheduledInterviews();
    const updatedInterviews = existingInterviews.filter(i => i.id !== interview.id);
    updatedInterviews.push(interview);
    
    localStorage.setItem(SCHEDULED_INTERVIEWS_KEY, JSON.stringify(updatedInterviews));
  } catch (error) {
    console.error('Error saving scheduled interview:', error);
  }
};

export const getScheduledInterviews = (): ScheduledInterview[] => {
  try {
    const stored = localStorage.getItem(SCHEDULED_INTERVIEWS_KEY);
    if (!stored) return [];
    
    const interviews = JSON.parse(stored);
    return interviews.map((interview: any) => ({
      ...interview,
      scheduledDate: new Date(interview.scheduledDate),
      createdAt: new Date(interview.createdAt)
    }));
  } catch (error) {
    console.error('Error loading scheduled interviews:', error);
    return [];
  }
};

export const updateInterviewStatus = (id: string, status: 'scheduled' | 'completed' | 'cancelled'): void => {
  try {
    const interviews = getScheduledInterviews();
    const interviewIndex = interviews.findIndex(i => i.id === id);
    
    if (interviewIndex !== -1) {
      interviews[interviewIndex].status = status;
      localStorage.setItem(SCHEDULED_INTERVIEWS_KEY, JSON.stringify(interviews));
    }
  } catch (error) {
    console.error('Error updating interview status:', error);
  }
};

export const deleteScheduledInterview = (id: string): void => {
  try {
    const interviews = getScheduledInterviews();
    const filteredInterviews = interviews.filter(i => i.id !== id);
    localStorage.setItem(SCHEDULED_INTERVIEWS_KEY, JSON.stringify(filteredInterviews));
  } catch (error) {
    console.error('Error deleting scheduled interview:', error);
  }
};

// Get interview by ID
export const getScheduledInterviewById = (id: string): ScheduledInterview | null => {
  const interviews = getScheduledInterviews();
  return interviews.find(i => i.id === id) || null;
};

// Get upcoming interviews
export const getUpcomingInterviews = (): ScheduledInterview[] => {
  const interviews = getScheduledInterviews();
  const now = new Date();
  return interviews.filter(i => 
    i.status === 'scheduled' && 
    i.scheduledDate > now
  ).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
};

// Get today's interviews
export const getTodaysInterviews = (): ScheduledInterview[] => {
  const interviews = getScheduledInterviews();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return interviews.filter(i => 
    i.status === 'scheduled' &&
    i.scheduledDate >= today && 
    i.scheduledDate < tomorrow
  );
};