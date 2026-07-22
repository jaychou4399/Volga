import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { siteConfig } from "@/siteConfig";
import LearningDashboard from "./LearningDashboard";

export const metadata = {
  title: "学习中心 | " + siteConfig.title,
  description: "STM32 · Python · C/C++ · 考研记录",
};

const learningTopics = [
  {
    id: "stm32",
    name: "STM32 嵌入式",
    icon: "🔌",
    color: "from-blue-500 to-cyan-500",
    progress: 45,
    desc: "HAL 库开发 · RTOS · 外设驱动",
    hours: 120,
    plan: "完成 FreeRTOS 项目实战",
    status: "进行中",
  },
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "from-yellow-500 to-green-500",
    progress: 75,
    desc: "数据分析 · 自动化脚本 · 爬虫",
    hours: 300,
    plan: "机器学习入门",
    status: "熟练",
  },
  {
    id: "cpp",
    name: "C / C++",
    icon: "⚙️",
    color: "from-purple-500 to-blue-500",
    progress: 60,
    desc: "指针 · 数据结构 · 嵌入式 C",
    hours: 200,
    plan: "深入理解 STL 和内存管理",
    status: "进行中",
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "from-red-500 to-orange-500",
    progress: 50,
    desc: "面向对象 · Spring Boot · 课设",
    hours: 150,
    plan: "完成 Spring Boot 项目",
    status: "进行中",
  },
  {
    id: "linux",
    name: "Linux",
    icon: "🐧",
    color: "from-gray-600 to-gray-400",
    progress: 40,
    desc: "命令行 · Shell 脚本 · 服务器运维",
    hours: 80,
    plan: "掌握常用命令和 Shell 编程",
    status: "进行中",
  },
  {
    id: "git",
    name: "Git",
    icon: "🔀",
    color: "from-orange-600 to-red-500",
    progress: 70,
    desc: "版本控制 · 分支管理 · GitHub",
    hours: 60,
    plan: "学习 Git Flow 工作流",
    status: "熟练",
  },
  {
    id: "english",
    name: "英语",
    icon: "📖",
    color: "from-emerald-500 to-teal-500",
    progress: 35,
    desc: "词汇 · 阅读 · 考研英语",
    hours: 250,
    plan: "每日背词 50 个 · 真题训练",
    status: "进行中",
  },
  {
    id: "kaoyan",
    name: "考研",
    icon: "🎯",
    color: "from-pink-500 to-rose-500",
    progress: 30,
    desc: "数学一 · 专业课 · 政治 · 英语",
    hours: 400,
    plan: "2026 年上岸目标院校",
    status: "全力冲刺",
  },
];

export default function LearningPage() {
  const totalHours = learningTopics.reduce((s, t) => s + t.hours, 0);
  const avgProgress = Math.round(
    learningTopics.reduce((s, t) => s + t.progress, 0) / learningTopics.length
  );

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />
      <PageTransition>
        <div className="w-full max-w-6xl mx-auto mt-28 px-4 sm:px-10">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">学习中心</h1>
            <p className="text-slate-500 dark:text-slate-400">
              累计 {totalHours}+ 小时 · 整体进度 {avgProgress}%
            </p>
          </div>

          <LearningDashboard topics={learningTopics} totalHours={totalHours} avgProgress={avgProgress} />
        </div>
      </PageTransition>
    </div>
  );
}
