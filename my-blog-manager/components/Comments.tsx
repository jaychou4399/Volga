"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 动态导入 Waline
    import("@waline/client").then(({ init }) => {
      import("@waline/client/style");
      container.innerHTML = "";
      init({
        el: container,
        serverURL: siteConfig.walineServerURL,
        path: pathname,
        lang: "zh-CN",
        dark: "auto",
        emoji: [
          "https://unpkg.com/@waline/emojis@1.2.0/bilibili",
          "https://unpkg.com/@waline/emojis@1.2.0/qq",
          "https://unpkg.com/@waline/emojis@1.2.0/weibo",
          "https://unpkg.com/@waline/emojis@1.2.0/tieba",
        ],
        imageUploader: true,
        search: false,
        pageSize: 10,
      });
    });
  }, [pathname]);

  return (
    <div className="w-full mt-16 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div ref={containerRef} className="relative z-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 waline-glass" />
    </div>
  );
}
