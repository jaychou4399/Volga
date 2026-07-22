"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import TimelineNode from "./TimelineNode";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, LayoutGrid, ListTree, Calendar, Hash, ArrowUp } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
  type: "post" | "chatter" | "moment";
  slug?: string;
  id?: string;
  title: string;
  date: string;
  description?: string;
  content?: string;
  tags: string[];
  cover?: string;
  location?: string;
  images?: string[];
  mood?: string;
}

const typeLabels: Record<string, string> = {
  post: "文章",
  chatter: "杂谈",
  moment: "说说",
};

const typeColors: Record<string, string> = {
  post: "bg-blue-500",
  chatter: "bg-purple-500",
  moment: "bg-pink-500",
};

const typeLinks = {
  post: (slug: string) => `/posts/${slug}`,
  chatter: (slug: string) => `/chatter/${slug}`,
  moment: () => `/moments`,
};

export default function TimelineClient({ items, tags }: { items: TimelineItem[]; tags: { name: string; count: number }[] }) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "card">("timeline");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enforceMobileView = () => {
      if (window.innerWidth < 768) setViewMode("card");
    };
    enforceMobileView();
    window.addEventListener("resize", enforceMobileView);
    return () => window.removeEventListener("resize", enforceMobileView);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const tagMatch = selectedTag === "All" || item.tags?.includes(selectedTag);
      const typeMatch = typeFilter === "All" || item.type === typeFilter;
      return tagMatch && typeMatch;
    });
  }, [items, selectedTag, typeFilter]);

  const getItemLink = (item: TimelineItem) => {
    if (item.type === "post" && item.slug) return `/posts/${item.slug}`;
    if (item.type === "chatter" && item.slug) return `/chatter/${item.slug}`;
    return `/moments`;
  };

  const getItemPreview = (item: TimelineItem) => {
    if (item.description) return item.description;
    if (item.content) return item.content;
    return "";
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-28 px-4 sm:px-10 relative z-10">
      <div className="text-center mb-12 relative z-20">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
          归档与探索
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2 italic">
          <Sparkles size={16} className="text-indigo-500" /> 总计 {items.length} 条记录
        </p>
        <div className="flex justify-center gap-3 mt-3 text-xs">
          <span className="text-blue-500">文章 {items.filter((i) => i.type === "post").length}</span>
          <span className="text-purple-500">杂谈 {items.filter((i) => i.type === "chatter").length}</span>
          <span className="text-pink-500">说说 {items.filter((i) => i.type === "moment").length}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 mb-16 relative z-[99]">
        {/* 搜索栏 */}
        <div className="relative w-full max-w-lg group" ref={searchContainerRef}>
          <input
            type="text"
            placeholder="搜寻时间线中的记录..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-2xl px-6 py-4 pl-14 text-slate-800 dark:text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-400 font-medium relative z-20"
          />
          <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-20" />

          <AnimatePresence>
            {isDropdownOpen && searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden max-h-[360px] overflow-y-auto z-[100]"
              >
                {searchResults.length > 0 ? (
                  <div className="flex flex-col py-2">
                    {searchResults.map((item, idx) => (
                      <Link key={`${item.type}-${item.slug || item.id}-${idx}`} href={getItemLink(item)}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${typeColors[item.type]}`} />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400">{typeLabels[item.type]}</span>
                          <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{item.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-slate-500">没有找到匹配的记录</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 筛选：类型 + 标签 */}
        <div className="flex flex-wrap justify-center gap-3">
          {["All", "post", "chatter", "moment"].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                typeFilter === t
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60"
              }`}>
              {t === "All" ? "全部" : typeLabels[t]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button key="tag-all" onClick={() => setSelectedTag("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedTag === "All" ? "bg-indigo-500 text-white" : "bg-white/30 dark:bg-slate-800/30 text-slate-500 hover:text-indigo-500"
            }`}>
            <Hash size={12} className="inline mr-1" /> All ({items.length})
          </button>
          {tags.map((tag) => (
            <button key={tag.name} onClick={() => setSelectedTag(tag.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTag === tag.name ? "bg-indigo-500 text-white" : "bg-white/30 dark:bg-slate-800/30 text-slate-500 hover:text-indigo-500"
              }`}>
              #{tag.name} ({tag.count})
            </button>
          ))}
        </div>

        {/* 视图切换 */}
        <div className="flex items-center gap-1 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-xl p-1 border border-white/40 dark:border-slate-700/40">
          <button onClick={() => setViewMode("timeline")}
            className={`p-2 rounded-lg transition-all ${viewMode === "timeline" ? "bg-white dark:bg-slate-700 shadow-md" : ""}`}>
            <ListTree size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white dark:bg-slate-700 shadow-md" : ""}`}>
            <LayoutGrid size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* 卡片视图 */}
        {viewMode === "card" && (
          <motion.div key="card-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16">
            {filteredItems.map((item, idx) => (
              <motion.div key={`${item.type}-${item.slug || item.id}`}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}>
                <Link href={getItemLink(item)} className="block">
                  <div className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg group hover:-translate-y-1 transition-transform duration-300">
                    {/* 封面/占位 */}
                    <div className="relative h-32 overflow-hidden">
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : item.images?.[0] ? (
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl">
                          {item.type === "moment" ? "📷" : item.type === "chatter" ? "💬" : "📝"}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                        {typeLabels[item.type]}
                      </span>
                      <span className="absolute bottom-2 left-3 text-white/90 text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded">
                        <Calendar size={10} className="inline mr-1" />{item.date.split(" ")[0]}
                      </span>
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-1 group-hover:text-indigo-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {getItemPreview(item) || "暂无预览"}
                      </p>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag: string) => (
                            <span key={tag} className="text-[8px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 时间线视图 */}
        {viewMode === "timeline" && (
          <motion.div key="timeline-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden p-2 md:p-10 min-h-[300px]">
            <div className="absolute border-opacity-20 border-indigo-500 dark:border-indigo-400/20 h-full border-2 left-1/2 transform -translate-x-1/2 rounded-full transition-colors duration-1000" />

            <div className="relative z-10 flex flex-col gap-12">
              {filteredItems.map((item, index) => (
                <div key={`${item.type}-${item.slug || item.id}`}
                  className={`flex items-center gap-4 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  {/* 时间节点 */}
                  <div className="flex-1" />
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs shrink-0 shadow-lg ${typeColors[item.type]}`}>
                    {index + 1}
                  </div>
                  {/* 内容卡片 */}
                  <Link href={getItemLink(item)} className="flex-1 group">
                    <div className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${typeColors[item.type]}`}>
                          {typeLabels[item.type]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.date.split(" ")[0]}</span>
                        {item.mood && <span className="text-[10px] text-slate-400">· {item.mood}</span>}
                        {item.location && <span className="text-[10px] text-slate-400">· 📍{item.location}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {getItemPreview(item) || "点击查看详情"}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                  时间线是空的，去发布一些内容吧 📡
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
