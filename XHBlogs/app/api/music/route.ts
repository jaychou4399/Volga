import { NextRequest, NextResponse } from "next/server";

// Meting API 代理 - 网易云音乐
// type=song 返回歌曲详情 (name, artist, url, pic, lrc 均为可用的代理地址)
const METING_BASE = "https://api.injahow.cn/meting/";

type SongResult = {
  id: string;
  name?: string;
  artist?: string;
  author?: string;
  cover?: string;
  pic?: string;
  url?: string;
  lrc?: string;
  error?: string;
};

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");
  if (!ids) {
    return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  const songIds = ids.split(",").map((id) => id.trim()).filter(Boolean);

  const results: SongResult[] = await Promise.all(
    songIds.map(async (songId): Promise<SongResult> => {
      try {
        // 获取歌曲详情 (name, artist, cover, play_url, lrc_url)
        const detailRes = await fetch(
          `${METING_BASE}?server=netease&type=song&id=${songId}`
        );
        const detailData = await detailRes.json().catch(() => []);
        const song = detailData?.[0];

        if (!song || !song.name) {
          return { id: songId, error: "not_found" };
        }

        // 获取歌词文本
        let lrcText = "";
        try {
          const lrcRes = await fetch(
            `${METING_BASE}?server=netease&type=lrc&id=${songId}`
          );
          lrcText = await lrcRes.text();
        } catch { /* ok */ }

        // song.url 直接就是可播放的音频代理地址
        // song.pic 是封面代理地址
        // song.lrc 是歌词代理地址 (但我们已经单独获取了文本)

        return {
          id: songId,
          name: song.name,
          artist: song.artist || song.author || "未知歌手",
          author: song.artist || song.author || "未知歌手",
          cover: song.pic || song.cover || "",
          pic: song.pic || song.cover || "",
          url: song.url || "",
          lrc: lrcText,
        };
      } catch (error) {
        console.error(`[api/music] 获取歌曲 ${songId} 失败:`, error);
        return { id: songId, error: String(error) };
      }
    })
  );

  return NextResponse.json(results);
}
