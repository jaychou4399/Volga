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
    "id": "volga",
    "name": "Volga Blog",
    "githubUrl": "https://github.com/jaychou4399/Volga",
    "description": "个人数字花园博客——基于 Next.js 15 + Tailwind CSS，集成 AI 总结、网易云音乐、Live2D Miku 看板娘、照片墙、时间轴等功能。",
    "icon": "🌸",
    "tags": ["Next.js", "TypeScript", "React"],
    "stars": 0
  },
  {
    "id": "stm32",
    "name": "STM32 学习记录",
    "githubUrl": "https://github.com/jaychou4399/STM32-",
    "description": "STM32 嵌入式开发学习笔记与实验代码，涵盖 GPIO、定时器、中断、通信协议等基础模块。",
    "icon": "🔧",
    "tags": ["STM32", "C", "Embedded"],
    "stars": 1
  },
  {
    "id": "first-project",
    "name": "My First Project",
    "githubUrl": "https://github.com/jaychou4399/my--first--project",
    "description": "入门时期的第一个网页项目，HTML + CSS 静态页面，记录了最初学习前端的起点。",
    "icon": "🌱",
    "tags": ["HTML", "CSS"],
    "stars": 0
  },
];
