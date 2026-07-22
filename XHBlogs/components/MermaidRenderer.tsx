"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

// 初始化 Mermaid 配置
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

interface MermaidRendererProps {
  contentHtml: string;
}

export default function MermaidRenderer({ contentHtml }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 查找所有 mermaid 代码块
    const mermaidBlocks = containerRef.current.querySelectorAll<HTMLElement>("code.language-mermaid");
    if (mermaidBlocks.length === 0) return;

    mermaidBlocks.forEach(async (block, index) => {
      try {
        const code = block.textContent || "";
        const id = `mermaid-${Date.now()}-${index}`;
        const { svg } = await mermaid.render(id, code);

        // 替换代码块为 SVG
        const pre = block.closest("pre");
        if (pre) {
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-wrapper my-6 flex justify-center";
          wrapper.innerHTML = svg;
          pre.replaceWith(wrapper);
        }
      } catch (e) {
        console.warn("Mermaid render failed:", e);
        block.textContent = `[Mermaid 渲染失败]\n${block.textContent}`;
      }
    });
  }, [contentHtml]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}