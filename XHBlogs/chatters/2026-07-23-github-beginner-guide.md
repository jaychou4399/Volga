---
title: "GitHub 零基础入门教程：从小白到日常使用"
date: "2026-07-23"
description: "保姆级 GitHub 教程：注册、Git 安装、仓库创建、提交推送、分支管理、协作开发，一步步带你上手"
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop"
mood: 教程
tags: ["GitHub", "Git", "教程", "效率工具"]
---

## 为什么要学 GitHub？

写代码的人，迟早会遇上这些场景：

- 代码改崩了，想回到昨天晚上的版本
- 和同学合作课设，文件传来传去搞不清哪个是最新的
- 想把自己写的项目展示给别人看，但发压缩包太 low
- 换电脑了，代码全在老电脑里拿不出来

**GitHub 一键全解决。**

## 第 0 步：搞清楚 GitHub 和 Git 的关系

很多人一开始就搞混——**Git 是工具，GitHub 是平台**。

| Git | GitHub |
|-----|--------|
| 安装在电脑上的版本控制工具 | 托管 Git 仓库的网站 |
| 在你本机运行 | 在云端运行 |
| 负责记录每一次修改 | 负责存储和分享代码 |
| 离线也能用 | 需要联网 |

简单类比：Git = 相机，GitHub = 朋友圈。你用相机拍照（记录版本），发到朋友圈给别人看（分享代码）。

## 第 1 步：注册 GitHub 账号

1. 打开 [github.com](https://github.com)
2. 点右上角 **Sign up** → 输入邮箱、密码、用户名
3. 验证邮箱 → 完成注册

📌 **取名建议**：用英文名 + 数字或专业缩写即可，尽量不要用火星文——以后写在简历上的。

## 第 2 步：安装 Git

### Windows

去 [git-scm.com](https://git-scm.com) 下载安装包，一路 Next。安装完成后右键菜单会有 `Git Bash Here`。

装完验证：

```bash
git --version
# 输出类似：git version 2.47.0
```

### 配置身份信息（必须做！）

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

每次提交都会带上这个身份标签，所以名字要和你 GitHub 账号一致。

## 第 3 步：创建你的第一个仓库

### 在 GitHub 上创建

1. 登录 GitHub → 点右上角 **+** → **New repository**
2. 填写 Repository name（比如 `my-first-project`）
3. 选 Public（公开）或 Private（私有）
4. ✅ 勾选 "Add a README file"
5. 点 **Create repository**

### 克隆到本地

```bash
# 把你的仓库地址复制下来，格式是 https://github.com/你的用户名/仓库名.git
git clone https://github.com/你的用户名/my-first-project.git
cd my-first-project
```

恭喜！现在你本地就有一个和 GitHub 同步的文件夹了。

## 第 4 步：第一次提交（add + commit + push）

这是日常使用频率最高的操作，俗称"Git 三连"：

```bash
# 1. 看看文件夹里改了什么
git status

# 2. 把修改的文件加入"待提交清单"
git add .          # . 表示当前文件夹下所有改动
# 或者精确到单个文件（推荐）：
git add index.html

# 3. 提交到本地仓库，附带说明
git commit -m "feat: 添加首页"

# 4. 推送到 GitHub
git push
```

打开 GitHub 网页刷新——你的文件已经在线上了！

### commit message 怎么写？

| 前缀 | 含义 | 例子 |
|------|------|------|
| `feat:` | 新功能 | `feat: 添加音乐播放器` |
| `fix:` | 修 Bug | `fix: 修复首页图片加载失败` |
| `docs:` | 改文档 | `docs: 更新 README` |
| `style:` | 改样式 | `style: 调整导航栏颜色` |
| `refactor:` | 重构代码 | `refactor: 拆分首页组件` |

**原则：让别人（和三个月后的你自己）一眼能看懂你干了什么。**

## 第 5 步：分支——一个人也要用

```bash
# 创建并切换到新分支
git checkout -b feat/music-player

# 确认当前在哪个分支
git branch

# 在新分支上随便改，不会影响 main
# ... 修改代码 ...

git add .
git commit -m "feat: 完成音乐播放器基础功能"
git push origin feat/music-player
```

好处：**main 分支永远是可运行、能见人的稳定版本**。不会出现"我改了一半但明天要给老师看"的尴尬。

```bash
# 新功能写完了、测好了，合并回 main
git checkout main
git merge feat/music-player
git push
```

## 第 6 步：拉取更新（pull）

当你在多台设备上写代码，或者和别人合作时，先拉再推：

```bash
# 从 GitHub 下载最新版本到本地
git pull

# 推荐加 --rebase，避免产生无意义的合并提交
git pull --rebase
```

**黄金法则：每次 push 之前先 pull。**

## 第 7 步：.gitignore——告诉 Git 忽略什么

在项目根目录创建 `.gitignore` 文件：

```gitignore
# 依赖（能通过 npm install 装回来，不用上传）
node_modules/

# 构建产物
.next/
dist/
build/

# 密钥和环境变量（绝对不要上传！）
.env
.env.local
*.key

# 系统垃圾
.DS_Store
Thumbs.db

# IDE 配置
.idea/
.vscode/
```

**三条原则**：能生成的不提交、密钥不提交、系统垃圾不提交。

## 第 8 步：常用场景速查

### 场景一：改崩了想回退

```bash
# 查看提交历史
git log --oneline

# 撤销某个文件到上次提交时的状态
git checkout -- 文件名

# 回退到某一次提交（保留修改记录）
git revert 提交ID
```

### 场景二：不小心提交了不该提交的东西

```bash
# 撤销最近一次 commit（但保留文件改动）
git reset --soft HEAD~1
```

### 场景三：想临时存一下改动，切去干别的事

```bash
# 暂存当前修改
git stash

# 干完别的事回来恢复
git stash pop
```

## 第 9 步：学生福利别错过

用学校邮箱申请 **[GitHub Student Developer Pack](https://education.github.com/pack)**，免费拿：

- 🎓 **GitHub Copilot**（AI 写代码，原价 $10/月）
- ☁️ 各种云服务额度（Vercel、Heroku 等）
- 🌐 免费域名一年
- 🎨 Figma、Canva Pro

申请只需要学生证照片，通常当天就能通过。

## 第 10 步：把 GitHub 变成你的简历

1. **建一个和用户名同名的仓库**（比如用户名叫 `jaychou4399`，就建 `jaychou4399/jaychou4399`），里面的 `README.md` 会自动显示在你的 GitHub 主页
2. 写好自我介绍、技术栈、GitHub 统计
3. 坚持每天 push，让贡献图绿起来

---

## 总结

| 操作 | 命令 |
|------|------|
| 克隆仓库 | `git clone 地址` |
| 查看状态 | `git status` |
| 添加文件 | `git add 文件名` |
| 提交 | `git commit -m "说明"` |
| 推送 | `git push` |
| 拉取 | `git pull --rebase` |
| 创建分支 | `git checkout -b 分支名` |
| 切换分支 | `git checkout 分支名` |
| 查看历史 | `git log --oneline` |
| 暂存改动 | `git stash` |

**开始动手吧——把你现在的这个博客项目 push 上去，就是最好的练习。**

> GitHub 不只是一个存代码的地方，它是你作为开发者的**作品集 + 成长轨迹 + 社交名片**。每个小项目都值得被记录。
