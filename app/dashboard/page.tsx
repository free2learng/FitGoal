"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Activity, CalendarDays, Check, Droplets, Dumbbell, Flame, Plus, RefreshCcw, ShieldAlert, Target, Trash2, Utensils } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { calorieTarget, dietPlan, estimateWorkoutCalories, macroTargets, planLabel, progressPercent, proteinTarget, todayKey, todaysWorkout, waterTargetMl, workoutPlan } from "@/lib/generators";
import { calculateProteinPerMeal, foodLogTotals, mealProteinStatus, mealTotalsByType, suggestNextMeal } from "@/lib/nutrition";
import { micronutrients } from "@/lib/program-data";
import { addHydrationLog, completeToday, deleteHydrationLog, loadState, skipToday, toggleHydrationAdjustment } from "@/lib/storage";
import { FitGoalState, HydrationDrinkType } from "@/lib/types";
import { bestCardioRecommendation } from "@/lib/workout-plans";

const mealTypes = ["breakfast", "lunch", "dinner", "snack", "post-workout"] as const;
const hydrationQuickAdds: { label: string; amountMl: number; drinkType: HydrationDrinkType }[] = [
  { label: "250ml glass", amountMl: 250, drinkType: "water" },
  { label: "330ml bottle", amountMl: 330, drinkType: "water" },
  { label: "500ml bottle", amountMl: 500, drinkType: "water" },
  { label: "750ml bottle", amountMl: 750, drinkType: "water" },
  { label: "1 litre bottle", amountMl: 1000, drinkType: "water" }
];
const hydrationDrinkTypes: HydrationDrinkType[] = ["water", "sparkling water", "tea", "coffee", "milk", "electrolyte drink", "protein shake"];

export default function DashboardPage() {
  const [state, setState] = useState<FitGoalState | null>(null);
  const [customWaterMl, setCustomWaterMl] = useState(250);
  const [customDrinkType, setCustomDrinkType] = useState<HydrationDrinkType>("water");

  useEffect(() => {
    const saved = loadState();
    if (!saved) window.location.href = "/onboarding";
    setState(saved);
  }, []);

  if (!state) return null;

  const workout = todaysWorkout(state);
  const weeklyPlan = workoutPlan(state);
  const meals = dietPlan(state.profile);
  const calories = calorieTarget(state.profile);
  const protein = proteinTarget(state.profile);
  const progress = progressPercent(state);
  const macros = macroTargets(state.profile);
  const today = todayKey();
  const todaysFoodLogs = (state.foodLogs ?? []).filter((entry) => entry.date === today);
  const eatenTotals = foodLogTotals(todaysFoodLogs.filter((entry) => entry.status === "eaten"));
  const plannedTotals = foodLogTotals(todaysFoodLogs.filter((entry) => entry.status === "planned"));
  const todaysHydrationLogs = (state.hydrationLogs ?? []).filter((entry) => entry.date === today);
  const hydrationAdjustments = state.hydrationAdjustments?.[today] ?? [];
  const waterGoal = waterTargetMl(state.profile, hydrationAdjustments);
  const waterLogged = todaysHydrationLogs.reduce((sum, entry) => sum + entry.amountMl, 0);
  const waterRemaining = Math.max(0, waterGoal - waterLogged);
  const plannedWorkoutCalories = estimateWorkoutCalories(workout, state.profile.weightKg);
  const completedWorkoutCalories = state.completedWorkoutDates.includes(today) ? plannedWorkoutCalories : 0;
  const expectedWorkoutCalories = state.completedWorkoutDates.includes(today) ? 0 : plannedWorkoutCalories;
  const actualNetCalories = eatenTotals.calories - completedWorkoutCalories;
  const projectedNetCalories = eatenTotals.calories + plannedTotals.calories - completedWorkoutCalories - expectedWorkoutCalories;
  const remainingCalories = Math.max(0, macros.calories - projectedNetCalories);
  const proteinStillNeeded = Math.max(0, macros.protein - eatenTotals.protein - plannedTotals.protein);
  const proteinEatenRemaining = Math.max(0, macros.protein - eatenTotals.protein);
  const proteinPerMeal = calculateProteinPerMeal({ dailyProteinGoal: macros.protein, mealsPerDay: 4 });
  const mealRows = mealTotalsByType(todaysFoodLogs.filter((entry) => entry.status === "eaten"), [...mealTypes]);
  const suggestedMeal = suggestNextMeal(remainingCalories, proteinStillNeeded);

  function logHydration(amountMl: number, drinkType: HydrationDrinkType) {
    if (!state) return;
    setState(addHydrationLog(state, { date: today, amountMl, drinkType }));
  }

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
          <BalanceTile label="Calories Today" value={eatenTotals.calories} suffix={`of ${calories} cal`} />
          <BalanceTile label="Protein Today" value={eatenTotals.protein} suffix={`of ${protein}g`} />
          <BalanceTile label="Protein Per Meal" value={proteinPerMeal} suffix="g target" />
          <BalanceTile label="Hydration Today" value={waterLogged} suffix={`of ${waterGoal} ml`} />
          <BalanceTile label="Workout Calories Burned" value={completedWorkoutCalories} suffix="cal" />
          <BalanceTile label="Net Calorie Balance" value={actualNetCalories} suffix="cal" />
        </div>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Utensils size={17} /> Today&apos;s Calorie Balance</p>
              <h2 className="mt-2 text-2xl font-black text-ink">{todaysFoodLogs.length ? "Logged from your food" : "Log food to start"}</h2>
            </div>
            <Link href="/nutrition/food-library" className="rounded-lg bg-mint/15 px-3 py-2 text-sm font-black text-leaf">Log food</Link>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Food intake is never assumed. Log eaten foods manually, or add planned foods and convert them after eating.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <BalanceTile label="Eaten so far" value={eatenTotals.calories} suffix="cal" />
            <BalanceTile label="Planned meals" value={plannedTotals.calories} suffix="cal" />
            <BalanceTile label="Workout burned" value={completedWorkoutCalories} suffix="cal" />
            <BalanceTile label="Planned burn" value={expectedWorkoutCalories} suffix="cal" />
            <BalanceTile label="Actual net" value={actualNetCalories} suffix="cal" />
            <BalanceTile label="Projected net" value={projectedNetCalories} suffix="cal" />
            <BalanceTile label="Remaining" value={remainingCalories} suffix="cal" />
            <BalanceTile label="Protein needed" value={proteinStillNeeded} suffix="g" />
          </div>
          <div className="mt-4 space-y-3">
            <MacroBar label="Protein eaten" eaten={eatenTotals.protein} target={macros.protein} suffix="g" />
            <MacroBar label="Carbs eaten" eaten={eatenTotals.carbs} target={macros.carbs} suffix="g" />
            <MacroBar label="Fats eaten" eaten={eatenTotals.fats} target={macros.fats} suffix="g" />
          </div>
          <div className="mt-4 rounded-lg bg-mint/15 p-3">
            <p className="text-sm font-black text-ink">Protein guidance</p>
            <p className="mt-1 text-sm text-zinc-700">You should aim for around {proteinPerMeal}g protein per meal today. Protein remaining from eaten foods: {proteinEatenRemaining}g.</p>
            <p className="mt-1 text-xs font-semibold text-zinc-600">Guideline: fat loss and muscle gain use 1.6-2.2g/kg body weight; maintenance uses 1.2-1.6g/kg.</p>
          </div>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3">
            <p className="text-sm font-black text-ink">Meal-level protein</p>
            <div className="mt-3 space-y-2">
              {mealRows.map((row) => (
                <div key={row.mealType} className="rounded-lg bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black capitalize text-ink">{row.mealType.replace("-", " ")}</p>
                    <span className={`rounded-lg px-2 py-1 text-xs font-black ${row.count && row.totals.protein >= proteinPerMeal * 0.8 ? "bg-mint/20 text-leaf" : "bg-peach/30 text-ink"}`}>
                      {row.count ? mealProteinStatus(row.totals.protein, proteinPerMeal) : "No meal logged"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{row.totals.calories} cal - {row.totals.protein}g protein - {row.totals.carbs}g carbs - {row.totals.fats}g fats</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3">
            <p className="text-sm font-black text-ink">Vitamins and minerals checklist</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {micronutrients.map((item) => {
                const done = eatenTotals.micronutrients.includes(item.name);
                return (
                  <span key={item.name} className={`rounded-lg px-2 py-1 text-xs font-bold ${done ? "bg-mint/20 text-leaf" : "bg-white text-zinc-500"}`}>
                    {done ? "✓" : "+"} {item.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-sky/15 p-3">
            <p className="text-sm font-black text-ink">Suggested next meal</p>
            <p className="mt-1 text-sm text-zinc-700">{suggestedMeal.name} ({suggestedMeal.calories} cal, {suggestedMeal.protein}g protein)</p>
          </div>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Droplets size={17} /> Hydration Today</p>
              <h2 className="mt-2 text-2xl font-black text-ink">{waterLogged}ml logged</h2>
            </div>
            <p className="rounded-lg bg-sky/15 px-3 py-2 text-sm font-black text-ink">{waterRemaining}ml left</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">You have {waterRemaining}ml left to reach your hydration goal. Alcohol is not counted as hydration.</p>
          <div className="mt-4">
            <MacroBar label="Water progress" eaten={waterLogged} target={waterGoal} suffix="ml" />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {hydrationQuickAdds.map((option) => (
              <button key={option.label} onClick={() => logHydration(option.amountMl, option.drinkType)} className="shrink-0 rounded-lg bg-ink px-3 py-2 text-xs font-black text-white">
                <Plus size={14} className="inline" /> {option.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_120px] gap-2">
            <select value={customDrinkType} onChange={(event) => setCustomDrinkType(event.target.value as HydrationDrinkType)} className="h-11 rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf">
              {hydrationDrinkTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <input value={customWaterMl} onChange={(event) => setCustomWaterMl(Number(event.target.value))} type="number" min="1" step="50" className="h-11 rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf" aria-label="Custom hydration amount ml" />
          </div>
          <button onClick={() => logHydration(Math.max(1, customWaterMl), customDrinkType)} className="mt-2 h-11 w-full rounded-lg bg-leaf text-sm font-black text-white">Add custom amount</button>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <AdjustmentButton active={hydrationAdjustments.includes("workout-day")} label="Workout +500ml" onClick={() => setState(toggleHydrationAdjustment(state, today, "workout-day"))} />
            <AdjustmentButton active={hydrationAdjustments.includes("hot-weather")} label="Hot +500ml" onClick={() => setState(toggleHydrationAdjustment(state, today, "hot-weather"))} />
            <AdjustmentButton active={hydrationAdjustments.includes("high-sweat")} label="High sweat +750ml" onClick={() => setState(toggleHydrationAdjustment(state, today, "high-sweat"))} />
          </div>
          <div className="mt-3 space-y-2">
            {todaysHydrationLogs.length === 0 ? (
              <p className="rounded-lg bg-zinc-50 p-3 text-sm font-semibold text-zinc-500">No hydration logged yet.</p>
            ) : todaysHydrationLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg bg-zinc-50 p-3">
                <p className="text-sm font-bold text-ink">{log.amountMl}ml {log.drinkType}</p>
                <button onClick={() => setState(deleteHydrationLog(state, log.id))} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-zinc-500" aria-label="Delete hydration"><Trash2 size={15} /></button>
              </div>
            ))}
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
              <p className="mt-1 text-sm text-zinc-600">{workout.durationMinutes} min - {workout.dayTheme ?? workout.focus}</p>
            </div>
            <Link href="/workouts/today" className="rounded-lg bg-mint/15 px-3 py-2 text-sm font-black text-leaf">Open</Link>
          </div>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3">
            <p className="text-sm font-black text-ink">{workout.focus}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{workout.whyThisWorkout}</p>
            <p className="mt-2 text-xs font-black uppercase tracking-normal text-zinc-500">Estimated burn: {plannedWorkoutCalories} cal</p>
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
          <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Dumbbell size={17} /> 7-day training plan</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Your weekly split</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Built around your goal, level, and available equipment. Missing a day shifts the next best workout into today.</p>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {weeklyPlan.map((day, index) => (
              <Link key={`${day.id}-${index}`} href={`/workouts/${day.id}`} className="w-[245px] shrink-0 rounded-lg bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-white px-2 py-1 text-xs font-black text-leaf">Day {index + 1}</span>
                  <span className="rounded-lg bg-mint/15 px-2 py-1 text-xs font-black capitalize text-ink">{day.intensity}</span>
                </div>
                <p className="mt-3 text-sm font-black text-zinc-500">{day.dayTheme}</p>
                <h3 className="mt-1 text-lg font-black text-ink">{day.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{day.durationMinutes} min - {estimateWorkoutCalories(day, state.profile.weightKg)} cal est.</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Activity size={17} /> Cardio guidance</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Most effective cardio for you</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{bestCardioRecommendation(state.profile)}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <AdvicePill icon={<Target size={15} />} title="Incline walk" text="High repeatability, low impact." />
            <AdvicePill icon={<Flame size={15} />} title="HIIT" text="Efficient, use sparingly." />
            <AdvicePill icon={<Droplets size={15} />} title="Swimming" text="Joint-friendly full-body cardio." />
            <AdvicePill icon={<Activity size={15} />} title="Treadmill" text="Clear pace and interval targets." />
          </div>
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

function BalanceTile({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-xs font-bold uppercase tracking-normal text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-black text-ink">{value}</p>
      <p className="text-xs font-semibold text-zinc-500">{suffix}</p>
    </div>
  );
}

function AdjustmentButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`min-h-11 rounded-lg px-2 text-xs font-black ${active ? "bg-sky text-ink" : "bg-zinc-100 text-zinc-600"}`}>
      {label}
    </button>
  );
}

function AdvicePill({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="flex items-center gap-2 text-sm font-black text-ink">{icon}{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-zinc-600">{text}</p>
    </div>
  );
}

function MacroBar({ label, eaten, target, suffix }: { label: string; eaten: number; target: number; suffix: string }) {
  const percent = target > 0 ? Math.min(100, Math.round((eaten / target) * 100)) : 0;
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
