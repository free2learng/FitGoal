"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { createState } from "@/lib/storage";
import { DietPreference, Equipment, FitnessLevel, Goal } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal>("fat-loss");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("beginner");
  const [equipment, setEquipment] = useState<Equipment>("none");
  const [dietPreference, setDietPreference] = useState<DietPreference>("balanced");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    createState({
      goal,
      age: Number(form.get("age")),
      heightCm: Number(form.get("heightCm")),
      weightKg: Number(form.get("weightKg")),
      fitnessLevel,
      equipment,
      dietPreference
    });
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-paper">
      <form onSubmit={submit} className="mx-auto min-h-screen w-full max-w-md space-y-6 bg-white px-5 py-6 shadow-soft">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-leaf">FitGoal quiz</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Tell us where you are starting.</h1>
        </div>
        <Field label="Goal">
          <Segment value={goal} onChange={setGoal} options={[["fat-loss", "Fat loss"], ["belly-fat-reduction", "Belly fat"], ["muscle-gain", "Muscle gain"], ["maintenance", "Maintain"]]} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <NumberField name="age" label="Age" defaultValue={30} />
          <NumberField name="heightCm" label="Height cm" defaultValue={175} />
          <NumberField name="weightKg" label="Weight kg" defaultValue={78} />
        </div>
        <Field label="Fitness level">
          <Segment value={fitnessLevel} onChange={setFitnessLevel} options={[["beginner", "Beginner"], ["intermediate", "Regular"], ["athletic", "Athletic"]]} />
        </Field>
        <Field label="Equipment">
          <Segment value={equipment} onChange={setEquipment} options={[["none", "None"], ["dumbbells", "Dumbbells"], ["gym", "Gym"]]} />
        </Field>
        <Field label="Diet preference">
          <Segment value={dietPreference} onChange={setDietPreference} options={[["balanced", "Balanced"], ["high-protein", "High protein"], ["vegetarian", "Vegetarian"]]} />
        </Field>
        <button className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-ink text-base font-black text-white">
          Build my plan <ArrowRight size={20} />
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      {children}
    </label>
  );
}

function NumberField({ name, label, defaultValue }: { name: string; label: string; defaultValue: number }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      <input required min={1} name={name} type="number" defaultValue={defaultValue} className="h-12 w-full rounded-lg border border-zinc-200 px-3 font-bold outline-none focus:border-leaf" />
    </label>
  );
}

function Segment<T extends string>({ value, onChange, options }: { value: T; onChange: (value: T) => void; options: [T, string][] }) {
  return (
    <div className="grid gap-2">
      {options.map(([option, label]) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={`h-12 rounded-lg border px-3 text-left text-sm font-black ${value === option ? "border-ink bg-ink text-white" : "border-zinc-200 bg-white text-ink"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
