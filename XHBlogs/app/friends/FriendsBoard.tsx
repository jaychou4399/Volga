"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";
import { friendsData } from "../../data/friends";
import Comments from "../../components/Comments";
import { siteConfig } from "../../siteConfig";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function FriendsBoard() {
  const [isCopied, setIsCopied] = useState(false);
  const applyFormat = siteConfig.friendLinkApplyFormat;

  const handleCopy = () => {
    navigator.clipboard.writeText(applyFormat);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getHostname = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-10 py-6 md:py-10 relative z-10 scroll-smooth mt-20 md:mt-10">
      <div className="mb-8 md:mb-12 flex flex-col items-center md:items-start">
        <div className="w-full flex justify-start mb-4 md:mb-6">
          <BackButton />
        </div>
        <div className="text-center md:text-left w-full px-2 md:px-0">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-widest drop-shadow-sm uppercase">
            🌐 友链
          </h1>
          <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-serif">
            那些散落在赛博宇宙各处的有趣灵魂
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {friendsData.map((friend) => (
          <motion.div key={friend.id} variants={itemVariants} className="h-full">
            <a
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full rounded-2xl md:rounded-3xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg md:shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl group relative p-4 md:p-6"
            >
              <div
                className="absolute -bottom-10 -right-10 w-24 h-24 md:w-32 md:h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ backgroundColor: friend.themeColor }}
              ></div>

              <div className="flex items-center gap-3 md:gap-4 relative z-10 mb-3 md:mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl p-[2px] bg-gradient-to-br from-indigo-400 to-purple-500 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-2xl object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm md:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {friend.name}
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-mono truncate mt-0.5">
                    {getHostname(friend.url)}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex-shrink-0">
                  <span className="inline-block px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-lg shadow-sm">
                    访问 →
                  </span>
                </div>
              </div>

              <p className="text-[11px] md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 relative z-10">
                {friend.description}
              </p>
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* 申请区 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 md:mt-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-3xl mx-auto text-center shadow-lg"
      >
        <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-4">
          🔗 交换友链
        </h2>
        <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 mb-4 md:mb-6">
          复制下方格式，在评论区留言申请
        </p>

        <div className="relative bg-slate-100/60 dark:bg-slate-900/60 rounded-xl md:rounded-2xl p-4 md:p-5 text-left inline-block w-full max-w-md border border-slate-200/50 dark:border-slate-700/50 group">
          <pre className="font-mono text-[10px] md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all pr-8">
            {applyFormat}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all duration-300 shadow-sm"
          >
            {isCopied ? "✓" : "📋"}
          </button>
        </div>

        <div className="mt-6">
          <a
            href="#gitalk-container"
            className="inline-block px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full text-sm md:text-base font-bold tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            去留言区申请 👇
          </a>
        </div>
      </motion.div>

      <motion.div
        id="gitalk-container"
        className="mt-12 md:mt-16 scroll-mt-24 px-2 md:px-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="w-8 md:w-12 h-[1px] bg-slate-300 dark:bg-slate-700"></span>
          <h3 className="text-sm md:text-xl font-bold text-slate-800 dark:text-gray-200 tracking-widest uppercase">
            留言板
          </h3>
          <span className="w-8 md:w-12 h-[1px] bg-slate-300 dark:bg-slate-700"></span>
        </div>
        <Comments />
      </motion.div>
    </div>
  );
}