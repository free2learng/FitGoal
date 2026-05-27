"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Flame, Info, ShieldAlert, Utensils } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDemoCard } from "@/components/ExerciseDemoCard";
import { calculateCaloriesBurned, deficitStatus, maintenanceCalories } from "@/lib/calories";
import { calorieTarget, todayKey } from "@/lib/generators";
import { foodLogTotals } from "@/lib/nutrition";
import { stubbornBellyFatKillerProgram } from "@/lib/program-data";
import { loadState } from "@/lib/storage";
import { FitGoalState, OnboardingProfile } from "@/lib/types";

const fallbackProfile: OnboardingProfile = {
  goal: "belly-fat-reduction",
  age: 30,
  heightCm: 175,
  weightKg: 78,
  fitnessLevel: "beginner",
  equipment: "none",
  dietPreference: "balanced"
};

export default function StubbornBellyFatKillerPage() {
  const [state, setState] = useState<FitGoalState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const profile = state?.profile ?? fallbackProfile;
  const program = stubbornBellyFatKillerProgram;
  const today = todayKey();
  const maintenance = maintenanceCalories(profile.weightKg, profile.heightCm, profile.age, profile.fitnessLevel === "beginner" ? 1.35 : 1.5);
  const intakeTarget = calorieTarget({ ...profile, goal: "belly-fat-reduction" });
  const todaysFoodLogs = (state?.foodLogs ?? []).filter((entry) => entry.date === today);
  const eatenTotals = foodLogTotals(todaysFoodLogs.filter((entry) => entry.status === "eaten"));

  const exerciseCalories = useMemo(() => {
    return program.exercises.map((exercise) => {
      const perSet = calculateCaloriesBurned({
        userWeightKg: profile.weightKg,
        metValue: exercise.metValue,
        durationMinutes: exercise.durationMinutesPerSet
      });
      return { name: exercise.name, perSet, total: perSet * exercise.sets };
    });
  }, [profile.weightKg, program.exercises]);

  const plannedWorkoutCalories = exerciseCalories.reduce((sum, item) => sum + item.total, 0);
  const workoutCaloriesBurned = state?.completedWorkoutDates.includes(today) ? plannedWorkoutCalories : 0;
  const caloriesConsumed = eatenTotals.calories;
  const summary = deficitStatus({
    maintenance,
    caloriesConsumed,
    workoutCaloriesBurned,
    targetDeficit: program.targetDailyDeficit
  });
  const dashboardStatus = todaysFoodLogs.length ? summary.status : "Log food to see your calorie deficit";
  const remainingToEat = Math.max(0, intakeTarget - caloriesConsumed);

  return (
    <AppShell>
      <section className="space-y-5 px-5 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black text-zinc-600">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <div className="rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-bold text-mint">Beginner fat-loss program</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">{program.title}</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">{program.subtitle}</p>
        </div>

        <article className="rounded-lg border border-peach/50 bg-peach/20 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-ink">
            <ShieldAlert size={18} /> No spot fat reduction claim
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Belly fat reduces through total body fat loss. The reliable path is a sensible calorie deficit, strength training, cardio, sleep, recovery, and nutrition. This program trains your whole body and core, but it does not promise fat loss from only one area.
          </p>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-leaf">
            <Flame size={18} /> Calorie deficit dashboard
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">{dashboardStatus}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            This uses today&apos;s foods you logged and workout calories only after you mark today&apos;s workout as done. No food intake is guessed.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <CalorieTile label="Intake target" value={intakeTarget} />
            <CalorieTile label="Food eaten" value={caloriesConsumed} />
            <CalorieTile label="Workout burned" value={workoutCaloriesBurned} />
            <CalorieTile label="Net calories" value={summary.netCalories} />
            <CalorieTile label="Target deficit" value={program.targetDailyDeficit} />
            <CalorieTile label="Actual deficit" value={summary.deficit} />
          </div>
          {!todaysFoodLogs.length && (
            <Link href="/nutrition/food-library" className="mt-4 flex min-h-12 items-center justify-center rounded-lg bg-ink px-4 text-sm font-black text-white">
              Log food to update this dashboard
            </Link>
          )}
          {!workoutCaloriesBurned && (
            <p className="mt-3 rounded-lg bg-sky/15 p-3 text-sm font-bold text-ink">
              Planned workout burn: {plannedWorkoutCalories} cal. It will count here after you mark today&apos;s workout as done on the dashboard.
            </p>
          )}
          <div className="mt-4 rounded-lg bg-zinc-50 p-3">
            <div className="flex items-center justify-between text-sm font-black">
              <span>Remaining calories to eat</span>
              <span>{remainingToEat} cal</span>
            </div>
            <Progress value={Math.min(100, Math.round((caloriesConsumed / intakeTarget) * 100))} />
            <div className="mt-3 flex items-center justify-between text-sm font-black">
              <span>Burn or save remaining</span>
              <span>{Math.max(0, summary.remainingDeficit)} cal</span>
            </div>
            <Progress value={Math.min(100, Math.round((summary.deficit / program.targetDailyDeficit) * 100))} tone="mint" />
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Calories are estimates and vary by body weight, intensity, and fitness level. MET estimates use the Compendium of Physical Activities concept where 1 MET is approximately 1 kcal/kg/hour.
          </p>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-leaf">
            <Info size={18} /> Goal system
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">Fat loss and belly fat reduction</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Beginner targets usually work best around a 300-500 calorie daily deficit. Expected weekly fat loss is {program.weeklyFatLossEstimateKg}. Do not use extreme calorie restriction, skip protein, or train hard without recovery.
          </p>
        </article>

        <div className="space-y-4">
          {program.exercises.map((exercise) => {
            const calories = exerciseCalories.find((item) => item.name === exercise.name);
            return (
              <div key={exercise.name} className="space-y-3">
                <div className="rounded-lg bg-zinc-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black text-ink">{exercise.name}</h2>
                      <p className="mt-1 text-sm text-zinc-600">
                        {exercise.sets} sets - {exercise.reps} - {exercise.restSeconds}s rest
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-normal text-leaf">{exercise.difficulty}</p>
                    </div>
                    <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-right shadow-sm">
                      <p className="text-xs font-bold text-zinc-500">Calories</p>
                      <p className="text-lg font-black text-ink">{calories?.total ?? 0}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs font-bold text-zinc-500">Per set</p>
                      <p className="font-black">{calories?.perSet ?? 0} cal</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs font-bold text-zinc-500">Total</p>
                      <p className="font-black">{calories?.total ?? 0} cal</p>
                    </div>
                  </div>
                </div>
                <ExerciseDemoCard
                  exerciseName={exercise.name}
                  videoUrl={exercise.tutorialUrl}
                  animationUrl={exercise.animationUrl}
                  targetMuscles={exercise.targetMuscles}
                  instructions={exercise.instructions}
                  commonMistakes={exercise.commonMistakes}
                  beginnerTips={exercise.beginnerTips}
                />
              </div>
            );
          })}
        </div>

        <Link href="/nutrition/food-library" className="flex h-14 items-center justify-center gap-2 rounded-lg bg-leaf text-base font-black text-white">
          <Utensils size={20} /> Open food library
        </Link>
      </section>
    </AppShell>
  );
}

function CalorieTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-xs font-bold uppercase tracking-normal text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink">{value}</p>
      <p className="text-xs font-semibold text-zinc-500">calories</p>
    </div>
  );
}

function Progress({ value, tone = "sky" }: { value: number; tone?: "sky" | "mint" }) {
  return (
    <div className="mt-2 h-2 rounded-full bg-zinc-200">
      <div className={`h-2 rounded-full ${tone === "mint" ? "bg-mint" : "bg-sky"}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
