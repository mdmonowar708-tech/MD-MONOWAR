export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  premium: boolean;
  role: string;
  createdAt: Date;
  todayPoints: number;
  totalPoints: number;
}

export interface LiveExam {
  id: string;
  title: string;
  courseId: string;
  duration: number;
  negativeMark: number;
  questionIds: string[];
  access: "free" | "premium" | string;
}

export interface Question {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number;
  explanation: string;
  category?: string;
  subcategory?: string;
}

export interface ExamResult {
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
  rank: number | string;
  totalParticipants: number;
  answers: any;
  submittedAt: Date;
}
