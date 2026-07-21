import { NextRequest, NextResponse } from 'next/server'

const NET_EASE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Referer: 'https://music.163.com/',
}

type SongResult = {
  id: string
  name?: string
  artist?: string
  author?: string
  cover?: string
  pic?: string
  url?: string
  lrc?: string
  error?: string
}

async function fetchSongDetail(songId: string): Promise<any> {
  // 优先用新接口（支持 11 位 ID）
  try {
    const res = await fetch(
      `https://music.163.com/api/v3/song/detail?c=${encodeURIComponent(JSON.stringify([{id: Number(songId), v: 0}]))}`,
      { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) },
    )
    if (res.ok) {
      const data = await res.json()
      const song = data.songs?.[0]
      if (song) return song
    }
  } catch { /* fall through */ }

  // 回退到老接口
  try {
    const res = await fetch(
      `https://music.163.com/api/song/detail/?id=${songId}&ids=[${songId}]`,
      { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) },
    )
    if (res.ok) {
      const data = await res.json()
      const song = data.songs?.[0]
      if (song) return song
    }
  } catch { /* fall through */ }

  return null
}

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids')
  if (!ids) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 })
  }

  const songIds = ids.split(',').map((id) => id.trim()).filter(Boolean)

  const results: SongResult[] = await Promise.all(
    songIds.map(async (songId): Promise<SongResult> => {
      try {
        const [song, lrcData] = await Promise.all([
          fetchSongDetail(songId),
          fetch(
            `https://music.163.com/api/song/lyric?id=${songId}&lv=-1&kv=-1&tv=-1`,
            { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) },
          ).then(r => r.ok ? r.json() : null).catch(() => null),
        ])

        if (!song) {
          return { id: songId, error: 'not_found' }
        }

        let lrcText = ''
        try { lrcText = lrcData?.lrc?.lyric || '' } catch { /* ok */ }

        const artistName = song.ar?.[0]?.name || song.artists?.[0]?.name || '未知歌手'

        return {
          id: songId,
          name: song.name,
          artist: artistName,
          author: artistName,
          cover: song.al?.picUrl || song.album?.picUrl || '',
          pic: song.al?.picUrl || song.album?.picUrl || '',
          url: `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
          lrc: lrcText,
        }
      } catch (error) {
        console.error(`[api/music] 获取歌曲 ${songId} 失败:`, error)
        return { id: songId, error: String(error) }
      }
    }),
  )

  return NextResponse.json(results)
}