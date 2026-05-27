import { FoodLogEntry } from "@/lib/types";

export function foodLogTotals(logs: FoodLogEntry[]) {
  return logs.reduce(
    (totals, log) => ({
      calories: totals.calories + log.calories,
      protein: totals.protein + log.protein,
      carbs: totals.carbs + log.carbs,
      fats: totals.fats + log.fats,
      micronutrients: Array.from(new Set([...totals.micronutrients, ...log.keyMicronutrients]))
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, micronutrients: [] as string[] }
  );
}

export function scaleFoodLog(log: Omit<FoodLogEntry, "id">): Omit<FoodLogEntry, "id"> {
  const multiplier = Number.isFinite(log.servingMultiplier) && log.servingMultiplier > 0 ? log.servingMultiplier : 1;
  return {
    ...log,
    servingMultiplier: multiplier,
    calories: Math.round(log.calories * multiplier),
    protein: Math.round(log.protein * multiplier),
    carbs: Math.round(log.carbs * multiplier),
    fats: Math.round(log.fats * multiplier)
  };
}

export function suggestNextMeal(remainingCalories: number, proteinStillNeeded: number) {
  const suggestions = [
    { name: "Greek yogurt + banana", calories: 251, protein: 21 },
    { name: "Chicken breast + rice", calories: 403, protein: 41 },
    { name: "Tuna sandwich", calories: 312, protein: 33 },
    { name: "Tofu bowl", calories: 385, protein: 24 },
    { name: "Cottage cheese + oats", calories: 354, protein: 30 }
  ];

  return suggestions.find((meal) => meal.calories <= remainingCalories && meal.protein >= Math.min(20, proteinStillNeeded)) ?? suggestions[0];
}
