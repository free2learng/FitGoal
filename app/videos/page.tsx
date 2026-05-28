"use client";

import { useEffect, useMemo, useState } from "react";
import { Dumbbell, ExternalLink, Flame, Heart, Plus, Share2, Sparkles, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { fitnessVideos, videoCategories } from "@/lib/video-data";
import { loadState, toggleFavoriteVideo } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { FitGoalState, FitnessVideo, VideoCategory } from "@/lib/types";
import { youtubeEmbedUrl, youtubeExternalUrl } from "@/lib/video-utils";

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
  const videos = useMemo(() => {
    return category === "All" ? allVideos : allVideos.filter((video) => video.category === category);
  }, [allVideos, category]);

  function toggleSaved(videoId: string) {
    if (!state) return;
    setState(toggleFavoriteVideo(state, videoId));
  }

  return (
    <AppShell>
      <section className="mx-auto flex h-[calc(100vh-8.25rem)] w-full max-w-5xl flex-col overflow-hidden px-3 py-3 sm:h-[calc(100vh-8.75rem)] sm:px-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-fit-primary"><Video size={16} /> Video hub</p>
            <h1 className="mt-1 truncate text-[clamp(1.55rem,6vw,2.4rem)] font-black leading-none text-fit-text dark:text-white">Learn fast. Move better.</h1>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[20px] bg-fit-text text-white dark:bg-white dark:text-fit-bg">
            <Sparkles size={18} />
          </span>
        </div>

        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
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

        <div className="snap-y snap-mandatory overflow-y-auto rounded-[28px] scroll-smooth">
          {videos.length === 0 ? (
            <EmptyCategory category={category} onSelect={setCategory} />
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

function VideoFeedCard({ video, saved, onSave }: { video: FitnessVideo; saved: boolean; onSave: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = youtubeEmbedUrl(video.videoUrl);
  const externalUrl = youtubeExternalUrl(video.videoUrl);

  return (
    <article className="relative mx-auto mb-4 h-[75vh] max-h-[640px] min-h-[500px] w-full max-w-[520px] snap-start overflow-hidden rounded-[28px] bg-fit-text text-white shadow-premium md:h-[70vh]">
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${video.thumbnailUrl})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/85" />

      <div className="absolute inset-x-0 top-0 h-[48%] bg-black">
        {embedUrl ? (
          <>
            {!loaded && <div className="absolute inset-0 grid place-items-center bg-fit-text text-sm font-black text-white/70">Loading video...</div>}
            <iframe
              src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1`}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="grid h-full place-items-center p-5 text-center">
            <p className="text-sm font-black text-white/80">Video embed unavailable</p>
            <a href={externalUrl} target="_blank" rel="noreferrer" className="mt-3 rounded-[18px] bg-white px-4 py-3 text-sm font-black text-fit-bg">Open on YouTube</a>
          </div>
        )}
      </div>

      <div className="absolute right-3 top-[50%] z-10 flex flex-col gap-2">
        <ActionButton label={`${video.likeCount} likes`} icon={<Heart size={16} fill="currentColor" />} />
        <button onClick={onSave} className={`grid h-10 w-10 place-items-center rounded-[16px] backdrop-blur-xl transition-transform active:scale-95 ${saved ? "bg-fit-success text-fit-bg" : "bg-white/18 text-white"}`} aria-label={saved ? "Saved video" : "Save video"}>
          <Plus size={17} className={saved ? "rotate-45" : ""} />
        </button>
        <ActionButton label="Share" icon={<Share2 size={16} />} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
        <div className="max-w-[calc(100%-4.5rem)]">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/18 px-2.5 py-1 text-[10px] font-black backdrop-blur">{video.category}</span>
            <span className="rounded-full bg-fit-accent px-2.5 py-1 text-[10px] font-black text-fit-bg">{video.difficulty}</span>
            <span className="rounded-full bg-white/18 px-2.5 py-1 text-[10px] font-black backdrop-blur">{Math.max(1, Math.round(video.durationSeconds / 60))} min</span>
          </div>
          <h2 className="text-[clamp(1.25rem,5vw,1.8rem)] font-black leading-none">{video.title}</h2>
          <p className="mt-1 text-xs font-bold text-white/72">{video.coachName} • {video.bodyPart}</p>
          <div className="mt-2 grid gap-2 text-xs font-bold text-white/78 min-[390px]:grid-cols-3">
            <InfoPill label="Targets" value={video.targetMuscles.slice(0, 3).join(", ") || "Full body"} />
            <InfoPill label="Burn" value={video.caloriesEstimate ? `${video.caloriesEstimate} cal` : "Guide"} />
            <InfoPill label="Safety" value={video.safetyNotes[0] ?? "Move pain-free"} />
          </div>
          <p className="mt-2 max-w-[34rem] text-xs font-bold leading-5 text-white/82">
            {video.coachTips[0] ?? "Focus on control first, then build intensity."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {video.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-black/30 px-3 py-1 text-[11px] font-black text-white/80 backdrop-blur">#{tag}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a href={externalUrl} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-[18px] bg-white text-xs font-black text-fit-bg transition-transform active:scale-95">
            <ExternalLink size={15} /> Open YouTube
          </a>
          <button className="flex h-11 items-center justify-center gap-2 rounded-[18px] bg-fit-success text-xs font-black text-fit-bg transition-transform active:scale-95">
            {video.caloriesEstimate ? <Flame size={15} /> : <Dumbbell size={15} />}
            {video.caloriesEstimate ? "Log workout" : "Add to workout"}
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-black/28 px-3 py-2 backdrop-blur">
      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-white/50">{label}</span>
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

function EmptyCategory({ category, onSelect }: { category: VideoCategory | "All"; onSelect: (category: VideoCategory | "All") => void }) {
  const suggestions: Array<VideoCategory | "All"> = ["All", "Full body", "Abs / core", "Beginner tips", "Diet tips"];
  return (
    <div className="mx-auto grid min-h-[420px] max-w-[520px] place-items-center rounded-[28px] border border-fit-border bg-fit-surfaceElevated p-6 text-center shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
      <div>
        <p className="text-xl font-black text-fit-text dark:text-white">No videos yet for this category</p>
        <p className="mt-2 text-sm font-bold text-fit-mutedText">Try a nearby category while we build out {category}.</p>
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
