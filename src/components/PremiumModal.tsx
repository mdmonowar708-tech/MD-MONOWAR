import React from "react";
import { Lock } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PremiumModal({ isOpen, onClose, onConfirm }: PremiumModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="w-18 h-18 rounded-full bg-amber-50 flex items-center justify-center text-[32px]">
            🔒
          </div>
        </div>

        <h3 className="text-2xl font-black text-neutral-800 mb-3.5 tracking-tight flex items-center justify-center gap-1.5">
          Premium Exam
        </h3>

        <p className="text-neutral-500 font-bold text-sm leading-relaxed mb-7 px-2">
          এই পরীক্ষাটি Premium সদস্যদের জন্য। <br />
          Premium কিনলে সকল Premium Exam, Premium Question Bank এবং Detailed Analysis পাবেন।
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-[#00BFA6] hover:bg-[#00a38e] active:scale-[0.99] transition-all text-white font-black py-4 px-4 rounded-2xl border-none cursor-pointer text-sm shadow-xs"
          >
            Premium কিনুন
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-[#E5E7EB] hover:bg-neutral-200 active:scale-[0.99] transition-all text-neutral-600 font-black py-4 px-4 rounded-2xl border-none cursor-pointer text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
