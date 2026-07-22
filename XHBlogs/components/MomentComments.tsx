"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { siteConfig } from "../siteConfig";

interface MomentCommentsProps {
  id: string;
}

export default function MomentComments({ id }: MomentCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

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
    script.setAttribute("data-term", id.substring(0, 49));
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
  }, [id, resolvedTheme]);

  return <div ref={containerRef} className="moment-giscus" />;
}
