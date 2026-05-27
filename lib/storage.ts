"use client";

import { FitGoalState, FoodItem, FoodLogEntry, HydrationAdjustment, HydrationLogEntry, OnboardingProfile, ProgressEntry } from "@/lib/types";
import { initialProgress, todayKey } from "@/lib/generators";

const key = "fitgoal-state";

export function loadState(): FitGoalState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as FitGoalState;
  return {
    ...parsed,
    foodLogs: parsed.foodLogs ?? [],
    customFoods: parsed.customFoods ?? [],
    favoriteFoodIds: parsed.favoriteFoodIds ?? [],
    hydrationLogs: parsed.hydrationLogs ?? [],
    hydrationAdjustments: parsed.hydrationAdjustments ?? {}
  };
}

export function saveState(state: FitGoalState) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

export function createState(profile: OnboardingProfile): FitGoalState {
  const state = { profile, completedWorkoutDates: [], skippedDates: [], progress: initialProgress(profile), foodLogs: [], customFoods: [], favoriteFoodIds: [], hydrationLogs: [], hydrationAdjustments: {} };
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
