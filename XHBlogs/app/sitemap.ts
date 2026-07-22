import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://volga-blog.vercel.app";

  const routes = ["", "/projects", "/photowall", "/timeline", "/music", "/friends", "/moments", "/chatter", "/about"].map(
    (route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })
  );

  // 添加文章
  const postsDir = path.join(process.cwd(), "posts");
  if (fs.existsSync(postsDir)) {
    fs.readdirSync(postsDir).filter((f) => f.endsWith(".md")).forEach((f) => {
      routes.push({ url: `${baseUrl}/posts/${f.replace(".md", "")}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 });
    });
  }

  return routes;
}
