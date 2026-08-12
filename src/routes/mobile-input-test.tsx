import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/mobile-input-test")({
  component: MobileInputTestPage,
});

function MobileInputTestPage() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-md p-6 bg-[#FAF6F0] dark:bg-[#161B1A] min-h-[80vh] text-[#252A28] dark:text-[#F5F1E8]">
      <div className="rounded-2xl bg-[#C96745]/10 border border-[#C96745]/30 p-4 mb-6">
        <h2 className="text-lg font-black text-[#C96745] mb-1">
          📱 URL A: Normal App Shell + Input Test
        </h2>
        <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2]">
          يعمل داخل الهيدر والكونتينر الرئيسي للتطبيق مع إيقاف تصفية الخلفية (Backdrop Filters Disabled) وتعديل Viewport Meta.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold mb-1">
            1. Text Input (Arabic / English): [{text}]
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا بالعربي أو بالإنجليزي (مثل: محمد / كافيهات)..."
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#C96745]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold mb-1">
            2. Email Input: [{email}]
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#C96745]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold mb-1">
            3. Password Input: [{password}]
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#C96745]"
          />
        </div>
      </div>
    </div>
  );
}
