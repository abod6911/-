import { useEffect, useState } from "react";

interface LogEntry {
  time: string;
  event: string;
}

export function KeyboardDebugPanel() {
  const [enabled, setEnabled] = useState(false);
  const [metrics, setMetrics] = useState({
    innerHeight: 0,
    clientHeight: 0,
    vvHeight: 0,
    vvTop: 0,
    vvLeft: 0,
    scrollY: 0,
    activeElement: "none",
    inputFocused: false,
    keyboardOpen: false,
    orientation: "portrait",
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDebug = window.location.search.includes("keyboardDebug=1");
    setEnabled(isDebug);
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const root = document.documentElement;

    const addLog = (event: string) => {
      const now = new Date();
      const timeStr = `${now.getSeconds()}.${now.getMilliseconds().toString().padStart(3, "0")}`;
      setLogs((prev) => [{ time: timeStr, event }, ...prev.slice(0, 7)]);
    };

    const updateMetrics = (eventName: string) => {
      const vv = window.visualViewport;
      const active = document.activeElement;
      const activeName = active ? `${active.tagName.toLowerCase()}${active.getAttribute("type") ? `[${active.getAttribute("type")}]` : ""}` : "none";

      setMetrics({
        innerHeight: window.innerHeight,
        clientHeight: root.clientHeight,
        vvHeight: vv ? Math.round(vv.height) : window.innerHeight,
        vvTop: vv ? Math.round(vv.offsetTop) : 0,
        vvLeft: vv ? Math.round(vv.offsetLeft) : 0,
        scrollY: Math.round(window.scrollY),
        activeElement: activeName,
        inputFocused: root.dataset.inputFocused === "true",
        keyboardOpen: root.dataset.keyboardOpen === "true",
        orientation: window.innerHeight > window.innerWidth ? "portrait" : "landscape",
      });

      addLog(eventName);
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Element | null;
      updateMetrics(`focusin:${target?.tagName.toLowerCase() || "unknown"}`);
    };
    const onFocusOut = () => updateMetrics("focusout");
    const onVvResize = () => updateMetrics("vv:resize");
    const onVvScroll = () => updateMetrics("vv:scroll");
    const onWinResize = () => updateMetrics("win:resize");

    updateMetrics("init");

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", onVvResize);
      vv.addEventListener("scroll", onVvScroll);
    }
    window.addEventListener("resize", onWinResize);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      if (vv) {
        vv.removeEventListener("resize", onVvResize);
        vv.removeEventListener("scroll", onVvScroll);
      }
      window.removeEventListener("resize", onWinResize);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed top-2 start-2 z-[99999] pointer-events-none max-w-[280px] w-full rounded-2xl bg-black/90 text-emerald-400 p-3 font-mono text-[10px] leading-tight border border-emerald-500/40 shadow-2xl backdrop-blur-md opacity-95">
      <div className="font-bold text-white mb-1.5 flex items-center justify-between border-b border-white/20 pb-1">
        <span>⌨️ KEYBOARD DEBUG</span>
        <span className="text-[9px] text-emerald-300">?keyboardDebug=1</span>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-white/90">
        <div>win.innerHeight: <span className="text-emerald-400 font-bold">{metrics.innerHeight}</span></div>
        <div>doc.clientHeight: <span className="text-emerald-400 font-bold">{metrics.clientHeight}</span></div>
        <div>vv.height: <span className="text-emerald-400 font-bold">{metrics.vvHeight}</span></div>
        <div>vv.offsetTop: <span className="text-emerald-400 font-bold">{metrics.vvTop}</span></div>
        <div>activeEl: <span className="text-amber-300 font-bold truncate block">{metrics.activeElement}</span></div>
        <div>scrollY: <span className="text-emerald-400 font-bold">{metrics.scrollY}</span></div>
        <div>inputFocused: <span className={metrics.inputFocused ? "text-emerald-400 font-bold" : "text-rose-400"}>{String(metrics.inputFocused)}</span></div>
        <div>keyboardOpen: <span className={metrics.keyboardOpen ? "text-emerald-400 font-bold" : "text-rose-400"}>{String(metrics.keyboardOpen)}</span></div>
      </div>

      <div className="border-t border-white/10 pt-1">
        <div className="text-[9px] font-bold text-white/60 mb-0.5">EVENT LOG:</div>
        <div className="space-y-0.5 max-h-16 overflow-hidden text-[9px] text-white/80">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-emerald-500">{log.time}</span>
              <span className="text-amber-200 font-semibold">{log.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
