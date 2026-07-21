import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = "Ov23ctQsmt7vPsj3xIex";
const GITHUB_CLIENT_SECRET = "dbc3436aacf1d029c8a7051d86f573d6e785329c";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // 解析 Gitalk 发来的 code
    let code = "";
    try {
      const params = new URLSearchParams(body);
      code = params.get("code") || "";
    } catch {
      const json = JSON.parse(body);
      code = json.code || "";
    }

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // 服务端直接换取 token，不依赖客户端传 client_secret
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[github proxy] error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
