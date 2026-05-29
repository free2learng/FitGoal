"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Flame, Heart, Plus, Share2, Sparkles, Video } from "lucide-react";
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
      <section className="mx-auto min-h-screen w-full max-w-5xl px-3 pb-24 pt-2 sm:px-5">
        <div className="sticky top-[4.25rem] z-20 -mx-3 border-b border-fit-border/70 bg-fit-bg/95 px-3 pb-3 pt-2 backdrop-blur-2xl dark:border-white/10 sm:-mx-5 sm:px-5">
          <div className="mx-auto max-w-[520px]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-fit-primary"><Video size={14} /> Video hub</p>
                <h1 className="mt-0.5 truncate text-[clamp(1.875rem,8vw,2.125rem)] font-black leading-none text-fit-text dark:text-white">Learn fast. Move better.</h1>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[18px] bg-fit-text text-white dark:bg-white dark:text-fit-bg">
                <Sparkles size={17} />
              </span>
            </div>

            <div data-testid="video-chip-bar" className="mt-3 flex gap-2 overflow-x-auto pb-1">
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

        <div className="mx-auto mt-4 grid max-w-[430px] snap-y snap-mandatory gap-4">
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
      className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-black transition-transform active:scale-95 ${active ? "bg-fit-text text-white dark:bg-white dark:text-fit-bg" : "bg-fit-muted text-fit-mutedText dark:bg-white/5 dark:text-white/60"}`}
    >
      {label} ({count})
    </button>
  );
}

function VideoFeedCard({ video, saved, onSave }: { video: FitnessVideo; saved: boolean; onSave: () => void }) {
  return (
    <article data-testid="video-card" className="relative h-[75vh] max-h-[680px] snap-start overflow-hidden rounded-[30px] bg-fit-text text-white shadow-premium">
      <div className="absolute inset-0">
        <NativeVideoPlayer videoUrl={video.videoUrl} externalUrl={video.externalUrl} posterUrl={video.thumbnailUrl} title={video.title} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/88" />

      <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
        <ActionButton label={`${video.likeCount} likes`} icon={<Heart size={16} fill="currentColor" />} />
        <button onClick={onSave} className={`grid h-10 w-10 place-items-center rounded-[16px] backdrop-blur-xl transition-transform active:scale-95 ${saved ? "bg-fit-success text-fit-bg" : "bg-white/18 text-white"}`} aria-label={saved ? "Saved video" : "Save video"}>
          <Plus size={17} className={saved ? "rotate-45" : ""} />
        </button>
        <ActionButton label="Share" icon={<Share2 size={16} />} />
        <ActionButton label="Add to workout" icon={video.caloriesEstimate ? <Flame size={16} /> : <Dumbbell size={16} />} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <div className="max-w-[calc(100%-3.5rem)]">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/18 px-2.5 py-1 text-[10px] font-black backdrop-blur">{video.category}</span>
            <span className="rounded-full bg-fit-accent px-2.5 py-1 text-[10px] font-black text-fit-bg">{video.difficulty}</span>
            <span className="rounded-full bg-white/18 px-2.5 py-1 text-[10px] font-black backdrop-blur">{Math.max(1, Math.round(video.durationSeconds / 60))} min</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-[clamp(1.25rem,5vw,1.75rem)] font-black leading-tight">{video.title}</h2>
            <p className="mt-1 text-xs font-bold text-white/70">{video.coachName} • {video.bodyPart}</p>
          </div>

          <div className="mt-3 grid gap-2 text-xs font-bold min-[390px]:grid-cols-3">
            <InfoPill label="Targets" value={video.targetMuscles.slice(0, 3).join(", ") || "Full body"} />
            <InfoPill label="Burn" value={video.caloriesEstimate ? `${video.caloriesEstimate} cal` : "Guide"} />
            <InfoPill label="Safety" value={video.safetyNotes[0] ?? "Move pain-free"} />
          </div>

          <p className="mt-3 text-xs font-bold leading-5 text-white/78">
            {video.coachTips[0] ?? "Focus on control first, then build intensity."}
          </p>
        </div>
      </div>
    </article>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-black/32 px-3 py-2 backdrop-blur">
      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-white/48">{label}</span>
      <span className="line-clamp-1 text-white">{value}</span>
    </div>
  );
}

function ActionButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="grid h-10 w-10 place-items-center rounded-[16px] bg-white/18 text-white backdrop-blur-xl transition-transform active:scale-95" aria-label={label}>
      {icon}
    </button>
  );
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
