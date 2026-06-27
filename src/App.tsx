import React, { useState, useEffect, useMemo } from "react";
import { SAMPLE_EXAMS, SAMPLE_QUESTIONS, SAMPLE_GLOBAL_USERS } from "./simulationData";
import { LiveExam, Question, ExamResult, UserProfile } from "./types";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import ExamSummary from "./components/ExamSummary";
import McqPage from "./components/McqPage";
import ResultPage from "./components/ResultPage";
import SolutionsPage from "./components/SolutionsPage";
import LeaderboardPage from "./components/LeaderboardPage";
import ProfilePage from "./components/ProfilePage";
import AuthPage from "./components/AuthPage";
import PremiumModal from "./components/PremiumModal";
import { testConnection, db, messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { collection, doc, onSnapshot } from "firebase/firestore";
import AdminSettingsPage from "./components/AdminSettingsPage";
import RoutinePage from "./components/RoutinePage";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>({
    uid: "u1",
    name: "Monowar Hossain",
    email: "monowar@gmail.com",
    premium: true,
    role: "premium",
    createdAt: new Date(),
    todayPoints: 1280,
    totalPoints: 1280,
  });

  const [activePage, setActivePage] = useState<string>("home-page");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<number, { questionId: string; answer: number }>>({});
  const [resultsHistory, setResultsHistory] = useState<ExamResult[]>([
    {
      userId: "u1",
      userName: "Monowar Hossain",
      examId: "exam_bcs_extra",
      examTitle: "BCS Mock Test #04",
      courseTitle: "BCS Preparation Masterclass",
      score: 42,
      correct: 42,
      wrong: 8,
      unanswered: 0,
      timeTaken: "00:44:12",
      percentage: 84,
      rank: 11,
      totalParticipants: 180,
      answers: {},
      submittedAt: new Date()
    }
  ]);
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Firestore real-time active listeners states
  const [firestoreExams, setFirestoreExams] = useState<LiveExam[]>([]);
  const [firestoreQuestions, setFirestoreQuestions] = useState<Record<string, Question>>({});
  const [firestoreCourses, setFirestoreCourses] = useState<any[]>([]);
  const [firestoreRoutines, setFirestoreRoutines] = useState<any[]>([]);
  const [questionLimit, setQuestionLimit] = useState<number>(5); // default base limit of 5 from user request
  
  // Real-time listener for Firestore setting, exams, and courses (removed heavy global questions subscriber for instant load)
  useEffect(() => {
    // 1. Settings listener
    const unsubscribeSettings = onSnapshot(doc(db, "settings", "app_config"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const limitVal = data.question_limit ?? data.freeLimit ?? data.freeUserLimit ?? data.limit ?? data.free_user_limit;
        if (typeof limitVal === 'number' && !isNaN(limitVal)) {
          setQuestionLimit(limitVal);
          console.log("🔥 Sync question limit from Firestore: ", limitVal);
        }
      }
    }, (error) => {
      console.warn("Firestore settings lookup warnings (offline support):", error);
    });

    // FCM Token registration
    const registerFcmToken = async () => {
      if (!user) return;
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // NOTE: You MUST generate a VAPID key in Firebase Console and replace this placeholder!
          const token = await getToken(messaging, { 
            vapidKey: 'BMVEiceHr_GxpmFuYQqOF4Z65h4mEQZy4O9r83HHloH5ajuzx4NB7RzZ4LhARmGtT4RbrMAxnPrcWmNh9jJOhmA' 
          });
          
          if (token) {
            await fetch('/api/save-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid: user.uid, token })
            });
            console.log("FCM Token saved successfully");
          }
        }
      } catch (error) {
        console.error("Error registering FCM token:", error);
      }
    };
    registerFcmToken();

    // 2. Exams listener
    const unsubscribeExams = onSnapshot(collection(db, "exams"), (snapshot) => {
      const list: LiveExam[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || "",
          courseId: data.courseId || "",
          duration: typeof data.duration === 'number' ? data.duration : (Number(data.duration) || 10),
          negativeMark: typeof data.negativeMark === 'number' ? data.negativeMark : (Number(data.negativeMark) || 0),
          questionIds: Array.isArray(data.questionIds) ? data.questionIds : [],
          access: data.access || "free",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
        });
      });
      setFirestoreExams(list);
    }, (err) => {
      console.warn("Firestore exams sync failed:", err);
    });

    // 3. Courses (Categories) listener
    const unsubscribeCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        // Normalize routine array
        const rawRoutine = Array.isArray(data.routine) ? data.routine : [];
        const normalizedRoutine = rawRoutine.map((item: any) => ({
          date: item.date || item.day || item.time || "আপডেট হচ্ছে",
          topic: item.topic || item.subject || item.title || item.name || ""
        })).filter((item: any) => item.topic);

        // Normalize pdfs array
        const rawPdfs = Array.isArray(data.pdfs) ? data.pdfs : [];
        const normalizedPdfs = rawPdfs.map((item: any) => {
          const pdfTitle = item.title || item.name || item.subject || item.label || "লেকচার শিট";
          const pdfLink = item.link || item.url || item.pdfUrl || item.driveUrl || item.downloadUrl || "#";
          const pdfDate = item.date || item.time || item.createdAt || "আজ";
          return {
            title: pdfTitle,
            link: pdfLink,
            date: pdfDate
          };
        }).filter((item: any) => item.link && item.link !== "#");

        list.push({
          id: docSnap.id,
          title: data.title || "",
          routine: normalizedRoutine,
          pdfs: normalizedPdfs,
        });
      });
      setFirestoreCourses(list);
    }, (err) => {
      console.warn("Firestore courses sync failed:", err);
    });

    // 4. Exam Routines listener
    const unsubscribeRoutines = onSnapshot(collection(db, "exam_routines"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      setFirestoreRoutines(list);
    }, (err) => {
      console.warn("Firestore exam_routines sync failed:", err);
    });

    // Connectivity check helper
    testConnection().then((success) => {
      console.log("Firebase Connection Active Status: ", success);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeExams();
      unsubscribeCourses();
      unsubscribeRoutines();
    };
  }, []);

  // Compute merged lists combining Firestore real-time values & local fallbacks
  const mergedExams = firestoreExams.length > 0 
    ? firestoreExams
    : SAMPLE_EXAMS;

  const mergedCourses = useMemo(() => {
    const baseCourses = [...firestoreCourses];

    if (firestoreRoutines.length > 0) {
      const updatedCourses = baseCourses.map(course => ({
        ...course,
        routine: Array.isArray(course.routine) ? [...course.routine] : []
      }));

      const matchedRoutineIds = new Set<string>();

      updatedCourses.forEach(course => {
        const matchingRoutines = firestoreRoutines.filter(r => {
          const rCourseId = String(r.courseId || r.course_id || r.course || r.courseTitle || r.courseName || r.category || r.categoryName || r.category_name || "").trim().toLowerCase();
          const cId = String(course.id || "").trim().toLowerCase();
          const cTitle = String(course.title || course.name || course.courseName || course.courseTitle || course.course_name || course.course_title || "").trim().toLowerCase();
          const isMatch = rCourseId && (rCourseId === cId || rCourseId === cTitle);
          if (isMatch && r.id) {
            matchedRoutineIds.add(r.id);
          }
          return isMatch;
        });

        if (matchingRoutines.length > 0) {
          const mappedRoutines = matchingRoutines.map(r => ({
            date: r.examDate || r.exam_date || r.date || r.day || r.time || "আপডেট হচ্ছে",
            topic: r.topic || r.examTitle || r.exam_title || r.examName || r.exam_name || r.subject || r.title || r.name || "স্পেশাল মডেল টেস্ট",
            syllabus: r.syllabus || r.description || "সিলেবাস নির্ধারণ করা হয়নি",
            duration: r.duration || r.timeLimit || r.time_limit || "১৫ মিঃ",
            marks: r.marks || r.points || r.totalQuestions || r.questionCount || "২০"
          })).filter(r => r.topic);

          mappedRoutines.forEach(mr => {
            if (!course.routine.some(er => er.topic === mr.topic && er.date === mr.date)) {
              course.routine.push(mr);
            }
          });
        }
      });

      // Collect unmatched routines and group them as dynamic virtual courses
      const unmatchedRoutines = firestoreRoutines.filter(r => !matchedRoutineIds.has(r.id));
      if (unmatchedRoutines.length > 0) {
        const groups: Record<string, { id: string; title: string; routines: any[] }> = {};
        
        unmatchedRoutines.forEach(r => {
          const courseId = r.courseId || r.course_id || r.course || r.category || "other_course";
          const courseTitle = r.courseTitle || r.courseName || r.course || r.categoryName || r.category || r.courseId || r.course_id || "অন্যান্য কোর্স";
          const key = String(courseId).trim().toLowerCase();
          if (!groups[key]) {
            groups[key] = {
              id: courseId,
              title: courseTitle,
              routines: []
            };
          }
          groups[key].routines.push({
            date: r.examDate || r.exam_date || r.date || r.day || r.time || "আপডেট হচ্ছে",
            topic: r.topic || r.examTitle || r.exam_title || r.examName || r.exam_name || r.subject || r.title || r.name || "স্পেশাল মডেল টেস্ট",
            syllabus: r.syllabus || r.description || "সিলেবাস নির্ধারণ করা হয়নি",
            duration: r.duration || r.timeLimit || r.time_limit || "১৫ মিঃ",
            marks: r.marks || r.points || r.totalQuestions || r.questionCount || "২০"
          });
        });

        Object.values(groups).forEach(g => {
          const validRoutines = g.routines.filter(r => r.topic);
          if (validRoutines.length > 0) {
            updatedCourses.push({
              id: g.id,
              title: g.title,
              routine: validRoutines,
              pdfs: []
            });
          }
        });
      }

      return updatedCourses;
    }
    return baseCourses;
  }, [firestoreCourses, firestoreRoutines, user]);

  // Dynamic Real-time listener for the currently selected exam's questions. Runs only when selectedExamId changes.
  // This solves performance (dashboard and courses load instantly) and enables real-time question additions/updates instantly without refresh!
  useEffect(() => {
    if (!selectedExamId) {
      setFirestoreQuestions({});
      return;
    }

    const exam = mergedExams.find((e) => e.id === selectedExamId);
    if (!exam || !exam.questionIds || exam.questionIds.length === 0) {
      setFirestoreQuestions({});
      return;
    }

    console.log(`Setting up real-time questions listener for ${exam.title} (${exam.questionIds.length} questions)`);

    const unsubscribes = exam.questionIds.map((qid) => {
      return onSnapshot(
        doc(db, "questions", qid),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setFirestoreQuestions((prev) => ({
              ...prev,
              [qid]: {
                id: snapshot.id,
                question: data.question || "",
                option1: data.option1 || "",
                option2: data.option2 || "",
                option3: data.option3 || "",
                option4: data.option4 || "",
                correctAnswer: typeof data.correctAnswer === 'number' ? data.correctAnswer : (Number(data.correctAnswer) || 1),
                explanation: data.explanation || "",
              },
            }));
          }
        },
        (err) => {
          console.warn(`Firestore question ${qid} listener failed (offline):`, err);
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [selectedExamId, mergedExams]);

  const mergedQuestions = useMemo(() => {
    return { ...SAMPLE_QUESTIONS, ...firestoreQuestions };
  }, [firestoreQuestions]);

  // Compute active exam questions dynamically with real-time updates and free users daily practice limits
  const currentExamQuestions = useMemo(() => {
    if (!selectedExamId) return [];
    const exam = mergedExams.find((e) => e.id === selectedExamId);
    if (!exam) return [];

    const qList = exam.questionIds.map((qid) => mergedQuestions[qid]).filter(Boolean);
    const isUserPremium = user?.premium || user?.role === 'premium';
    return isUserPremium ? qList : qList.slice(0, questionLimit);
  }, [selectedExamId, mergedExams, mergedQuestions, user, questionLimit]);

  // Login handler
  const handleSignIn = async (email: string) => {
    setUser({
      uid: "u1",
      name: "Monowar Hossain",
      email: email,
      premium: true,
      role: "premium",
      todayPoints: 1280,
      totalPoints: 1280,
      createdAt: new Date()
    });
    setActivePage("home-page");
  };

  // Register handler
  const handleSignUp = async (name: string, email: string) => {
    setUser({
      uid: "u_new",
      name: name,
      email: email,
      premium: false,
      role: "free",
      todayPoints: 0,
      totalPoints: 0,
      createdAt: new Date()
    });
    setActivePage("home-page");
  };

  const handleSignOut = () => {
    setUser(null);
    setActivePage("home-page");
  };

  // Start exam summary trigger
  const handleStartExam = (examId: string) => {
    const exam = mergedExams.find((e) => e.id === examId);
    if (!exam) return;

    const userRole = user ? (user.role || 'free') : 'free';
    const purchased = user ? (user.purchasedCourses || []) : [];

    if (userRole === 'premium' || user?.premium) {
      // Premium champion users can access absolutely everything.
    } else if (userRole === 'course_purchased') {
      // Course-purchased users can access:
      // - access === 'free'
      // - Their purchased courses (exam.courseId exists in purchased)
      const hasPurchasedThisCourse = exam.courseId && purchased.includes(exam.courseId);
      if (exam.access !== 'free' && !hasPurchasedThisCourse) {
        setIsPremiumModalOpen(true);
        return;
      }
    } else {
      // Free users can ONLY access 'free' exams
      if (exam.access !== 'free') {
        setIsPremiumModalOpen(true);
        return;
      }
    }

    setSelectedExamId(examId);
    setActivePage("exam-summary-page");
  };

  // Start active time test questions
  const handleRealStart = () => {
    if (!selectedExamId) return;
    setSavedAnswers({});
    setActivePage("mcq-page");
  };

  // Single select radio handlers
  const handleSelectAnswer = (questionIndex: number, answerNo: number) => {
    const q = currentExamQuestions[questionIndex];
    if (!q) return;

    setSavedAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        questionId: q.id,
        answer: answerNo,
      },
    }));
  };

  // Auto-grade calculation engine
  const handleFinishExam = (timeLeftSeconds: number) => {
    if (!selectedExamId) return;
    const exam = mergedExams.find((e) => e.id === selectedExamId);
    if (!exam) return;

    let score = 0;
    let correct = 0;
    let wrong = 0;

    currentExamQuestions.forEach((q, idx) => {
      const ansData = savedAnswers[idx];
      if (ansData) {
        if (ansData.answer === q.correctAnswer) {
          correct++;
          score++;
        } else {
          wrong++;
          score -= exam.negativeMark;
        }
      }
    });

    const unanswered = currentExamQuestions.length - Object.keys(savedAnswers).length;
    const percentage = currentExamQuestions.length > 0 
      ? (correct / currentExamQuestions.length) * 100 
      : 0;

    // Time calculations
    const elapsedSeconds = (exam.duration * 60) - timeLeftSeconds;
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const timeTaken = `00:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    // Mock rank calculations
    const calculatedRank = Math.floor(Math.random() * 5) + 2; 

    const finalResult: ExamResult = {
      userId: user?.uid || "u_test",
      userName: user?.name || "Anonymous User",
      examId: exam.id,
      examTitle: exam.title,
      courseTitle: "General Subject Assessment",
      score: Number(score.toFixed(2)),
      correct,
      wrong,
      unanswered,
      timeTaken,
      percentage: Number(percentage.toFixed(1)),
      rank: calculatedRank,
      totalParticipants: calculatedRank + Math.floor(Math.random() * 40) + 12,
      answers: savedAnswers,
      submittedAt: new Date()
    };

    // Update state history
    setResultsHistory((prev) => [finalResult, ...prev]);
    setCurrentResult(finalResult);

    // Update user local points
    if (user) {
      setUser((prev) => prev ? {
        ...prev,
        todayPoints: (prev.todayPoints || 0) + Math.round(score > 0 ? score * 10 : 0),
        totalPoints: (prev.totalPoints || 0) + Math.round(score > 0 ? score * 10 : 0),
      } : null);
    }

    setActivePage("final-result-page");
  };

  // Helper stats definitions
  const getCalculatedStats = () => {
    if (resultsHistory.length === 0) {
      return {
        totalPoints: user?.totalPoints || 0,
        totalExams: 0,
        accuracy: "0%",
        bestScore: 0,
        bestRank: "-",
        totalCourses: mergedCourses.length
      };
    }

    const totalExams = resultsHistory.length;
    const avgAccuracy = Math.round(resultsHistory.reduce((sum, r) => sum + r.percentage, 0) / totalExams);
    const bestScore = Math.max(...resultsHistory.map((r) => r.score));
    const bestRank = "#" + Math.min(...resultsHistory.map((r) => r.rank));

    return {
      totalPoints: user?.totalPoints || 0,
      totalExams,
      accuracy: `${avgAccuracy}%`,
      bestScore,
      bestRank,
      totalCourses: mergedCourses.length
    };
  };

  const currentStats = getCalculatedStats();

  if (!user) {
    return <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  // Active Screen Selector Switch
  const renderActivePage = () => {
    switch (activePage) {
      case "home-page":
        return (
          <Dashboard 
            onOpenSidebar={() => setSidebarOpen(true)}
            exams={mergedExams}
            onStartExam={handleStartExam}
            isPremium={user.premium}
            user={user}
            onUpgrade={() => {
              setUser((prev) => prev ? { ...prev, premium: true, role: "premium" } : null);
              alert("🎉 অভিনন্দন! আপনি সফলভাবে প্রিমিয়াম মেম্বারশিপে আপগ্রেড করেছেন।");
            }}
            onNavigate={(id) => setActivePage(id)}
            userStats={{
              totalPoints: user.todayPoints || 0,
              totalExams: currentStats.totalExams,
              accuracy: currentStats.accuracy,
              rank: user.premium || user.role === 'premium' ? "#17" : "#42",
            }}
            courses={mergedCourses}
          />
        );

      case "exam-page":
        return (
          <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen">
            {/* Header with styled back button */}
            <div className="bg-white border-b border-neutral-100 p-4 sticky top-0 z-10 flex items-center gap-3">
              <button 
                onClick={() => setActivePage("home-page")}
                className="p-1.5 hover:bg-neutral-100 rounded-full transition-all cursor-pointer border-none bg-transparent text-neutral-800 flex items-center justify-center w-8 h-8 font-black text-lg"
              >
                ←
              </button>
              <h2 className="text-sm font-extrabold text-neutral-900 tracking-tight">
                📚 Available live Exams (পরীক্ষাসমূহ)
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {mergedExams.map((exam) => (
                <div key={exam.id} className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-extrabold text-neutral-800 text-sm">{exam.title}</h3>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5">MCQ Practice Series</p>
                    </div>
                    <span className="text-[10px] bg-sky-50 text-[#009688] font-bold px-2 py-0.5 rounded-full uppercase">
                      {exam.access}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-neutral-500 font-bold py-2 border-t border-b border-neutral-50 my-3">
                    <span>⏱ {exam.duration} Min</span>
                    <span>📑 {exam.questionIds.length} Questions</span>
                  </div>
                  <button
                    onClick={() => handleStartExam(exam.id)}
                    className="w-full bg-[#00BFA6] hover:bg-[#009688] font-bold py-2.5 rounded-2xl cursor-pointer text-white border-none text-xs transition-colors"
                  >
                    Open Summary Detail
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "exam-summary-page":
        {
          const e = mergedExams.find((exam) => exam.id === selectedExamId);
          return e ? (
            <ExamSummary 
              exam={e} 
              onBack={() => setActivePage("home-page")} 
              onRealStart={handleRealStart} 
            />
          ) : null;
        }

      case "mcq-page":
        {
          const e = mergedExams.find((exam) => exam.id === selectedExamId);
          return e ? (
            <McqPage 
              exam={e}
              questions={currentExamQuestions}
              savedAnswers={savedAnswers}
              onSelectAnswer={handleSelectAnswer}
              onFinishExam={handleFinishExam}
              onCancel={() => {
                setSavedAnswers({});
                setActivePage("home-page");
              }}
            />
          ) : null;
        }

      case "final-result-page":
        return currentResult ? (
          <ResultPage 
            result={currentResult}
            onViewSolutions={() => setActivePage("solution-page")}
            onNavigateToLeaderboard={() => setActivePage("global-leaderboard-page")}
            onBackToHome={() => {
              setCurrentResult(null);
              setActivePage("home-page");
            }}
          />
        ) : null;

      case "solution-page":
        return (
          <SolutionsPage 
            questions={currentExamQuestions}
            savedAnswers={savedAnswers}
            onBack={() => setActivePage("final-result-page")}
          />
        );

      case "global-leaderboard-page":
        return <LeaderboardPage />;

      case "profile-page":
        return (
          <ProfilePage 
            user={user}
            onUpdateUser={setUser}
            stats={{
              totalPoints: user.todayPoints || 0,
              totalExams: currentStats.totalExams,
              accuracy: currentStats.accuracy,
              bestScore: currentStats.bestScore,
              bestRank: currentStats.bestRank,
              totalCourses: currentStats.totalCourses
            }}
            resultsHistory={resultsHistory}
            onSignOut={handleSignOut}
            courses={mergedCourses}
          />
        );

      case "admin-settings-page":
        return (
          <AdminSettingsPage
            onBack={() => setActivePage("home-page")}
            courses={mergedCourses}
            currentLimit={questionLimit}
            onUpdateLimit={(limit) => setQuestionLimit(limit)}
          />
        );

      case "routine-page":
        return (
          <RoutinePage
            courses={mergedCourses}
            customFiles={[]}
            onBack={() => setActivePage("home-page")}
          />
        );

      default:
        return <div className="text-center py-10">Page not found.</div>;
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      
      {/* Dynamic Slide Drawer Menu */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={(id) => setActivePage(id)}
        isPremium={user.premium}
      />

      {/* Main Routed View */}
      <main className="w-full">
        {renderActivePage()}
      </main>

      {/* Persistent Bottom Nav Tab rails */}
      {activePage !== "mcq-page" && (
        <BottomNav 
          activePage={activePage}
          onNavigate={(id) => setActivePage(id)}
        />
      )}

      {/* Premium Lock Popup Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onConfirm={() => {
          setUser((prev) => prev ? { ...prev, premium: true, role: "premium" } : null);
          setIsPremiumModalOpen(false);
          alert("🎉 অভিনন্দন! আপনি সফলভাবে প্রিমিয়াম মেম্বারশিপে আপগ্রেড করেছেন।");
        }}
      />
    </div>
  );
}
