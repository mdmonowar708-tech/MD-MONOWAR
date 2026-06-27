import { LiveExam, Question } from "./types";

export const SAMPLE_EXAMS: LiveExam[] = [
  {
    id: "exam_bcs_05",
    title: "BCS Mock Test #05",
    courseId: "course_bcs",
    duration: 10, // 10 minutes for testing convenience
    negativeMark: 0.5,
    questionIds: ["q1", "q2", "q3", "q4", "q5"],
    access: "free"
  },
  {
    id: "exam_math_01",
    title: "Job Math Master Quiz #01",
    courseId: "course_math",
    duration: 15,
    negativeMark: 0.25,
    questionIds: ["q6", "q7", "q8"],
    access: "premium"
  },
  {
    id: "exam_ict_02",
    title: "ICT Revision Test #02",
    courseId: "course_ict",
    duration: 8,
    negativeMark: 0.5,
    questionIds: ["q9", "q10"],
    access: "free"
  }
];

export const SAMPLE_QUESTIONS: Record<string, Question> = {
  q1: {
    id: "q1",
    question: "চর্যাপদ কোন যুগে রচিত হয়েছে?",
    option1: "প্রাচীন যুগ",
    option2: "মধ্যযুগ",
    option3: "অন্ধকার যুগ",
    option4: "আধুনিক যুগ",
    correctAnswer: 1,
    explanation: "বাংলা সাহিত্যের প্রাচীন যুগের একমাত্র নির্ভরযোগ্য ঐতিহাসিক নিদর্শন চর্যাপদ। চর্যাপদ প্রাচীন যুগে (৬৫০-১২০০ খ্রিস্টাব্দের মধ্যে) রচিত হয়েছে।"
  },
  q2: {
    id: "q2",
    question: "নিচের কোনটি মৌলিক সংখ্যা?",
    option1: "৯",
    option2: "১৫",
    option3: "২১",
    option4: "৪৭",
    correctAnswer: 4,
    explanation: "৪৭ একটি মৌলিক সংখ্যা কারণ একে ১ এবং ৪৭ ছাড়া অন্য কোনো সংখ্যা দ্বারা নিঃশেষে ভাগ করা যায় না।"
  },
  q3: {
    id: "q3",
    question: "The word 'Omnipotent' means:",
    option1: "All-knowing",
    option2: "All-powerful",
    option3: "All-present",
    option4: "All-merciful",
    correctAnswer: 2,
    explanation: "'Omnipotent' means having unlimited power, which translates to 'All-powerful' (সর্বশক্তিমান)।"
  },
  q4: {
    id: "q4",
    question: "বঙ্গবন্ধু শেখ মুজিবুর রহমান কত তারিখে ঐতিহাসিক ছয় দফা দাবি পেশ করেন?",
    option1: "৫ ফেব্রুয়ারি ১৯৬৬",
    option2: "৭ মার্চ ১৯৬৬",
    option3: "২৩ জুন ১৯৬৬",
    option4: "১৬ ডিসেম্বর ১৯৬৬",
    correctAnswer: 1,
    explanation: "১৯৬৬ সালের ৫-৬ ফেব্রুয়ারি লাহোরে অনুষ্ঠিত বিরোধী দলগুলোর এক সম্মেলনে বঙ্গবন্ধু শেখ মুজিবুর রহমান ঐতিহাসিক ছয় দফা দাবি পেশ করেন।"
  },
  q5: {
    id: "q5",
    question: "কম্পিউটারের স্থায়ী স্মৃতিশক্তিকে কী বলে?",
    option1: "RAM",
    option2: "ROM",
    option3: "CPU",
    option4: "Hard Disk",
    correctAnswer: 2,
    explanation: "ROM (Read Only Memory) হলো কম্পিউটারের স্থায়ী স্মৃতিশক্তি (Non-volatile memory)।"
  },
  q6: {
    id: "q6",
    question: "শতকরা বার্ষিক ৫ টাকা হার সুদে ১২০ টাকার ৩ বছরের সুদ কত?",
    option1: "১৫ টাকা",
    option2: "১৮ টাকা",
    option3: "২০ টাকা",
    option4: "২২ টাকা",
    correctAnswer: 2,
    explanation: "সুদ = (আসল × সুদের হার × সময়) / ১০০ = (১২০ × ৫ × ৩) / ১০০ = ১৮০০ / ১০০ = ১৮ টাকা।"
  },
  q7: {
    id: "q7",
    question: "দুইটি সংখ্যার অনুপাত ৫:৬ এবং গ.সা.গু ৪ হলে ল.সা.গু কত?",
    option1: "৬০",
    option2: "১২০",
    option3: "২৪০",
    option4: "৪৮০",
    correctAnswer: 2,
    explanation: "সংখ্যা দুটি হলো ৫×৪ = ২০ এবং ৬×৪ = ২৪। ২০ ও ২৪ এর ল.সা.গু হলো ১২০।"
  },
  q8: {
    id: "q8",
    question: "১০টি সংখ্যার গড় ৩০। যদি ১টি সংখ্যা বাদ দেওয়া হয় তবে গড় হয় ২৯। বাদ দেওয়া সংখ্যাটি কত?",
    option1: "৩৯",
    option2: "৪০",
    option3: "৪১",
    option4: "৪২",
    correctAnswer: 1,
    explanation: "১০টি সংখ্যার সমষ্টি = ৩০ × ১০ = ৩০০। ৯টি সংখ্যার সমষ্টি = ২৯ × ৯ = ২৬১। বাদ যাওয়া সংখ্যাটি = ৩০০ - ২৬১ = ৩৯।"
  },
  q9: {
    id: "q9",
    question: "নিচের কোনটি কম্পিউটারের ইনপুট ডিভাইস?",
    option1: "Monitor",
    option2: "Speaker",
    option3: "Keyboard",
    option4: "Printer",
    correctAnswer: 3,
    explanation: "কীবোর্ড (Keyboard) হলো প্রধান ইনপুট ডিভাইস। মনিটর, স্পিকার এবং প্রিন্টার হলো আউটপুট ডিভাইস।"
  },
  q10: {
    id: "q10",
    question: "১ গিগাবাইট (GB) সমান কত মেগাবাইট (MB)?",
    option1: "১০২৪ MB",
    option2: "১০০০ MB",
    option3: "৫১২ MB",
    option4: "২০৪৮ MB",
    correctAnswer: 1,
    explanation: "১ গিগাবাইট (GB) = ১০২৪ মেগাবাইট (MB)।"
  }
};

export const SAMPLE_NOTICES = [
  "📢 বিশেষ নোটিশ: আগামী ২০ জুন ২০২৬ তারিখে বিসিএস প্রিলিমিনারি মডেল টেস্ট অনুষ্ঠিত হবে।",
  "⚡️ MCQ HERO প্রিমিয়াম মেম্বারশিপে ২০% ডিসকাউন্ট আজ রাত ১২টা পর্যন্ত!",
  "📝 নতুন গণিত মডিউল পরীক্ষার প্রশ্ন আপলোড সম্পন্ন হয়েছে।"
];

export const SAMPLE_ACHIEVEMENTS = [
  { id: "a1", title: "First Exam Completed", icon: "🎯", description: "Completed your first live exam test!" },
  { id: "a2", title: "Accuracy Master", icon: "📈", description: "Scored over 80% accuracy on any test." },
  { id: "a3", title: "Daily Streak Raider", icon: "🔥", description: "Logged in and completed quizzes 3 days in a row." },
  { id: "a4", title: "Premium Member", icon: "⭐", description: "Upgraded account to unconstrained access levels." }
];

export const SAMPLE_GLOBAL_USERS = [
  { name: "Monowar Hossain", points: 2840, rank: 1, uid: "u1" },
  { name: "Sajid Rahim", points: 2450, rank: 2, uid: "u2" },
  { name: "Nusrat Jahan", points: 2120, rank: 3, uid: "u3" },
  { name: "Anisur Rahman", points: 1980, rank: 4, uid: "u4" },
  { name: "Tonmoy Roy", points: 1850, rank: 5, uid: "u5" },
  { name: "Sonia Akter", points: 1620, rank: 6, uid: "u6" },
  { name: "Kabir Chowdhury", points: 1450, rank: 7, uid: "u7" }
];
