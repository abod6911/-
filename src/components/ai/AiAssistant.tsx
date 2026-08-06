import { useEffect, useRef, useState } from "react";
import { Bot, ChevronLeft, ChevronRight, Globe, MapPin, Send, Sparkles, Wand2, X } from "lucide-react";
import { getPlace, places, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";
import { checkContent } from "@/lib/moderation";
import {
  processAssistantMessage,
  type AssistantResponse,
  type ValidatedPlan,
} from "@/lib/hybrid-ai";

interface AiChatMessage {
  id: string;
  sender: "ai" | "user";
  response?: AssistantResponse;
  text?: string;
}

export function AiAssistant() {
  const { t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ValidatedPlan | null>(null);

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
    ? "أهلاً وسهلاً بك في مساعد جِدّاو! 🤖 أنا جاهز لمساعدتك في التخطيط لطلعتك أو البحث عن أفضل كافيهات ومطاعم جدة."
    : "Welcome to JEDDAW Assistant! 🤖 How can I help you plan your outing or discover spots in Jeddah?";

  const initialAiMsg: AiChatMessage = {
    id: "1",
    sender: "ai",
    response: {
      type: "message",
      message: welcomeText,
      suggestedReplies: isRtl
        ? ["خطة عائلية بالبلد 🏛️", "طلعة روقان وعشاء بحري 🌊", "ألعاب وكارتينج شباب 🏎️"]
        : ["Balad Family Outing 🏛️", "Sea View & Sunset Dinner 🌊", "Karting & Youth Action 🏎️"],
      plan: null,
    },
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([initialAiMsg]);
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

    const userMsg: AiChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 1. Run Content Moderation Check
    const modResult = await checkContent(userText);
    if (!modResult.allowed) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          response: {
            type: "clarification",
            message: isRtl ? modResult.messageAr : modResult.messageEn,
            plan: null,
          },
        },
      ]);
      return;
    }

    // 2. Intent Routing & Assistant Message Processor
    try {
      const response = await processAssistantMessage({
        message: userText,
        currentPlan,
        conversationHistory: messages,
      });

      setIsTyping(false);

      // Update active plan state ONLY if intent is plan and validated is true
      if (response.type === "plan" && response.plan?.validated) {
        setCurrentPlan(response.plan);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          response,
        },
      ]);
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          response: {
            type: "error",
            message: isRtl
              ? "عذراً، لم أستطع فهم الرسالة. هل تود البحث عن مكان أو إنشاء خطة طلعة؟"
              : "Sorry, I didn't get that. Would you like to search places or build an outing plan?",
            plan: null,
          },
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
                    {isRtl ? "مساعد جِدّاو الذكي" : "JEDDAW AI Assistant"}
                  </h2>
                  <p className="text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {isRtl ? "موجه بالنية والتحقق الصارم — 0 تخمين" : "Intent router backed — 0 guesswork"}
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
                  {/* User Message Bubble */}
                  {msg.sender === "user" ? (
                    <div className="max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm bg-[#C96745] text-white rounded-br-none">
                      {msg.text}
                    </div>
                  ) : (
                    /* AI Response Bubble */
                    <div className="max-w-[88%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm bg-white dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-bl-none">
                      {msg.response?.message}

                      {/* Render Places list if type is place_results */}
                      {msg.response?.type === "place_results" && msg.response.places && (
                        <div className="mt-3 space-y-2 border-t border-[#E2D3BE] dark:border-white/10 pt-3">
                          {msg.response.places.map((place) => (
                            <div
                              key={place.id}
                              onClick={() => setSelectedPlace(place)}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1A2221] border border-[#E2D3BE]/60 dark:border-white/10 hover:border-[#C96745] transition-all cursor-pointer"
                            >
                              <img
                                src={place.image}
                                alt={place.nameAr}
                                className="h-10 w-10 rounded-lg object-cover shrink-0"
                              />
                              <div className="flex-1 truncate">
                                <div className="text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] truncate">
                                  {isRtl ? place.nameAr : place.nameEn}
                                </div>
                                <div className="text-[10px] text-[#397C78] dark:text-[#5EAAA5] font-semibold">
                                  {place.categoryAr} · {place.pricePerPerson} {isRtl ? "ر.س" : "SAR"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* STRICT CONDITION: Plan Card renders ONLY when type === 'plan' AND validated === true */}
                      {msg.response?.type === "plan" &&
                        msg.response.plan &&
                        msg.response.plan.validated === true && (
                          <div className="mt-4 pt-3 border-t border-[#E2D3BE] dark:border-white/10">
                            <div className="flex items-center justify-between font-black text-sm text-[#C96745]">
                              <span>{isRtl ? msg.response.plan.titleAr : msg.response.plan.titleEn}</span>
                              <span className="text-xs bg-[#C96745]/15 px-2.5 py-1 rounded-full text-[#C96745]">
                                ⏱️ {msg.response.plan.totalDurationMinutes} {isRtl ? "دقيقة" : "min"}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2.5">
                              {msg.response.plan.stops.map((stop, i) => {
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
                              <span>{msg.response.plan.estimatedCostMin} - {msg.response.plan.estimatedCostMax} {isRtl ? "ر.س" : "SAR"}</span>
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Follow-up Suggested Action Chips */}
                  {msg.sender === "ai" &&
                    msg.response?.suggestedReplies &&
                    msg.response.suggestedReplies.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                        {msg.response.suggestedReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(reply)}
                            className="rounded-full bg-white dark:bg-[#253230] px-3 py-1.5 text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/15 hover:border-[#C96745] hover:text-[#C96745] transition-all cursor-pointer shadow-sm"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] bg-white dark:bg-[#253230] p-3 rounded-2xl w-fit border border-[#E2D3BE] dark:border-white/10 shadow-sm animate-pulse">
                  <Bot className="h-4 w-4 text-[#C96745] animate-spin" />
                  <span>{isRtl ? "جاري تحليل نية الطلب واستخراج الرد..." : "Analyzing intent & processing..."}</span>
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
                      ? "اكتب رسالتك هنا (مثلاً: رتب لي طلعة، كافيه بالروضة)..."
                      : "Type your message (e.g. build a plan, cafes in Rawdah)..."
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
