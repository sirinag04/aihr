// Email service for sending interview invitations
export interface EmailInvitation {
  candidateEmail: string;
  candidateName: string;
  jobRole: string;
  interviewDate: Date;
  meetingLink: string;
  interviewerName: string;
}

export const generateMeetingLink = (): string => {
  const roomId = Math.random().toString(36).substring(2, 15);
  return `https://aihr-fawn.vercel.app/interview/join/${roomId}`;  // ✅ Use your Vercel URL
};


export const generateEmailTemplate = (invitation: EmailInvitation): string => {
  const formattedDate = invitation.interviewDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
Subject: Interview Invitation - ${invitation.jobRole} Position

Dear ${invitation.candidateName},

We are pleased to invite you for a virtual interview for the ${invitation.jobRole} position.

Interview Details:
📅 Date & Time: ${formattedDate}
👤 Interviewer: ${invitation.interviewerName}
💼 Position: ${invitation.jobRole}

🔗 Join Interview: ${invitation.meetingLink}

Please click the link above at the scheduled time to join your interview. Make sure you have:
✓ A stable internet connection
✓ Working camera and microphone
✓ A quiet environment
✓ Chrome or Firefox browser (recommended)

If you need to reschedule or have any questions, please reply to this email.

We look forward to speaking with you!

Best regards,
HR Team
  `.trim();
};

export const sendEmailInvitation = async (invitation: EmailInvitation): Promise<boolean> => {
  try {
    const emailContent = generateEmailTemplate(invitation);
    
    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invitation.candidateEmail)}&su=${encodeURIComponent(`Interview Invitation - ${invitation.jobRole} Position`)}&body=${encodeURIComponent(emailContent)}`;
    
    // Open Gmail in new tab
    window.open(gmailUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error sending email invitation:', error);
    return false;
  }
};

export const copyInvitationText = (invitation: EmailInvitation): string => {
  return generateEmailTemplate(invitation);
};