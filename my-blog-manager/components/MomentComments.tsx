"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "../siteConfig";

interface MomentCommentsProps {
  id: string;
}

export default function MomentComments({ id }: MomentCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    import("@waline/client").then(({ init }) => {
      import("@waline/client/style");
      container.innerHTML = "";
      init({
        el: container,
        serverURL: siteConfig.walineServerURL,
        path: `/moments/${id}`,
        lang: "zh-CN",
        dark: "auto",
        emoji: [
          "https://unpkg.com/@waline/emojis@1.2.0/bilibili",
          "https://unpkg.com/@waline/emojis@1.2.0/qq",
        ],
        imageUploader: true,
        pageSize: 10,
      });
    });
  }, [id]);

  return <div ref={containerRef} className="moment-waline" />;
}
