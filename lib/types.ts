export type Goal = "fat-loss" | "muscle-gain" | "maintenance";
export type FitnessLevel = "beginner" | "intermediate" | "athletic";
export type Equipment = "none" | "dumbbells" | "gym";
export type DietPreference = "balanced" | "high-protein" | "vegetarian";

export type OnboardingProfile = {
  goal: Goal;
  age: number;
  heightCm: number;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  equipment: Equipment;
  dietPreference: DietPreference;
};

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tutorialUrl: string;
};

export type Workout = {
  id: string;
  title: string;
  level: FitnessLevel;
  goal: Goal;
  day: number;
  durationMinutes: number;
  focus: string;
  exercises: Exercise[];
};

export type Meal = {
  name: string;
  calories: number;
  protein: number;
};

export type MealDay = {
  day: number;
  title: string;
  calories: number;
  protein: number;
  meals: Meal[];
};

export type ProgressEntry = {
  id: string;
  date: string;
  weightKg: number;
  waistCm: number;
  calories: number;
  workoutsCompleted: number;
};

export type FitGoalState = {
  profile: OnboardingProfile;
  completedWorkoutDates: string[];
  skippedDates: string[];
  progress: ProgressEntry[];
};
