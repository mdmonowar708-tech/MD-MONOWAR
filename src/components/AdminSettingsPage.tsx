import React, { useState } from "react";
import { 
  ArrowLeft, Plus, Edit, Trash2, Check, Settings, BookOpen, Layers, ShieldCheck, 
  RefreshCw 
} from "lucide-react";
import { db } from "../firebase";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Course } from "../types";

interface AdminSettingsPageProps {
  onBack: () => void;
  courses: Course[];
  currentLimit: number;
  onUpdateLimit: (limit: number) => void;
}

export default function AdminSettingsPage({ 
  onBack, 
  courses, 
  currentLimit,
  onUpdateLimit 
}: AdminSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "settings">("settings");
  
  // Category management states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [isSubmitCategoryLoading, setIsSubmitCategoryLoading] = useState(false);
  


  // Settings states
  const [customLimit, setCustomLimit] = useState<number>(currentLimit);
  const [isSaveLimitLoading, setIsSaveLimitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Handle Save Question Limit in Firestore
  const handleSaveQuestionLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customLimit < 1) {
      alert("প্রশ্ন লিমিট কমপক্ষে ১ হতে হবে।");
      return;
    }
    setIsSaveLimitLoading(true);
    setSuccessMsg("");
    try {
      // Save directly to settings/app_config document as question_limit
      await setDoc(doc(db, "settings", "app_config"), {
        question_limit: Number(customLimit),
        updatedAt: new Date()
      }, { merge: true });
      
      onUpdateLimit(Number(customLimit));
      setSuccessMsg("🎉 প্রশ্ন লিমিট সফলভাবে সেভ করা হয়েছে এবং ইউজারদের জন্য ইনস্ট্যান্টলি কার্যকর হয়েছে!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("error setting question limit:", err);
      alert(`লিমিট আপডেট করতে ব্যর্থ হয়েছে: ${err.message || err}`);
    } finally {
      setIsSaveLimitLoading(false);
    }
  };

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSubmitCategoryLoading(true);
    try {
      const generatedId = "course_" + Date.now().toString().slice(-6);
      await setDoc(doc(db, "courses", generatedId), {
        title: newCategoryName.trim(),
        createdAt: new Date()
      });
      setNewCategoryName("");
      alert("✅ ক্যাটাগরি সফলভাবে যোগ হয়েছে!");
    } catch (err: any) {
      console.error("add category error:", err);
      alert(`ক্যাটাগরি যোগ করতে ব্যর্থ হয়েছে: ${err.message || err}`);
    } finally {
      setIsSubmitCategoryLoading(false);
    }
  };

  // Handle Rename Category
  const startEditing = (id: string, currentTitle: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(currentTitle);
  };

  const handleUpdateCategoryName = async (id: string) => {
    if (!editingCategoryName.trim()) return;
    setIsSubmitCategoryLoading(true);
    try {
      await setDoc(doc(db, "courses", id), {
        title: editingCategoryName.trim()
      }, { merge: true });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      alert("✅ ক্যাটাগরি সফলভাবে এডিট হয়েছে!");
    } catch (err: any) {
      console.error("update category error:", err);
      alert(`ক্যাটাগরি এডিট করতে ব্যর্থ হয়েছে: ${err.message || err}`);
    } finally {
      setIsSubmitCategoryLoading(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${name}" ক্যাটাগরি নিষ্ক্রিয়/ডিলিট করতে চান?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "courses", id));
      alert("🗑️ ক্যাটাগরি সফলভাবে রিমুভ হয়েছে!");
    } catch (err: any) {
      console.error("delete category error:", err);
      alert(`ক্যাটাগরি রিমুভ করতে ব্যর্থ হয়েছে: ${err.message || err}`);
    }
  };



  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-neutral-100 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer text-neutral-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#00BFA6]" /> এডমিন কন্ট্রোল প্যানেল
          </h2>
          <p className="text-xs text-neutral-400 font-bold">ক্যাটাগরি এবং ফ্রি ইউজার প্রশ্ন লিমিট পরিবর্তন</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex bg-neutral-200/60 p-1 rounded-2xl mb-6 gap-1">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-2.5 text-center font-bold text-xs rounded-xl border-none cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "settings" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Settings className="h-3.5 w-3.5" /> প্রশ্ন লিমিট কন্ট্রোল
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 py-2.5 text-center font-bold text-xs rounded-xl border-none cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "categories" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> ক্যাটাগরি ম্যানেজার
        </button>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold leading-relaxed shadow-sm">
          {successMsg}
        </div>
      )}

      {/* SETTINGS VIEW */}
      {activeTab === "settings" && (
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.015)] space-y-6">
          <div className="text-center pb-4 border-b border-neutral-50">
            <h3 className="text-base font-extrabold text-neutral-800">ফ্রি ইউজার Daily Question Limit</h3>
            <p className="text-xs text-neutral-400 font-semibold mt-1">ফ্রি ইউজাররা প্রতিদিন সর্বোচ্চ কয়টি প্রশ্ন প্র্যাকটিস করতে পারবে</p>
          </div>

          <form onSubmit={handleSaveQuestionLimit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-500 block mb-2">প্রতিদিনের প্রশ্ন প্র্যাকটিস সীমাঃ</label>
              <div className="relative">
                <input
                  type="number"
                  value={customLimit}
                  onChange={(e) => setCustomLimit(Number(e.target.value))}
                  placeholder="যেমন: ৫, ১০, ২০"
                  className="w-full bg-neutral-50 border border-neutral-150 rounded-2xl py-3.5 px-4 text-sm font-extrabold focus:outline-none focus:border-[#00BFA6] transition-colors"
                />
                <span className="absolute right-4 top-3.5 text-xs text-neutral-400 font-bold">টি প্রশ্ন</span>
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 text-amber-800 text-xs leading-relaxed space-y-2">
              <p className="font-extrabold">💡 এটি কিভাবে কাজ করে?</p>
              <p className="font-semibold text-neutral-650">
                এখানে লিমিট সেট করে সেভ করার সাথে সাথে Firestore-এ এটি সেভ হবে। ইউজার অ্যাপ্লিকেশনে রিয়েলটাইম লিসেনার চালু থাকায় কোনো পেইজ রিফ্রেশ না করেই ফ্রি ইউজারদের এই নতুন লিমিটে প্রশ্ন প্র্যাকটিস করতে দেওয়া হবে।
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaveLimitLoading}
              className="w-full bg-[#00BFA6] hover:bg-[#009688] disabled:bg-neutral-300 font-extrabold py-3.5 rounded-2xl text-white cursor-pointer border-none text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {isSaveLimitLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> আপলোডিং সেটিংস...
                </>
              ) : (
                "সেটিংস সেভ করুন (Save Settings)"
              )}
            </button>
          </form>
        </div>
      )}

      {/* CATEGORIES VIEW */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Add Category Card */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-2xs">
            <h3 className="text-sm font-extrabold text-neutral-800 mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#00BFA6]" /> নতুন ক্যাটাগরি (Course) যোগ করুন
            </h3>
            
            <form onSubmit={handleAddCategory} className="flex gap-2.5">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="যেমন: প্রাইমারি শিক্ষক নিয়োগ প্রস্তুতি"
                className="flex-1 bg-neutral-50 border border-neutral-150 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#00BFA6] transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitCategoryLoading || !newCategoryName.trim()}
                className="bg-[#00BFA6] hover:bg-[#009688] disabled:opacity-40 font-bold px-4 rounded-xl text-white cursor-pointer border-none text-xs flex items-center gap-1 transition-all"
              >
                <Plus className="h-4 w-4" /> যোগ করুন
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-2xs">
            <h3 className="text-sm font-extrabold text-neutral-800 pb-3 border-b border-neutral-50 mb-3.5 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#00BFA6]" /> সমস্ত একটিভ ক্যাটাগরি সমূহ ({courses.length})
            </h3>

            <div className="space-y-3">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100/50 rounded-2xl border border-neutral-100 transition-colors"
                >
                  <div className="flex-1 mr-3">
                    {editingCategoryId === course.id ? (
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 bg-white border border-[#00BFA6] rounded-lg py-1 px-2.5 text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateCategoryName(course.id)}
                          className="p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white border-none cursor-pointer"
                          title="Save Changes"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">📘</span>
                        <span className="font-extrabold text-neutral-800 text-xs">{course.title}</span>
                      </div>
                    )}
                  </div>

                  {editingCategoryId !== course.id && (
                    <div className="flex items-center gap-1 text-neutral-400">
                      <button
                        onClick={() => startEditing(course.id, course.title)}
                        className="p-2 hover:bg-neutral-200/50 hover:text-[#00BFA6] rounded-xl transition-all border-none bg-transparent cursor-pointer"
                        title="Edit Course Category"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCategory(course.id, course.title)}
                        className="p-2 hover:bg-neutral-200/50 hover:text-rose-600 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                        title="Delete Course Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
