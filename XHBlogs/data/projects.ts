// JayChou 的项目展示

export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl: string;
  tags: string[];
  stars?: number;
};

export const projectsData: Project[] = [
  {
    id: "volga",
    name: "Volga Blog",
    githubUrl: "https://github.com/jaychou4399/Volga",
    description: "个人数字花园博客，基于 Next.js 15 + React 19 + Tailwind CSS 构建，部署在 Vercel。集成 DeepSeek AI 文章总结、网易云音乐播放器、Live2D Miku 看板娘、照片墙瀑布流、成长时间轴、全文 AI 搜索、说说朋友圈、杂谈专栏、GitHub 项目展示等功能模块，支持深色模式与响应式布局。",
    icon: "🌸",
    tags: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Vercel"],
    stars: 0
  },
  {
    id: "stm32",
    name: "STM32 学习记录",
    githubUrl: "https://github.com/jaychou4399/STM32-",
    description: "STM32F103 嵌入式开发学习仓库，记录从零开始学习 ARM Cortex-M3 的完整过程。涵盖 GPIO 点亮 LED、外部中断 EXTI、定时器 TIM（PWM 输出/输入捕获）、ADC 模拟信号采集、USART/I2C/SPI 通信协议、DMA 数据传输等外设驱动代码与学习笔记，配套原理图分析与调试经验总结。",
    icon: "🔧",
    tags: ["STM32", "C", "Embedded", "ARM", "Keil"],
    stars: 1
  },
  {
    id: "first-project",
    name: "My First Project",
    githubUrl: "https://github.com/jaychou4399/my--first--project",
    description: "编程入门时期的第一个网页作品，使用纯 HTML + CSS 手写静态页面，包含个人主页、相册展示、留言板等基础模块。虽然技术栈简单，但记录了从零开始接触前端开发的起点——从 HTML 标签都不会写，到能独立完成一个多页面的静态网站，是成长路上最重要的里程碑。",
    icon: "🌱",
    tags: ["HTML", "CSS", "Static Site"],
    stars: 0
  },
  {
    id: "automated-data",
    name: "Automated Data",
    githubUrl: "https://github.com/jaychou4399/Automated-Data",
    description: "自动化数据处理工具，基于 TypeScript 开发，用于批量数据采集、清洗与格式化输出。支持多种数据源接入、自定义转换规则、自动化定时任务调度，适合日常数据分析与报表生成场景，持续迭代中。",
    icon: "🤖",
    tags: ["TypeScript", "Automation", "Data"],
    stars: 0
  },
];
