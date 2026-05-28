"use client";

import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Flame, Heart, Plus, Share2, Sparkles, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { fitnessVideos, videoCategories } from "@/lib/video-data";
import { loadState, toggleFavoriteVideo } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { FitGoalState, FitnessVideo, VideoCategory } from "@/lib/types";

export default function VideosPage() {
  const [state, setState] = useState<FitGoalState | null>(null);
  const [remoteVideos, setRemoteVideos] = useState<FitnessVideo[]>([]);
  const [category, setCategory] = useState<VideoCategory | "All">("All");

  useEffect(() => {
    setState(loadState());
    async function loadVideos() {
      if (!supabase) return;
      const { data, error } = await supabase.from("video_library").select("*").order("created_at", { ascending: false }).limit(80);
      if (error || !data) return;
      setRemoteVideos(data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        bodyPart: item.body_part,
        difficulty: item.difficulty,
        durationSeconds: item.duration_seconds,
        thumbnailUrl: item.thumbnail_url,
        videoUrl: item.video_url,
        coachName: item.coach_name,
        tags: item.tags ?? [],
        caloriesEstimate: item.calories_estimate ?? undefined,
        relatedExerciseId: item.related_exercise_id ?? undefined,
        relatedFoodId: item.related_food_id ?? undefined,
        likeCount: item.like_count ?? 0
      })));
    }
    void loadVideos();
  }, []);

  const allVideos = remoteVideos.length ? remoteVideos : fitnessVideos;
  const videos = useMemo(() => {
    return category === "All" ? allVideos : allVideos.filter((video) => video.category === category);
  }, [allVideos, category]);

  function toggleSaved(videoId: string) {
    if (!state) return;
    setState(toggleFavoriteVideo(state, videoId));
  }

  return (
    <AppShell>
      <section className="mx-auto flex h-[calc(100vh-8.25rem)] w-full max-w-5xl flex-col overflow-hidden px-3 py-4 sm:h-[calc(100vh-8.75rem)] sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-fit-primary"><Video size={16} /> Video hub</p>
            <h1 className="text-display-sm mt-1 truncate font-black leading-none text-fit-text dark:text-white">Learn fast. Move better.</h1>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[20px] bg-fit-text text-white dark:bg-white dark:text-fit-bg">
            <Sparkles size={18} />
          </span>
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {(["All", ...videoCategories] as Array<VideoCategory | "All">).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-transform active:scale-95 ${category === item ? "bg-fit-text text-white dark:bg-white dark:text-fit-bg" : "bg-fit-muted text-fit-mutedText dark:bg-white/5 dark:text-white/60"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="snap-y snap-mandatory overflow-y-auto rounded-[32px] scroll-smooth">
          {videos.map((video) => (
            <VideoFeedCard
              key={video.id}
              video={video}
              saved={Boolean(state?.favoriteVideoIds?.includes(video.id))}
              onSave={() => toggleSaved(video.id)}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function VideoFeedCard({ video, saved, onSave }: { video: FitnessVideo; saved: boolean; onSave: () => void }) {
  return (
    <article className="relative mb-4 h-[min(74vh,720px)] min-h-[560px] snap-start overflow-hidden rounded-[32px] bg-fit-text text-white shadow-premium">
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${video.thumbnailUrl})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/85" />

      <a href={video.videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center" aria-label={`Open ${video.title} video`}>
        <span className="grid h-20 w-20 place-items-center rounded-full bg-white/20 text-white shadow-premium backdrop-blur-xl transition-transform active:scale-95">
          <Video size={30} />
        </span>
      </a>

      <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
        <ActionButton label={`${video.likeCount} likes`} icon={<Heart size={19} fill="currentColor" />} />
        <button onClick={onSave} className={`grid h-12 w-12 place-items-center rounded-[20px] backdrop-blur-xl transition-transform active:scale-95 ${saved ? "bg-fit-success text-fit-bg" : "bg-white/18 text-white"}`} aria-label={saved ? "Saved video" : "Save video"}>
          <Plus size={20} className={saved ? "rotate-45" : ""} />
        </button>
        <ActionButton label="Share" icon={<Share2 size={19} />} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
        <div className="max-w-[calc(100%-4.5rem)]">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-black backdrop-blur">{video.category}</span>
            <span className="rounded-full bg-fit-accent px-3 py-1 text-xs font-black text-fit-bg">{video.difficulty}</span>
            <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-black backdrop-blur">{Math.round(video.durationSeconds / 60)} min</span>
          </div>
          <h2 className="text-section-title font-black leading-none">{video.title}</h2>
          <p className="mt-2 text-sm font-bold text-white/72">{video.coachName} • {video.bodyPart}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {video.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-black/30 px-3 py-1 text-[11px] font-black text-white/80 backdrop-blur">#{tag}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={video.videoUrl} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-[20px] bg-white text-sm font-black text-fit-bg transition-transform active:scale-95">
            <Video size={17} /> Watch
          </a>
          <button className="flex h-12 items-center justify-center gap-2 rounded-[20px] bg-fit-success text-sm font-black text-fit-bg transition-transform active:scale-95">
            {video.caloriesEstimate ? <Flame size={17} /> : <Dumbbell size={17} />}
            {video.caloriesEstimate ? "Log workout" : "Add to workout"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ActionButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="grid h-12 w-12 place-items-center rounded-[20px] bg-white/18 text-white backdrop-blur-xl transition-transform active:scale-95" aria-label={label}>
      {icon}
    </button>
  );
}
