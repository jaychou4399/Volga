// app/api/chat/route.ts
import { siteConfig } from '../../../siteConfig';

export const runtime = 'edge';

export async function POST(req: Request) {
  console.log("[1/5] 路由进入：开始对接 DeepSeek 脑回路");

  try {
    const { message } = await req.json();

    const apiKey = (process.env.DEEPSEEK_API_KEY || '').trim();

    if (!apiKey) {
      console.error("找不到 DeepSeek API Key");
      return new Response(JSON.stringify({ error: "Key missing" }), { status: 500 });
    }

    const modelId = siteConfig.geminiConfig.modelId;
    const url = "https://api.deepseek.com/v1/chat/completions";

    console.log(`[2/5] 正在呼叫模型: ${modelId}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: siteConfig.geminiConfig.systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: siteConfig.geminiConfig.maxOutputTokens,
        temperature: siteConfig.geminiConfig.temperature,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepSeek 拒绝了请求:", JSON.stringify(data));
      return new Response(JSON.stringify({
        error: `模型拒绝访问: ${response.status}`,
        details: data.error?.message || "未知错误"
      }), { status: response.status });
    }

    console.log("[3/5] DeepSeek 成功响应");
    const reply = data.choices?.[0]?.message?.content || "本喵现在不想理你喵...";

    console.log("[4/5] 回复已生成，准备传回前端");

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("[5/5] 运行时崩溃:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ status: "Ready", model: "DeepSeek" }), { status: 200 });
}