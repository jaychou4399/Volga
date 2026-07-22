"use client";

import { motion } from "framer-motion";
import { Clock, Target, TrendingUp } from "lucide-react";

type Topic = {
  id: string; name: string; icon: string; color: string;
  progress: number; desc: string; hours: number; plan: string; status: string;
};

export default function LearningDashboard({
  topics, totalHours, avgProgress,
}: {
  topics: Topic[]; totalHours: number; avgProgress: number;
}) {
  return (
    <div className="space-y-8">
      {/* 总览卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Clock, label: "累计学习", value: `${totalHours}h`, color: "text-indigo-400" },
          { icon: TrendingUp, label: "整体进度", value: `${avgProgress}%`, color: "text-emerald-400" },
          { icon: Target, label: "进行中", value: `${topics.filter(t => t.status !== "熟练").length} 项`, color: "text-amber-400" },
        ].map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg">
            <div className={`p-3 rounded-xl bg-white/10 ${item.color}`}><item.icon size={24} /></div>
            <div><p className="text-xs text-slate-500">{item.label}</p><p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p></div>
          </motion.div>
        ))}
      </div>

      {/* 学习方向卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic, i) => (
          <motion.div key={topic.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{topic.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{topic.name}</h3>
                  <p className="text-xs text-slate-500">{topic.desc}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                topic.status === "熟练" ? "bg-emerald-500/10 text-emerald-500" : 
                topic.status === "全力冲刺" ? "bg-rose-500/10 text-rose-500" : 
                "bg-amber-500/10 text-amber-500"
              }`}>{topic.status}</span>
            </div>

            {/* 进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>进度</span><span>{topic.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${topic.color}`}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-500">
              <span>⏱ {topic.hours}h</span>
              <span className="text-slate-400">📋 {topic.plan}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
