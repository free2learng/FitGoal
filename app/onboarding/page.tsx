"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { NumberStepper } from "@/components/NumberStepper";
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
    <main className="min-h-screen bg-fit-bg px-3 py-3 text-fit-text sm:px-5 sm:py-6">
      <form onSubmit={submit} className="mx-auto min-h-[calc(100vh-1.5rem)] w-full max-w-3xl space-y-6 rounded-[34px] border border-fit-border bg-fit-surfaceElevated px-4 py-6 shadow-premium backdrop-blur-2xl dark:border-white/10 dark:bg-fit-darkElevated sm:px-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-fit-primary">FitGoal quiz</p>
          <h1 className="mt-2 text-[clamp(2rem,9vw,3.6rem)] font-black leading-[0.95] text-fit-text dark:text-white">Tell us where you are starting.</h1>
        </div>
        <Field label="Goal">
          <Segment value={goal} onChange={setGoal} options={[["fat-loss", "Fat loss"], ["belly-fat-reduction", "Belly fat"], ["muscle-gain", "Muscle gain"], ["maintenance", "Maintain"]]} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberStepper name="age" label="Age" defaultValue={30} min={13} max={100} step={1} presets={[18, 25, 35, 50]} />
          <NumberStepper name="heightCm" label="Height" defaultValue={175} min={100} max={230} step={1} unit="cm" presets={[160, 170, 180]} />
          <NumberStepper name="weightKg" label="Weight" defaultValue={78} min={30} max={250} step={0.5} unit="kg" presets={[60, 75, 90]} />
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
        <button className="flex h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-fit-text text-base font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
          Build my plan <ArrowRight size={20} />
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-fit-text dark:text-white">{label}</span>
      {children}
    </label>
  );
}

function Segment<T extends string>({ value, onChange, options }: { value: T; onChange: (value: T) => void; options: [T, string][] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(([option, label]) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={`min-h-12 rounded-[20px] border px-3 py-3 text-left text-sm font-black transition-transform active:scale-95 ${value === option ? "border-fit-text bg-fit-text text-white dark:border-white dark:bg-white dark:text-fit-bg" : "border-fit-border bg-fit-surfaceElevated text-fit-text dark:border-white/10 dark:bg-white/5 dark:text-white"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
