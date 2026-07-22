import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center px-6">
        <div className="text-8xl font-black text-indigo-500 mb-4 animate-bounce">404</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">页面走丢了喵~</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          你试图访问的页面不存在，可能已经被删除、移动，或者从一开始就不存在。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>
    </div>
  );
}