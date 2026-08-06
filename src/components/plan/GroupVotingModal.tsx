import React, { useState } from "react";
import { Check, Share2, ThumbsDown, ThumbsUp, Vote, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Place } from "@/data/jeddah";

interface GroupVotingModalProps {
  stops: Place[];
  onClose: () => void;
}

export function GroupVotingModal({ stops, onClose }: GroupVotingModalProps) {
  const { isRtl } = useLanguage();
  const [votes, setVotes] = useState<Record<string, { up: number; down: number }>>(() => {
    const initial: Record<string, { up: number; down: number }> = {};
    stops.forEach((s) => {
      initial[s.id] = { up: Math.floor(Math.random() * 4) + 2, down: 0 };
    });
    return initial;
  });

  const [userVoted, setUserVoted] = useState<Record<string, "up" | "down" | null>>({});

  const handleVote = (id: string, type: "up" | "down") => {
    const current = userVoted[id];
    setVotes((prev) => {
      const curVotes = { up: 0, down: 0, ...prev[id] };
      if (current === type) {
        // Toggle off
        curVotes[type] -= 1;
        setUserVoted((uv) => ({ ...uv, [id]: null }));
      } else {
        if (current) curVotes[current] -= 1;
        curVotes[type] += 1;
        setUserVoted((uv) => ({ ...uv, [id]: type }));
      }
      return { ...prev, [id]: curVotes };
    });
  };

  const handleSharePoll = () => {
    const pollText = `${isRtl ? "🗳️ تصويت الشلة على خطة الطلعة — جِدّاو" : "🗳️ Outing Group Poll — JEDDAW"}\n\n${stops
      .map(
        (s, i) =>
          `${i + 1}. ${isRtl ? s.nameAr : s.nameEn} (👍 ${votes[s.id]?.up || 0} | 👎 ${votes[s.id]?.down || 0})`
      )
      .join("\n")}\n\n🔗 ${isRtl ? "صوتوا لخياركم المفضل هنا:" : "Cast your votes here:"} https://jeddaw.sa`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(pollText)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-3xl shadow-2xl relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-[#EADECB] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-white text-2xl shadow-lift">
            🗳️
          </div>
          <h2 className="text-xl font-black">
            {isRtl ? "تصويت واستطلاع رأي الشلة 🗳️" : "Group Voting & Outing Poll 🗳️"}
          </h2>
          <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-0.5">
            {isRtl ? "صوّت على أماكن الطلعة وشارك رابط التصويت مع المجموعة" : "Vote on stops & share voting poll with your group"}
          </p>
        </div>

        {/* Stops Voting List */}
        <div className="space-y-3 mb-6">
          {stops.map((stop, i) => (
            <div
              key={stop.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#253230] border border-[#E2D3BE] dark:border-white/10 flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#397C78] text-xs font-black text-white shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                    {isRtl ? stop.nameAr : stop.nameEn}
                  </h4>
                  <p className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-0.5">
                    {isRtl ? stop.districtId : stop.districtId} · {stop.pricePerPerson} SAR
                  </p>
                </div>
              </div>

              {/* Vote Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleVote(stop.id, "up")}
                  className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                    userVoted[stop.id] === "up"
                      ? "bg-[#397C78] text-white shadow-sm"
                      : "bg-[#FAF6F0] dark:bg-[#1C2422] text-[#397C78] hover:bg-[#397C78]/15"
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{votes[stop.id]?.up || 0}</span>
                </button>

                <button
                  onClick={() => handleVote(stop.id, "down")}
                  className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                    userVoted[stop.id] === "down"
                      ? "bg-[#B84E4E] text-white shadow-sm"
                      : "bg-[#FAF6F0] dark:bg-[#1C2422] text-[#B84E4E] hover:bg-[#B84E4E]/15"
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  <span>{votes[stop.id]?.down || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSharePoll}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-xs font-black text-white shadow-lift hover:bg-[#20bd5a] transition-all min-h-[48px]"
        >
          <Share2 className="h-4 w-4" />
          {isRtl ? "مشاركة استطلاع التصويت مع الشلة على WhatsApp 📲" : "Share Group Poll on WhatsApp 📲"}
        </button>
      </div>
    </div>
  );
}
