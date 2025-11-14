"use client";

import { useEffect, useRef } from "react";

type GistProps = {
  gistId: string;
};

export function Gist({ gistId }: GistProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // すでに script が挿入済みなら再挿入しない
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = `https://gist.github.com/${gistId}.js`;
    script.async = true;
    containerRef.current.appendChild(script);
  }, [gistId]);

  return <div ref={containerRef} />;
}
