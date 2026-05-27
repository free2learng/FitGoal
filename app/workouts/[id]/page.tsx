"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Target, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { estimateWorkoutCalories, todaysWorkout, workoutPlan } from "@/lib/generators";
import { loadState } from "@/lib/storage";
import { workouts } from "@/lib/seed-data";
import { FitGoalState, Workout } from "@/lib/types";

export default function WorkoutPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [state, setState] = useState<FitGoalState | null>(null);

  useEffect(() => {
    const state = loadState() as FitGoalState | null;
    if (!state) {
      window.location.href = "/onboarding";
      return;
    }
    setState(state);
    const workoutId = params.id;
    const generatedPlan = workoutPlan(state);
    setWorkout(workoutId === "today" ? todaysWorkout(state) : generatedPlan.find((item) => item.id === workoutId) ?? workouts.find((item) => item.id === workoutId) ?? todaysWorkout(state));
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
          {state && <p className="mt-2 text-sm font-bold text-white/75">Estimated burn: {estimateWorkoutCalories(workout, state.profile.weightKg)} calories</p>}
        </div>
        <article className="mt-5 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-black text-leaf"><Target size={17} /> Why this workout</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{workout.whyThisWorkout ?? "This workout supports your goal with balanced exercise selection and beginner-friendly pacing."}</p>
          {workout.cardioAdvice && <p className="mt-2 rounded-lg bg-sky/15 p-3 text-sm font-semibold leading-6 text-ink">{workout.cardioAdvice}</p>}
        </article>
        <div className="mt-5 space-y-3">
          {workout.exercises.map((exercise, index) => (
            <article key={exercise.name} className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mint/15 text-sm font-black text-leaf">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-ink">{exercise.name}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{exercise.sets} sets - {exercise.reps} reps - {exercise.restSeconds}s rest</p>
                  {exercise.targetMuscles && <p className="mt-2 text-xs font-black uppercase tracking-normal text-zinc-500">{exercise.targetMuscles.join(" / ")}</p>}
                  {exercise.coachingTip && <p className="mt-2 text-sm leading-6 text-zinc-600">{exercise.coachingTip}</p>}
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
