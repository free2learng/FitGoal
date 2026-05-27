"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { todaysWorkout } from "@/lib/generators";
import { loadState } from "@/lib/storage";
import { workouts } from "@/lib/seed-data";
import { FitGoalState, Workout } from "@/lib/types";

export default function WorkoutPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const state = loadState() as FitGoalState | null;
    if (!state) {
      window.location.href = "/onboarding";
      return;
    }
    const workoutId = params.id;
    setWorkout(workoutId === "today" ? todaysWorkout(state) : workouts.find((item) => item.id === workoutId) ?? todaysWorkout(state));
  }, [params.id]);

  if (!workout) return null;

  return (
    <AppShell>
      <section className="px-5 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black text-zinc-600">
          <ArrowLeft size={18} /> Dashboard
        </Link>
        <div className="mt-5 rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-bold text-white/70">{workout.level} - {workout.goal}</p>
          <h1 className="mt-2 text-3xl font-black">{workout.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-white/75"><Timer size={17} /> {workout.durationMinutes} minutes - {workout.focus}</p>
        </div>
        <div className="mt-5 space-y-3">
          {workout.exercises.map((exercise, index) => (
            <article key={exercise.name} className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mint/15 text-sm font-black text-leaf">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-ink">{exercise.name}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{exercise.sets} sets - {exercise.reps} reps - {exercise.restSeconds}s rest</p>
                  <a href={exercise.tutorialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-black text-ink">
                    Tutorial <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
