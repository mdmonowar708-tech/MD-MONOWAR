import React, { useState } from "react";
import { GraduationCap, ShieldCheck, Mail, Lock, User, CheckCircle2 } from "lucide-react";

interface AuthPageProps {
  onSignIn: (email: string) => Promise<void>;
  onSignUp: (name: string, email: string) => Promise<void>;
}

export default function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("monowar@gmail.com"); // default for swift developer preview
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Monowar Hossain");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("সব তথ্য পূরণ করুন!");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      if (isLogin) {
        await onSignIn(email);
      } else {
        if (!name) {
          setErrorMsg("পূর্ণ নাম পূরণ করুন!");
          setLoading(false);
          return;
        }
        await onSignUp(name, email);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Credential configuration check failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <div className="h-14 w-14 bg-[#00BFA6]/10 text-[#00BFA6] rounded-3xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            MCQ <span className="text-[#00BFA6]">HERO</span>
          </h2>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">
            Standard BCS & MCQ Prep Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-neutral-100 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.015)] space-y-6">
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMsg("");
              }}
              className={`flex-1 py-2.5 text-center font-bold text-xs rounded-xl border-none cursor-pointer transition-all ${
                isLogin ? "bg-[#00BFA6] text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMsg("");
              }}
              className={`flex-1 py-2.5 text-center font-bold text-xs rounded-xl border-none cursor-pointer transition-all ${
                !isLogin ? "bg-[#00BFA6] text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Register Candidate
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-550 block">পূর্ণ নাম (Full Name)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-450" />
                  <input
                    type="text"
                    required
                    placeholder="Monowar Hossain"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-150 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#00BFA6] transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-550 block">ইমেইল ঠিকানা (Email Address)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-450" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-150 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#00BFA6] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-550 block">পাসওয়ার্ড (Security Password)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-450" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-150 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#00BFA6] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00BFA6] hover:bg-[#009688] text-white font-extrabold py-3.5 rounded-2xl focus:outline-none transition-all shadow-sm cursor-pointer border-none text-xs uppercase tracking-wider disabled:opacity-55"
            >
              {loading ? "⏳ Processing Authentication..." : isLogin ? "Secure Login" : "Complete Registration"}
            </button>
          </form>

          {isLogin && (
            <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-2xl">
              <div className="flex gap-2 items-center text-sky-700 font-bold text-[10px] mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>DEMO CREDENTIAL TIP</span>
              </div>
              <p className="text-[10px] text-sky-600 font-semibold leading-relaxed">
                Clicking sign-in with the default form logs you straight into study simulation channels.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
