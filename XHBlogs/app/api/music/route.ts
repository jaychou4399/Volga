import { NextRequest, NextResponse } from "next/server";

const LOCAL_API = process.env.NETEASE_API_URL || "http://localhost:4300";
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

async function fetchSingleFromLocal(songId: string): Promise<SongResult | null> {
  try {
    const [detailRes, urlRes, lrcRes] = await Promise.all([
      fetch(`${LOCAL_API}/song/detail?ids=${songId}`, { signal: AbortSignal.timeout(6000) }),
      fetch(`${LOCAL_API}/song/url?id=${songId}`, { signal: AbortSignal.timeout(6000) }),
      fetch(`${LOCAL_API}/lyric?id=${songId}`, { signal: AbortSignal.timeout(6000) }),
    ]);
    const detailData = await detailRes.json().catch(() => ({}));
    const song = detailData?.songs?.[0];
    if (!song) return null;
    const urlData = await urlRes.json().catch(() => ({}));
    const lrcData = await lrcRes.json().catch(() => ({}));
    return {
      id: songId,
      name: song.name,
      artist: song.ar?.[0]?.name || "未知歌手",
      author: song.ar?.[0]?.name || "未知歌手",
      cover: song.al?.picUrl || "",
      pic: song.al?.picUrl || "",
      url: urlData?.data?.[0]?.url || "",
      lrc: lrcData?.lrc?.lyric || lrcData?.lyric || "",
    };
  } catch { return null; }
}

async function fetchFromMeting(songId: string): Promise<SongResult | null> {
  try {
    const [detailRes, lrcRes] = await Promise.all([
      fetch(`${METING_BASE}?server=netease&type=song&id=${songId}`, { signal: AbortSignal.timeout(6000) }),
      fetch(`${METING_BASE}?server=netease&type=lrc&id=${songId}`, { signal: AbortSignal.timeout(6000) }),
    ]);
    const detailData = await detailRes.json().catch(() => []);
    const song = detailData?.[0];
    if (!song || !song.name) return null;
    let lrcText = "";
    try { lrcText = await lrcRes.text(); } catch { /* ok */ }
    return {
      id: songId, name: song.name,
      artist: song.artist || song.author || "未知歌手",
      author: song.artist || song.author || "未知歌手",
      cover: song.pic || song.cover || "",
      pic: song.pic || song.cover || "",
      url: song.url || "", lrc: lrcText,
    };
  } catch { return null; }
}

async function fetchSong(songId: string): Promise<SongResult> {
  const local = await fetchSingleFromLocal(songId);
  if (local && local.name) return local;
  const meting = await fetchFromMeting(songId);
  if (meting && meting.name) return meting;
  return { id: songId, error: "not_found" };
}

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get("playlist");
  const ids = request.nextUrl.searchParams.get("ids");

  if (!playlistId && !ids) {
    return NextResponse.json({ error: "Missing playlist or ids" }, { status: 400 });
  }

  // 歌单模式
  if (playlistId) {
    try {
      // 获取歌单歌曲列表（含详情）
      const tracksRes = await fetch(`${LOCAL_API}/playlist/tracks?id=${playlistId}`, {
        signal: AbortSignal.timeout(15000),
      });
      const tracksData = await tracksRes.json().catch(() => ({}));
      const tracks = tracksData.songs || [];

      if (!tracks.length) {
        return NextResponse.json([{ id: playlistId, error: "empty_playlist" }]);
      }

      // 限制最多50首，避免超时
      const limitedTracks = tracks.slice(0, 50);

      // 并行获取播放链接和歌词
      const results = await Promise.all(
        limitedTracks.map(async (track: any): Promise<SongResult> => {
          const songId = String(track.id);
          try {
            const [urlRes, lrcRes] = await Promise.all([
              fetch(`${LOCAL_API}/song/url?id=${songId}`, { signal: AbortSignal.timeout(5000) }),
              fetch(`${LOCAL_API}/lyric?id=${songId}`, { signal: AbortSignal.timeout(5000) }),
            ]);
            const urlData = await urlRes.json().catch(() => ({}));
            const lrcData = await lrcRes.json().catch(() => ({}));
            return {
              id: songId,
              name: track.name,
              artist: track.ar?.[0]?.name || "未知歌手",
              author: track.ar?.[0]?.name || "未知歌手",
              cover: track.al?.picUrl || "",
              pic: track.al?.picUrl || "",
              url: urlData?.data?.[0]?.url || "",
              lrc: lrcData?.lrc?.lyric || lrcData?.lyric || "",
            };
          } catch {
            return { id: songId, error: "fetch_failed" };
          }
        })
      );

      return NextResponse.json(results);
    } catch (e: any) {
      return NextResponse.json([{ id: playlistId, error: e.message }]);
    }
  }

  // 单曲模式
  const songIds = ids!.split(",").map((id) => id.trim()).filter(Boolean);
  const results = await Promise.all(songIds.map(fetchSong));
  return NextResponse.json(results);
}
