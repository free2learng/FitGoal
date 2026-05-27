import { Exercise, FitnessLevel, Goal, OnboardingProfile, Workout, WorkoutType } from "@/lib/types";

const tutorial = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

type DayTemplate = {
  workoutType: WorkoutType;
  dayTheme: string;
  title: string;
  focus: string;
};

const dayTemplates: Record<Goal, DayTemplate[]> = {
  "fat-loss": [
    { workoutType: "full-body", dayTheme: "Full body strength", title: "Full Body Fat Loss Strength", focus: "Compound moves that train more muscle in less time" },
    { workoutType: "incline-walk", dayTheme: "Incline cardio", title: "Incline Walk Engine", focus: "Low impact calorie burn and aerobic base" },
    { workoutType: "upper-body", dayTheme: "Upper body", title: "Upper Body Lean Strength", focus: "Push, pull, posture, and core stability" },
    { workoutType: "hiit", dayTheme: "HIIT conditioning", title: "Beginner Smart HIIT", focus: "Short intervals with joint-friendly options" },
    { workoutType: "lower-body", dayTheme: "Lower body", title: "Lower Body Burn", focus: "Legs and glutes with steady effort" },
    { workoutType: "swimming", dayTheme: "Cardio choice", title: "Swim or Zone 2 Cardio", focus: "Joint-friendly cardio for recovery and calorie output" },
    { workoutType: "mobility", dayTheme: "Recovery", title: "Mobility Reset", focus: "Mobility, walking, and recovery to keep consistency high" }
  ],
  "belly-fat-reduction": [
    { workoutType: "full-body", dayTheme: "Full body strength", title: "Total Body Deficit Builder", focus: "Strength plus core bracing without spot-reduction claims" },
    { workoutType: "incline-walk", dayTheme: "Incline cardio", title: "Incline Walk Fat Loss", focus: "Sustainable cardio that supports total body fat loss" },
    { workoutType: "upper-body", dayTheme: "Upper body", title: "Upper Body Metabolic Strength", focus: "Upper body strength with core control" },
    { workoutType: "hiit", dayTheme: "HIIT conditioning", title: "Low Impact HIIT", focus: "Efficient conditioning with controlled intensity" },
    { workoutType: "leg-day", dayTheme: "Leg day", title: "Leg Day Calorie Driver", focus: "Large muscle groups for strength and energy use" },
    { workoutType: "treadmill-run", dayTheme: "Treadmill intervals", title: "Treadmill Walk-Run Intervals", focus: "Adjustable cardio for fitness level and preference" },
    { workoutType: "mobility", dayTheme: "Recovery", title: "Sleep and Steps Reset", focus: "Easy movement, stretching, and recovery habits" }
  ],
  "muscle-gain": [
    { workoutType: "upper-body", dayTheme: "Upper body", title: "Upper Body Hypertrophy", focus: "Chest, back, shoulders, and arms" },
    { workoutType: "lower-body", dayTheme: "Lower body", title: "Lower Body Strength", focus: "Squat, hinge, glutes, and hamstrings" },
    { workoutType: "mobility", dayTheme: "Recovery", title: "Mobility and Easy Cardio", focus: "Recovery that helps the next lift feel stronger" },
    { workoutType: "full-body", dayTheme: "Full body", title: "Full Body Builder", focus: "Balanced strength practice across the whole body" },
    { workoutType: "leg-day", dayTheme: "Leg day", title: "Leg Day Growth", focus: "Quads, glutes, hamstrings, and calves" },
    { workoutType: "cardio", dayTheme: "Cardio support", title: "Zone 2 Conditioning", focus: "Heart health without stealing from muscle recovery" },
    { workoutType: "mobility", dayTheme: "Recovery", title: "Stretch and Core Control", focus: "Breathing, mobility, and light core work" }
  ],
  maintenance: [
    { workoutType: "full-body", dayTheme: "Full body", title: "Full Body Maintenance", focus: "Efficient strength for the whole body" },
    { workoutType: "cardio", dayTheme: "Cardio", title: "Cardio Choice Day", focus: "Pick incline walk, swim, bike, or treadmill run" },
    { workoutType: "upper-body", dayTheme: "Upper body", title: "Upper Body Strength", focus: "Push and pull balance" },
    { workoutType: "mobility", dayTheme: "Mobility", title: "Mobility and Core", focus: "Move better and reduce stiffness" },
    { workoutType: "lower-body", dayTheme: "Lower body", title: "Lower Body Strength", focus: "Legs, glutes, and posterior chain" },
    { workoutType: "hiit", dayTheme: "Conditioning", title: "Short Conditioning Finisher", focus: "Fast, optional intensity for fitness" },
    { workoutType: "mobility", dayTheme: "Recovery", title: "Walk and Reset", focus: "Steps, stretching, and readiness" }
  ]
};

const levelConfig: Record<FitnessLevel, { sets: number; duration: number; rest: number; difficulty: Exercise["difficulty"] }> = {
  beginner: { sets: 2, duration: 28, rest: 60, difficulty: "beginner" },
  intermediate: { sets: 3, duration: 38, rest: 50, difficulty: "moderate" },
  athletic: { sets: 4, duration: 48, rest: 40, difficulty: "challenging" }
};

function strengthExercise(name: string, reps: string, targetMuscles: string[], level: FitnessLevel, coachingTip: string): Exercise {
  const config = levelConfig[level];
  return {
    name,
    sets: config.sets,
    reps,
    restSeconds: config.rest,
    tutorialUrl: tutorial(`${name} proper form`),
    targetMuscles,
    difficulty: config.difficulty,
    coachingTip
  };
}

function cardioExercise(name: string, reps: string, level: FitnessLevel, coachingTip: string): Exercise {
  const config = levelConfig[level];
  return {
    name,
    sets: level === "beginner" ? 1 : 2,
    reps,
    restSeconds: level === "athletic" ? 45 : 60,
    tutorialUrl: tutorial(`${name} workout beginner form`),
    targetMuscles: ["heart", "lungs", "legs"],
    difficulty: config.difficulty,
    coachingTip
  };
}

function equipmentName(profile: OnboardingProfile, bodyweight: string, dumbbells: string, gym: string) {
  if (profile.equipment === "gym") return gym;
  if (profile.equipment === "dumbbells") return dumbbells;
  return bodyweight;
}

function exercisesFor(template: DayTemplate, profile: OnboardingProfile): Exercise[] {
  const level = profile.fitnessLevel;
  const press = equipmentName(profile, "Incline Push-up", "Dumbbell Floor Press", "Machine Chest Press");
  const row = equipmentName(profile, "Towel Row or Doorframe Row", "One-arm Dumbbell Row", "Seated Cable Row");
  const squat = equipmentName(profile, "Bodyweight Squat", "Goblet Squat", "Leg Press");
  const hinge = equipmentName(profile, "Glute Bridge", "Dumbbell Romanian Deadlift", "Barbell Romanian Deadlift");
  const shoulder = equipmentName(profile, "Pike Push-up", "Dumbbell Shoulder Press", "Machine Shoulder Press");
  const lunge = equipmentName(profile, "Reverse Lunge", "Dumbbell Reverse Lunge", "Walking Lunge");

  if (template.workoutType === "upper-body") {
    return [
      strengthExercise(press, level === "beginner" ? "8-10" : "8-12", ["chest", "triceps", "shoulders"], level, "Keep one or two reps in reserve."),
      strengthExercise(row, "10 each side", ["back", "biceps"], level, "Pull your elbow toward your hip, not your neck."),
      strengthExercise(shoulder, "8-10", ["shoulders", "triceps"], level, "Brace your ribs down before each rep."),
      strengthExercise("Dead Bug", "8 each side", ["core"], level, "Move slowly and keep your lower back quiet.")
    ];
  }

  if (template.workoutType === "lower-body" || template.workoutType === "leg-day") {
    return [
      strengthExercise(squat, level === "athletic" ? "8-10" : "10-12", ["quads", "glutes"], level, "Use a range of motion you can control."),
      strengthExercise(hinge, "8-12", ["hamstrings", "glutes", "back"], level, "Hips move back first, spine stays long."),
      strengthExercise(lunge, "8 each side", ["quads", "glutes"], level, "Step back far enough to keep the front heel grounded."),
      strengthExercise("Standing Calf Raise", "12-15", ["calves"], level, "Pause briefly at the top.")
    ];
  }

  if (template.workoutType === "hiit") {
    return [
      cardioExercise("Marching High Knees", level === "beginner" ? "30 sec on, 30 sec easy" : "40 sec on, 20 sec easy", level, "Fast does not matter until form is steady."),
      cardioExercise("Mountain Climbers", level === "beginner" ? "20 sec on, 40 sec easy" : "35 sec on, 25 sec easy", level, "Keep shoulders stacked over hands."),
      cardioExercise("Squat to Reach", "10-15 reps", level, "Use this as a power move, not a sloppy jump."),
      cardioExercise(level === "beginner" ? "Step-back Burpee" : "Burpee", level === "beginner" ? "6 reps" : "8-10 reps", level, "Step instead of jumping whenever impact feels too high.")
    ];
  }

  if (template.workoutType === "incline-walk") {
    return [
      cardioExercise("Treadmill Incline Walk", level === "beginner" ? "20 min at 4-7% incline" : "28 min at 6-10% incline", level, "Choose a pace where talking is possible but not effortless."),
      strengthExercise("Side Plank", "15-30 sec each side", ["core", "obliques"], level, "Think long body, not high hips."),
      strengthExercise("Glute Bridge", "12-15", ["glutes", "hamstrings"], level, "Squeeze glutes without arching the back.")
    ];
  }

  if (template.workoutType === "swimming") {
    return [
      cardioExercise("Easy Swim Intervals", level === "beginner" ? "8 x 1 min easy with 45 sec rest" : "10 x 2 min steady with 30 sec rest", level, "Use relaxed breathing and smooth strokes."),
      cardioExercise("Pool Walk or Kickboard", "6-10 min easy", level, "Keep this joint-friendly and restorative."),
      strengthExercise("Bird Dog", "8 each side", ["core", "back"], level, "Reach long, avoid twisting.")
    ];
  }

  if (template.workoutType === "treadmill-run") {
    return [
      cardioExercise("Treadmill Walk-Run Intervals", level === "beginner" ? "1 min jog, 2 min walk x 8" : "2 min run, 1 min walk x 10", level, "Control breathing before increasing speed."),
      strengthExercise("Bodyweight Squat", "12", ["quads", "glutes"], level, "Keep this easy after intervals."),
      strengthExercise("Plank", "20-40 sec", ["core"], level, "Stop before your hips sag.")
    ];
  }

  if (template.workoutType === "cardio") {
    return [
      cardioExercise("Zone 2 Cardio Choice", level === "beginner" ? "25 min walk, bike, swim, or easy treadmill" : "35 min walk, bike, swim, row, or treadmill", level, "Pick the mode you will actually repeat."),
      strengthExercise("Farmer Carry or Suitcase Carry", "30-45 sec", ["core", "grip", "shoulders"], level, "Walk tall and slow."),
      strengthExercise("Hip Flexor Stretch", "40 sec each side", ["hips"], level, "Breathe into the stretch.")
    ];
  }

  if (template.workoutType === "mobility") {
    return [
      strengthExercise("Cat Cow", "8 slow reps", ["spine"], level, "Move gently and breathe."),
      strengthExercise("World's Greatest Stretch", "5 each side", ["hips", "hamstrings", "upper back"], level, "Use a small range first."),
      strengthExercise("Child's Pose Breathing", "60 sec", ["back", "hips"], level, "Use this to downshift stress."),
      cardioExercise("Easy Walk", "15-30 min", level, "Keep it easy enough to recover.")
    ];
  }

  return [
    strengthExercise(squat, "10-12", ["quads", "glutes"], level, "Start with control."),
    strengthExercise(press, "8-10", ["chest", "triceps"], level, "Brace first."),
    strengthExercise(row, "10 each side", ["back", "biceps"], level, "Pull smoothly."),
    strengthExercise(hinge, "10-12", ["hamstrings", "glutes"], level, "Hinge from the hips.")
  ];
}

function cardioAdvice(profile: OnboardingProfile, workoutType: WorkoutType) {
  if (workoutType === "swimming") return "Swimming is a strong choice when joints feel tired because it trains cardio with low impact.";
  if (workoutType === "incline-walk") return "Incline walking is one of the best beginner fat-loss cardio options because it is repeatable, low impact, and easy to progress.";
  if (workoutType === "treadmill-run") return "Use treadmill intervals when you want a clear cardio target; slow down before form or breathing breaks down.";
  if (workoutType === "hiit") return "HIIT is efficient, but keep it to one or two weekly sessions so recovery and strength still improve.";
  if (profile.goal === "muscle-gain") return "Keep cardio mostly easy today so it supports heart health without reducing lifting performance.";
  return "Choose the cardio mode you can repeat consistently: incline walk, swim, bike, or easy treadmill work all count.";
}

function whyThisWorkout(profile: OnboardingProfile, template: DayTemplate) {
  if (profile.goal === "belly-fat-reduction") {
    return "This supports total body fat loss through calorie balance, strength training, cardio, sleep, and nutrition. It does not claim spot fat reduction.";
  }
  if (profile.goal === "fat-loss") return "This balances muscle-retaining strength work with sustainable calorie output.";
  if (profile.goal === "muscle-gain") return "This prioritizes progressive strength volume while leaving room for recovery and protein intake.";
  return "This keeps strength, cardio, mobility, and recovery in rotation so fitness stays balanced.";
}

export function weeklyWorkoutPlan(profile: OnboardingProfile, missedCount = 0): Workout[] {
  const templates = dayTemplates[profile.goal];
  const config = levelConfig[profile.fitnessLevel];
  return templates.map((template, index) => {
    const day = index + 1;
    return {
      id: `${profile.fitnessLevel}-${profile.goal}-${template.workoutType}-${day}`,
      title: template.title,
      level: profile.fitnessLevel,
      goal: profile.goal,
      day,
      durationMinutes: template.workoutType === "mobility" ? Math.max(20, config.duration - 10) : config.duration,
      focus: template.focus,
      workoutType: template.workoutType,
      dayTheme: template.dayTheme,
      intensity: template.workoutType === "mobility" || template.workoutType === "cardio" || template.workoutType === "swimming" ? "easy" : template.workoutType === "hiit" ? "hard" : "moderate",
      equipment: [profile.equipment],
      bestFor: `${profile.fitnessLevel} ${profile.goal.replaceAll("-", " ")} with ${profile.equipment === "none" ? "bodyweight" : profile.equipment} training`,
      whyThisWorkout: whyThisWorkout(profile, template),
      cardioAdvice: cardioAdvice(profile, template.workoutType),
      exercises: exercisesFor(template, profile)
    } satisfies Workout;
  }).map((workout, index, all) => all[(index + missedCount) % all.length]);
}

export function bestCardioRecommendation(profile: OnboardingProfile) {
  if (profile.goal === "muscle-gain") return "Best fit: 2 easy Zone 2 sessions weekly, such as incline walk, cycling, or swimming, so cardio supports recovery without competing with muscle gain.";
  if (profile.fitnessLevel === "beginner") return "Best fit: incline walking and swimming first. Add short HIIT only after consistency feels easy.";
  if (profile.fitnessLevel === "athletic") return "Best fit: combine incline walks for volume with one treadmill interval or HIIT day for conditioning.";
  return "Best fit: incline walks for repeatable calorie burn plus one HIIT or treadmill interval session when recovery is good.";
}
