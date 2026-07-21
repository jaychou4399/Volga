"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { albums, Album } from "../../data/albums";

// 懒加载图片组件：只有进入视口才加载
function LazyImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "200px" } // 提前 200px 开始加载
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ""}`}>
      {/* 骨架屏占位 */}
      <div className={`w-full aspect-[4/3] bg-slate-200 dark:bg-slate-700 animate-pulse rounded-2xl ${loaded ? "hidden" : "block"}`} />
      {inView && (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
        />
      )}
    </div>
  );
}

export default function PhotoWallClient() {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setActiveQuery(searchQuery.toLowerCase());
      setIsTransitioning(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { matchedAlbums, matchedPhotos } = useMemo(() => {
    if (!activeQuery) return { matchedAlbums: albums, matchedPhotos: [] };
    const matchedAlbums = albums.filter(
      (album) =>
        album.title.toLowerCase().includes(activeQuery) ||
        album.description.toLowerCase().includes(activeQuery)
    );
    const matchedPhotos = albums
      .flatMap((album) => album.photos.map((p) => ({ ...p, albumName: album.title })))
      .filter((photo) => photo.caption?.toLowerCase().includes(activeQuery));
    return { matchedAlbums, matchedPhotos };
  }, [activeQuery]);

  return (
    <div className="min-h-screen relative pb-32">
      <Navbar />
      <PageTransition>
        <div className="w-full max-w-7xl mx-auto mt-28 px-4 sm:px-10 relative z-10">
          {!currentAlbum && (
            <div className="animate-fade-in-up">
              <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest mb-2 transition-colors duration-700">
                    光影画廊
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wider transition-colors duration-700">
                    定格时间，封存泰拉与现实的每一次心跳
                  </p>
                </div>
                <div className="relative w-full md:w-80 group">
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="搜索相册名或照片描述..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full text-sm text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all duration-700"
                  />
                </div>
              </div>

              <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                {activeQuery && matchedPhotos.length > 0 && (
                  <div className="mb-16">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                      <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                      匹配的单张照片 ({matchedPhotos.length})
                    </h3>
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                      {matchedPhotos.map((photo, index) => (
                        <div key={`search-photo-${index}`} onClick={() => setSelectedImage(photo)}
                          className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in shadow-lg bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/10 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20"
                        >
                          <LazyImage src={photo.url} alt={photo.caption} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                            {photo.caption && (
                              <p className="text-white font-medium text-sm drop-shadow-md">{photo.caption}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 相册卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {matchedAlbums.map((album, index) => (
                    <div key={album.id} onClick={() => setCurrentAlbum(album)}
                      className="group cursor-pointer rounded-3xl overflow-hidden shadow-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/10 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/20 animate-fade-in-up"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img src={album.cover} alt={album.title} loading="lazy" decoding="async"
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 text-white/80 text-xs font-bold tracking-wider bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          {album.date}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{album.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{album.description}</p>
                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-500">
                          <span>{album.photos.length} 张照片</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 相册详情 */}
          {currentAlbum && (
            <div className="animate-fade-in-up">
              <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setCurrentAlbum(null)}
                      className="flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <span className="bg-white/40 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-lg border border-white/50 dark:border-white/10 shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </span>
                      返回画廊
                    </button>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{currentAlbum.date}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-wider mb-2">{currentAlbum.title}</h1>
                  <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">{currentAlbum.description}</p>
                </div>
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm">
                  共 <span className="text-indigo-500 dark:text-indigo-400 text-lg">{currentAlbum.photos.length}</span> 瞬间
                </div>
              </div>

              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {currentAlbum.photos.map((photo, index) => (
                  <div key={`${photo.url}-${index}`} onClick={() => setSelectedImage(photo)}
                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in shadow-lg bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/10 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20"
                  >
                    <LazyImage src={photo.url} alt={photo.caption || "照片"} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      {photo.caption && (
                        <p className="text-white font-medium text-sm drop-shadow-md">{photo.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageTransition>

      {/* 全屏预览 */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-10 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={selectedImage.url} alt={selectedImage.caption || "全屏照片"}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.caption && (
            <div className="absolute bottom-10 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium tracking-wide shadow-2xl">
              {selectedImage.caption}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
