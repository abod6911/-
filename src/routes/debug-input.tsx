import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/debug-input")({
  component: DebugInputPage,
});

function DebugInputPage() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-md p-6 bg-[#FAF6F0] dark:bg-[#161B1A] min-h-screen text-[#252A28] dark:text-[#F5F1E8]">
      <h2 className="text-xl font-bold text-[#C96745] mb-2">
        🧪 Test 2: Bare React Controlled Input Route
      </h2>
      <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] mb-6">
        اختبار مكون رياكت المعزول تماماً بدون هيدر وبدون فوتار وبدون أي خطافات لوحة مفاتيح.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold mb-1">
            1. Text Input (Controlled React State): [{text}]
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا بالعربي أو بالإنجليزي..."
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#C96745]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            2. Email Input: [{email}]
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#C96745]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
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
