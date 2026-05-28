"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Flame, Info, Play, ShieldAlert, Utensils } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDemoCard } from "@/components/ExerciseDemoCard";
import { CalorieBalanceCard, ExerciseStoryCard, HeroCard } from "@/components/PremiumUI";
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
        <HeroCard
          eyebrow="Beginner fat-loss program"
          title={program.title}
          body={program.subtitle}
          tone="danger"
          icon={<Flame size={24} />}
          action={<Link href="#timeline" className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-white px-5 text-sm font-black text-fit-bg transition-transform active:scale-95"><Play size={16} fill="currentColor" /> Start timeline</Link>}
        />

        <article className="rounded-[30px] border border-fit-warning/30 bg-fit-warning/15 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-fit-text dark:text-white">
            <ShieldAlert size={18} /> No spot fat reduction claim
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-fit-mutedText dark:text-white/60">
            Belly fat reduces through total fat loss, not spot reduction. Strength, cardio, nutrition, sleep, and a sensible calorie deficit do the work.
          </p>
        </article>

        <CalorieBalanceCard
          eaten={caloriesConsumed}
          burned={workoutCaloriesBurned}
          remaining={remainingToEat}
          status={dashboardStatus}
          percent={Math.min(100, Math.round((caloriesConsumed / intakeTarget) * 100))}
        />

        <article className="rounded-[32px] border border-fit-border bg-fit-surfaceElevated p-5 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
          <p className="flex items-center gap-2 text-sm font-black text-fit-danger"><Flame size={18} /> Deficit details</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <CalorieTile label="Target" value={intakeTarget} />
            <CalorieTile label="Net" value={summary.netCalories} />
            <CalorieTile label="Deficit" value={summary.deficit} />
            <CalorieTile label="Goal" value={program.targetDailyDeficit} />
          </div>
          {!todaysFoodLogs.length && (
            <Link href="/nutrition/food-library" className="mt-4 flex min-h-12 items-center justify-center rounded-[20px] bg-fit-text px-4 text-sm font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
              Log food to update this dashboard
            </Link>
          )}
          {!workoutCaloriesBurned && (
            <p className="mt-3 rounded-[20px] bg-fit-accent/15 p-3 text-sm font-bold text-fit-text dark:text-white">
              Planned workout burn: {plannedWorkoutCalories} cal. It will count here after you mark today&apos;s workout as done on the dashboard.
            </p>
          )}
          <p className="mt-3 text-xs font-bold leading-5 text-fit-mutedText">
            Calories are estimates and vary by body weight, intensity, and fitness level. MET estimates use the Compendium of Physical Activities concept where 1 MET is approximately 1 kcal/kg/hour.
          </p>
        </article>

        <article className="rounded-[32px] border border-fit-border bg-fit-surfaceElevated p-5 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
          <p className="flex items-center gap-2 text-sm font-bold text-fit-primary">
            <Info size={18} /> Goal system
          </p>
          <h2 className="mt-2 text-2xl font-black text-fit-text dark:text-white">Fat loss and belly fat reduction</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-fit-mutedText dark:text-white/55">
            Beginner targets usually work best around a 300-500 calorie daily deficit. Expected weekly fat loss is {program.weeklyFatLossEstimateKg}. Do not use extreme calorie restriction, skip protein, or train hard without recovery.
          </p>
        </article>

        <div id="timeline" className="flex snap-x gap-4 overflow-x-auto pb-2">
          {program.exercises.map((exercise) => {
            const calories = exerciseCalories.find((item) => item.name === exercise.name);
            return (
              <ExerciseStoryCard
                key={exercise.name}
                name={exercise.name}
                meta={`${exercise.sets} sets - ${exercise.reps} - ${exercise.restSeconds}s rest`}
                calories={calories?.total ?? 0}
                difficulty={exercise.difficulty}
                muscles={exercise.targetMuscles}
                action={<a href={exercise.tutorialUrl} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center rounded-[20px] bg-fit-text text-sm font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">Start exercise</a>}
              >
                <ExerciseDemoCard
                  exerciseName={exercise.name}
                  videoUrl={exercise.tutorialUrl}
                  animationUrl={exercise.animationUrl}
                  targetMuscles={exercise.targetMuscles}
                  instructions={exercise.instructions}
                  commonMistakes={exercise.commonMistakes}
                  beginnerTips={exercise.beginnerTips}
                />
              </ExerciseStoryCard>
            );
          })}
        </div>

        <Link href="/nutrition/food-library" className="flex h-14 items-center justify-center gap-2 rounded-[24px] bg-fit-text text-base font-black text-white shadow-premium transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
          <Utensils size={20} /> Open food library
        </Link>
      </section>
    </AppShell>
  );
}

function CalorieTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] bg-fit-muted p-3 dark:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-normal text-fit-mutedText">{label}</p>
      <p className="mt-1 text-2xl font-black text-fit-text dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-fit-mutedText">calories</p>
    </div>
  );
}
