"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
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
      <section className="space-y-5 px-5 py-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-leaf">Progress tracker</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Small updates, clear momentum.</h1>
        </div>
        <form onSubmit={submit} className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <Input name="date" label="Date" type="date" defaultValue={todayKey()} />
            <Input name="weightKg" label="Weight kg" type="number" defaultValue={state.profile.weightKg} />
            <Input name="waistCm" label="Waist cm" type="number" defaultValue={state.progress[0]?.waistCm ?? 80} />
            <Input name="calories" label="Calories" type="number" defaultValue={calorieTarget(state.profile)} />
            <Input name="workoutsCompleted" label="Workouts" type="number" defaultValue={state.completedWorkoutDates.length} />
          </div>
          <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-black text-white">
            <Plus size={18} /> Add check-in
          </button>
        </form>
        <div className="space-y-3">
          {state.progress.map((entry) => (
            <article key={entry.id} className="rounded-lg bg-zinc-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-black text-ink">{entry.date}</p>
                  <p className="mt-1 text-sm text-zinc-600">Weight {entry.weightKg}kg - Waist {entry.waistCm}cm</p>
                </div>
                <div className="text-right text-sm font-black">
                  <p>{entry.calories} cal</p>
                  <p className="text-leaf">{entry.workoutsCompleted} workouts</p>
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
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      <input required className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf" {...props} />
    </label>
  );
}
