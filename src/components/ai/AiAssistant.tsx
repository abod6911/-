import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { places, readyPlans, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceDetailModal } from "@/components/places/PlaceDetailModal";

interface AiMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  suggestedPlaces?: Place[];
  actionLink?: { label: string; url: string } | undefined;
}

// Inappropriate / offensive word safety list
const PROFANITY_PATTERN = /(أحا|كل زق|يا غبي|حمار|حيوان|قذر|شتم|سب|سافل|منحط|sex|nude|badword)/i;

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
      text: "أهلاً وسهلاً بك في جِدّاو! 🤖 أنا مساعدك الذكي لتخطيط أحلى الطلعات في جدة. أسألني عن الأماكن، المطاعم، الكافيهات، الفنادق، أو كيف ترتّب يومك حسب ميزانيتك ووقتك!",
    },
  ]);

  const quickPrompts = [
    "كيف أرتّب طلعة بضغطة واحدة؟ ⚡",
    "اعطيني خيار عشاء رومانسي على البحر 🌊",
    "وين أفضل مطعم شامي أو مصري في جدة؟ 🥙",
    "أبغى مقهى هادي ينفع لمذاكرة أو شغل ☕",
    "وش أفضل المنتجات والفنادق المطلة؟ 🏨",
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
      let actionLink: { label: string; url: string } | undefined = undefined;

      const q = userText.toLowerCase().trim();

      // 1. Safety Guard Filter
      if (PROFANITY_PATTERN.test(q)) {
        responseText =
          "أعتذر منك يا غالي! 🌸 أنا مساعد ذكي محترم مخصص لمساعدتك في التخطيط لأفضل الأماكن والطلعات في جدة. اسألني عن أي مطعم، مقهى، شاطئ، أو خطة مناسبة وسأكون في خدمتك بجدة!";
      }
      // 2. Questions about how JEDDAW works
      else if (q.includes("كيف") && (q.includes("موقع") || q.includes("خطة") || q.includes("جدداو") || q.includes("جِدّاو") || q.includes("يعمل") || q.includes("خدمة"))) {
        responseText =
          "المواقع الثانية تعطيك قوائم مطاعم وبس.. أما جِدّاو يرتّب لك الطلعة كاملة! 🎯 تقدر تدخل صفحة 'خطة على السريع' وتحدد ميزانيتك ووقتك والعدد والمود، والذكاء الاصطناعي يرتّب لك المسار كامل (نشاط + عشاء + قهوة) بالوقت والخرائط في ثوانٍ!";
        actionLink = { label: "جرّب خطة على السريع الآن ⚡", url: "/quick-plan" };
      }
      // 3. Questions about budget & prices
      else if (q.includes("ميزانية") || q.includes("سعر") || q.includes("كم تكلف") || q.includes("رخيص") || q.includes("مجاني") || q.includes("100")) {
        matches = places.filter((p) => p.pricePerPerson <= 100 || p.pricePerPerson === 0);
        responseText =
          "في جِدّاو عندنا خيارات تناسب كل الميزانيات! تبدأ من طلعت مجانية 0 ريال على كورنيش جدة والبلد التاريخية، إلى طلعات اقتصادية بأقل من 100 ريال للشخص، أو تجارب فاخرة. اخترت لك بعض الأماكن الرائعة والاقتصادية:";
      }
      // 4. Cafes & Study spots
      else if (q.includes("مقهى") || q.includes("كافيه") || q.includes("مذاكرة") || q.includes("شغل") || q.includes("قهوة") || q.includes("روقان")) {
        matches = places.filter((p) => p.kind === "cafe" || p.moods.includes("calm"));
        responseText =
          "للروقان والتركيز أو المذاكرة والجلسات الرايقة، هذي أفضل مقاهي جدة المتميزة بجودة القهوة والأجواء:";
      }
      // 5. Sea & Romantic sunset spots
      else if (q.includes("بحر") || q.includes("غروب") || q.includes("رومانسي") || q.includes("شاطئ") || q.includes("كورنيش")) {
        matches = places.filter((p) => p.moods.includes("sea") || p.categoryAr.includes("بحر") || p.descAr.includes("بحر"));
        responseText =
          "عروس البحر الأحمر تجنن في الغروب! 🌊 هذي أفضل الجلسات والمطاعم المطلة مباشرة على بحر جدة:";
      }
      // 6. Food Cuisines: Shami, Egyptian, Fast Food, Traditional Saudi
      else if (q.includes("شامي") || q.includes("مصري") || q.includes("سعودي") || q.includes("قديم") || q.includes("وجبات") || q.includes("مطعم") || q.includes("أكل")) {
        if (q.includes("شامي")) {
          matches = places.filter((p) => p.subCategoryAr?.includes("شامية") || p.descAr.includes("شامي"));
          responseText = "الأكل الشامي والمشاوي الفاخرة في جدة! هذي التوصيات الأعلى تقييماً:";
        } else if (q.includes("مصري")) {
          matches = places.filter((p) => p.subCategoryAr?.includes("مصرية") || p.descAr.includes("مصري"));
          responseText = "أجمل النكهات والمطاعم المصرية الأصيلة في قلب جدة:";
        } else if (q.includes("سعودي") || q.includes("قديم")) {
          matches = places.filter((p) => p.subCategoryAr?.includes("سعودية قديمة") || p.descAr.includes("سعودي") || p.descAr.includes("أصيل"));
          responseText = "المطاعم السعودية القديمة والتراثية بنكهة حجازية أصيلة:";
        } else {
          matches = places.filter((p) => p.kind === "food");
          responseText = "مطاعم جدة المتنوعة والأعلى تقييماً حسب آراء الزوار هذا الأسبوع:";
        }
      }
      // 7. Hotels & Resorts
      else if (q.includes("فندق") || q.includes("منتجع") || q.includes("فنادق") || q.includes("منتجعات") || q.includes("شاليه") || q.includes("إقامة")) {
        matches = places.filter((p) => p.kind === "hotel" || p.kind === "resort");
        responseText =
          "استرخاء وإقامة فاخرة على الكورنيش والبحر 🏨✨ هذي أفضل الفنادق والمنتجعات الموصى بها في جدة:";
      }
      // 8. Family & Kids
      else if (q.includes("طفل") || q.includes("أطفال") || q.includes("عائلة") || q.includes("عوائل") || q.includes("ملاهي") || q.includes("ألعاب")) {
        matches = places.filter((p) => p.kidsFriendly || p.groups.includes("family"));
        responseText =
          "لليالي العائلية الممتعة مع الأطفال 👨‍👩‍👧‍👦 هذي أماكن آمنة وممتعة وتناسب جميع الأعمار:";
      }
      // 9. Late Night / After work
      else if (q.includes("ليل") || q.includes("سهر") || q.includes("بعد الدوام") || q.includes("تأخر")) {
        matches = places.filter((p) => p.closesAt >= 2 || p.closesAt === 24);
        responseText =
          "جدة ما تنام! 🌙 هذي خيارات ممتازة للسهرات والطلعات المتأخرة بعد الدوام أو آخر الليل:";
      }
      // 10. General friendly default response with smart recommendations
      else {
        matches = places.filter((p) => p.trending || (p.rating && p.rating >= 4.8)).slice(0, 3);
        responseText =
          `أهلاً بك! الذكاء الاصطناعي حلل طلبك 🎯 بخصوص "${userText}"، هذي بعض أفضل الأماكن والترندات الموصى بها اليوم في جدة، وتقدر دائماً تخبرني بالتفاصيل مثل (الميزانية أو الحي أو المود):`;
      }

      // Shuffle matching places slightly for natural variety
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
    }, 900);
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
        <span className="text-sm">
          {isRtl ? "مساعد جِدّاو الذكي 🤖" : "JEDDAW AI Assistant 🤖"}
        </span>
      </button>

      {/* AI Assistant Chat Drawer Modal */}
      {isOpen && (
        <div className="modal-overlay z-50">
          <div className="modal-content max-w-lg w-full h-[620px] flex flex-col justify-between p-0 overflow-hidden bg-[#FAF6F0] dark:bg-[#1C2422] border border-[#E2D3BE] dark:border-white/10 animate-modal-in shadow-2xl">
            {/* Header */}
            <div className="bg-[#252A28] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745] text-xl font-bold shadow-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">مساعد جِدّاو الذكي</h3>
                  <span className="text-[11px] text-[#5EAAA5] font-bold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#397C78] animate-pulse" /> متصل ومستعد للمساعدة
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
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#C96745] text-white rounded-br-none shadow-sm"
                        : "bg-[#F4EBDD] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Action link if available */}
                  {msg.actionLink && (
                    <a
                      href={msg.actionLink.url}
                      className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-[#397C78] text-white px-4 py-2 text-xs font-bold shadow-sm hover:bg-[#2e6461] transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {msg.actionLink.label}
                    </a>
                  )}

                  {/* Suggested Places */}
                  {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                    <div className="mt-3 w-full space-y-2">
                      {msg.suggestedPlaces.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlace(p)}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#293735] border border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745] cursor-pointer transition-all shadow-sm"
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
                                {p.categoryAr} · {p.pricePerPerson === 0 ? "مجاني ✨" : `${p.pricePerPerson} ر.س`}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-[#C96745] font-bold">التفاصيل 📍</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#6E716C] dark:text-[#B5B8B2] text-xs">
                  <Bot className="h-4 w-4 animate-spin text-[#C96745]" />
                  <span>المساعد الذكي يفكر ويحلل طلبك...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-t border-[#E2D3BE] dark:border-white/10 bg-[#F4EBDD]/60 dark:bg-[#161B1A]/60 flex gap-2 overflow-x-auto no-scrollbar">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="shrink-0 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#222826] px-3.5 py-1.5 text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] hover:text-[#C96745] transition-all"
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
                placeholder="اسألني عن أي مطعم، كافيه، منتجع، أو كيف أسوي خطة..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-2.5 text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8] focus:outline-none focus:border-[#C96745]"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#C96745] text-white hover:bg-[#b55837] transition-colors shadow-sm"
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
