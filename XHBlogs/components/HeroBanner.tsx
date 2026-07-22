"use client";

import { motion } from "framer-motion";
import { siteConfig } from "../siteConfig";
import { ArrowRight, Github, Camera, Cpu, BookOpen } from "lucide-react";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/10 shadow-2xl"
    >
      {/* 背景光晕 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
        {/* 左侧文字 */}
        <div className="flex-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              2026 考研进行中
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
          >
            <span className="text-white">Hey, I{"'"}m </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              JayChou
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed"
          >
            {siteConfig.bio}
          </motion.p>

          {/* 技能标签 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {["STM32", "Python", "C/C++", "Java", "Linux", "Git", "嵌入式"].map((skill) => (
              <span key={skill}
                className="px-3 py-1 text-xs font-bold rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-indigo-300 transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {/* CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link href="/posts/first"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
              阅读文章 <ArrowRight size={16} />
            </Link>
            <Link href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-xl transition-all">
              <Cpu size={16} /> 项目
            </Link>
            <Link href="/photowall"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-xl transition-all">
              <Camera size={16} /> 照片
            </Link>
          </motion.div>
        </div>

        {/* 右侧状态卡片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:w-80 shrink-0 space-y-3"
        >
          {[
            { icon: Cpu, label: "学习重点", value: "STM32 HAL 库", color: "text-indigo-400" },
            { icon: BookOpen, label: "今日目标", value: "考研数学 2h", color: "text-emerald-400" },
            { icon: Camera, label: "近日", value: "南昌滕王阁采风", color: "text-amber-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
