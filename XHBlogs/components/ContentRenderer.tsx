"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  themeVariables: {
    primaryColor: "#6366f1",
    primaryTextColor: "#1e293b",
    primaryBorderColor: "#818cf8",
    lineColor: "#94a3b8",
    secondaryColor: "#f0abfc",
    tertiaryColor: "#a5b4fc",
  },
});

interface ContentRendererProps {
  contentHtml: string;
}

export default function ContentRenderer({ contentHtml }: ContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // === 1. Mermaid 图表渲染 ===
    const mermaidBlocks = containerRef.current.querySelectorAll<HTMLElement>("code.language-mermaid");
    mermaidBlocks.forEach(async (block, index) => {
      try {
        const code = block.textContent || "";
        const id = `mermaid-${Date.now()}-${index}`;
        const { svg } = await mermaid.render(id, code);
        const pre = block.closest("pre");
        if (pre) {
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-wrapper my-6 flex justify-center";
          wrapper.innerHTML = svg;
          pre.replaceWith(wrapper);
        }
      } catch (e) {
        console.warn("Mermaid render failed:", e);
      }
    });

    // === 2. 代码块复制按钮 ===
    const codeBlocks = containerRef.current.querySelectorAll<HTMLElement>("pre:has(code)");
    codeBlocks.forEach((pre) => {
      // 跳过已处理的 mermaid 块
      if (pre.querySelector("code.language-mermaid")) return;
      // 避免重复添加
      if (pre.querySelector(".copy-btn")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper relative group";

      const btn = document.createElement("button");
      btn.className = "copy-btn absolute top-2 right-2 z-10 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-sm";
      btn.textContent = "复制";
      btn.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || "";
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = "✓ 已复制";
          btn.classList.add("!bg-green-500", "!border-green-500", "!text-white");
          setTimeout(() => {
            btn.textContent = "复制";
            btn.classList.remove("!bg-green-500", "!border-green-500", "!text-white");
          }, 2000);
        } catch {
          btn.textContent = "失败";
          setTimeout(() => { btn.textContent = "复制"; }, 1500);
        }
      };

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(btn);
    });
  }, [contentHtml]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}