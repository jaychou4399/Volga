---
title: "GitHub 从入门到日常：让版本控制成为你的第二本能"
date: "2026-07-23"
tags:
  - GitHub
  - Git
  - 教程
  - 效率工具
mood: 教程
cover: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=675&fit=crop
description: "不只是 git push，聊聊 GitHub 那些真正提升效率的用法"
---

## 为什么你需要 GitHub

写代码的人，迟早会遇到这几个问题：

- 代码改崩了想回到昨天晚上的版本
- 和同学合作课设，文件传来传去搞不清哪个是最新的
- 想把自己写的项目展示给别人看

GitHub 就是为解决这些问题而生的。但大多数人的使用方式停留在 `git add . && git commit -m "fix" && git push`，这其实只用到了它 10% 的功能。

## 基础三连，但要养成肌肉记忆

```bash
# 1. 看看改了啥（养成习惯：commit 之前一定要看一眼）
git status
git diff

# 2. 有意义的 commit message
git add 具体文件    # 不要 git add . 一把梭
git commit -m "feat: 添加用户登录功能"   # 写清楚干了什么

# 3. 推送前先拉取
git pull --rebase  # 避免无意义的 merge commit
git push
```

## 分支策略：一个人也要用

很多人觉得"我就一个人写代码，不用分支"。大错特错。

```bash
# 开发新功能
git checkout -b feat/music-player

# 在 feat 分支随便折腾，不会搞坏 main
# 写完了、测好了，再合并
git checkout main
git merge feat/music-player
```

好处：**主分支永远是可运行的、能见人的版本**。不会出现"我改了一半但老师明天要检查"的尴尬。

## .gitignore 是你的好朋友

```gitignore
# 依赖
node_modules/
# 构建产物
.next/
dist/
# 环境变量
.env
.env.local
# 系统文件
.DS_Store
Thumbs.db
# IDE
.idea/
.vscode/
```

**原则**：能生成的东西不提交，密钥不提交，系统垃圾不提交。

## Issues + Projects：不只是 Bug 追踪

用 Issues 管理你的待办事项：

- 📝 记录想加的功能
- 🐛 记录发现的 Bug
- 💡 记录突然的想法

用 Projects（看板）可视化进度：Todo → In Progress → Done。

这比写在手机备忘录里靠谱多了——它是和代码在一起的。

## Actions：白嫖 CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
```

每次 push 自动部署，不用手动操作。GitHub Actions 每月有 2000 分钟的免费额度，对学生完全够用。

## Profile README：你的个人名片

在你的用户名同名仓库里创建 `README.md`，它会显示在你的 GitHub 主页。

一个好的 Profile 应该包含：
- 👋 简短自我介绍
- 🔧 技术栈
- 📊 GitHub 统计（用 [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)）
- 📌 置顶项目

## 学生福利：GitHub Student Pack

用学校邮箱申请 [GitHub Student Developer Pack](https://education.github.com/pack)，免费拿：
- GitHub Copilot（AI 辅助编程，原价 $10/月）
- 各种云服务额度
- 域名（.me 域名免费一年）
- Figma、Canva Pro 等设计工具

**申请秒过**，只需要学生证照片。

## 最后

GitHub 不只是一个存代码的地方，它是一个**程序员的作品集 + 学习轨迹 + 协作平台**。

从今天开始，把每一个小项目都 push 上去。半年后，你的 GitHub 贡献图会是你最好的简历。

---

> 今天 push 的代码，是未来面试时最硬的底气。
