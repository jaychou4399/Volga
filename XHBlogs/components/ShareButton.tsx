"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `https://volga-blog.vercel.app/posts/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareWeibo = () => {
    window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        分享
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 flex gap-1 z-50"
          >
            <button onClick={copyLink} className="px-3 py-2 text-xs font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap">
              {copied ? "✓ 已复制" : "📋 复制链接"}
            </button>
            <button onClick={shareTwitter} className="px-3 py-2 text-xs font-bold rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/30 text-slate-700 dark:text-slate-300 transition-colors">
              𝕏 推特
            </button>
            <button onClick={shareWeibo} className="px-3 py-2 text-xs font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-700 dark:text-slate-300 transition-colors">
              📢 微博
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}