import { DietPreference, FitnessLevel, Goal, MealDay, Workout } from "@/lib/types";

const tutorials = {
  squat: "https://www.youtube.com/results?search_query=proper+bodyweight+squat+form",
  pushup: "https://www.youtube.com/results?search_query=beginner+push+up+form",
  row: "https://www.youtube.com/results?search_query=dumbbell+row+proper+form",
  lunge: "https://www.youtube.com/results?search_query=reverse+lunge+proper+form",
  plank: "https://www.youtube.com/results?search_query=plank+proper+form",
  deadlift: "https://www.youtube.com/results?search_query=romanian+deadlift+proper+form",
  press: "https://www.youtube.com/results?search_query=dumbbell+shoulder+press+proper+form",
  burpee: "https://www.youtube.com/results?search_query=burpee+proper+form"
};

export const workouts: Workout[] = [
  {
    id: "beginner-fat-loss-1",
    title: "Starter Full Body Burn",
    level: "beginner",
    goal: "fat-loss",
    day: 1,
    durationMinutes: 28,
    focus: "Low impact strength and steady conditioning",
    exercises: [
      { name: "Bodyweight Squat", sets: 3, reps: "10", restSeconds: 45, tutorialUrl: tutorials.squat },
      { name: "Incline Push-up", sets: 3, reps: "8", restSeconds: 45, tutorialUrl: tutorials.pushup },
      { name: "Reverse Lunge", sets: 2, reps: "8 each side", restSeconds: 45, tutorialUrl: tutorials.lunge },
      { name: "Plank", sets: 3, reps: "20 sec", restSeconds: 40, tutorialUrl: tutorials.plank }
    ]
  },
  {
    id: "beginner-muscle-gain-1",
    title: "Foundations Strength",
    level: "beginner",
    goal: "muscle-gain",
    day: 1,
    durationMinutes: 32,
    focus: "Simple strength practice with controlled reps",
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: "8-10", restSeconds: 75, tutorialUrl: tutorials.squat },
      { name: "Dumbbell Row", sets: 3, reps: "10 each side", restSeconds: 60, tutorialUrl: tutorials.row },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "8", restSeconds: 75, tutorialUrl: tutorials.press },
      { name: "Dead Bug", sets: 3, reps: "8 each side", restSeconds: 45, tutorialUrl: tutorials.plank }
    ]
  },
  {
    id: "beginner-maintenance-1",
    title: "Feel Good Circuit",
    level: "beginner",
    goal: "maintenance",
    day: 1,
    durationMinutes: 25,
    focus: "Balanced movement and consistency",
    exercises: [
      { name: "Bodyweight Squat", sets: 2, reps: "12", restSeconds: 40, tutorialUrl: tutorials.squat },
      { name: "Wall Push-up", sets: 2, reps: "12", restSeconds: 40, tutorialUrl: tutorials.pushup },
      { name: "Glute Bridge", sets: 3, reps: "12", restSeconds: 40, tutorialUrl: tutorials.deadlift },
      { name: "Side Plank", sets: 2, reps: "15 sec each", restSeconds: 35, tutorialUrl: tutorials.plank }
    ]
  },
  {
    id: "intermediate-fat-loss-1",
    title: "Strength Sweat Session",
    level: "intermediate",
    goal: "fat-loss",
    day: 1,
    durationMinutes: 36,
    focus: "Supersets and short rest",
    exercises: [
      { name: "Dumbbell Squat", sets: 4, reps: "12", restSeconds: 45, tutorialUrl: tutorials.squat },
      { name: "Push-up", sets: 4, reps: "10", restSeconds: 45, tutorialUrl: tutorials.pushup },
      { name: "Dumbbell Row", sets: 4, reps: "12 each", restSeconds: 45, tutorialUrl: tutorials.row },
      { name: "Mountain Climber", sets: 3, reps: "30 sec", restSeconds: 40, tutorialUrl: tutorials.burpee }
    ]
  },
  {
    id: "intermediate-muscle-gain-1",
    title: "Upper Lower Builder",
    level: "intermediate",
    goal: "muscle-gain",
    day: 1,
    durationMinutes: 42,
    focus: "Progressive hypertrophy basics",
    exercises: [
      { name: "Romanian Deadlift", sets: 4, reps: "8-10", restSeconds: 90, tutorialUrl: tutorials.deadlift },
      { name: "Dumbbell Bench Press", sets: 4, reps: "8-10", restSeconds: 90, tutorialUrl: tutorials.pushup },
      { name: "Walking Lunge", sets: 3, reps: "10 each", restSeconds: 75, tutorialUrl: tutorials.lunge },
      { name: "One-arm Row", sets: 3, reps: "10 each", restSeconds: 75, tutorialUrl: tutorials.row }
    ]
  },
  {
    id: "athletic-fat-loss-1",
    title: "Athletic Conditioning",
    level: "athletic",
    goal: "fat-loss",
    day: 1,
    durationMinutes: 45,
    focus: "Power, pace, and full-body conditioning",
    exercises: [
      { name: "Burpee", sets: 5, reps: "8", restSeconds: 45, tutorialUrl: tutorials.burpee },
      { name: "Jump Squat", sets: 4, reps: "10", restSeconds: 45, tutorialUrl: tutorials.squat },
      { name: "Push-up", sets: 4, reps: "15", restSeconds: 45, tutorialUrl: tutorials.pushup },
      { name: "Plank Shoulder Tap", sets: 4, reps: "20 taps", restSeconds: 40, tutorialUrl: tutorials.plank }
    ]
  },
  {
    id: "athletic-muscle-gain-1",
    title: "Performance Strength",
    level: "athletic",
    goal: "muscle-gain",
    day: 1,
    durationMinutes: 50,
    focus: "Heavy compound work with accessory volume",
    exercises: [
      { name: "Deadlift", sets: 5, reps: "5", restSeconds: 120, tutorialUrl: tutorials.deadlift },
      { name: "Front Squat", sets: 4, reps: "6", restSeconds: 105, tutorialUrl: tutorials.squat },
      { name: "Shoulder Press", sets: 4, reps: "8", restSeconds: 90, tutorialUrl: tutorials.press },
      { name: "Bent-over Row", sets: 4, reps: "8", restSeconds: 90, tutorialUrl: tutorials.row }
    ]
  },
  {
    id: "athletic-maintenance-1",
    title: "Total Body Prime",
    level: "athletic",
    goal: "maintenance",
    day: 1,
    durationMinutes: 38,
    focus: "Strength, mobility, and conditioning balance",
    exercises: [
      { name: "Kettlebell Swing", sets: 4, reps: "15", restSeconds: 60, tutorialUrl: tutorials.deadlift },
      { name: "Pull-up or Row", sets: 4, reps: "8-10", restSeconds: 75, tutorialUrl: tutorials.row },
      { name: "Split Squat", sets: 3, reps: "10 each", restSeconds: 60, tutorialUrl: tutorials.lunge },
      { name: "Hollow Hold", sets: 3, reps: "25 sec", restSeconds: 45, tutorialUrl: tutorials.plank }
    ]
  }
];

const balancedMeals: MealDay[] = [
  { day: 1, title: "Balanced Start", calories: 2050, protein: 135, meals: [{ name: "Greek yogurt, berries, oats", calories: 430, protein: 34 }, { name: "Chicken rice bowl", calories: 650, protein: 48 }, { name: "Salmon, potatoes, greens", calories: 720, protein: 46 }, { name: "Apple with peanut butter", calories: 250, protein: 7 }] },
  { day: 2, title: "Simple Prep", calories: 1980, protein: 128, meals: [{ name: "Egg toast and fruit", calories: 460, protein: 30 }, { name: "Turkey wrap", calories: 610, protein: 42 }, { name: "Lean beef pasta", calories: 700, protein: 48 }, { name: "Cottage cheese", calories: 210, protein: 8 }] },
  { day: 3, title: "Fresh Fuel", calories: 2025, protein: 132, meals: [{ name: "Protein smoothie", calories: 410, protein: 35 }, { name: "Tuna quinoa salad", calories: 620, protein: 45 }, { name: "Chicken tacos", calories: 735, protein: 44 }, { name: "Carrots and hummus", calories: 260, protein: 8 }] },
  { day: 4, title: "Comfort Fit", calories: 2100, protein: 140, meals: [{ name: "Omelet and toast", calories: 500, protein: 36 }, { name: "Chicken soup and roll", calories: 580, protein: 38 }, { name: "Turkey chili", calories: 760, protein: 56 }, { name: "Protein pudding", calories: 260, protein: 10 }] },
  { day: 5, title: "High Energy", calories: 2150, protein: 142, meals: [{ name: "Overnight oats", calories: 480, protein: 32 }, { name: "Shrimp rice bowl", calories: 640, protein: 48 }, { name: "Chicken curry", calories: 760, protein: 52 }, { name: "Skyr and fruit", calories: 270, protein: 10 }] },
  { day: 6, title: "Weekend Easy", calories: 2000, protein: 130, meals: [{ name: "Breakfast burrito", calories: 520, protein: 34 }, { name: "Chicken Caesar salad", calories: 620, protein: 48 }, { name: "Turkey burger plate", calories: 640, protein: 42 }, { name: "Protein bar", calories: 220, protein: 6 }] },
  { day: 7, title: "Reset Day", calories: 1950, protein: 126, meals: [{ name: "Cottage cheese bowl", calories: 390, protein: 34 }, { name: "Chicken pesto sandwich", calories: 650, protein: 42 }, { name: "Cod, rice, vegetables", calories: 680, protein: 44 }, { name: "Fruit and nuts", calories: 230, protein: 6 }] }
];

export function mealPlanFor(preference: DietPreference, goal: Goal): MealDay[] {
  const multiplier = goal === "fat-loss" ? 0.85 : goal === "muscle-gain" ? 1.12 : 1;
  const proteinBoost = preference === "high-protein" ? 18 : preference === "vegetarian" ? -5 : 0;
  return balancedMeals.map((day) => ({
    ...day,
    calories: Math.round(day.calories * multiplier),
    protein: day.protein + proteinBoost,
    meals: day.meals.map((meal) => ({
      ...meal,
      name: preference === "vegetarian" ? meal.name.replace(/Chicken|Turkey|Salmon|Tuna|Lean beef|Shrimp|Cod/g, "Tofu") : meal.name,
      calories: Math.round(meal.calories * multiplier),
      protein: Math.max(6, meal.protein + Math.round(proteinBoost / 4))
    }))
  }));
}

export function workoutFor(level: FitnessLevel, goal: Goal): Workout {
  return workouts.find((workout) => workout.level === level && workout.goal === goal) ?? workouts.find((workout) => workout.level === level) ?? workouts[0];
}
