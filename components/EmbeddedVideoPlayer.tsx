"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { youtubeEmbedUrl, youtubeExternalUrl } from "@/lib/video-utils";

export function EmbeddedVideoPlayer({ videoUrl, title }: { videoUrl: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const embedUrl = youtubeEmbedUrl(videoUrl);
  const externalUrl = youtubeExternalUrl(videoUrl);

  if (!embedUrl || failed) {
    return (
      <div className="grid h-full place-items-center rounded-[24px] bg-fit-text p-5 text-center text-white">
        <div>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15">
            <Play size={18} fill="currentColor" />
          </span>
          <p className="mt-3 text-sm font-black">Demo coming soon</p>
          <a href={externalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-[16px] bg-white px-4 text-xs font-black text-fit-bg">
            Open on YouTube <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[24px] bg-black shadow-sm">
      {!loaded && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-fit-text text-xs font-black text-white/70">
          Loading video...
        </div>
      )}
      <iframe
        src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1`}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
