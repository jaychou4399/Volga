"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { siteConfig } from "../siteConfig";

export default function LabComments({ pageId }: { pageId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const finalId = pageId || pathname.replace(/\/$/, "") || "/";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", siteConfig.giscusConfig.repo);
    script.setAttribute("data-repo-id", siteConfig.giscusConfig.repoId);
    script.setAttribute("data-category", siteConfig.giscusConfig.category);
    script.setAttribute("data-category-id", siteConfig.giscusConfig.categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", finalId.substring(0, 49));
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
  }, [finalId, resolvedTheme]);

  return (
    <div className="w-full mt-16 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div ref={containerRef} className="relative z-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50" />
    </div>
  );
}
