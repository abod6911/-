import { useEffect, useRef, useState } from "react";
import { Bot, Globe, Send, Sparkles, X } from "lucide-react";
import { places, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";
import { checkContent } from "@/lib/moderation";

interface AiMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  suggestedPlaces?: Place[];
  actionLink?: { label: string; url: string } | undefined;
}

// Broad pattern for insults / bad words / nonsense in AR & EN
const OFFENSIVE_PATTERN =
  /(غبي|أحمق|فاشل|حقير|زفت|سخيف|حمار|حيوان|قذر|شتم|سافل|منحط|كل زق|أحا|تفه|خراء|stupid|dumb|idiot|fool|useless|rubbish|crap|shit|bitch|bastard)/i;

// Pattern for simple friendly greetings
const GREETING_PATTERN =
  /^(هلا|مرحبا|مرحباً|أهلا|أهلاً|سلام|السلام عليكم|صباح الخير|مساء الخير|hi|hello|hey|greetings|good morning|good evening)$/i;

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
    ? "أهلاً وسهلاً بك في جِدّاو! 🤖 أنا مساعدك الذكي لتخطيط أحلى الطلعات في جدة. اسألني بالعربي أو بالإنكليزي عن الأماكن، المطاعم، الكافيهات، الفنادق، أو كيف ترتّب يومك حسب ميزانيتك ووقتك!"
    : "Welcome to JEDDAW! 🤖 I am your smart AI assistant for planning the best outings in Jeddah. Ask me in Arabic or English about restaurants, cafes, hotels, beaches, or how to plan your day!";

  const initialAiMsg: AiMessage = {
    id: "1",
    sender: "ai",
    text: welcomeText,
  };

  const [messages, setMessages] = useState<AiMessage[]>([initialAiMsg]);

  // Update initial message when language changes if no custom messages yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: "1",
            sender: "ai",
            text: isRtl
              ? "أهلاً وسهلاً بك في جِدّاو! 🤖 أنا مساعدك الذكي لتخطيط أحلى الطلعات في جدة. اسألني بالعربي أو بالإنكليزي عن الأماكن، المطاعم، الكافيهات، الفنادق، أو كيف ترتّب يومك حسب ميزانيتك ووقتك!"
              : "Welcome to JEDDAW! 🤖 I am your smart AI assistant for planning the best outings in Jeddah. Ask me in Arabic or English about restaurants, cafes, hotels, beaches, or how to plan your day!",
          },
        ];
      }
      return prev;
    });
  }, [isRtl]);

  const quickPromptsAr = [
    "كيف أرتّب طلعة بضغطة واحدة؟ ⚡",
    "اعطيني خيار عشاء رومانسي على البحر 🌊",
    "وين أفضل مطعم شامي أو مصري في جدة؟ 🥙",
    "أبغى مقهى هادي ينفع لمذاكرة أو شغل ☕",
    "وش أفضل المنتجات والفنادق المطلة؟ 🏨",
  ];

  const quickPromptsEn = [
    "How to plan a complete trip instantly? ⚡",
    "Show me romantic sea view dinners 🌊",
    "Best coffee shops for working ☕",
    "Top 5-star hotels & sea resorts 🏨",
    "Famous places & shopping malls 🛍️",
  ];

  const quickPrompts = isRtl ? quickPromptsAr : quickPromptsEn;

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

    const modResult = await checkContent(userText);

    setTimeout(() => {
      let responseText = "";
      let matches: Place[] = [];
      let actionLink: { label: string; url: string } | undefined = undefined;

      const q = userText.toLowerCase().trim();
      const isEnglishInput = /[a-z]/i.test(q) && !/[\u0600-\u06FF]/.test(q);

      // 0. Check content moderation result
      if (!modResult.allowed) {
        responseText = isRtl ? modResult.messageAr : modResult.messageEn;
      }
      // 1. Handle Insults / Offense / Rude Words gracefully with high intelligence
      else if (OFFENSIVE_PATTERN.test(q)) {
        if (isEnglishInput || !isRtl) {
          responseText =
            "Hello there! 💫 I am JEDDAW's AI Assistant, designed to help you discover the finest restaurants, cafes, sea spots, and outing plans in Jeddah politely & instantly. How can I assist you with your plans today?";
        } else {
          responseText =
            "أهلاً بك! 🌸 أنا مساعد جِدّاو الذكي، مخصص لخدمتك وتوجيهك لأجمل مطاعم، كافيهات، شواطئ، وخطط جدة بكل احترام وسرعة 💫. يسعدني جداً أن أساعدك في العثور على مكان رائع اليوم! عن ماذا تحب أن تسأل؟";
        }
      }
      // 2. Handle Simple Greetings without dumping random places
      else if (GREETING_PATTERN.test(q)) {
        if (isEnglishInput || !isRtl) {
          responseText =
            "Hello and welcome! 🌸 I'm delighted to assist you today. What kind of outing or places are you looking for in Jeddah? (e.g. Restaurants, Cafes, Sea views, Hotels, or Budget plans)";
        } else {
          responseText =
            "أهلاً وسهلاً بك! 🌸 شرفتني ونورتني. كيف أقدر أساعدك اليوم في تخطيط طلعتك في جدة؟ (مثلاً: مطاعم، كافيهات، إطلالة بحرية، فنادق، أو خطة الويكند)";
        }
      }
      // 3. Questions about JEDDAW or how to plan
      else if (
        q.includes("وش") ||
        q.includes("كيف") ||
        q.includes("خطة") ||
        q.includes("plan") ||
        q.includes("how")
      ) {
        responseText = isEnglishInput || !isRtl
          ? "With JEDDAW, planning your outing takes under 1 minute! Select your vibe, budget & district in the 'Quick Plan' tab, and we generate a complete itinerary with dining, coffee, and GPS route."
          : "مع جِدّاو، تخطيط طلعتك ما ياخذ دقيقة! حدّد ميزانيتك، وجوّكم، والحي المفضل في تبويب (سوّ لي خطة)، وجِدّاو يرتّب لك النشاط، المطعم، القهوة، والمسار كاملاً مع خرائط قوقل!";
        actionLink = {
          label: isRtl ? "سوّ خطتك الآن ⚡" : "Plan Your Outing Now ⚡",
          url: "/quick-plan",
        };
      }
      // 4. Dining / Restaurants / Food
      else if (
        q.includes("مطعم") ||
        q.includes("أكل") ||
        q.includes("عشاء") ||
        q.includes("غداء") ||
        q.includes("restaurant") ||
        q.includes("dine") ||
        q.includes("food")
      ) {
        matches = places.filter((p) => p.kind === "food");
        responseText = isEnglishInput || !isRtl
          ? "Here are top recommended dining spots in Jeddah:"
          : "إليك أعذّ وأفضل المطاعم المقترحة في جدة حسب ترشيحات جِدّاو المحترفة:";
      }
      // 5. Cafes & Coffee
      else if (
        q.includes("كافيه") ||
        q.includes("قهوة") ||
        q.includes("مقهى") ||
        q.includes("حلى") ||
        q.includes("cafe") ||
        q.includes("coffee")
      ) {
        matches = places.filter((p) => p.kind === "cafe");
        responseText = isEnglishInput || !isRtl
          ? "Here are top specialty cafes & dessert spots in Jeddah:"
          : "إليك أفضل الكافيهات والقهوة المختصة والمقاهي الهادئة بجدة:";
      }
      // 6. Hotels & Resorts
      else if (
        q.includes("فندق") ||
        q.includes("منتجع") ||
        q.includes("شاليه") ||
        q.includes("أبحر") ||
        q.includes("hotel") ||
        q.includes("resort")
      ) {
        matches = places.filter((p) => p.kind === "hotel" || p.kind === "resort");
        responseText = isEnglishInput || !isRtl
          ? "Here are top 5-star hotels & sea resorts in Jeddah & Obhur:"
          : "إليك أفخم الفنادق 5 نجوم ومنتجعات الشاطئ وأبحر الشمالية بجدة:";
      }
      // Default fallback
      else {
        matches = places.filter((p) => {
          const text = (p.nameAr + " " + p.nameEn + " " + p.categoryAr + " " + p.descAr).toLowerCase();
          return text.includes(q);
        });

        if (matches.length === 0) {
          matches = places.filter((p) => p.trending || (p.rating && p.rating >= 4.8)).slice(0, 3);
        }

        responseText = isEnglishInput || !isRtl
          ? "Here are top recommended places in Jeddah tailored for your request:"
          : "هذي أفضل الأماكن والترندات الموصى بها اليوم في جدة، وتقدر دائماً تخصيص بحثك بالحي أو الميزانية أو المود:";
      }

      const shuffledMatches = [...matches].sort(() => 0.5 - Math.random()).slice(0, 3);

      const aiMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
        suggestedPlaces: shuffledMatches,
        actionLink,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 end-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C96745] to-[#397C78] px-5 py-3 text-xs font-black text-white shadow-lift hover:scale-105 transition-all animate-pulse-glow border border-white/20 min-h-[48px]"
        aria-label={isRtl ? "مساعد جِدّاو الذكي" : "JEDDAW AI Assistant"}
      >
        <Bot className="h-5 w-5 animate-bounce" />
        <span className="hidden sm:inline">
          {isRtl ? "مساعد جِدّاو الذكي 🤖" : "JEDDAW AI Assistant 🤖"}
        </span>
      </button>

      {/* AI Assistant Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="w-full max-w-lg h-[82vh] max-h-[640px] flex flex-col rounded-3xl bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 shadow-2xl overflow-hidden animate-modal-in">
            {/* Header Bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#1D3A37] to-[#295652] px-6 py-4 text-white shrink-0">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745] text-xl text-white shadow-md">
                  🤖
                </span>
                <div>
                  <h2 className="text-base font-black flex items-center gap-1.5">
                    <span>{isRtl ? "مساعد جِدّاو الذكي" : "JEDDAW AI Assistant"}</span>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 border border-emerald-400/30">
                      {isRtl ? "ثنائي اللغة (AR/EN)" : "Bilingual (AR/EN)"}
                    </span>
                  </h2>
                  <p className="text-[11px] text-white/80 font-semibold flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {isRtl ? "متصل وجاهز لمساعدتك لحظياً" : "Online & ready to assist instantly"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isRtl ? "إغلاق" : "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#C96745] text-white rounded-te-none"
                        : "bg-white dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-ts-none"
                    }`}
                  >
                    {msg.text}

                    {/* Action Button Link */}
                    {msg.actionLink && (
                      <a
                        href={msg.actionLink.url}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#C96745] px-4 py-2 text-xs font-black text-white shadow-lift hover:bg-[#b55837] transition-all"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{msg.actionLink.label}</span>
                      </a>
                    )}
                  </div>

                  {/* Suggested Places Horizontal Cards */}
                  {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                    <div className="mt-3 w-full space-y-2">
                      {msg.suggestedPlaces.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => setSelectedPlace(place)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#253230] border border-[#E2D3BE] dark:border-white/10 shadow-sm hover:border-[#C96745] cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={place.image}
                              alt={place.nameAr}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                                {isRtl ? place.nameAr : place.nameEn}
                              </h4>
                              <p className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                                {isRtl ? (place.subCategoryAr || place.categoryAr) : (place.subCategoryEn || place.kind)} ·{" "}
                                {place.pricePerPerson === 0
                                  ? isRtl
                                    ? "مجاني ✨"
                                    : "Free ✨"
                                  : `${place.pricePerPerson} ${isRtl ? "ر.س" : "SAR"}`}
                              </p>
                            </div>
                          </div>

                          <button className="text-xs font-bold text-[#C96745] hover:underline flex items-center gap-1">
                            التفاصيل 📍
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] bg-white dark:bg-[#253230] px-4 py-3 rounded-2xl w-fit border border-[#E2D3BE] dark:border-white/10">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#C96745] animate-ping" />
                  <span>الذكاء الاصطناعي يحلل التوصيات...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-4 py-2 border-t border-[#E2D3BE]/60 dark:border-white/10 bg-white/60 dark:bg-[#161B1A] flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full bg-[#F4EBDD] dark:bg-[#253230] px-3.5 py-1.5 text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] whitespace-nowrap border border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white dark:bg-[#1A2221] border-t border-[#E2D3BE] dark:border-white/10 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder={
                  isRtl
                    ? "اسألني عن أي مطعم، كافيه، منتجع، أو كيف أسوّي خطة..."
                    : "Ask me about restaurants, cafes, resorts, or trip plans..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#253230] px-4 py-3 text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8] focus:outline-none focus:border-[#C96745]"
              />
              <button
                type="submit"
                className="grid h-11 w-11 place-items-center rounded-2xl bg-[#C96745] text-white shadow-lift hover:bg-[#b55837] transition-all shrink-0"
                aria-label="إرسال"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Place Detail Modal when clicked from AI recommendations */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </>
  );
}
