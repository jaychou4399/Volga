const { serveNcmApi } = require("NeteaseCloudMusicApi");

serveNcmApi({
  port: 4300,
  host: "127.0.0.1",
}).then(() => {
  console.log("Netease API 运行在 http://localhost:4300");
});
