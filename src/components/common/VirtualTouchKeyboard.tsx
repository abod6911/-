import React, { memo } from "react";
import { Delete, Space, X } from "lucide-react";

const ARABIC_KEYS_ROW1 = ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "هـ", "خ", "ح", "ج"];
const ARABIC_KEYS_ROW2 = ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"];
const ARABIC_KEYS_ROW3 = ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"];

export const VirtualTouchKeyboard = memo(function VirtualTouchKeyboard({
  onKeyPress,
  onBackspace,
  onSpace,
  onClose,
}: {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#121817] border-t-2 border-[#C96745] p-2.5 shadow-2xl safe-area-bottom animate-slide-up">
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 border-b border-white/10 text-xs font-bold text-[#E4A23B]">
        <span className="flex items-center gap-1.5">
          <span>🎹 كيبورد اللمس الفوري (بدون تعليق الجوال)</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded-xl bg-[#C96745] text-white hover:bg-[#b55837] text-xs font-extrabold transition-colors cursor-pointer"
        >
          إغلاق ✕
        </button>
      </div>

      <div className="space-y-1.5 dir-rtl text-center max-w-lg mx-auto">
        <div className="flex justify-center gap-1">
          {ARABIC_KEYS_ROW1.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKeyPress(k)}
              className="h-11 flex-1 max-w-[36px] rounded-xl bg-[#222826] active:bg-[#C96745] text-white text-base font-black shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-1">
          {ARABIC_KEYS_ROW2.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKeyPress(k)}
              className="h-11 flex-1 max-w-[36px] rounded-xl bg-[#222826] active:bg-[#C96745] text-white text-base font-black shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-1">
          {ARABIC_KEYS_ROW3.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKeyPress(k)}
              className="h-11 flex-1 max-w-[36px] rounded-xl bg-[#222826] active:bg-[#C96745] text-white text-base font-black shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 pt-1.5">
          <button
            type="button"
            onClick={onSpace}
            className="h-11 flex-1 rounded-xl bg-[#2D3836] text-white text-xs font-extrabold flex items-center justify-center gap-1 active:bg-[#C96745] cursor-pointer"
          >
            <Space className="h-4 w-4 text-[#E4A23B]" /> مسافة
          </button>

          <button
            type="button"
            onClick={onBackspace}
            className="h-11 w-16 rounded-xl bg-[#B84E4E]/30 text-red-300 text-xs font-extrabold flex items-center justify-center active:bg-[#B84E4E] active:text-white cursor-pointer"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});
