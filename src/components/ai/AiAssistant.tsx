import { useState } from "react";
import { Bot, Globe, Send, Sparkles, X } from "lucide-react";
import { places, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";

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

  const initialAiMsg: AiMessage = {
    id: "1",
    sender: "ai",
    text: isRtl
      ? "أهلاً وسهلاً بك في جِدّاو! 🤖 أنا مساعدك الذكي لتخطيط أحلى الطلعات في جدة. اسألني بالعربي أو بالإنكليزي عن الأماكن، المطاعم، الكافيهات، الفنادق، أو كيف ترتّب يومك حسب ميزانيتك ووقتك!"
      : "Welcome to JEDDAW! 🤖 I am your smart AI assistant for planning the best outings in Jeddah. Ask me in Arabic or English about restaurants, cafes, hotels, beaches, or how to plan your day!",
  };

  const [messages, setMessages] = useState<AiMessage[]>([initialAiMsg]);

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
      let actionLink: { label: string; url: string } | undefined = undefined;

      const q = userText.toLowerCase().trim();
      const isEnglishInput = /[a-z]/i.test(q) && !/[\u0600-\u06FF]/.test(q);

      // 1. Handle Insults / Offense / Rude Words gracefully with high intelligence
      if (OFFENSIVE_PATTERN.test(q)) {
        if (isEnglishInput) {
          responseText =
            "Hello there! 💫 I am JEDDAW's AI Assistant, designed to help you discover the finest restaurants, cafes, sea spots, and outing plans in Jeddah politely & instantly. How can I assist you with your plans today?";
        } else {
          responseText =
            "أهلاً بك! 🌸 أنا مساعد جِدّاو الذكي، مخصص لخدمتك وتوجيهك لأجمل مطاعم، كافيهات، شواطئ، وخطط جدة بكل احترام وسرعة 💫. يسعدني جداً أن أساعدك في العثور على مكان رائع اليوم! عن ماذا تحب أن تسأل؟";
        }
      }
      // 2. Handle Simple Greetings without dumping random places
      else if (GREETING_PATTERN.test(q)) {
        if (isEnglishInput) {
          responseText =
            "Hello and welcome! 🌸 I'm delighted to assist you today. What kind of outing or places are you looking for in Jeddah? (e.g. Restaurants, Cafes, Sea views, Hotels, or Budget plans)";
        } else {
          responseText =
            "أهلاً وسهلاً بك! 🌸 شرفتني ونورتني. كيف أقدر أساعدك اليوم في تخطيط طلعتك في جدة؟ (مثلاً: مطاعم، كافيهات، إطلالة بحرية، فنادق، أو خطة الويكند)";
        }
      }
      // 3. Questions about JEDDAW or how to plan
      else if (
        q.includes("كيف") ||
        q.includes("how") ||
        q.includes("plan") ||
        q.includes("جِدّاو") ||
        q.includes("jeddaw")
      ) {
        if (isEnglishInput) {
          responseText =
            "Other sites just give you a random list of places... But JEDDAW plans your complete outing! 🎯 Go to our 'Quick Plan' page, pick your time, budget, and group, and our AI will build your entire route (Activity + Dinner + Coffee) with live timing & Google Maps in seconds!";
          actionLink = { label: "Try Quick Plan Now ⚡", url: "/quick-plan" };
        } else {
          responseText =
            "المواقع الثانية تعطيك قائمة مطاعم وبس.. أما جِدّاو يرتّب لك الطلعة كاملة! 🎯 تقدر تدخل صفحة 'خطة على السريع' وتحدد ميزانيتك ووقتك والعدد والجو، والذكاء الاصطناعي يرتّب لك المسار كامل (نشاط + عشاء + قهوة) بالوقت والخرائط في ثوانٍ!";
          actionLink = { label: "جرّب خطة على السريع الآن ⚡", url: "/quick-plan" };
        }
      }
      // 4. Cafes, Coffee & Quiet work spots
      else if (
        q.includes("مقهى") ||
        q.includes("كافيه") ||
        q.includes("قهوة") ||
        q.includes("مذاكرة") ||
        q.includes("شغل") ||
        q.includes("cafe") ||
        q.includes("coffee") ||
        q.includes("study") ||
        q.includes("work")
      ) {
        matches = places.filter((p) => p.kind === "cafe" || p.moods.includes("calm"));
        if (isEnglishInput) {
          responseText =
            "Here are the top-rated specialty coffee shops and quiet cafes in Jeddah for relaxing, working, or social meetings:";
        } else {
          responseText =
            "للروقان والتركيز أو المذاكرة والجلسات الرايقة، هذي أفضل مقاهي جدة المتميزة بجودة القهوة والأجواء:";
        }
      }
      // 5. Sea, Beach, Sunset, Corniche, Obhur
      else if (
        q.includes("بحر") ||
        q.includes("غروب") ||
        q.includes("شاطئ") ||
        q.includes("كورنيش") ||
        q.includes("أبحر") ||
        q.includes("sea") ||
        q.includes("beach") ||
        q.includes("sunset") ||
        q.includes("corniche") ||
        q.includes("obhur")
      ) {
        matches = places.filter(
          (p) => p.moods.includes("sea") || p.districtId === "corniche" || p.districtId === "obhur"
        );
        if (isEnglishInput) {
          responseText =
            "Jeddah Red Sea sunset views are unforgettable! 🌊 Here are top waterfront restaurants & spots directly overlooking the sea:";
        } else {
          responseText =
            "عروس البحر الأحمر تجنن في الغروب! 🌊 هذي أفضل الجلسات والمطاعم المطلة مباشرة على بحر جدة:";
        }
      }
      // 6. Food, Restaurants, Cuisines (Seafood, Shami, Egyptian, Saudi, Fast Food)
      else if (
        q.includes("مطعم") ||
        q.includes("أكل") ||
        q.includes("عشاء") ||
        q.includes("غداء") ||
        q.includes("شامي") ||
        q.includes("مصري") ||
        q.includes("سعودي") ||
        q.includes("بحري") ||
        q.includes("سمك") ||
        q.includes("restaurant") ||
        q.includes("food") ||
        q.includes("dinner") ||
        q.includes("seafood")
      ) {
        if (q.includes("بحري") || q.includes("سمك") || q.includes("seafood")) {
          matches = places.filter((p) => p.subCategoryAr?.includes("مأكولات بحرية") || p.descAr.includes("سمك"));
          responseText = isEnglishInput
            ? "Jeddah's iconic fresh Red Sea seafood spots:"
            : "أشهر وألذ مطاعم الأسماك والمأكولات البحرية على البحر في جدة:";
        } else if (q.includes("شامي")) {
          matches = places.filter((p) => p.subCategoryAr?.includes("شامية") || p.descAr.includes("شامي"));
          responseText = "الأكل الشامي والمشاوي الفاخرة في جدة! هذي التوصيات الأعلى تقييماً:";
        } else if (q.includes("مصري")) {
          matches = places.filter((p) => p.subCategoryAr?.includes("مصرية") || p.descAr.includes("مصري"));
          responseText = "أجمل النكهات والمطاعم المصرية الأصيلة في قلب جدة:";
        } else {
          matches = places.filter((p) => p.kind === "food");
          responseText = isEnglishInput
            ? "Here are Jeddah's top-rated restaurants across various cuisines:"
            : "مطاعم جدة المتنوعة والأعلى تقييماً حسب آراء الزوار هذا الأسبوع:";
        }
      }
      // 7. Shopping Malls & Bazaars
      else if (
        q.includes("تسوق") ||
        q.includes("مول") ||
        q.includes("مولات") ||
        q.includes("سوق") ||
        q.includes("shopping") ||
        q.includes("mall") ||
        q.includes("bazaar")
      ) {
        matches = places.filter((p) => p.kind === "shopping");
        responseText = isEnglishInput
          ? "Top shopping malls and traditional heritage souqs in Jeddah:"
          : "أشهر مولات ومراكز التسوق الفاخرة والأسواق التراثية في جدة:";
      }
      // 8. Hotels & Resorts
      else if (
        q.includes("فندق") ||
        q.includes("منتجع") ||
        q.includes("فنادق") ||
        q.includes("منتجعات") ||
        q.includes("hotel") ||
        q.includes("resort") ||
        q.includes("stay")
      ) {
        matches = places.filter((p) => p.kind === "hotel" || p.kind === "resort");
        responseText = isEnglishInput
          ? "Luxury 5-star hotels and waterfront Red Sea resorts in Jeddah:"
          : "استرخاء وإقامة فاخرة على الكورنيش والبحر 🏨✨ هذي أفضل الفنادق والمنتجعات الموصى بها في جدة:";
      }
      // 9. Budget / Price / Cheap / Free
      else if (
        q.includes("ميزانية") ||
        q.includes("رخيص") ||
        q.includes("مجاني") ||
        q.includes("سعر") ||
        q.includes("budget") ||
        q.includes("cheap") ||
        q.includes("free") ||
        q.includes("cost")
      ) {
        matches = places.filter((p) => p.pricePerPerson <= 80 || p.pricePerPerson === 0);
        responseText = isEnglishInput
          ? "Jeddah has great budget options starting from FREE seaside walks in Balad & Corniche to delicious outings under 80 SAR per person:"
          : "في جِدّاو عندنا خيارات تناسب كل الميزانيات! تبدأ من طلعت مجانية 0 ريال على كورنيش جدة والبلد التاريخية، إلى طلعات اقتصادية مناسبة جداً:";
      }
      // 10. Default helpful answer with specific semantic match
      else {
        // Find semantic matches by checking place names & categories
        matches = places.filter((p) => {
          const text = (p.nameAr + " " + p.nameEn + " " + p.categoryAr + " " + p.descAr).toLowerCase();
          return text.includes(q);
        });

        if (matches.length === 0) {
          matches = places.filter((p) => p.trending || (p.rating && p.rating >= 4.8)).slice(0, 3);
        }

        responseText = isEnglishInput
          ? "Here are top recommended places in Jeddah tailored for your search:"
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
        aria-label="مساعد جِدّاو الذكي"
      >
        <Bot className="h-5 w-5 animate-bounce" />
        <span className="hidden sm:inline">
          {isRtl ? "مساعد جِدّاو الذكي 🤖" : "JEDDAW AI Assistant 🤖"}
        </span>
      </button>

      {/* AI Assistant Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg h-[82vh] max-h-[640px] flex flex-col rounded-3xl bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 shadow-2xl overflow-hidden animate-modal-in">
            {/* Header Bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#1D3A37] to-[#295652] px-6 py-4 text-white shrink-0">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745] text-xl text-white shadow-md">
                  🤖
                </span>
                <div>
                  <h2 className="text-base font-black flex items-center gap-1.5">
                    <span>مساعد جِدّاو الذكي</span>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 border border-emerald-400/30">
                      ثنائي اللغة (AR/EN)
                    </span>
                  </h2>
                  <p className="text-[11px] text-white/80 font-semibold flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    متصل وجاهز لمساعدتك لحظياً
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="إغلاق"
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
                                {place.categoryAr} · {place.pricePerPerson === 0 ? "مجاني ✨" : `${place.pricePerPerson} ر.س`}
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
