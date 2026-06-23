export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  premium: boolean;
  role?: 'free' | 'premium' | 'course_purchased' | 'moderator' | 'admin';
  purchasedCourses?: string[];
  createdAt?: any;
  todayPoints?: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  totalPoints?: number;
}

export interface LiveExam {
  id: string;
  title: string;
  courseId: string;
  duration: number; // minutes
  negativeMark: number;
  questionIds: string[];
  access: 'free' | 'premium' | 'course';
  startTime?: string;
  endTime?: string;
}

export interface Question {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number; // 1, 2, 3, or 4
  explanation?: string;
}

export interface ExamResult {
  id?: string;
  userId: string;
  userName: string;
  examId: string;
  examTitle: string;
  courseTitle: string;
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  timeTaken: string;
  percentage: number;
  rank: number;
  totalParticipants: number;
  answers: Record<number, { questionId: string; answer: number }>;
  submittedAt: any;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  routine?: { date: string; topic: string; testId?: string }[];
  pdfs?: { title: string; link: string; date?: string }[];
}

export interface QuestionReport {
  id?: string;
  userEmail: string;
  reason: string;
  description: string;
  questionId: string;
  createdAt: any;
  questionText?: string;
  subject?: string;
  status?: string;
}
