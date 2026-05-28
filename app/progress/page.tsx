"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { NumberStepper } from "@/components/NumberStepper";
import { calorieTarget, todayKey } from "@/lib/generators";
import { addProgress, loadState } from "@/lib/storage";
import { FitGoalState } from "@/lib/types";

export default function ProgressPage() {
  const [state, setState] = useState<FitGoalState | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (!saved) window.location.href = "/onboarding";
    setState(saved);
  }, []);

  if (!state) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;
    const form = new FormData(event.currentTarget);
    setState(addProgress(state, {
      date: String(form.get("date")),
      weightKg: Number(form.get("weightKg")),
      waistCm: Number(form.get("waistCm")),
      calories: Number(form.get("calories")),
      workoutsCompleted: Number(form.get("workoutsCompleted"))
    }));
    event.currentTarget.reset();
  }

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-fit-primary">Progress tracker</p>
          <h1 className="mt-2 text-[clamp(2rem,9vw,3.5rem)] font-black leading-[0.95] text-fit-text dark:text-white">Small updates, clear momentum.</h1>
        </div>
        <form onSubmit={submit} className="rounded-[32px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input name="date" label="Date" type="date" defaultValue={todayKey()} />
            <NumberStepper name="weightKg" label="Weight" defaultValue={state.profile.weightKg} min={30} max={250} step={0.5} unit="kg" />
            <NumberStepper name="waistCm" label="Waist" defaultValue={state.progress[0]?.waistCm ?? 80} min={40} max={200} step={0.5} unit="cm" />
            <Input name="calories" label="Calories" type="number" defaultValue={calorieTarget(state.profile)} />
            <Input name="workoutsCompleted" label="Workouts" type="number" defaultValue={state.completedWorkoutDates.length} />
          </div>
          <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-fit-text text-sm font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
            <Plus size={18} /> Add check-in
          </button>
        </form>
        <div className="grid gap-3 lg:grid-cols-2">
          {state.progress.map((entry) => (
            <article key={entry.id} className="rounded-[26px] bg-fit-muted p-4 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-fit-text dark:text-white">{entry.date}</p>
                  <p className="mt-1 text-sm font-semibold text-fit-mutedText">Weight {entry.weightKg}kg - Waist {entry.waistCm}cm</p>
                </div>
                <div className="shrink-0 text-right text-sm font-black text-fit-text dark:text-white">
                  <p>{entry.calories} cal</p>
                  <p className="text-fit-primary">{entry.workoutsCompleted} workouts</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-fit-text dark:text-white">{label}</span>
      <input required className="h-14 w-full rounded-[24px] border border-fit-border bg-fit-surfaceElevated px-3 text-sm font-bold text-fit-text outline-none focus:border-fit-primary dark:border-white/10 dark:bg-white/5 dark:text-white" {...props} />
    </label>
  );
}
