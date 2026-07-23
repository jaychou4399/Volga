"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOODS = ["🍰", "🍩", "🍪", "🍭", "🧁", "🍙", "🍡", "🍫", "🍓", "🍮"];

const FEED_REPLIES = [
  "哇~ 最喜欢了！🍰",
  "是葱味饼干吗？谢谢主人~",
  "好吃！Miku 充满能量了！",
  "谢谢投喂！唱歌更有力气了~",
  "呜哇好甜！幸福的滋味！",
  "嘿嘿~ 主人最好了！",
];

export default function Live2DMiku() {
  const [feedOpen, setFeedOpen] = useState(false);
  const [feedMsg, setFeedMsg] = useState("");
  const feedTimer = useRef<NodeJS.Timeout | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const style = document.createElement("style");
    style.textContent = `
      #live2d-widget .live2d-dialog {
        font-size: 13px !important; padding: 8px 14px !important;
        border-radius: 16px !important; background: rgba(255,255,255,0.95) !important;
        backdrop-filter: blur(8px) !important; box-shadow: 0 4px 20px rgba(99,102,241,0.2) !important;
        color: #4b5563 !important; max-width: 220px !important;
      }
    `;
    document.head.appendChild(style);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).L2Dwidget) {
        (window as any).L2Dwidget.init({
          model: { jsonPath: "https://cdn.jsdelivr.net/npm/live2d-widget-model-miku@1.0.5/assets/miku.model.json", scale: 1 },
          display: { position: "right", width: 150, height: 300, hOffset: 10, vOffset: -30 },
          mobile: { show: false },
          react: { opacityDefault: 0.85, opacityOnHover: 1 },
          dialog: { enable: true, hitokoto: false },
          dev: { border: false, log: false },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
      if (script.parentNode) script.parentNode.removeChild(script);
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  const feedCharacter = (food: string) => {
    setFeedOpen(false);
    const msg = FEED_REPLIES[Math.floor(Math.random() * FEED_REPLIES.length)];
    setFeedMsg(food + " " + msg);
    if (feedTimer.current) clearTimeout(feedTimer.current);
    feedTimer.current = setTimeout(() => setFeedMsg(""), 3000);
  };

  return (
    <div className="hidden md:block">
      <AnimatePresence>
        {feedMsg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="fixed bottom-[260px] right-[20px] z-[100001] pointer-events-none">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-xl border border-pink-200/50 max-w-[240px]">
              <span className="text-sm text-slate-700 dark:text-slate-200">{feedMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {feedOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-14 right-[160px] z-[9999] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-3 shadow-xl border">
            <p className="text-xs font-bold text-slate-500 mb-2">🍽️ 投喂 Miku</p>
            <div className="flex gap-1.5 flex-wrap max-w-[200px]">
              {FOODS.map(food => (
                <button key={food} onClick={() => feedCharacter(food)}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-pink-100 hover:scale-110 active:scale-90 flex items-center justify-center text-lg transition-all">{food}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setFeedOpen(!feedOpen)}
        className="fixed bottom-8 right-[160px] z-[9999] w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border shadow-lg flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-all"
        title="投喂 Miku">🍙</button>
    </div>
  );
}