import { mealPlanFor, workoutFor, workouts } from "@/lib/seed-data";
import { FitGoalState, Goal, OnboardingProfile, ProgressEntry } from "@/lib/types";

export function calorieTarget(profile: OnboardingProfile) {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  const activity = profile.fitnessLevel === "beginner" ? 1.35 : profile.fitnessLevel === "intermediate" ? 1.5 : 1.7;
  const maintenance = base * activity;
  const target = profile.goal === "fat-loss" ? maintenance - 450 : profile.goal === "muscle-gain" ? maintenance + 300 : maintenance;
  return Math.round(target / 25) * 25;
}

export function proteinTarget(profile: OnboardingProfile) {
  const multiplier = profile.goal === "muscle-gain" ? 2.0 : profile.goal === "fat-loss" ? 1.8 : 1.6;
  return Math.round(profile.weightKg * multiplier);
}

export function waterTargetLiters(profile: OnboardingProfile) {
  return Number(Math.max(2.1, profile.weightKg * 0.035).toFixed(1));
}

export function planLabel(goal: Goal) {
  return goal === "fat-loss" ? "Fat loss" : goal === "muscle-gain" ? "Muscle gain" : "Maintenance";
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function todaysWorkout(state: FitGoalState) {
  const missedCount = state.skippedDates.length;
  const baseWorkout = workoutFor(state.profile.fitnessLevel, state.profile.goal);
  const alternatives = workouts.filter((workout) => workout.level === state.profile.fitnessLevel || workout.goal === state.profile.goal);
  return alternatives[missedCount % alternatives.length] ?? baseWorkout;
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
