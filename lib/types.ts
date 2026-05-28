export type Goal = "fat-loss" | "belly-fat-reduction" | "muscle-gain" | "maintenance";
export type FitnessLevel = "beginner" | "intermediate" | "athletic";
export type Equipment = "none" | "dumbbells" | "gym";
export type DietPreference = "balanced" | "high-protein" | "vegetarian";
export type WorkoutType = "upper-body" | "lower-body" | "full-body" | "leg-day" | "cardio" | "hiit" | "swimming" | "incline-walk" | "treadmill-run" | "mobility";

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
  id?: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tutorialUrl: string;
  targetMuscles?: string[];
  difficulty?: "beginner" | "moderate" | "challenging";
  coachingTip?: string;
  equipmentNeeded?: string[];
  instructions?: string[];
  commonMistakes?: string[];
  beginnerTips?: string[];
  breathingTips?: string[];
  formCues?: string[];
  goodFor?: string;
  regression?: string;
  progression?: string;
  safetyNotes?: string[];
  metValue?: number;
  durationMinutesPerSet?: number;
  shortVideoTipUrl?: string;
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
  workoutType?: WorkoutType;
  dayTheme?: string;
  intensity?: "easy" | "moderate" | "hard";
  equipment?: Array<Equipment | "any">;
  bestFor?: string;
  whyThisWorkout?: string;
  cardioAdvice?: string;
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

export type FoodCategory =
  | "drinks"
  | "protein"
  | "carbs"
  | "healthy-fats"
  | "meat"
  | "fish"
  | "vegetables"
  | "fruits"
  | "grains"
  | "bread"
  | "rice-dishes"
  | "pasta"
  | "noodles"
  | "soups"
  | "sauces"
  | "snacks"
  | "desserts"
  | "fast-food"
  | "restaurant-meals"
  | "cultural-foods"
  | "supplements";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "drink" | "post-workout";
export type FoodLogStatus = "eaten" | "planned";
export type VerifiedStatus = "verified" | "estimated" | "user";
export type HydrationDrinkType = "water" | "sparkling water" | "tea" | "coffee" | "milk" | "electrolyte drink" | "protein shake";
export type HydrationAdjustment = "workout-day" | "hot-weather" | "high-sweat";
export type AccountMode = "guest" | "google";

export type FoodItem = {
  id: string;
  name: string;
  category: FoodCategory;
  subcategory: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sugar: number;
  fibre: number;
  sodium: number;
  caffeineMg?: number;
  vitamins: string[];
  minerals: string[];
  tags: string[];
  synonyms: string[];
  commonServingOptions: { label: string; multiplier: number }[];
  preparationMethod: string;
  isDrink: boolean;
  isCustom: boolean;
  source: "seed" | "custom" | "usda" | "open-food-facts" | "barcode" | "restaurant";
  verifiedStatus: VerifiedStatus;
  fitnessBenefit: string;
  mealUse: string;
};

export type MealTemplate = {
  id: string;
  name: string;
  category: string;
  mealType: MealType;
  ingredientFoodIds: string[];
  tags: string[];
  description: string;
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
  sugar: number;
  fibre: number;
  sodium: number;
  caffeineMg?: number;
  keyMicronutrients: string[];
  source: "library" | "custom" | "template" | "combination";
};

export type HydrationLogEntry = {
  id: string;
  date: string;
  drinkType: HydrationDrinkType;
  amountMl: number;
};

export type FitGoalAccount = {
  mode: AccountMode;
  guestId?: string;
  userId?: string;
  email?: string;
  name?: string;
  startedAt: string;
  lastSyncedAt?: string;
};

export type PerformanceSummary = {
  totalFoodLogs: number;
  totalHydrationLogs: number;
  workoutsCompleted: number;
  currentWeightKg: number;
  latestWaistCm: number;
  averageCaloriesLogged: number;
  averageProteinLogged: number;
  lastActiveDate: string;
};

export type MicronutrientItem = {
  name: string;
  foods: string[];
  whyItMatters: string;
};

export type VideoCategory =
  | "Full body"
  | "Abs / core"
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Arms"
  | "Legs"
  | "Glutes"
  | "Cardio"
  | "Mobility"
  | "Beginner tips"
  | "Diet tips"
  | "Protein tips"
  | "Hydration tips"
  | "Recovery";

export type FitnessVideo = {
  id: string;
  title: string;
  category: VideoCategory;
  bodyPart: string;
  difficulty: "beginner" | "intermediate" | "athletic";
  durationSeconds: number;
  thumbnailUrl: string;
  videoUrl: string;
  coachName: string;
  tags: string[];
  targetMuscles: string[];
  coachTips: string[];
  safetyNotes: string[];
  caloriesEstimate?: number;
  relatedExerciseId?: string;
  relatedFoodId?: string;
  likeCount: number;
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
  account?: FitGoalAccount;
  profile: OnboardingProfile;
  completedWorkoutDates: string[];
  skippedDates: string[];
  progress: ProgressEntry[];
  foodLogs?: FoodLogEntry[];
  customFoods?: FoodItem[];
  favoriteFoodIds?: string[];
  favoriteVideoIds?: string[];
  hydrationLogs?: HydrationLogEntry[];
  hydrationAdjustments?: Record<string, HydrationAdjustment[]>;
};
