import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/bare-input-test")({
  component: BareInputTestPage,
});

function BareInputTestPage() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-md p-6 bg-[#FAF6F0] dark:bg-[#161B1A] min-h-screen text-[#252A28] dark:text-[#F5F1E8]">
      <div className="rounded-2xl bg-[#397C78]/10 border border-[#397C78]/30 p-4 mb-6">
        <h2 className="text-lg font-black text-[#397C78] dark:text-[#5EAAA5] mb-1">
          🧪 URL B: Bare App Shell (No Header / No TabBar Mounted)
        </h2>
        <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2]">
          يعمل في هيكل عادي كلياً بدون شريط الموقع العلوي أو السفلي للتحقق مما إذا كان تضارب التخطيط القادم منهما.
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
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#397C78]"
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
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#397C78]"
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
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] p-3 text-base font-semibold focus:outline-none focus:border-[#397C78]"
          />
        </div>
      </div>
    </div>
  );
}
