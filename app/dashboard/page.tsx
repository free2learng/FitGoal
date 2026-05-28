"use client";

import { useEffect, useState } from "react";
import { Check, Flame, RefreshCcw, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AchievementBadge, CalorieBalanceCard, HeroCard, HydrationTracker, MissionCard, ProteinProgressCard } from "@/components/PremiumUI";
import { addHydrationLog, completeToday, loadState, skipToday } from "@/lib/storage";
import { calorieTarget, estimateWorkoutCalories, macroTargets, planLabel, proteinTarget, todayKey, todaysWorkout } from "@/lib/generators";
import { calculateProteinPerMeal, foodLogTotals } from "@/lib/nutrition";
import { FitGoalState } from "@/lib/types";

export default function DashboardPage() {
  const [state, setState] = useState<FitGoalState | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (!saved) window.location.href = "/onboarding";
    setState(saved);
  }, []);

  if (!state) return null;

  const today = todayKey();
  const workout = todaysWorkout(state);
  const macros = macroTargets(state.profile);
  const calories = calorieTarget(state.profile);
  const protein = proteinTarget(state.profile);
  const todaysFoodLogs = (state.foodLogs ?? []).filter((entry) => entry.date === today);
  const eatenTotals = foodLogTotals(todaysFoodLogs.filter((entry) => entry.status === "eaten"));
  const plannedTotals = foodLogTotals(todaysFoodLogs.filter((entry) => entry.status === "planned"));
  const todaysHydrationLogs = (state.hydrationLogs ?? []).filter((entry) => entry.date === today);
  const workoutBurn = estimateWorkoutCalories(workout, state.profile.weightKg);
  const workoutDone = state.completedWorkoutDates.includes(today);
  const completedWorkoutCalories = workoutDone ? workoutBurn : 0;
  const projectedNetCalories = eatenTotals.calories + plannedTotals.calories - completedWorkoutCalories - (workoutDone ? 0 : workoutBurn);
  const actualNetCalories = eatenTotals.calories - completedWorkoutCalories;
  const remainingCalories = Math.max(0, calories - projectedNetCalories);
  const targetDeficit = state.profile.goal === "fat-loss" || state.profile.goal === "belly-fat-reduction" ? 400 : state.profile.goal === "muscle-gain" ? -300 : 0;
  const deficitNow = calories - actualNetCalories;
  const deficitStatus = state.profile.goal === "muscle-gain"
    ? `${Math.max(0, remainingCalories)} kcal left to fuel growth.`
    : deficitNow >= targetDeficit
      ? "Nice. You are on track."
      : `Burn or save ${Math.max(0, targetDeficit - deficitNow)} kcal.`;
  const caloriePercent = Math.min(100, Math.round(((eatenTotals.calories + plannedTotals.calories) / Math.max(1, calories)) * 100));
  const proteinPerMeal = calculateProteinPerMeal({ dailyProteinGoal: protein, mealsPerDay: 4 });
  const waterGoal = Math.round(state.profile.weightKg * 35);
  const waterLogged = todaysHydrationLogs.reduce((sum, entry) => sum + entry.amountMl, 0);
  const streak = Math.max(1, state.completedWorkoutDates.length + Math.min(2, todaysFoodLogs.length));

  function logWater(amountMl: number) {
    if (!state) return;
    setState(addHydrationLog(state, { date: today, amountMl, drinkType: "water" }));
  }

  return (
    <AppShell>
      <section className="space-y-5 px-5 pb-8 pt-5">
        <HeroCard
          eyebrow={planLabel(state.profile.goal)}
          title="Today, we move."
          body={`Mission: ${workout.dayTheme ?? workout.focus}. ${todaysFoodLogs.length ? "Your food log is live." : "Log your first meal to tune the plan."}`}
          icon={<Zap size={24} />}
          action={
            <div className="flex gap-2 overflow-x-auto pb-1">
              <AchievementBadge label={`${streak}-day streak`} detail="keep the glow" icon={<Sparkles size={16} />} />
              <AchievementBadge label="Energy check" detail="quick mood soon" icon={<Flame size={16} />} />
            </div>
          }
        />

        <MissionCard title={workout.title} focus={workout.focus} burn={workoutBurn} completed={workoutDone} />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setState(completeToday(state))} className="flex h-14 items-center justify-center gap-2 rounded-[24px] bg-fit-success text-sm font-black text-fit-bg shadow-premium transition-transform active:scale-95">
            <Check size={18} /> Mission done
          </button>
          <button onClick={() => setState(skipToday(state))} className="flex h-14 items-center justify-center gap-2 rounded-[24px] border border-fit-border bg-fit-surfaceElevated text-sm font-black text-fit-text shadow-sm transition-transform active:scale-95 dark:border-white/10 dark:bg-fit-darkElevated dark:text-white">
            <RefreshCcw size={18} /> Shift plan
          </button>
        </div>

        <CalorieBalanceCard eaten={eatenTotals.calories} burned={completedWorkoutCalories} remaining={remainingCalories} status={deficitStatus} percent={caloriePercent} />

        <ProteinProgressCard eaten={eatenTotals.protein + plannedTotals.protein} target={macros.protein} perMeal={proteinPerMeal} />

        <HydrationTracker logged={waterLogged} target={waterGoal} onAdd={logWater} />

      </section>
    </AppShell>
  );
}
