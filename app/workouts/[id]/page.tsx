"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ExternalLink, Flame, Play, ShieldAlert, Target, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDemoCard } from "@/components/ExerciseDemoCard";
import { calculateCaloriesBurned } from "@/lib/calories";
import { enrichExercise } from "@/lib/exercise-coaching";
import { estimateWorkoutCalories, todaysWorkout, workoutPlan } from "@/lib/generators";
import { loadState } from "@/lib/storage";
import { workouts } from "@/lib/seed-data";
import { FitGoalState, Workout } from "@/lib/types";

export default function WorkoutPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [state, setState] = useState<FitGoalState | null>(null);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});

  useEffect(() => {
    const state = loadState() as FitGoalState | null;
    if (!state) {
      window.location.href = "/onboarding";
      return;
    }
    setState(state);
    const workoutId = params.id;
    const generatedPlan = workoutPlan(state);
    const nextWorkout = workoutId === "today" ? todaysWorkout(state) : generatedPlan.find((item) => item.id === workoutId) ?? workouts.find((item) => item.id === workoutId) ?? todaysWorkout(state);
    setWorkout({ ...nextWorkout, exercises: nextWorkout.exercises.map(enrichExercise) });
  }, [params.id]);

  if (!workout) return null;

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black text-fit-mutedText">
          <ArrowLeft size={18} /> Dashboard
        </Link>
        <div className="mt-5 rounded-[34px] bg-fit-text p-5 text-white shadow-premium sm:p-6">
          <p className="text-sm font-bold text-white/70">{workout.level} - {workout.goal}</p>
          <h1 className="mt-2 text-[clamp(2rem,9vw,3.6rem)] font-black leading-[0.95]">{workout.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-white/75"><Timer size={17} /> {workout.durationMinutes} minutes - {workout.focus}</p>
          {state && <p className="mt-2 text-sm font-bold text-white/75">Estimated burn: {estimateWorkoutCalories(workout, state.profile.weightKg)} calories</p>}
        </div>
        {workout.exercises[0] && (
          <div className="mt-5">
            <ExerciseDemoCard
              exerciseName={workout.exercises[0].name}
              videoUrl={workout.exercises[0].shortVideoTipUrl ?? workout.exercises[0].tutorialUrl}
              animationUrl=""
              targetMuscles={workout.exercises[0].targetMuscles ?? []}
              instructions={workout.exercises[0].instructions ?? []}
              commonMistakes={workout.exercises[0].commonMistakes ?? []}
              beginnerTips={workout.exercises[0].beginnerTips ?? []}
            />
          </div>
        )}
        <article className="mt-5 rounded-[30px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
          <p className="flex items-center gap-2 text-sm font-black text-fit-primary"><Target size={17} /> Why this workout</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-fit-mutedText">{workout.whyThisWorkout ?? "This workout supports your goal with balanced exercise selection and beginner-friendly pacing."}</p>
          {workout.cardioAdvice && <p className="mt-2 rounded-[22px] bg-fit-secondary/15 p-3 text-sm font-semibold leading-6 text-fit-text dark:text-white">{workout.cardioAdvice}</p>}
        </article>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {workout.exercises.map((exercise, index) => (
            <article key={exercise.name} className="rounded-[28px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-sm dark:border-white/10 dark:bg-fit-darkElevated">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[18px] bg-fit-success/15 text-sm font-black text-fit-text dark:text-white">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-fit-text dark:text-white">{exercise.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-fit-mutedText">{exercise.sets} sets - {exercise.reps} reps - {exercise.restSeconds}s rest</p>
                  {exercise.targetMuscles && <p className="mt-2 text-xs font-black uppercase tracking-normal text-fit-mutedText">{exercise.targetMuscles.join(" / ")}</p>}
                  <p className="mt-2 text-sm font-semibold leading-6 text-fit-mutedText">{exercise.goodFor ?? exercise.coachingTip ?? "Builds fitness with clear, controlled movement."}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <MiniInfo icon={<Flame size={14} />} label="Burn" value={`${exerciseCalories(exercise, state?.profile.weightKg ?? 78)} cal/set`} />
                    <MiniInfo icon={<Timer size={14} />} label="Rest" value={`${exercise.restSeconds}s`} />
                  </div>
                  {exercise.formCues && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exercise.formCues.slice(0, 3).map((cue) => <span key={cue} className="rounded-full bg-fit-muted px-3 py-1 text-xs font-black text-fit-mutedText dark:bg-white/5">{cue}</span>)}
                    </div>
                  )}
                  <details className="mt-3 rounded-[20px] bg-fit-muted p-3 dark:bg-white/5">
                    <summary className="cursor-pointer text-sm font-black text-fit-text dark:text-white">Coaching notes</summary>
                    <List title="Instructions" items={exercise.instructions} />
                    <List title="Avoid" items={exercise.commonMistakes} />
                    <List title="Breathing" items={exercise.breathingTips} />
                    {(exercise.regression || exercise.progression) && (
                      <div className="mt-3 grid gap-2 text-sm font-semibold text-fit-mutedText">
                        {exercise.regression && <p><strong className="text-fit-text dark:text-white">Easier:</strong> {exercise.regression}</p>}
                        {exercise.progression && <p><strong className="text-fit-text dark:text-white">Harder:</strong> {exercise.progression}</p>}
                      </div>
                    )}
                    {exercise.safetyNotes?.length ? (
                      <p className="mt-3 flex gap-2 rounded-[16px] bg-fit-warning/20 p-3 text-xs font-bold text-fit-text dark:text-white"><ShieldAlert size={15} /> {exercise.safetyNotes[0]}</p>
                    ) : null}
                  </details>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setActiveTimer(activeTimer === exercise.name ? null : exercise.name)} className="flex h-11 items-center justify-center gap-2 rounded-[18px] bg-fit-text text-sm font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
                      <Play size={15} /> {activeTimer === exercise.name ? `${exercise.restSeconds}s rest` : "Start timer"}
                    </button>
                    <button onClick={() => setCompletedSets((sets) => ({ ...sets, [exercise.name]: Math.min(exercise.sets, (sets[exercise.name] ?? 0) + 1) }))} className="flex h-11 items-center justify-center gap-2 rounded-[18px] bg-fit-success text-sm font-black text-fit-bg transition-transform active:scale-95">
                      <Check size={15} /> {completedSets[exercise.name] ?? 0}/{exercise.sets}
                    </button>
                  </div>
                  <a href={exercise.shortVideoTipUrl ?? exercise.tutorialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-[18px] border border-fit-border px-3 py-2 text-sm font-black text-fit-text dark:border-white/10 dark:text-white">
                    Video demo <ExternalLink size={16} />
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

function exerciseCalories(exercise: Workout["exercises"][number], weightKg: number) {
  return calculateCaloriesBurned({
    userWeightKg: weightKg,
    metValue: exercise.metValue ?? 3.5,
    durationMinutes: exercise.durationMinutesPerSet ?? 0.75
  });
}

function MiniInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-fit-muted p-3 dark:bg-white/5">
      <p className="flex items-center gap-1 text-[10px] font-black uppercase text-fit-mutedText">{icon}{label}</p>
      <p className="mt-1 text-sm font-black text-fit-text dark:text-white">{value}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-3">
      <p className="text-xs font-black uppercase text-fit-mutedText">{title}</p>
      <ul className="mt-1 space-y-1 text-sm font-semibold text-fit-mutedText">
        {items.slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}
