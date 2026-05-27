import { FoodItem, FoodLogEntry } from "@/lib/types";

export function foodLogTotals(logs: FoodLogEntry[]) {
  return logs.reduce(
    (totals, log) => ({
      calories: totals.calories + log.calories,
      protein: totals.protein + log.protein,
      carbs: totals.carbs + log.carbs,
      fats: totals.fats + log.fats,
      sugar: totals.sugar + (log.sugar ?? 0),
      fibre: totals.fibre + (log.fibre ?? 0),
      sodium: totals.sodium + (log.sodium ?? 0),
      caffeineMg: totals.caffeineMg + (log.caffeineMg ?? 0),
      micronutrients: Array.from(new Set([...totals.micronutrients, ...log.keyMicronutrients]))
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, sugar: 0, fibre: 0, sodium: 0, caffeineMg: 0, micronutrients: [] as string[] }
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
    fats: Math.round(log.fats * multiplier),
    sugar: Math.round((log.sugar ?? 0) * multiplier),
    fibre: Math.round((log.fibre ?? 0) * multiplier),
    sodium: Math.round((log.sodium ?? 0) * multiplier),
    caffeineMg: log.caffeineMg ? Math.round(log.caffeineMg * multiplier) : undefined
  };
}

export function foodToLogBase(food: FoodItem) {
  return {
    foodName: food.name,
    serving: `${food.servingSize}${food.servingUnit}`,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fats: food.fats,
    sugar: food.sugar,
    fibre: food.fibre,
    sodium: food.sodium,
    caffeineMg: food.caffeineMg,
    keyMicronutrients: Array.from(new Set([...food.vitamins, ...food.minerals])),
    source: food.isCustom ? "custom" as const : "library" as const
  };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = a[i - 1] === b[j - 1] ? matrix[i - 1][j - 1] : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[a.length][b.length];
}

export function searchFoods(foods: FoodItem[], query: string, category: string) {
  const term = query.trim().toLowerCase();
  const normalizedTerm = normalize(term);
  return foods
    .filter((food) => category === "all" || food.category === category || food.subcategory === category)
    .map((food) => {
      const haystack = [food.name, food.category, food.subcategory, food.preparationMethod, ...food.tags, ...food.synonyms, ...food.vitamins, ...food.minerals].join(" ").toLowerCase();
      const normalizedName = normalize(food.name);
      let score = 0;
      if (!term) score = 1;
      else if (food.name.toLowerCase() === term) score = 100;
      else if (food.name.toLowerCase().includes(term)) score = 80;
      else if (haystack.includes(term)) score = 60;
      else if (normalizedTerm && (normalizedName.includes(normalizedTerm) || levenshtein(normalizedTerm, normalizedName.slice(0, normalizedTerm.length)) <= 2)) score = 35;
      return { food, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .map((item) => item.food);
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
