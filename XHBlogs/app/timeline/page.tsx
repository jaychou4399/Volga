import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { siteConfig } from "../../siteConfig";
import TimelineClient from "../../components/TimelineClient";
import { ToastProvider } from "../../components/ToastProvider";

export const metadata = {
  title: "归档与探索 | " + siteConfig.title,
};

interface TimelineItem {
  type: "post" | "chatter" | "moment";
  slug?: string;
  id?: string;
  title: string;
  date: string;
  description?: string;
  content?: string;
  tags: string[];
  cover?: string;
  location?: string;
  images?: string[];
  mood?: string;
}

export default function Timeline() {
  const items: TimelineItem[] = [];

  // 1. 加载文章
  const postsDir = path.join(process.cwd(), "posts");
  try {
    if (fs.existsSync(postsDir)) {
      fs.readdirSync(postsDir)
        .filter((f) => f.endsWith(".md"))
        .forEach((fileName) => {
          const slug = fileName.replace(/\.md$/, "");
          const { data } = matter(fs.readFileSync(path.join(postsDir, fileName), "utf8"));
          items.push({
            type: "post",
            slug,
            title: data.title || "无标题",
            date: data.date || "1970-01-01",
            description: data.description || "",
            tags: Array.isArray(data.tags) ? data.tags : ["未分类"],
            cover: data.cover || siteConfig.defaultPostCover,
          });
        });
    }
  } catch (e) { console.error("读取文章失败", e); }

  // 2. 加载杂谈
  const chattersDir = path.join(process.cwd(), "chatters");
  try {
    if (fs.existsSync(chattersDir)) {
      fs.readdirSync(chattersDir)
        .filter((f) => f.endsWith(".md"))
        .forEach((fileName) => {
          const slug = fileName.replace(/\.md$/, "");
          const { data } = matter(fs.readFileSync(path.join(chattersDir, fileName), "utf8"));
          items.push({
            type: "chatter",
            slug,
            title: data.title || "杂谈",
            date: data.date || "1970-01-01",
            tags: Array.isArray(data.tags) ? data.tags : [],
            cover: data.cover || siteConfig.defaultPostCover,
            mood: data.mood || "",
          });
        });
    }
  } catch (e) { console.error("读取杂谈失败", e); }

  // 3. 加载说说
  const momentsDir = path.join(process.cwd(), "moments");
  try {
    if (fs.existsSync(momentsDir)) {
      fs.readdirSync(momentsDir)
        .filter((f) => f.endsWith(".md"))
        .forEach((fileName) => {
          const id = fileName.replace(/\.md$/, "");
          const { data, content } = matter(fs.readFileSync(path.join(momentsDir, fileName), "utf8"));
          items.push({
            type: "moment",
            id,
            title: "说说",
            date: data.date || "1970-01-01",
            content: content.trim().substring(0, 80),
            tags: [],
            location: data.location || "",
            images: data.images || [],
          });
        });
    }
  } catch (e) { console.error("读取说说失败", e); }

  // 按日期倒序
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 统计标签（仅文章和杂谈）
  const tagCounts: Record<string, number> = {};
  items.forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const tagsArray = Object.keys(tagCounts)
    .map((name) => ({ name, count: tagCounts[name] }))
    .sort((a, b) => b.count - a.count);

  return (
    <ToastProvider>
      <div className="min-h-screen relative pb-32">
        <Navbar />
        <PageTransition>
          <TimelineClient items={items} tags={tagsArray} />
        </PageTransition>
      </div>
    </ToastProvider>
  );
}
