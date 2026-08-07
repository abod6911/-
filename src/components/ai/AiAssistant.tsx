import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bot, ChevronLeft, Send, Sparkles, Wand2, X } from "lucide-react";
import { getPlace, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";
import { checkContent } from "@/lib/moderation";
import {
  processMasterAssistantMessage,
  type AssistantResponse,
} from "@/lib/hybrid-ai";
import { type GeneratedPlan } from "@/lib/plan-builder";

interface AiChatMessage {
  id: string;
  sender: "ai" | "user";
  response?: AssistantResponse;
  text?: string;
}

export function AiAssistant() {
  const { isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);

  const welcomeText = isRtl
    ? "أهلاً بك في جِدّاو! 🌊 أنا هنا لمساعدتك في ترتيب أحلى طلعة في جدة أو اكتشاف كافيهات ومطاعم مميزة ومجربة."
    : "Welcome to JEDDAW! 🌊 I'm here to help you plan an amazing outing or discover top places in Jeddah.";

  const initialAiMsg: AiChatMessage = {
    id: "1",
    sender: "ai",
    response: {
      type: "message",
      message: welcomeText,
      suggestedReplies: isRtl
        ? ["خطة عائلية بالبلد 🏛️", "طلعة روقان وعشاء بحري 🌊", "ألعاب وكارتينج شباب 🏎️", "البحث عن كافيهات وأماكن ☕"]
        : ["Balad Family Outing 🏛️", "Sea View & Sunset Dinner 🌊", "Karting & Youth Action 🏎️", "Search Cafes & Places ☕"],
      plan: null,
    },
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([initialAiMsg]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // NO scrollIntoView! Only scroll the inner messages container directly.
  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
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

    // 1. Content Moderation Check
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

    // 2. Intent Routing & Assistant Processor
    try {
      const response = await processMasterAssistantMessage({
        message: userText,
        currentPlan,
        conversationHistory: messages,
      });

      setIsTyping(false);

      if ((response.type === "plan" || response.type === "plan_update") && response.plan?.validated) {
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
      {/* FLAGSHIP ULTRA-PREMIUM INTERACTIVE AI WIDGET LAUNCHER */}
      <div className="ai-launcher fixed bottom-[74px] sm:bottom-20 lg:bottom-6 end-3 sm:end-6 z-40 flex items-center gap-2.5 group pointer-events-auto">
        
        {/* Hover/Interactive Micro-Tooltip Bubble (Desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-[#091C1A]/95 text-white px-3.5 py-2 border border-white/20 shadow-2xl backdrop-blur-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          <Wand2 className="h-3.5 w-3.5 text-[#E4A23B] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-xs font-extrabold tracking-wide text-white/90">
            {isRtl ? "اسأل الذكاء الاصطناعي..." : "Ask JEDDAW AI..."}
          </span>
        </div>

        {/* Main Launcher Capsule Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#091C1A]/95 via-[#122A27]/95 to-[#091C1A]/95 p-2 pe-4 text-white shadow-[0_12px_40px_-6px_rgba(201,103,69,0.5)] hover:shadow-[0_16px_50px_-4px_rgba(201,103,69,0.7)] hover:scale-[1.04] active:scale-95 border border-[#C96745]/50 hover:border-[#FF9D7A]/90 backdrop-blur-2xl transition-transform duration-200 cursor-pointer overflow-hidden group"
          aria-label={isRtl ? "مساعد جِدّاو" : "JEDDAW Assistant"}
        >
          {/* AI Orb Icon Unit */}
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] p-0.5 shadow-lg shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#091C1A]/90 backdrop-blur-sm text-white transition-transform duration-300 group-hover:rotate-12">
              <Bot className="h-5 w-5 text-[#FF9D7A]" />
            </div>
            <span className="absolute top-0 end-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#091C1A]" />
            </span>
          </div>

          {/* Label Stack */}
          <div className="flex flex-col text-start me-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white drop-shadow-sm leading-none">
                {isRtl ? "مساعد جِدّاو" : "JEDDAW AI"}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-white/75 flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3 text-[#E4A23B] animate-pulse" />
              <span>{isRtl ? "اقتراحات ذكية لاكتشاف جدة" : "Smart suggestions"}</span>
            </span>
          </div>
        </button>
      </div>

      {/* Radix Dialog Modal Sheet - Mounted at Document Body via Portal */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 animate-fade-in" />
          <Dialog.Content className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 outline-none">
            <div className="mobile-visual-viewport-sheet sm:!static surface-card flex h-[var(--vv-height,90vh)] sm:!h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[#E2D3BE] dark:border-white/10 bg-[#FAF6F0] dark:bg-[#1C2422] shadow-2xl">
              
              <Dialog.Title className="sr-only">
                {isRtl ? "مساعد جِدّاو" : "JEDDAW Assistant"}
              </Dialog.Title>

              {/* Header - Fixed Non-scrolling */}
              <div className="flex items-center justify-between border-b border-[#E2D3BE]/60 dark:border-white/10 bg-[#F4EBDD] dark:bg-[#161B1A] px-5 py-4 flex-none">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-md ring-2 ring-[#C96745]/30">
                    <Bot className="h-5 w-5" />
                    <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161B1A]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#252A28] dark:text-[#F5F1E8]">
                      {isRtl ? "مساعد جِدّاو" : "JEDDAW Assistant"}
                    </h2>
                    <p className="text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="h-3 w-3 text-[#E4A23B]" />
                      {isRtl ? "اقتراحات ذكية لاكتشاف جدة" : "Smart suggestions for discovering Jeddah"}
                    </p>
                  </div>
                </div>
                <Dialog.Close className="rounded-full p-2 text-[#6E716C] dark:text-[#B5B8B2] hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer" aria-label={isRtl ? "إغلاق" : "Close"}>
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              {/* Chat Body - Flex-1 Scrollable Container (NO scrollIntoView!) */}
              <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* User Message Bubble */}
                    {msg.sender === "user" ? (
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm bg-gradient-to-r from-[#C96745] to-[#D97757] text-white rounded-br-none">
                        {msg.text}
                      </div>
                    ) : (
                      /* AI Response Bubble */
                      <div className="max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm bg-white dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE]/80 dark:border-white/10 rounded-bl-none">
                        <div className="whitespace-pre-line leading-relaxed">{msg.response?.message}</div>

                        {/* Render Places list if type is place_results */}
                        {msg.response?.type === "place_results" && msg.response.places && (
                          <div className="mt-3 space-y-2 border-t border-[#E2D3BE]/50 dark:border-white/10 pt-3">
                            {msg.response.places.map((place) => (
                              <div
                                key={place.id}
                                onClick={() => setSelectedPlace(place)}
                                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#1A2221] border border-[#E2D3BE]/60 dark:border-white/10 hover:border-[#C96745] hover:shadow-md transition-all cursor-pointer group"
                              >
                                <img
                                  src={place.image}
                                  alt={place.nameAr}
                                  className="h-11 w-11 rounded-xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-1 truncate">
                                  <div className="text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] truncate">
                                    {isRtl ? place.nameAr : place.nameEn}
                                  </div>
                                  <div className="text-[10px] text-[#397C78] dark:text-[#5EAAA5] font-semibold mt-0.5 flex items-center gap-2">
                                    <span>{place.categoryAr}</span>
                                    <span>•</span>
                                    <span>{place.pricePerPerson} {isRtl ? "ر.س" : "SAR"}</span>
                                  </div>
                                </div>
                                <ChevronLeft className="h-4 w-4 text-[#C96745] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Plan Card */}
                        {(msg.response?.type === "plan" || msg.response?.type === "plan_update") &&
                          msg.response.plan &&
                          msg.response.plan.validated === true && (
                            <div className="mt-4 pt-3.5 border-t border-[#E2D3BE]/60 dark:border-white/10">
                              <div className="flex items-center justify-between font-black text-sm text-[#C96745] bg-[#C96745]/10 p-3 rounded-2xl border border-[#C96745]/20">
                                <span>{isRtl ? msg.response.plan.titleAr : msg.response.plan.titleEn}</span>
                                <span className="text-xs bg-[#C96745] text-white px-3 py-1 rounded-full font-bold shadow-sm">
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
                                      className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#1A2221] border border-[#E2D3BE]/60 dark:border-white/10 hover:border-[#C96745] hover:shadow-md transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-3">
                                        {p && (
                                          <img
                                            src={p.image}
                                            alt={p.nameAr}
                                            className="h-11 w-11 rounded-xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                                          />
                                        )}
                                        <div className="flex-1 truncate">
                                          <div className="flex items-center justify-between text-xs font-bold text-[#252A28] dark:text-[#F5F1E8]">
                                            <span className="truncate">{i + 1}. {p ? (isRtl ? p.nameAr : p.nameEn) : stop.placeId}</span>
                                            <span className="text-[10px] text-[#397C78] dark:text-[#5EAAA5] font-black bg-[#397C78]/10 px-2 py-0.5 rounded-full">
                                              {stop.arrivalTime}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-[#6E716C] dark:text-[#B5B8B2] truncate mt-1">
                                            💡 {isRtl ? stop.reasonAr : stop.reasonEn}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] bg-[#397C78]/10 p-2.5 rounded-xl border border-[#397C78]/20">
                                <span>💰 {isRtl ? "التكلفة التقديرية للفرد:" : "Estimated per person:"}</span>
                                <span className="text-xs font-black">{msg.response.plan.estimatedCostMin} - {msg.response.plan.estimatedCostMax} {isRtl ? "ر.س" : "SAR"}</span>
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Follow-up Suggested Action Chips */}
                    {msg.sender === "ai" &&
                      msg.response?.suggestedReplies &&
                      msg.response.suggestedReplies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 max-w-[95%]">
                          {msg.response.suggestedReplies.map((reply, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(reply)}
                              className="rounded-full bg-[#FAF6F0] dark:bg-[#253230] px-3.5 py-2 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/20 hover:border-[#C96745] dark:hover:border-[#C96745] hover:text-[#C96745] dark:hover:text-[#FF9D7A] hover:bg-[#C96745]/10 dark:hover:bg-[#C96745]/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                            >
                              <span>{reply}</span>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] bg-white dark:bg-[#253230] p-3.5 rounded-2xl w-fit border border-[#E2D3BE] dark:border-white/10 shadow-sm animate-pulse">
                    <Bot className="h-4 w-4 text-[#C96745] animate-spin" />
                    <span>{isRtl ? "جاري التفكير وتحليل أفضل الأماكن..." : "Analyzing best options..."}</span>
                  </div>
                )}
              </div>

              {/* Composer Input Bar - Fixed Bottom Non-scrolling */}
              <div className="border-t border-[#E2D3BE]/60 dark:border-white/10 bg-white dark:bg-[#161B1A] p-3 sm:p-4 flex-none">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    inputMode="search"
                    enterKeyHint="send"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isRtl
                        ? "اكتب طلبك (مثلاً: رتب لي طلعة، كافيهات بالروضة)..."
                        : "Type your request (e.g. plan an outing, cafes in Rawdah)..."
                    }
                    className="flex-1 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#253230] px-4 py-3 text-base sm:text-xs text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/70 focus:outline-none focus:border-[#C96745] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shrink-0"
                    aria-label={isRtl ? "إرسال" : "Send"}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </>
  );
}
