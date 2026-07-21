const http = require("http");
const {
  song_detail, song_url_v1, lyric_new,
  playlist_track_all, playlist_detail,
} = require("NeteaseCloudMusicApi");

const PORT = 4300;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // 歌曲详情
    if (path === "/song/detail") {
      const ids = url.searchParams.get("ids");
      if (!ids) { res.writeHead(400); return res.end(JSON.stringify({ error: "Missing ids" })); }
      const result = await song_detail({ ids });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.body));
    }

    // 播放链接
    if (path === "/song/url") {
      const id = url.searchParams.get("id");
      if (!id) { res.writeHead(400); return res.end(JSON.stringify({ error: "Missing id" })); }
      const result = await song_url_v1({ id, level: "standard" });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.body));
    }

    // 歌词
    if (path === "/lyric") {
      const id = url.searchParams.get("id");
      if (!id) { res.writeHead(400); return res.end(JSON.stringify({ error: "Missing id" })); }
      const result = await lyric_new({ id });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.body));
    }

    // 歌单全部歌曲
    if (path === "/playlist/tracks") {
      const id = url.searchParams.get("id");
      if (!id) { res.writeHead(400); return res.end(JSON.stringify({ error: "Missing id" })); }
      const result = await playlist_track_all({ id });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ songs: result.body?.songs || [], code: result.body?.code || 200 }));
    }

    // 歌单详情
    if (path === "/playlist/detail") {
      const id = url.searchParams.get("id");
      if (!id) { res.writeHead(400); return res.end(JSON.stringify({ error: "Missing id" })); }
      const result = await playlist_detail({ id });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.body));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (e) {
    console.error(path, e.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Netease API: http://localhost:${PORT}`);
});
