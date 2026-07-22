import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PostNav = { slug: string; title: string };

export default function PostNavigation({ prev, next }: { prev?: PostNav; next?: PostNav }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="flex-1 group p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:border-indigo-500/30 transition-all">
          <span className="text-xs text-slate-500 flex items-center gap-1"><ChevronLeft size={14} /> 上一篇</span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 line-clamp-1 mt-1">{prev.title}</p>
        </Link>
      ) : <div className="flex-1" />}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="flex-1 group p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:border-indigo-500/30 transition-all text-right">
          <span className="text-xs text-slate-500 flex items-center justify-end gap-1">下一篇 <ChevronRight size={14} /></span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 line-clamp-1 mt-1">{next.title}</p>
        </Link>
      ) : <div className="flex-1" />}
    </div>
  );
}
