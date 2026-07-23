"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "../MusicProvider";

export default function MusicVisualizerTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying } = useMusic();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const barCount = 28;
    const bars = new Float32Array(barCount).fill(0.05);
    const targets = new Float32Array(barCount).fill(0.05);
    let animId = 0;

    const resize = () => {
      const p = canvas.parentElement; if (!p) return;
      const w = p.clientWidth, h = p.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener("resize", resize);

    const animate = () => {
      const w = canvas.width / dpr, h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      if (isPlaying) for (let i=0;i<barCount;i++) targets[i]=0.15+Math.random()*0.85;
      else for (let i=0;i<barCount;i++) targets[i]=0.05;
      for (let i=0;i<barCount;i++) bars[i]+=(targets[i]-bars[i])*0.12;
      const bw=(w/barCount)*0.7, gap=(w/barCount)*0.3;
      const grad=ctx.createLinearGradient(0,h,0,0);
      grad.addColorStop(0,"#6366f1"); grad.addColorStop(0.5,"#a855f7"); grad.addColorStop(1,"#ec4899");
      ctx.fillStyle=grad;
      for (let i=0;i<barCount;i++){const bh=bars[i]*h; ctx.fillRect(i*(bw+gap),h-bh,bw,bh);}
      animId=requestAnimationFrame(animate);
    };
    animate();
    return ()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);};
  }, [isPlaying]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
