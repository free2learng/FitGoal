export type Goal = "fat-loss" | "belly-fat-reduction" | "muscle-gain" | "maintenance";
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

export type ProgramExercise = Exercise & {
  difficulty: "beginner" | "moderate" | "challenging";
  targetMuscles: string[];
  animationUrl?: string;
  instructions: string[];
  commonMistakes: string[];
  beginnerTips: string[];
  metValue: number;
  durationMinutesPerSet: number;
};

export type WorkoutProgram = {
  id: string;
  title: string;
  subtitle: string;
  goal: Goal;
  level: FitnessLevel;
  targetDailyDeficit: number;
  weeklyFatLossEstimateKg: string;
  safetyNote: string;
  exercises: ProgramExercise[];
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
  carbs?: number;
  fats?: number;
};

export type MealDay = {
  day: number;
  title: string;
  calories: number;
  protein: number;
  carbs?: number;
  fats?: number;
  meals: Meal[];
};

export type FoodCategory = "protein" | "carbs" | "healthy-fats";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "post-workout";
export type FoodLogStatus = "eaten" | "planned";

export type FoodItem = {
  name: string;
  category: FoodCategory;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  keyMicronutrients: string[];
  fitnessBenefit: string;
  mealUse: string;
};

export type FoodLogEntry = {
  id: string;
  date: string;
  status: FoodLogStatus;
  mealType: MealType;
  foodName: string;
  serving: string;
  servingMultiplier: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  keyMicronutrients: string[];
  source: "library" | "custom";
};

export type MicronutrientItem = {
  name: string;
  foods: string[];
  whyItMatters: string;
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
  foodLogs?: FoodLogEntry[];
};
