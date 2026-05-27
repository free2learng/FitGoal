import { mealPlanFor } from "@/lib/seed-data";
import { FitGoalState, Goal, HydrationAdjustment, OnboardingProfile, ProgressEntry, Workout } from "@/lib/types";
import { weeklyWorkoutPlan } from "@/lib/workout-plans";

export function calorieTarget(profile: OnboardingProfile) {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  const activity = profile.fitnessLevel === "beginner" ? 1.35 : profile.fitnessLevel === "intermediate" ? 1.5 : 1.7;
  const maintenance = base * activity;
  const target = profile.goal === "fat-loss" || profile.goal === "belly-fat-reduction" ? maintenance - 400 : profile.goal === "muscle-gain" ? maintenance + 300 : maintenance;
  return Math.round(target / 25) * 25;
}

export function proteinTarget(profile: OnboardingProfile) {
  const multiplier = profile.goal === "maintenance" ? 1.4 : 1.8;
  return Math.round(profile.weightKg * multiplier);
}

export function waterTargetLiters(profile: OnboardingProfile) {
  return Number(Math.max(2.1, profile.weightKg * 0.035).toFixed(1));
}

export function waterTargetMl(profile: OnboardingProfile, adjustments: HydrationAdjustment[] = []) {
  const adjustmentMl = adjustments.reduce((sum, adjustment) => {
    if (adjustment === "workout-day") return sum + 500;
    if (adjustment === "hot-weather") return sum + 500;
    if (adjustment === "high-sweat") return sum + 750;
    return sum;
  }, 0);
  return Math.round(profile.weightKg * 35 + adjustmentMl);
}

export function planLabel(goal: Goal) {
  return goal === "fat-loss" ? "Fat loss" : goal === "belly-fat-reduction" ? "Belly fat reduction" : goal === "muscle-gain" ? "Muscle gain" : "Maintenance";
}

export function macroTargets(profile: OnboardingProfile) {
  const calories = calorieTarget(profile);
  const protein = proteinTarget(profile);
  const fats = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4);
  return { calories, protein, carbs, fats };
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function todaysWorkout(state: FitGoalState) {
  const missedCount = state.skippedDates.length;
  return weeklyWorkoutPlan(state.profile, missedCount)[0];
}

export function workoutPlan(state: FitGoalState) {
  return weeklyWorkoutPlan(state.profile, state.skippedDates.length);
}

export function estimateWorkoutCalories(workout: Workout, weightKg: number) {
  const metByType = {
    "upper-body": 4.5,
    "lower-body": 5.2,
    "full-body": 5.8,
    "leg-day": 5.8,
    cardio: 5.5,
    hiit: 8,
    swimming: 6,
    "incline-walk": 6.3,
    "treadmill-run": 7.5,
    mobility: 2.5
  };
  const intensityBoost = workout.intensity === "hard" ? 1.12 : workout.intensity === "easy" ? 0.9 : 1;
  const met = (workout.workoutType ? metByType[workout.workoutType] : 5) * intensityBoost;
  return Math.round((met * weightKg * workout.durationMinutes) / 60);
}

export function progressPercent(state: FitGoalState) {
  const completed = state.completedWorkoutDates.length;
  const missed = state.skippedDates.length;
  const denominator = Math.max(7, completed + missed);
  return Math.min(100, Math.round((completed / denominator) * 100));
}

export function dietPlan(profile: OnboardingProfile) {
  return mealPlanFor(profile.dietPreference, profile.goal);
}

export function initialProgress(profile: OnboardingProfile): ProgressEntry[] {
  return [
    {
      id: crypto.randomUUID(),
      date: todayKey(),
      weightKg: profile.weightKg,
      waistCm: Math.round(profile.heightCm * 0.48),
      calories: calorieTarget(profile),
      workoutsCompleted: 0
    }
  ];
}
