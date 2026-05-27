"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Check, Droplets, Flame, RefreshCcw, ShieldAlert, Utensils } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { calorieTarget, dietPlan, macroTargets, nutritionEstimate, planLabel, progressPercent, proteinTarget, todaysWorkout, waterTargetLiters } from "@/lib/generators";
import { micronutrients } from "@/lib/program-data";
import { completeToday, loadState, skipToday } from "@/lib/storage";
import { FitGoalState } from "@/lib/types";

export default function DashboardPage() {
  const [state, setState] = useState<FitGoalState | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (!saved) window.location.href = "/onboarding";
    setState(saved);
  }, []);

  if (!state) return null;

  const workout = todaysWorkout(state);
  const meals = dietPlan(state.profile);
  const calories = calorieTarget(state.profile);
  const protein = proteinTarget(state.profile);
  const water = waterTargetLiters(state.profile);
  const progress = progressPercent(state);
  const macros = macroTargets(state.profile);
  const eaten = nutritionEstimate(state.profile);

  return (
    <AppShell>
      <section className="space-y-5 px-5 py-5">
        <div className="rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-bold text-white/70">{planLabel(state.profile.goal)} plan</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Today plan</h1>
          <div className="mt-5 h-3 rounded-full bg-white/15">
            <div className="h-3 rounded-full bg-mint" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm font-bold text-white/70">{progress}% of weekly workouts completed</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Calories" value={`${calories}`} hint="daily target" />
          <MetricCard label="Protein" value={`${protein}g`} hint="daily target" />
          <MetricCard label="Water" value={`${water}L`} hint="goal today" />
          <MetricCard label="Streak" value={`${state.completedWorkoutDates.length}`} hint="workouts done" />
        </div>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Utensils size={17} /> Nutrition today</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Macros and micros</h2>
            </div>
            <Link href="/nutrition/food-library" className="rounded-lg bg-mint/15 px-3 py-2 text-sm font-black text-leaf">Foods</Link>
          </div>
          <div className="mt-4 space-y-3">
            <MacroBar label="Calories eaten" eaten={eaten.calories} target={macros.calories} suffix=" cal" />
            <MacroBar label="Protein" eaten={eaten.protein} target={macros.protein} suffix="g" />
            <MacroBar label="Carbs" eaten={eaten.carbs} target={macros.carbs} suffix="g" />
            <MacroBar label="Fats" eaten={eaten.fats} target={macros.fats} suffix="g" />
          </div>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3">
            <p className="text-sm font-black text-ink">Vitamins and minerals checklist</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {micronutrients.map((item) => {
                const done = eaten.micronutrients.includes(item.name);
                return (
                  <span key={item.name} className={`rounded-lg px-2 py-1 text-xs font-bold ${done ? "bg-mint/20 text-leaf" : "bg-white text-zinc-500"}`}>
                    {done ? "✓" : "+"} {item.name}
                  </span>
                );
              })}
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-peach/50 bg-peach/20 p-5">
          <p className="flex items-center gap-2 text-sm font-black text-ink"><ShieldAlert size={17} /> Belly fat note</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">Belly fat reduces through total body fat loss, not spot reduction. Use a beginner-friendly calorie deficit, strength training, cardio, sleep, and nutrition.</p>
          <Link href="/programs/stubborn-belly-fat-killer" className="mt-3 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 text-sm font-black text-white">
            Open Stubborn Belly Fat Killer
          </Link>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-leaf"><CalendarDays size={17} /> Workout</p>
              <h2 className="mt-2 text-2xl font-black text-ink">{workout.title}</h2>
              <p className="mt-1 text-sm text-zinc-600">{workout.durationMinutes} min - {workout.focus}</p>
            </div>
            <Link href="/workouts/today" className="rounded-lg bg-mint/15 px-3 py-2 text-sm font-black text-leaf">Open</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setState(completeToday(state))} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-leaf text-sm font-black text-white">
              <Check size={18} /> Done
            </button>
            <button onClick={() => setState(skipToday(state))} className="flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-200 text-sm font-black text-ink">
              <RefreshCcw size={18} /> Missed
            </button>
          </div>
          {state.skippedDates.length > 0 && <p className="mt-3 text-sm font-semibold text-zinc-600">Adaptive logic active: missed days are rescheduled into upcoming workouts.</p>}
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Flame size={17} /> Meal plan</p>
          <h2 className="mt-2 text-2xl font-black">7-day nutrition</h2>
          <div className="mt-4 space-y-3">
            {meals.map((day) => (
              <div key={day.day} className="flex items-center justify-between rounded-lg bg-zinc-50 p-3">
                <div>
                  <p className="font-black">Day {day.day}: {day.title}</p>
                  <p className="text-sm text-zinc-600">{day.meals.map((meal) => meal.name.split(",")[0]).slice(0, 2).join(" - ")}</p>
                </div>
                <div className="text-right text-sm font-black">
                  <p>{day.calories} cal</p>
                  <p className="text-leaf">{day.protein}g</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg bg-sky/15 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-ink"><Droplets size={17} /> Beginner note</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">Start with the listed reps, stop two reps before failure, and use the tutorial links when a movement feels unfamiliar.</p>
        </article>
      </section>
    </AppShell>
  );
}

function MacroBar({ label, eaten, target, suffix }: { label: string; eaten: number; target: number; suffix: string }) {
  const percent = Math.min(100, Math.round((eaten / target) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-black">
        <span>{label}</span>
        <span>{eaten}{suffix} / {target}{suffix}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-mint" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
