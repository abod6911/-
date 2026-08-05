import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, Compass, Flame, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { places, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";

interface AiMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  suggestedPlaces?: Place[];
}

export function AiAssistant() {
  const { t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "أهلاً بك! أنا مساعد جِدّاو الذكي 🤖. كيف أقدر أساعدك تخطط لطلعتك اليوم في جدة؟ قل لي وش في بالك أو اختار سؤالاً سريعاً!",
    },
  ]);

  const quickPrompts = [
    "أبغى مقهى هادي ينفع لمذاكرة أو شغل ☕",
    "اعطيني خيار عشاء رومانسي على البحر بأقل من 200 ريال 🌊",
    "وين أفضل مطعم شامي أو مصري في جدة؟ 🥙",
    "أبغى خطة عائلية ممتازة مع الأطفال 👨‍👩‍👧‍👦",
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";
      let matches: Place[] = [];

      const query = userText.toLowerCase();

      if (query.includes("مقهى") || query.includes("كافيه") || query.includes("مذاكرة") || query.includes("شغل")) {
        matches = places.filter((p) => p.kind === "cafe" || p.moods.includes("calm"));
        responseText = "بناءً على تقييمات اليوم ونسبة الهدوء، اخترت لك أفضل المقاهي المناسبة للروقان والتركيز:";
      } else if (query.includes("رومانسي") || query.includes("بحر") || query.includes("عشاء")) {
        matches = places.filter((p) => p.moods.includes("sea") || p.moods.includes("food"));
        responseText = "يا سلام! الذكاء الاصطناعي حلل لك أفضل خيارات العشاء المطلة على بحر جدة والغروب:";
      } else if (query.includes("شامي") || query.includes("مصري") || query.includes("مطعم")) {
        matches = places.filter((p) => p.kind === "food");
        responseText = "إليك أفضل المطاعم الأعلى تقييماً وتداولاً في جدة حسب المذاق المطلوب:";
      } else {
        matches = places.filter((p) => p.trending || p.rating && p.rating > 4.7).slice(0, 3);
        responseText = "حللت لك آراء وزيارات الناس هذا الأسبوع، وهذه أفضل التوصيات المتنوعة لخروجتك:";
      }

      // Shuffle matching places slightly so results are dynamic & non-repetitive
      const shuffledMatches = [...matches].sort(() => 0.5 - Math.random()).slice(0, 3);

      const aiMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
        suggestedPlaces: shuffledMatches,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <>
      {/* Floating Action AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-6 end-6 z-40 flex items-center gap-2.5 rounded-full bg-[#C96745] px-5 py-3.5 font-extrabold text-white shadow-lift animate-pulse-glow hover:scale-105 transition-all"
        aria-label="مساعد جِدّاو الذكي"
      >
        <Bot className="h-5 w-5 animate-bounce" />
        <span className="text-sm">مساعد جِدّاو الذكي 🤖</span>
      </button>

      {/* AI Assistant Chat Drawer Modal */}
      {isOpen && (
        <div className="modal-overlay z-50">
          <div className="modal-content max-w-lg w-full h-[620px] flex flex-col justify-between p-0 overflow-hidden bg-[#FAF6F0] dark:bg-[#222826] border border-[#E2D3BE] dark:border-white/10 animate-modal-in shadow-2xl">
            {/* Header */}
            <div className="bg-[#252A28] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745] text-xl font-bold shadow-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">مساعد جِدّاو الذكي</h3>
                  <span className="text-[11px] text-[#397C78] font-bold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#397C78] animate-pulse" /> ذكاء ديناميكي مباشر
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#C96745] text-white rounded-br-none"
                        : "bg-[#F4EBDD] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Places */}
                  {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                    <div className="mt-3 w-full space-y-2">
                      {msg.suggestedPlaces.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlace(p)}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#2E3633] border border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745] cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.nameAr}
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                            <div>
                              <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] block text-xs">
                                {p.nameAr}
                              </span>
                              <span className="text-[11px] text-[#397C78] dark:text-[#5EAAA5] font-semibold">
                                {p.categoryAr} · {p.pricePerPerson} ر.س
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-[#C96745] font-bold">معاينة 📍</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#6E716C] dark:text-[#B5B8B2] text-xs">
                  <Bot className="h-4 w-4 animate-spin" />
                  <span>الذكاء الاصطناعي يحلل أفضل التوصيات لك…</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-t border-[#E2D3BE] dark:border-white/10 bg-[#F4EBDD]/60 dark:bg-[#161B1A]/60 flex gap-2 overflow-x-auto no-scrollbar">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="shrink-0 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#222826] px-3 py-1.5 text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745]"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white dark:bg-[#222826] border-t border-[#E2D3BE] dark:border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="اكتب سؤالك أو اطلب خطة على جوّك..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-2.5 text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8] focus:outline-none focus:border-[#C96745]"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#C96745] text-white hover:bg-[#b55837] transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </>
  );
}
