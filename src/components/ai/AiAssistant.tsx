import { useEffect, useRef, useState } from "react";
import { Bot, ChevronLeft, ChevronRight, Globe, MapPin, Send, Sparkles, Wand2, X } from "lucide-react";
import { getPlace, places, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";
import { checkContent } from "@/lib/moderation";
import { sendHybridAiQuery, type StructuredPlan } from "@/lib/hybrid-ai";

interface AiMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  suggestedPlaces?: Place[];
  plan?: StructuredPlan;
  suggestedActions?: string[];
}

export function AiAssistant() {
  const { t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Body scroll lock effect when assistant modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen]);

  const welcomeText = isRtl
    ? "أهلاً وسهلاً بك في مساعد جِدّاو الهجين! 🤖 أنا جاهز لمساعدتك في التخطيط لطلعتك المثالية في جدة (مطاعم، كافيهات، شواطئ، ومغامرات) مع حماية 100% من تخمين الأسعار أو الأماكن."
    : "Welcome to JEDDAW's Hybrid AI Assistant! 🤖 I can build verified itineraries in Jeddah with 0 hallucinations.";

  const initialAiMsg: AiMessage = {
    id: "1",
    sender: "ai",
    text: welcomeText,
    suggestedActions: isRtl
      ? ["خطة عائلية بالبلد 🏛️", "طلعة روقان وعشاء بحري 🌊", "ألعاب وكارتينج شباب 🏎️"]
      : ["Balad Family Outing 🏛️", "Sea View & Sunset Dinner 🌊", "Karting & Youth Action 🏎️"],
  };

  const [messages, setMessages] = useState<AiMessage[]>([initialAiMsg]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const userText = customText || input;
    if (!userText.trim()) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 1. Run Multilingual Content Moderation Engine
    const modResult = await checkContent(userText);
    if (!modResult.allowed) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: isRtl ? modResult.messageAr : modResult.messageEn,
        },
      ]);
      return;
    }

    // 2. Invoke Hybrid AI Engine (Supabase Edge Function + Gemini + Deterministic Engine)
    try {
      const aiResponse = await sendHybridAiQuery(userText, messages);
      setIsTyping(false);

      const responsePlaces: Place[] = [];
      if (aiResponse.plan && aiResponse.plan.stops) {
        aiResponse.plan.stops.forEach((stop) => {
          const p = getPlace(stop.placeId);
          if (p) responsePlaces.push(p);
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiResponse.assistantMessage,
          suggestedPlaces: responsePlaces.length > 0 ? responsePlaces : undefined,
          plan: aiResponse.plan,
          suggestedActions: aiResponse.suggestedActions || [
            isRtl ? "خلّها أرخص 💰" : "Make it cheaper",
            isRtl ? "قرّب الأماكن 📍" : "Closer places",
            isRtl ? "بدّل المطعم 🍽️" : "Swap restaurant",
            isRtl ? "أضف كافيه ☕" : "Add cafe",
          ],
        },
      ]);
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: isRtl
            ? "عذراً، حدث خطأ أثناء تجهيز الخطة. يمكنك تجربة اختيار محطة أخرى أو إعادة المحاولة."
            : "Sorry, an error occurred while building the plan. Please try again.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 end-5 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] p-3.5 text-white shadow-2xl hover:scale-105 transition-all animate-pulse-glow lg:bottom-6 cursor-pointer"
        aria-label={isRtl ? "مساعد جِدّاو الذكي" : "JEDDAW AI Assistant"}
      >
        <Bot className="h-6 w-6 animate-bounce" />
        <span className="hidden text-xs font-black md:inline-block">
          {isRtl ? "مساعد جِدّاو الذكي" : "JEDDAW AI"}
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#E2D3BE] dark:border-white/10 bg-[#FAF6F0] dark:bg-[#1C2422] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2D3BE] dark:border-white/10 bg-[#F4EBDD] dark:bg-[#161B1A] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745] text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#252A28] dark:text-[#F5F1E8]">
                    {isRtl ? "مساعد جِدّاو الهجين (Hybrid AI)" : "JEDDAW Hybrid AI Assistant"}
                  </h2>
                  <p className="text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {isRtl ? "مدمج بقاعدة بيانات جِدّاو المعتمدة — 0 تخمين" : "Verified database backed — 0 hallucinations"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[#6E716C] dark:text-[#B5B8B2] hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#C96745] text-white rounded-br-none"
                        : "bg-white dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-bl-none"
                    }`}
                  >
                    {msg.text}

                    {/* Structured Plan Rendering */}
                    {msg.plan && (
                      <div className="mt-4 pt-3 border-t border-[#E2D3BE] dark:border-white/10">
                        <div className="flex items-center justify-between font-black text-sm text-[#C96745]">
                          <span>{isRtl ? msg.plan.titleAr : msg.plan.titleEn}</span>
                          <span className="text-xs bg-[#C96745]/15 px-2.5 py-1 rounded-full text-[#C96745]">
                            ⏱️ {msg.plan.totalDurationMinutes} {isRtl ? "دقيقة" : "min"}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2.5">
                          {msg.plan.stops.map((stop, i) => {
                            const p = getPlace(stop.placeId);
                            return (
                              <div
                                key={i}
                                onClick={() => p && setSelectedPlace(p)}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1A2221] border border-[#E2D3BE]/60 dark:border-white/10 hover:border-[#C96745] transition-all cursor-pointer"
                              >
                                {p && (
                                  <img
                                    src={p.image}
                                    alt={p.nameAr}
                                    className="h-10 w-10 rounded-lg object-cover shrink-0"
                                  />
                                )}
                                <div className="flex-1 truncate">
                                  <div className="flex items-center justify-between text-xs font-bold text-[#252A28] dark:text-[#F5F1E8]">
                                    <span className="truncate">{i + 1}. {p ? (isRtl ? p.nameAr : p.nameEn) : stop.placeId}</span>
                                    <span className="text-[10px] text-[#397C78] dark:text-[#5EAAA5]">{stop.arrivalTime}</span>
                                  </div>
                                  <div className="text-[10px] text-[#6E716C] dark:text-[#B5B8B2] truncate">
                                    {isRtl ? stop.reasonAr : stop.reasonEn}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] bg-[#397C78]/10 p-2 rounded-lg">
                          <span>💰 {isRtl ? "التكلفة التقديرية للفرد:" : "Estimated per person:"}</span>
                          <span>{msg.plan.estimatedCostMin} - {msg.plan.estimatedCostMax} {isRtl ? "ر.س" : "SAR"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Follow-up Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action)}
                          className="rounded-full bg-white dark:bg-[#253230] px-3 py-1.5 text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/15 hover:border-[#C96745] hover:text-[#C96745] transition-all cursor-pointer shadow-sm"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] bg-white dark:bg-[#253230] p-3 rounded-2xl w-fit border border-[#E2D3BE] dark:border-white/10 shadow-sm animate-pulse">
                  <Bot className="h-4 w-4 text-[#C96745] animate-spin" />
                  <span>{isRtl ? "جاري المطابقة مع قاعدة البيانات المعتمدة..." : "Matching with verified database..."}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-[#E2D3BE] dark:border-white/10 bg-white dark:bg-[#161B1A] p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isRtl
                      ? "اكتب مودك أو اطلب تعديل الخطة (مثلاً: خلّها أرخص)..."
                      : "Type your mood or request plan edit..."
                  }
                  className="flex-1 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#253230] px-4 py-2.5 text-xs text-[#252A28] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#C96745]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#C96745] text-white shadow-lift hover:bg-[#b55837] disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </>
  );
}
