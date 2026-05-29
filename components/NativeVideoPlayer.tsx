"use client";

import { useRef, useState } from "react";
import { ExternalLink, Play, Volume2, VolumeX } from "lucide-react";

function isNativeVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function NativeVideoPlayer({ videoUrl, externalUrl, posterUrl, title }: { videoUrl?: string; externalUrl?: string; posterUrl?: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(Boolean(videoUrl));
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const playable = Boolean(videoUrl && isNativeVideoUrl(videoUrl));

  async function togglePlay() {
    const video = videoRef.current;
    if (!video || !playable) return;
    if (video.paused) {
      await video.play().catch(() => undefined);
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video || !playable) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  if (!playable) {
    return (
      <div className="relative h-full overflow-hidden rounded-[28px] bg-fit-text text-white">
        {posterUrl && <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: `url(${posterUrl})` }} />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80" />
        <div className="relative grid h-full place-items-center p-6 text-center">
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/15">
              <Play size={20} fill="currentColor" />
            </span>
            <p className="mt-4 text-lg font-black">Video coming soon</p>
            <p className="mt-2 text-xs font-bold leading-5 text-white/65">Upload a direct `.mp4` or `.webm` file to Supabase Storage and paste its public URL in admin.</p>
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-fit-bg transition-transform active:scale-95"
              >
                Open external fallback <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[28px] bg-black text-white">
      {loading && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-fit-text text-xs font-black text-white/70">
          Loading video...
        </div>
      )}
      <button type="button" onClick={togglePlay} className="absolute inset-0 z-[2]" aria-label={paused ? `Play ${title}` : `Pause ${title}`}>
        <span className="sr-only">{paused ? "Play" : "Pause"}</span>
      </button>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="h-full w-full object-cover"
        autoPlay
        muted={muted}
        playsInline
        loop
        preload="metadata"
        onCanPlay={() => setLoading(false)}
        onLoadedData={() => setLoading(false)}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      />
      {paused && (
        <div className="pointer-events-none absolute inset-0 z-[3] grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-black/35 backdrop-blur">
            <Play size={24} fill="currentColor" />
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute right-3 top-3 z-[4] grid h-10 w-10 place-items-center rounded-full bg-black/35 backdrop-blur transition-transform active:scale-95"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
    </div>
  );
}
