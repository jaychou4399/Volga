import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { siteConfig } from "@/siteConfig";

export async function GET() {
  const postsDir = path.join(process.cwd(), "posts");
  const posts: any[] = [];

  if (fs.existsSync(postsDir)) {
    fs.readdirSync(postsDir)
      .filter((f) => f.endsWith(".md"))
      .forEach((file) => {
        const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
        const { data, content } = matter(raw);
        posts.push({
          slug: file.replace(/\.md$/, ""),
          title: data.title || file,
          description: data.description || "",
          date: data.date || "1970-01-01",
          content: content.substring(0, 500),
        });
      });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const baseUrl = "https://volga-blog.vercel.app";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.bio}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml"/>
    ${posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/posts/${p.slug}</link>
      <guid>${baseUrl}/posts/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description || p.content}]]></description>
    </item>`).join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}