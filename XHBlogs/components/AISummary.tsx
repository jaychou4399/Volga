"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AISummary({ slug }: { slug: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "请求失败");
      setSummary(data.summary);
      setOpen(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!summary ? (
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              正在生成...
            </>
          ) : (
            <>
              <span className="text-lg">🤖</span> AI 总结
            </>
          )}
        </button>
      ) : (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🤖</span> AI 生成的文章总结
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {summary}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-2">❌ {error}</p>
      )}
    </div>
  );
}