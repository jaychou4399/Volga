"use client";

import MusicVisualizerTool from './toolbox/MusicVisualizerTool';

export default function GlobalToolbox() {
  return (
    <div className="fixed bottom-6 left-6 z-[49] w-44">
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-700/50">
          <span className="text-xs">🎵</span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">音乐柱</span>
        </div>
        <div className="h-20">
          <MusicVisualizerTool />
        </div>
      </div>
    </div>
  );
}
