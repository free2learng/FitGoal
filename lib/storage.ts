"use client";

import { FitGoalState, OnboardingProfile, ProgressEntry } from "@/lib/types";
import { initialProgress, todayKey } from "@/lib/generators";

const key = "fitgoal-state";

export function loadState(): FitGoalState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as FitGoalState) : null;
}

export function saveState(state: FitGoalState) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

export function createState(profile: OnboardingProfile): FitGoalState {
  const state = { profile, completedWorkoutDates: [], skippedDates: [], progress: initialProgress(profile) };
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
