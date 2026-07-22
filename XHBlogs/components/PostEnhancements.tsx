"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

type PostInfo = { slug: string; title: string };

export default function PostEnhancements({
  contentHtml,
  prev,
  next,
}: {
  contentHtml: string;
  prev?: PostInfo;
  next?: PostInfo;
}) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const wordCount = contentHtml.replace(/<[^>]*>/g, "").length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 400));

  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById("article-content");
      if (!article) return;
      const top = article.getBoundingClientRect().top;
      const h = article.offsetHeight;
      const wh = window.innerHeight;
      setProgress(Math.min(100, Math.max(0, ((-top + wh) / (h + wh)) * 100)));
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 阅读进度条 */}
      <motion.div className="fixed top-0 left-0 right-0 z-50 h-1 bg-indigo-500/20"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-150"
          style={{ width: `${progress}%` }} />
      </motion.div>

      {/* 返回顶部 */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          ><ArrowUp size={20} /></motion.button>
        )}
      </AnimatePresence>

      {/* 阅读时间 */}
      <span className="inline-flex items-center gap-1 text-sm text-slate-400 ml-3">
        <Clock size={14} /> {readingTime} min read
      </span>

      {/* 上下篇导航 */}
      <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
        {prev ? (
          <Link href={`/posts/${prev.slug}`}
            className="flex-1 group p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:border-indigo-500/30 transition-all">
            <span className="text-xs text-slate-500 flex items-center gap-1"><ChevronLeft size={14} />上一篇</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 line-clamp-1 mt-1">{prev.title}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link href={`/posts/${next.slug}`}
            className="flex-1 group p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:border-indigo-500/30 transition-all text-right">
            <span className="text-xs text-slate-500 flex items-center justify-end gap-1">下一篇<ChevronRight size={14} /></span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 line-clamp-1 mt-1">{next.title}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </>
  );
}
