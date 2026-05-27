type CalorieBurnInput = {
  userWeightKg: number;
  metValue: number;
  durationMinutes: number;
};

export function calculateCaloriesBurned({ userWeightKg, metValue, durationMinutes }: CalorieBurnInput) {
  return Math.round((metValue * userWeightKg * durationMinutes) / 60);
}

export function maintenanceCalories(userWeightKg: number, heightCm: number, age: number, activityMultiplier = 1.45) {
  const base = 10 * userWeightKg + 6.25 * heightCm - 5 * age + 5;
  return Math.round((base * activityMultiplier) / 25) * 25;
}

export function deficitStatus({ maintenance, caloriesConsumed, workoutCaloriesBurned, targetDeficit }: { maintenance: number; caloriesConsumed: number; workoutCaloriesBurned: number; targetDeficit: number }) {
  const netCalories = caloriesConsumed - workoutCaloriesBurned;
  const deficit = maintenance - netCalories;
  const remainingDeficit = targetDeficit - deficit;

  if (remainingDeficit <= -100) {
    return {
      netCalories,
      deficit,
      remainingDeficit,
      status: `You have exceeded your target by ${Math.abs(remainingDeficit)} calories`
    };
  }

  if (remainingDeficit <= 0) {
    return {
      netCalories,
      deficit,
      remainingDeficit,
      status: "You are on track"
    };
  }

  return {
    netCalories,
    deficit,
    remainingDeficit,
    status: `You need to burn or save ${remainingDeficit} more calories`
  };
}
