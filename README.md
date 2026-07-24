# 🌸 Volga — JayChou の宝藏之地

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

> 🏠 一个具有强烈个人特色的数字花园（Digital Garden），用于记录学习、生活、摄影、项目和思考。

**🌐 在线访问：[volga-nu.vercel.app](https://volga-nu.vercel.app/)**

---

## ✨ 功能特性

### 📝 内容创作
- **Markdown 写作** — 完整的 Markdown 支持，代码高亮、表格、引用
- **AI 文章总结** — 基于 DeepSeek API 自动生成文章摘要
- **AI 智能搜索** — 自然语言搜索全站内容
- **草稿与发布** — 支持文章草稿管理

### 🎨 视觉体验
- **毛玻璃设计** — Glassmorphism 风格，现代高级质感
- **深色模式** — 自动适配系统主题，可手动切换
- **响应式布局** — 完美适配手机、平板、桌面端
- **开屏动画** — 二次元风格终端启动画面
- **弹幕背景** — 首页二次元弹幕效果

### 🎵 音乐系统
- **网易云音乐** — 接入网易云歌单，支持播放控制
- **音乐柱可视化** — 左下角实时音频频谱动画
- **歌词栏** — 首页浮动歌词显示

### 🎀 互动功能
- **Miku 看板娘** — Live2D 初音未来，支持投喂互动
- **评论系统** — Gitalk（GitHub Issues）评论
- **说说模块** — 类朋友圈日常碎碎念
- **留言板** — 访客留言互动

### 📸 内容展示
- **照片墙** — 瀑布流相册，支持分类浏览与 Lightbox 预览
- **时间轴** — 成长时间轴，按时间记录学习与生活
- **杂谈专栏** — 数码评测、工具推荐、教程分享
- **项目展示** — GitHub 仓库自动同步，展示项目详情与星数
- **友链** — 友情链接展示

### 📊 数据统计
- **首页仪表盘** — 文章数、项目数、照片数、运行时间
- **Umami 分析** — 隐私友好的访问统计

### 🔧 技术栈
- **框架**：Next.js 15 + React 19
- **样式**：Tailwind CSS 4 + Framer Motion
- **语言**：TypeScript
- **部署**：Vercel
- **AI**：DeepSeek API
- **音乐**：网易云音乐 API
- **统计**：Umami Analytics

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/jaychou4399/Volga.git
cd Volga/XHBlogs

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可预览。

### 构建部署

```bash
npm run build
npm start
```

推荐使用 [Vercel](https://vercel.com) 一键部署，对 Next.js 有原生支持。

---

## 📁 项目结构

```
Volga/
├── XHBlogs/                # 博客主项目
│   ├── app/                # Next.js App Router 页面
│   │   ├── page.tsx        # 首页
│   │   ├── about/          # 关于页
│   │   ├── chatter/        # 杂谈（列表 + 详情）
│   │   ├── friends/        # 友链
│   │   ├── moments/        # 说说（朋友圈）
│   │   ├── music/          # 音乐页
│   │   ├── photowall/      # 照片墙
│   │   ├── posts/          # 文章
│   │   ├── projects/       # 项目展示
│   │   ├── timeline/       # 时间轴
│   │   └── api/            # API 路由
│   ├── components/         # React 组件
│   ├── chatters/           # 杂谈 Markdown 文件
│   ├── moments/            # 说说 Markdown 文件
│   ├── posts/              # 文章 Markdown 文件
│   ├── data/               # 数据文件（项目、相册）
│   └── siteConfig.ts       # 站点全局配置
└── netease-api/            # 网易云音乐 API 子模块
```

---

## ⚙️ 环境变量

在 Vercel 或本地 `.env.local` 中配置：

```env
# DeepSeek AI（文章总结 + AI 搜索）
DEEPSEEK_API_KEY=your_deepseek_api_key

# GitHub OAuth（Gitalk 评论）
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## 🎨 自定义

### 站点信息
编辑 `XHBlogs/siteConfig.ts` 修改博客名称、头像、简介、社交链接等。

### 项目展示
编辑 `XHBlogs/data/projects.ts` 添加或修改展示的 GitHub 项目。

### 照片墙
编辑 `XHBlogs/data/albums.ts` 管理相册和照片。

### 内容写作
- **文章**：在 `XHBlogs/posts/` 新建 `.md` 文件
- **杂谈**：在 `XHBlogs/chatters/` 新建 `.md` 文件
- **说说**：在 `XHBlogs/moments/` 新建 `.md` 文件

---

## 📄 许可证

本项目基于原 [XHBlogs](https://github.com/heiehiehi/XinghuisamaBlogs) 二次开发，采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 许可协议。允许学习、分享和二次修改，但**禁止商业用途**。

---

## ⭐ Star History

如果这个项目对你有帮助，欢迎点亮 Star ⭐

---

> 🎧 写代码的时候听周杰伦，写博客的时候也听周杰伦。
> 
> — JayChou, 2026 Summer
