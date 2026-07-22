import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400 });

    const apiKey = (process.env.DEEPSEEK_API_KEY || "").trim();
    if (!apiKey) return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });

    // 读取文章
    const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // 清理 markdown（去掉代码块，保留正文）
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, "[代码块]")
      .replace(/!\[.*?\]\(.*?\)/g, "[图片]")
      .replace(/<[^>]*>/g, "")
      .trim();

    // 截断过长内容（DeepSeek 上下文限制）
    const maxChars = 3000;
    const truncated = cleanContent.length > maxChars
      ? cleanContent.substring(0, maxChars) + "\n\n[文章后续内容已省略...]"
      : cleanContent;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个专业的技术文章总结助手。用中文生成简洁的摘要，包含：1) 文章主题一句话概括 2) 3-5个核心要点（用emoji点缀）。总共不超过200字。"
          },
          {
            role: "user",
            content: `请总结以下文章《${data.title || slug}》：

${truncated}`,
          },
        ],
        max_tokens: 400,
        temperature: 0.5,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: result.error?.message || "AI 请求失败" }), { status: response.status });
    }

    const summary = result.choices?.[0]?.message?.content || "无法生成总结";
    return new Response(JSON.stringify({ summary }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}