"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Dumbbell, Flame, Heart, Plus, Share2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { NativeVideoPlayer } from "@/components/NativeVideoPlayer";
import { fitnessVideos, videoCategories } from "@/lib/video-data";
import { loadState, toggleFavoriteVideo } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { FitGoalState, FitnessVideo, VideoCategory } from "@/lib/types";

type CategoryFilter = VideoCategory | "All";

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

export default function VideosPage() {
  const router = useRouter();
  const [state, setState] = useState<FitGoalState | null>(null);
  const [remoteVideos, setRemoteVideos] = useState<FitnessVideo[]>([]);
  const [category, setCategory] = useState<CategoryFilter>("All");

  useEffect(() => {
    setState(loadState());
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("category");
    if (requested) {
      const match = videoCategories.find((item) => normalizeCategory(item) === normalizeCategory(requested));
      setCategory(match ?? (requested as VideoCategory));
    }

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
        externalUrl: item.external_url ?? undefined,
        coachName: item.coach_name,
        tags: item.tags ?? [],
        targetMuscles: item.target_muscles ?? [],
        coachTips: item.coach_tips ?? [],
        safetyNotes: item.safety_notes ?? [],
        caloriesEstimate: item.calories_estimate ?? undefined,
        relatedExerciseId: item.related_exercise_id ?? undefined,
        relatedFoodId: item.related_food_id ?? undefined,
        likeCount: item.like_count ?? 0
      })));
    }
    void loadVideos();
  }, []);

  const allVideos = useMemo(() => {
    const remoteIds = new Set(remoteVideos.map((video) => video.id));
    return [...remoteVideos, ...fitnessVideos.filter((video) => !remoteIds.has(video.id))];
  }, [remoteVideos]);

  const categoryCounts = useMemo(() => {
    return allVideos.reduce<Record<string, number>>((counts, video) => {
      const key = normalizeCategory(video.category);
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});
  }, [allVideos]);

  const visibleCategories = useMemo(() => {
    return videoCategories.filter((item) => (categoryCounts[normalizeCategory(item)] ?? 0) > 0);
  }, [categoryCounts]);

  const videos = useMemo(() => {
    if (category === "All") return allVideos;
    const selected = normalizeCategory(category);
    return allVideos.filter((video) => normalizeCategory(video.category) === selected);
  }, [allVideos, category]);

  function chooseCategory(nextCategory: CategoryFilter) {
    setCategory(nextCategory);
    const query = nextCategory === "All" ? "/videos" : `/videos?category=${encodeURIComponent(nextCategory)}`;
    router.replace(query, { scroll: false });
  }

  function toggleSaved(videoId: string) {
    if (!state) return;
    setState(toggleFavoriteVideo(state, videoId));
  }

  return (
    <AppShell>
      <section className="mx-auto min-h-screen w-full px-2 pb-24 pt-0 sm:px-4">
        <div className="sticky top-[4.05rem] z-20 -mx-2 border-b border-fit-border/70 bg-fit-bg/95 px-2 py-2 backdrop-blur-2xl dark:border-white/10 sm:-mx-4 sm:px-4">
          <div className="mx-auto max-w-[430px]">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-fit-primary">Video hub</p>
                <h1 className="truncate text-xl font-black leading-none text-fit-text dark:text-white">Watch. Learn. Move.</h1>
              </div>
              <span className="rounded-full bg-fit-text px-3 py-1.5 text-[10px] font-black text-white dark:bg-white dark:text-fit-bg">
                {videos.length} clips
              </span>
            </div>

            <div data-testid="video-chip-bar" className="flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <CategoryChip label="All" count={allVideos.length} active={category === "All"} onClick={() => chooseCategory("All")} />
              {visibleCategories.map((item) => (
                <CategoryChip
                  key={item}
                  label={item}
                  count={categoryCounts[normalizeCategory(item)] ?? 0}
                  active={normalizeCategory(category) === normalizeCategory(item)}
                  onClick={() => chooseCategory(item)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 grid max-w-[430px] snap-y snap-mandatory gap-3">
          {videos.length === 0 ? (
            <EmptyCategory category={category} onSelect={chooseCategory} />
          ) : videos.map((video) => (
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

function CategoryChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-black transition-transform active:scale-95 ${active ? "bg-fit-text text-white dark:bg-white dark:text-fit-bg" : "bg-fit-muted text-fit-mutedText dark:bg-white/5 dark:text-white/60"}`}
    >
      {label} ({count})
    </button>
  );
}

function VideoFeedCard({ video, saved, onSave }: { video: FitnessVideo; saved: boolean; onSave: () => void }) {
  return (
    <article data-testid="video-card" className="relative h-[70svh] min-h-[390px] max-h-[640px] snap-start overflow-hidden rounded-[28px] bg-fit-text text-white shadow-premium">
      <div className="absolute inset-0">
        <NativeVideoPlayer videoUrl={video.videoUrl} externalUrl={video.externalUrl} posterUrl={video.thumbnailUrl} title={video.title} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/90" />

      <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-6.5rem)] flex-wrap gap-1.5">
        <span className="rounded-full bg-black/38 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] backdrop-blur">{video.category}</span>
        <span className="rounded-full bg-fit-accent px-2.5 py-1 text-[10px] font-black text-fit-bg">{video.difficulty}</span>
      </div>

      <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
        <ActionButton label={`${video.likeCount} likes`} icon={<Heart size={15} fill="currentColor" />} text={compactNumber(video.likeCount)} />
        <button onClick={onSave} className={`grid min-h-10 w-10 place-items-center rounded-full backdrop-blur-xl transition-transform active:scale-95 ${saved ? "bg-fit-success text-fit-bg" : "bg-black/35 text-white"}`} aria-label={saved ? "Saved video" : "Save video"}>
          {saved ? <Bookmark size={16} fill="currentColor" /> : <Plus size={17} />}
        </button>
        <ActionButton label="Share" icon={<Share2 size={15} />} />
        <ActionButton label="Add to workout" icon={video.caloriesEstimate ? <Flame size={15} /> : <Dumbbell size={15} />} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
        <div className="max-w-[calc(100%-3.5rem)]">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-[clamp(1.1rem,4.8vw,1.45rem)] font-black leading-tight">{video.title}</h2>
            <p className="mt-1 text-[11px] font-bold text-white/70">{video.coachName} • {video.bodyPart} • {Math.max(1, Math.round(video.durationSeconds / 60))} min</p>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-black">
            <InfoPill label="Targets" value={video.targetMuscles.slice(0, 2).join(", ") || "Full body"} />
            <InfoPill label="Burn" value={video.caloriesEstimate ? `${video.caloriesEstimate} cal` : "Guide"} />
          </div>

          <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-white/78">
            {video.coachTips[0] ?? "Focus on control first, then build intensity."}
          </p>
        </div>
      </div>
    </article>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full bg-black/38 px-2.5 py-1 backdrop-blur">
      <span className="sr-only">{label}: </span>
      <span className="line-clamp-1 text-white">{value}</span>
    </div>
  );
}

function ActionButton({ label, icon, text }: { label: string; icon: React.ReactNode; text?: string }) {
  return (
    <button className="grid min-h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-xl transition-transform active:scale-95" aria-label={label}>
      <span className="grid place-items-center">{icon}</span>
      {text && <span className="-mt-1 text-[9px] font-black leading-none">{text}</span>}
    </button>
  );
}

function compactNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return String(value);
}

function EmptyCategory({ category, onSelect }: { category: CategoryFilter; onSelect: (category: CategoryFilter) => void }) {
  const suggestions: CategoryFilter[] = ["Full body", "Beginner tips", "Abs / core"];
  return (
    <div className="grid min-h-[320px] place-items-center rounded-[28px] border border-fit-border bg-fit-surfaceElevated p-6 text-center shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
      <div>
        <p className="text-xl font-black text-fit-text dark:text-white">No videos yet for {category}.</p>
        <p className="mt-2 text-sm font-bold text-fit-mutedText">Try Full body or Beginner tips.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggestions.map((item) => (
            <button key={item} onClick={() => onSelect(item)} className="rounded-full bg-fit-muted px-4 py-2 text-xs font-black text-fit-mutedText transition-transform active:scale-95 dark:bg-white/5 dark:text-white/70">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
