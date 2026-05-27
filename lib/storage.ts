"use client";

import { FitGoalAccount, FitGoalState, FoodItem, FoodLogEntry, HydrationAdjustment, HydrationLogEntry, OnboardingProfile, PerformanceSummary, ProgressEntry } from "@/lib/types";
import { initialProgress, todayKey } from "@/lib/generators";
import { supabase } from "@/lib/supabase";

const key = "fitgoal-state";
const accountKey = "fitgoal-account";

function createGuestAccount(): FitGoalAccount {
  return {
    mode: "guest",
    guestId: crypto.randomUUID(),
    startedAt: new Date().toISOString()
  };
}

export function loadAccount(): FitGoalAccount {
  if (typeof window === "undefined") return createGuestAccount();
  const raw = window.localStorage.getItem(accountKey);
  if (!raw) {
    const account = createGuestAccount();
    window.localStorage.setItem(accountKey, JSON.stringify(account));
    return account;
  }
  return JSON.parse(raw) as FitGoalAccount;
}

export function saveAccount(account: FitGoalAccount) {
  if (typeof window === "undefined") return account;
  window.localStorage.setItem(accountKey, JSON.stringify(account));
  const saved = loadState();
  if (saved) saveState({ ...saved, account });
  return account;
}

export function loadState(): FitGoalState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as FitGoalState;
  return {
    ...parsed,
    account: parsed.account ?? loadAccount(),
    foodLogs: parsed.foodLogs ?? [],
    customFoods: parsed.customFoods ?? [],
    favoriteFoodIds: parsed.favoriteFoodIds ?? [],
    hydrationLogs: parsed.hydrationLogs ?? [],
    hydrationAdjustments: parsed.hydrationAdjustments ?? {}
  };
}

export function saveState(state: FitGoalState) {
  const next = { ...state, account: state.account ?? loadAccount() };
  window.localStorage.setItem(key, JSON.stringify(next));
  void syncStateToSupabase(next);
}

export function createState(profile: OnboardingProfile): FitGoalState {
  const state = { account: loadAccount(), profile, completedWorkoutDates: [], skippedDates: [], progress: initialProgress(profile), foodLogs: [], customFoods: [], favoriteFoodIds: [], hydrationLogs: [], hydrationAdjustments: {} };
  saveState(state);
  return state;
}

export function completeToday(state: FitGoalState) {
  const today = todayKey();
  const completedWorkoutDates = Array.from(new Set([...state.completedWorkoutDates, today]));
  const next = { ...state, completedWorkoutDates, skippedDates: state.skippedDates.filter((date) => date !== today) };
  saveState(next);
  return next;
}

export function skipToday(state: FitGoalState) {
  const today = todayKey();
  const skippedDates = Array.from(new Set([...state.skippedDates, today]));
  const next = { ...state, skippedDates, completedWorkoutDates: state.completedWorkoutDates.filter((date) => date !== today) };
  saveState(next);
  return next;
}

export function addProgress(state: FitGoalState, entry: Omit<ProgressEntry, "id">) {
  const next = { ...state, progress: [{ ...entry, id: crypto.randomUUID() }, ...state.progress].slice(0, 10) };
  saveState(next);
  return next;
}

export function addFoodLog(state: FitGoalState, entry: Omit<FoodLogEntry, "id">) {
  const next = { ...state, foodLogs: [{ ...entry, id: crypto.randomUUID() }, ...(state.foodLogs ?? [])] };
  saveState(next);
  return next;
}

export function convertPlannedFood(state: FitGoalState, entryId: string) {
  const next = {
    ...state,
    foodLogs: (state.foodLogs ?? []).map((entry) => entry.id === entryId ? { ...entry, status: "eaten" as const } : entry)
  };
  saveState(next);
  return next;
}

export function deleteFoodLog(state: FitGoalState, entryId: string) {
  const next = { ...state, foodLogs: (state.foodLogs ?? []).filter((entry) => entry.id !== entryId) };
  saveState(next);
  return next;
}

export function saveCustomFood(state: FitGoalState, food: FoodItem) {
  const customFoods = [food, ...(state.customFoods ?? []).filter((item) => item.id !== food.id)];
  const next = { ...state, customFoods };
  saveState(next);
  return next;
}

export function toggleFavoriteFood(state: FitGoalState, foodId: string) {
  const existing = new Set(state.favoriteFoodIds ?? []);
  if (existing.has(foodId)) existing.delete(foodId);
  else existing.add(foodId);
  const next = { ...state, favoriteFoodIds: Array.from(existing) };
  saveState(next);
  return next;
}

export function addHydrationLog(state: FitGoalState, entry: Omit<HydrationLogEntry, "id">) {
  const next = { ...state, hydrationLogs: [{ ...entry, id: crypto.randomUUID() }, ...(state.hydrationLogs ?? [])] };
  saveState(next);
  return next;
}

export function deleteHydrationLog(state: FitGoalState, entryId: string) {
  const next = { ...state, hydrationLogs: (state.hydrationLogs ?? []).filter((entry) => entry.id !== entryId) };
  saveState(next);
  return next;
}

export function toggleHydrationAdjustment(state: FitGoalState, date: string, adjustment: HydrationAdjustment) {
  const existing = new Set(state.hydrationAdjustments?.[date] ?? []);
  if (existing.has(adjustment)) existing.delete(adjustment);
  else existing.add(adjustment);
  const next = {
    ...state,
    hydrationAdjustments: {
      ...(state.hydrationAdjustments ?? {}),
      [date]: Array.from(existing)
    }
  };
  saveState(next);
  return next;
}

export function performanceSummary(state: FitGoalState): PerformanceSummary {
  const foodLogs = state.foodLogs ?? [];
  const eatenLogs = foodLogs.filter((entry) => entry.status === "eaten");
  const uniqueFoodDays = Array.from(new Set(eatenLogs.map((entry) => entry.date)));
  const latestProgress = state.progress[0];
  const calories = eatenLogs.reduce((sum, entry) => sum + entry.calories, 0);
  const protein = eatenLogs.reduce((sum, entry) => sum + entry.protein, 0);

  return {
    totalFoodLogs: foodLogs.length,
    totalHydrationLogs: (state.hydrationLogs ?? []).length,
    workoutsCompleted: state.completedWorkoutDates.length,
    currentWeightKg: latestProgress?.weightKg ?? state.profile.weightKg,
    latestWaistCm: latestProgress?.waistCm ?? Math.round(state.profile.heightCm * 0.48),
    averageCaloriesLogged: uniqueFoodDays.length ? Math.round(calories / uniqueFoodDays.length) : 0,
    averageProteinLogged: uniqueFoodDays.length ? Math.round(protein / uniqueFoodDays.length) : 0,
    lastActiveDate: todayKey()
  };
}

async function syncStateToSupabase(state: FitGoalState) {
  if (!supabase || state.account?.mode !== "google") return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("user_state_snapshots").upsert({
    user_id: data.user.id,
    state,
    performance_summary: performanceSummary(state),
    updated_at: new Date().toISOString()
  });
}
