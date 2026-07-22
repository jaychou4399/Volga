import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const runtime = "edge";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  excerpt: string;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || !query.trim()) {
      return new Response(JSON.stringify({ results: [] }), { status: 200 });
    }

    const apiKey = (process.env.DEEPSEEK_API_KEY || "").trim();
    if (!apiKey) return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });

    // 读取所有文章元数据
    const postsDir = path.join(process.cwd(), "posts");
    const posts: PostMeta[] = [];

    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
        const { data, content } = matter(raw);
        const clean = content.replace(/```[\s\S]*?```/g, "").replace(/[#*>`\[\]()!]/g, "").trim();
        posts.push({
          slug: file.replace(/\.md$/, ""),
          title: data.title || file.replace(".md", ""),
          description: data.description || "",
          tags: data.tags || [],
          date: data.date || "",
          excerpt: clean.substring(0, 200),
        });
      }
    }

    if (posts.length === 0) {
      return new Response(JSON.stringify({ results: [] }), { status: 200 });
    }

    // 构建文章索引字符串（只发元数据，节省 token）
    const index = posts.map((p, i) =>
      `[${i}] 标题：${p.title} | 描述：${p.description} | 标签：${p.tags.join(", ")} | 日期：${p.date}`
    ).join("\n");

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
            content: "你是一个博客搜索引擎。根据用户查询，从文章列表中找到最相关的文章。只返回匹配的文章编号（如 [0], [3], [7]），按相关度排序，最多5个。如果没有任何匹配，返回空数组 []。不要返回任何其他文字。"
          },
          {
            role: "user",
            content: `用户查询：${query}\n\n文章列表：\n${index}\n\n请返回最相关文章的编号数组：`,
          },
        ],
        max_tokens: 100,
        temperature: 0.1,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: result.error?.message }), { status: response.status });
    }

    const rawText = result.choices?.[0]?.message?.content || "[]";
    // 提取 [数字] 格式
    const matches = rawText.match(/\[(\d+)\]/g);
    if (!matches) return new Response(JSON.stringify({ results: [] }), { status: 200 });

    const indices = matches.map((m: string) => parseInt(m.replace(/[\[\]]/g, ""))).filter((i: number) => i >= 0 && i < posts.length);
    const uniqueIndices = [...new Set(indices)].slice(0, 5);

    const results = uniqueIndices.map(i => ({
      slug: posts[i].slug,
      title: posts[i].title,
      description: posts[i].description,
      date: posts[i].date,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message, results: [] }), { status: 200 });
  }
}