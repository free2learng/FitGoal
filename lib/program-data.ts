import { FoodCategory, FoodItem, MealTemplate, MicronutrientItem, VerifiedStatus, WorkoutProgram } from "@/lib/types";

const demo = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const stubbornBellyFatKillerProgram: WorkoutProgram = {
  id: "stubborn-belly-fat-killer",
  title: "Stubborn Belly Fat Killer",
  subtitle: "Beginner fat-loss conditioning with simple strength moves",
  goal: "belly-fat-reduction",
  level: "beginner",
  targetDailyDeficit: 400,
  weeklyFatLossEstimateKg: "About 0.25-0.5 kg per week when paired with nutrition and recovery",
  safetyNote: "Avoid extreme calorie deficits. Beginners usually do best with a 300-500 calorie daily deficit, enough protein, sleep, and progressive training.",
  exercises: [
    {
      name: "Jumping Jacks",
      sets: 3,
      reps: "40 seconds",
      restSeconds: 30,
      tutorialUrl: demo("jumping jacks beginner form"),
      difficulty: "beginner",
      targetMuscles: ["Full body", "Calves", "Shoulders"],
      animationUrl: "",
      instructions: ["Stand tall with feet together", "Jump feet out while raising arms", "Return softly and keep a steady rhythm"],
      commonMistakes: ["Landing hard", "Holding breath", "Moving too fast before warmup"],
      beginnerTips: ["Step side to side instead of jumping if needed", "Keep knees soft"],
      metValue: 7.7,
      durationMinutesPerSet: 0.67
    },
    {
      name: "Mountain Climbers",
      sets: 3,
      reps: "30 seconds",
      restSeconds: 40,
      tutorialUrl: demo("mountain climbers beginner form"),
      difficulty: "moderate",
      targetMuscles: ["Core", "Shoulders", "Hip flexors"],
      animationUrl: "",
      instructions: ["Start in a strong plank", "Drive one knee toward the chest", "Alternate legs while keeping hips steady"],
      commonMistakes: ["Hips too high", "Shoulders drifting behind hands", "Rushing with poor control"],
      beginnerTips: ["Slow the pace and tap each foot forward", "Stop before your lower back sags"],
      metValue: 8,
      durationMinutesPerSet: 0.5
    },
    {
      name: "High Knees",
      sets: 3,
      reps: "30 seconds",
      restSeconds: 40,
      tutorialUrl: demo("high knees beginner low impact"),
      difficulty: "moderate",
      targetMuscles: ["Quads", "Core", "Calves"],
      animationUrl: "",
      instructions: ["Stand tall", "Lift knees toward hip height", "Pump arms and keep your torso upright"],
      commonMistakes: ["Leaning backward", "Landing stiff", "Letting knees collapse inward"],
      beginnerTips: ["March in place for a low-impact version", "Use a pace you can control"],
      metValue: 8,
      durationMinutesPerSet: 0.5
    },
    {
      name: "Plank",
      sets: 3,
      reps: "25 seconds",
      restSeconds: 35,
      tutorialUrl: demo("plank proper form beginner"),
      difficulty: "beginner",
      targetMuscles: ["Core", "Shoulders", "Glutes"],
      animationUrl: "",
      instructions: ["Place elbows under shoulders", "Brace your core", "Keep head, ribs, hips, and heels aligned"],
      commonMistakes: ["Hips sagging", "Holding breath", "Shrugging shoulders"],
      beginnerTips: ["Use knees-down plank if needed", "Think ribs down and glutes gently squeezed"],
      metValue: 3.3,
      durationMinutesPerSet: 0.42
    },
    {
      name: "Bicycle Crunches",
      sets: 3,
      reps: "10 each side",
      restSeconds: 35,
      tutorialUrl: demo("bicycle crunch beginner form"),
      difficulty: "beginner",
      targetMuscles: ["Abs", "Obliques"],
      animationUrl: "",
      instructions: ["Lie on your back with hands light behind head", "Rotate shoulder toward opposite knee", "Move slowly and alternate sides"],
      commonMistakes: ["Pulling the neck", "Rushing reps", "Arching lower back"],
      beginnerTips: ["Keep elbows wide", "Shorten the range until control improves"],
      metValue: 4,
      durationMinutesPerSet: 0.8
    },
    {
      name: "Bodyweight Squats",
      sets: 3,
      reps: "12 reps",
      restSeconds: 45,
      tutorialUrl: demo("bodyweight squat proper form beginner"),
      difficulty: "beginner",
      targetMuscles: ["Quads", "Glutes", "Hamstrings"],
      animationUrl: "",
      instructions: ["Stand feet about shoulder width", "Sit hips back and down", "Drive through the full foot to stand"],
      commonMistakes: ["Knees caving inward", "Heels lifting", "Dropping too fast"],
      beginnerTips: ["Use a chair as a target", "Keep chest proud and ribs stacked"],
      metValue: 5,
      durationMinutesPerSet: 0.75
    },
    {
      name: "Burpees beginner version",
      sets: 2,
      reps: "6 reps",
      restSeconds: 60,
      tutorialUrl: demo("beginner burpee step back no push up"),
      difficulty: "challenging",
      targetMuscles: ["Full body", "Chest", "Legs", "Core"],
      animationUrl: "",
      instructions: ["Squat and place hands down", "Step back to plank", "Step feet forward and stand tall"],
      commonMistakes: ["Collapsing into plank", "Holding breath", "Jumping before ready"],
      beginnerTips: ["Skip the jump and push-up", "Use a bench for elevated hands"],
      metValue: 8,
      durationMinutesPerSet: 0.9
    },
    {
      name: "Leg Raises beginner version",
      sets: 3,
      reps: "8 reps",
      restSeconds: 40,
      tutorialUrl: demo("beginner leg raises bent knee form"),
      difficulty: "beginner",
      targetMuscles: ["Lower abs", "Hip flexors"],
      animationUrl: "",
      instructions: ["Lie on your back", "Keep knees slightly bent", "Lower legs only as far as your back stays flat"],
      commonMistakes: ["Lower back arching", "Swinging legs", "Holding breath"],
      beginnerTips: ["Bend knees more to reduce difficulty", "Place hands under hips if comfortable"],
      metValue: 3.8,
      durationMinutesPerSet: 0.65
    },
    {
      name: "Russian Twists beginner version",
      sets: 3,
      reps: "12 total",
      restSeconds: 35,
      tutorialUrl: demo("beginner russian twist feet down"),
      difficulty: "beginner",
      targetMuscles: ["Obliques", "Abs"],
      animationUrl: "",
      instructions: ["Sit tall with feet down", "Lean back slightly", "Rotate ribs side to side with control"],
      commonMistakes: ["Only moving the arms", "Rounding the back", "Going too fast"],
      beginnerTips: ["Keep feet on the floor", "Use no weight at first"],
      metValue: 3.8,
      durationMinutesPerSet: 0.65
    },
    {
      name: "Glute Bridges",
      sets: 3,
      reps: "12 reps",
      restSeconds: 35,
      tutorialUrl: demo("glute bridge proper form beginner"),
      difficulty: "beginner",
      targetMuscles: ["Glutes", "Hamstrings", "Core"],
      animationUrl: "",
      instructions: ["Lie on your back with knees bent", "Drive through heels", "Lift hips and squeeze glutes at the top"],
      commonMistakes: ["Overarching lower back", "Pushing through toes", "Rushing reps"],
      beginnerTips: ["Pause one second at the top", "Keep ribs down"],
      metValue: 3.5,
      durationMinutesPerSet: 0.7
    }
  ]
};

const serving = (label: string, multiplier: number) => ({ label, multiplier });

function food(input: {
  id: string;
  name: string;
  category: FoodCategory;
  subcategory: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  sugar?: number;
  fibre?: number;
  sodium?: number;
  caffeineMg?: number;
  vitamins?: string[];
  minerals?: string[];
  tags?: string[];
  synonyms?: string[];
  commonServingOptions?: { label: string; multiplier: number }[];
  preparationMethod?: string;
  isDrink?: boolean;
  source?: FoodItem["source"];
  verifiedStatus?: VerifiedStatus;
  fitnessBenefit?: string;
  mealUse?: string;
}): FoodItem {
  return {
    protein: 0,
    carbs: 0,
    fats: 0,
    sugar: 0,
    fibre: 0,
    sodium: 0,
    vitamins: [],
    minerals: [],
    tags: [],
    synonyms: [],
    commonServingOptions: [serving("1 serving", 1), serving("1/2 serving", 0.5), serving("2 servings", 2)],
    preparationMethod: "standard",
    isDrink: false,
    isCustom: false,
    source: "seed",
    verifiedStatus: "estimated",
    fitnessBenefit: "Helps users track calories and macros consistently.",
    mealUse: "Log the serving that best matches what you ate.",
    ...input
  };
}

export const nutritionFoods: FoodItem[] = [
  food({ id: "black-tea", name: "Black tea", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 2, caffeineMg: 45, tags: ["tea", "drink", "hot drink"], synonyms: ["tea", "plain tea"], commonServingOptions: [serving("small mug 200ml", 0.8), serving("mug 250ml", 1), serving("large mug 350ml", 1.4)], preparationMethod: "brewed without milk or sugar", isDrink: true, fitnessBenefit: "Very low calorie drink with caffeine.", mealUse: "Log as a drink." }),
  food({ id: "green-tea", name: "Green tea", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 2, caffeineMg: 30, tags: ["tea", "drink"], synonyms: ["sencha", "green"], preparationMethod: "brewed", isDrink: true }),
  food({ id: "herbal-tea", name: "Herbal tea", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 2, caffeineMg: 0, tags: ["tea", "drink", "caffeine free"], synonyms: ["peppermint tea", "camomile tea"], preparationMethod: "brewed", isDrink: true }),
  food({ id: "chai-tea", name: "Chai tea", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 120, protein: 5, carbs: 18, fats: 4, sugar: 16, sodium: 80, caffeineMg: 45, vitamins: ["Vitamin B12"], minerals: ["Calcium"], tags: ["tea", "milk tea"], synonyms: ["masala chai", "chai"], preparationMethod: "tea with milk and spices", isDrink: true }),
  food({ id: "milk-tea", name: "Milk tea", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 55, protein: 3, carbs: 5, fats: 2, sugar: 5, sodium: 45, caffeineMg: 40, minerals: ["Calcium"], tags: ["tea", "milk"], synonyms: ["tea with milk"], preparationMethod: "black tea with semi-skimmed milk", isDrink: true }),
  food({ id: "tea-sugar", name: "Tea with sugar", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 34, carbs: 8, sugar: 8, caffeineMg: 45, tags: ["tea", "sugar"], synonyms: ["sweet tea"], preparationMethod: "black tea with 2 tsp sugar", isDrink: true }),
  food({ id: "tea-oat-milk", name: "Tea with oat milk", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 45, protein: 1, carbs: 7, fats: 2, sugar: 4, caffeineMg: 40, tags: ["tea", "oat milk"], synonyms: ["oat milk tea"], preparationMethod: "black tea with oat milk", isDrink: true }),
  food({ id: "tea-almond-milk", name: "Tea with almond milk", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 20, protein: 1, carbs: 1, fats: 1, caffeineMg: 40, tags: ["tea", "almond milk"], preparationMethod: "black tea with almond milk", isDrink: true }),
  food({ id: "iced-tea", name: "Iced tea", category: "drinks", subcategory: "tea", servingSize: 330, servingUnit: "ml", calories: 95, carbs: 24, sugar: 23, sodium: 20, caffeineMg: 25, tags: ["tea", "cold drink"], synonyms: ["ice tea"], preparationMethod: "bottled sweetened iced tea", isDrink: true }),
  food({ id: "matcha-tea", name: "Matcha tea", category: "drinks", subcategory: "tea", servingSize: 250, servingUnit: "ml", calories: 5, carbs: 1, caffeineMg: 70, tags: ["tea", "matcha"], preparationMethod: "matcha powder with water", isDrink: true }),
  food({ id: "black-coffee", name: "Black coffee", category: "drinks", subcategory: "coffee", servingSize: 250, servingUnit: "ml", calories: 3, caffeineMg: 95, tags: ["coffee", "drink"], synonyms: ["coffee", "filter coffee"], preparationMethod: "brewed without milk or sugar", isDrink: true }),
  food({ id: "espresso", name: "Espresso", category: "drinks", subcategory: "coffee", servingSize: 30, servingUnit: "ml", calories: 2, caffeineMg: 65, tags: ["coffee"], synonyms: ["single espresso"], commonServingOptions: [serving("single shot", 1), serving("double shot", 2)], preparationMethod: "espresso shot", isDrink: true }),
  food({ id: "americano", name: "Americano", category: "drinks", subcategory: "coffee", servingSize: 300, servingUnit: "ml", calories: 5, caffeineMg: 120, tags: ["coffee"], synonyms: ["long black"], preparationMethod: "espresso with hot water", isDrink: true }),
  food({ id: "latte", name: "Latte", category: "drinks", subcategory: "coffee", servingSize: 300, servingUnit: "ml", calories: 150, protein: 9, carbs: 14, fats: 6, sugar: 14, sodium: 120, caffeineMg: 120, minerals: ["Calcium"], tags: ["coffee", "milk"], preparationMethod: "espresso with steamed milk", isDrink: true }),
  food({ id: "cappuccino", name: "Cappuccino", category: "drinks", subcategory: "coffee", servingSize: 240, servingUnit: "ml", calories: 95, protein: 6, carbs: 9, fats: 4, sugar: 9, sodium: 90, caffeineMg: 100, minerals: ["Calcium"], tags: ["coffee", "milk"], isDrink: true }),
  food({ id: "flat-white", name: "Flat white", category: "drinks", subcategory: "coffee", servingSize: 180, servingUnit: "ml", calories: 110, protein: 6, carbs: 10, fats: 5, sugar: 10, sodium: 85, caffeineMg: 120, minerals: ["Calcium"], tags: ["coffee", "milk"], isDrink: true }),
  food({ id: "mocha", name: "Mocha", category: "drinks", subcategory: "coffee", servingSize: 300, servingUnit: "ml", calories: 260, protein: 9, carbs: 37, fats: 9, sugar: 31, sodium: 150, caffeineMg: 120, minerals: ["Calcium"], tags: ["coffee", "chocolate"], isDrink: true }),
  food({ id: "iced-coffee", name: "Iced coffee", category: "drinks", subcategory: "coffee", servingSize: 300, servingUnit: "ml", calories: 120, protein: 5, carbs: 18, fats: 3, sugar: 16, caffeineMg: 120, tags: ["coffee", "cold drink"], isDrink: true }),
  food({ id: "cold-brew", name: "Cold brew", category: "drinks", subcategory: "coffee", servingSize: 300, servingUnit: "ml", calories: 5, caffeineMg: 160, tags: ["coffee", "cold drink"], isDrink: true }),
  food({ id: "coffee-milk", name: "Coffee with milk", category: "drinks", subcategory: "coffee", servingSize: 250, servingUnit: "ml", calories: 35, protein: 2, carbs: 3, fats: 1, sugar: 3, caffeineMg: 95, tags: ["coffee", "milk"], isDrink: true }),
  food({ id: "coffee-sugar", name: "Coffee with sugar", category: "drinks", subcategory: "coffee", servingSize: 250, servingUnit: "ml", calories: 35, carbs: 8, sugar: 8, caffeineMg: 95, tags: ["coffee", "sugar"], isDrink: true }),
  food({ id: "coffee-oat-milk", name: "Coffee with oat milk", category: "drinks", subcategory: "coffee", servingSize: 250, servingUnit: "ml", calories: 60, protein: 1, carbs: 9, fats: 2, sugar: 5, caffeineMg: 95, tags: ["coffee", "oat milk"], isDrink: true }),
  food({ id: "coffee-almond-milk", name: "Coffee with almond milk", category: "drinks", subcategory: "coffee", servingSize: 250, servingUnit: "ml", calories: 25, protein: 1, carbs: 1, fats: 2, caffeineMg: 95, tags: ["coffee", "almond milk"], isDrink: true }),
  food({ id: "whole-milk", name: "Whole milk", category: "drinks", subcategory: "milk", servingSize: 250, servingUnit: "ml", calories: 155, protein: 8, carbs: 12, fats: 9, sugar: 12, sodium: 105, vitamins: ["Vitamin B12", "Vitamin D"], minerals: ["Calcium"], tags: ["milk", "dairy"], isDrink: true }),
  food({ id: "semi-skimmed-milk", name: "Semi-skimmed milk", category: "drinks", subcategory: "milk", servingSize: 250, servingUnit: "ml", calories: 115, protein: 9, carbs: 12, fats: 4, sugar: 12, sodium: 105, vitamins: ["Vitamin B12"], minerals: ["Calcium"], tags: ["milk", "dairy"], isDrink: true }),
  food({ id: "skimmed-milk", name: "Skimmed milk", category: "drinks", subcategory: "milk", servingSize: 250, servingUnit: "ml", calories: 88, protein: 9, carbs: 13, fats: 0, sugar: 13, sodium: 105, vitamins: ["Vitamin B12"], minerals: ["Calcium"], tags: ["milk", "dairy"], isDrink: true }),
  food({ id: "lactose-free-milk", name: "Lactose-free milk", category: "drinks", subcategory: "milk", servingSize: 250, servingUnit: "ml", calories: 110, protein: 8, carbs: 12, fats: 3, sugar: 12, minerals: ["Calcium"], tags: ["milk", "lactose free"], isDrink: true }),
  food({ id: "oat-milk", name: "Oat milk", category: "drinks", subcategory: "plant-based milk", servingSize: 250, servingUnit: "ml", calories: 120, protein: 3, carbs: 16, fats: 5, sugar: 7, fibre: 2, sodium: 100, minerals: ["Calcium"], tags: ["plant milk", "oat"], isDrink: true }),
  food({ id: "almond-milk", name: "Almond milk", category: "drinks", subcategory: "plant-based milk", servingSize: 250, servingUnit: "ml", calories: 35, protein: 1, carbs: 1, fats: 3, sodium: 150, minerals: ["Calcium"], tags: ["plant milk", "almond"], isDrink: true }),
  food({ id: "soy-milk", name: "Soy milk", category: "drinks", subcategory: "plant-based milk", servingSize: 250, servingUnit: "ml", calories: 100, protein: 8, carbs: 7, fats: 4, sugar: 5, sodium: 95, minerals: ["Calcium"], tags: ["plant milk", "soy"], isDrink: true }),
  food({ id: "coconut-milk-drink", name: "Coconut milk drink", category: "drinks", subcategory: "plant-based milk", servingSize: 250, servingUnit: "ml", calories: 50, protein: 1, carbs: 3, fats: 4, sodium: 60, tags: ["plant milk", "coconut"], isDrink: true }),
  food({ id: "rice-milk", name: "Rice milk", category: "drinks", subcategory: "plant-based milk", servingSize: 250, servingUnit: "ml", calories: 120, protein: 1, carbs: 23, fats: 2, sugar: 10, sodium: 90, tags: ["plant milk", "rice"], isDrink: true }),
  food({ id: "orange-juice", name: "Orange juice", category: "drinks", subcategory: "juices", servingSize: 250, servingUnit: "ml", calories: 112, protein: 2, carbs: 26, sugar: 21, vitamins: ["Vitamin C"], tags: ["juice"], isDrink: true }),
  food({ id: "cola", name: "Cola soft drink", category: "drinks", subcategory: "soft drinks", servingSize: 330, servingUnit: "ml", calories: 139, carbs: 35, sugar: 35, sodium: 15, caffeineMg: 32, tags: ["soda", "soft drink"], synonyms: ["coke", "cola"], isDrink: true }),
  food({ id: "energy-drink", name: "Energy drink", category: "drinks", subcategory: "energy drinks", servingSize: 250, servingUnit: "ml", calories: 110, carbs: 27, sugar: 27, caffeineMg: 80, tags: ["energy drink"], isDrink: true }),
  food({ id: "whey-protein-shake", name: "Whey protein shake", category: "supplements", subcategory: "protein shakes", servingSize: 1, servingUnit: "scoop", calories: 120, protein: 24, carbs: 3, fats: 2, sugar: 2, sodium: 120, tags: ["protein", "shake", "post-workout"], isDrink: true, mealUse: "Log as post-workout or snack." }),
  food({ id: "protein-smoothie", name: "Protein smoothie", category: "drinks", subcategory: "smoothies", servingSize: 450, servingUnit: "ml", calories: 360, protein: 30, carbs: 45, fats: 8, sugar: 28, fibre: 6, minerals: ["Potassium", "Calcium"], tags: ["smoothie", "protein"], isDrink: true }),
  food({ id: "boiled-egg", name: "Boiled egg", category: "protein", subcategory: "eggs", servingSize: 1, servingUnit: "large egg", calories: 72, protein: 6, carbs: 1, fats: 5, sodium: 62, vitamins: ["Vitamin D", "Vitamin B12"], tags: ["egg"], synonyms: ["egg", "hard boiled egg"], preparationMethod: "boiled" }),
  food({ id: "fried-egg", name: "Fried egg", category: "protein", subcategory: "eggs", servingSize: 1, servingUnit: "large egg", calories: 90, protein: 6, carbs: 1, fats: 7, sodium: 95, vitamins: ["Vitamin D", "Vitamin B12"], tags: ["egg"], preparationMethod: "fried with light oil" }),
  food({ id: "scrambled-eggs", name: "Scrambled eggs", category: "protein", subcategory: "eggs", servingSize: 2, servingUnit: "eggs", calories: 210, protein: 14, carbs: 2, fats: 16, sodium: 220, vitamins: ["Vitamin D", "Vitamin B12"], tags: ["egg", "breakfast"], preparationMethod: "scrambled with milk and light butter" }),
  food({ id: "omelette", name: "Omelette", category: "protein", subcategory: "eggs", servingSize: 2, servingUnit: "egg omelette", calories: 220, protein: 15, carbs: 2, fats: 17, sodium: 240, vitamins: ["Vitamin D"], tags: ["egg", "breakfast"], preparationMethod: "plain omelette" }),
  food({ id: "poached-egg", name: "Poached egg", category: "protein", subcategory: "eggs", servingSize: 1, servingUnit: "large egg", calories: 72, protein: 6, carbs: 1, fats: 5, sodium: 62, vitamins: ["Vitamin D"], tags: ["egg"], preparationMethod: "poached" }),
  food({ id: "egg-whites", name: "Egg whites", category: "protein", subcategory: "eggs", servingSize: 100, servingUnit: "g", calories: 52, protein: 11, carbs: 1, sodium: 166, tags: ["egg", "lean protein"], preparationMethod: "cooked egg whites" }),
  food({ id: "egg-yolk", name: "Egg yolk", category: "protein", subcategory: "eggs", servingSize: 1, servingUnit: "yolk", calories: 55, protein: 3, fats: 5, sodium: 8, vitamins: ["Vitamin D", "Vitamin B12"], tags: ["egg"], preparationMethod: "egg yolk" }),
  food({ id: "cheese-omelette", name: "Cheese omelette", category: "protein", subcategory: "eggs", servingSize: 1, servingUnit: "omelette", calories: 330, protein: 22, carbs: 3, fats: 25, sodium: 480, minerals: ["Calcium"], tags: ["egg", "cheese"], preparationMethod: "2 eggs with cheese" }),
  food({ id: "vegetable-omelette", name: "Vegetable omelette", category: "protein", subcategory: "eggs", servingSize: 1, servingUnit: "omelette", calories: 260, protein: 17, carbs: 8, fats: 18, fibre: 2, sodium: 300, vitamins: ["Vitamin C"], tags: ["egg", "vegetables"], preparationMethod: "2 eggs with mixed vegetables" }),
  food({ id: "masala-omelette", name: "Masala omelette", category: "cultural-foods", subcategory: "eggs", servingSize: 1, servingUnit: "omelette", calories: 250, protein: 16, carbs: 6, fats: 18, fibre: 1, sodium: 340, tags: ["egg", "indian", "spiced"], preparationMethod: "eggs with onion, chilli, tomato and spices" }),
  food({ id: "chicken-breast", name: "Chicken breast", category: "meat", subcategory: "chicken", servingSize: 120, servingUnit: "g cooked", calories: 198, protein: 37, fats: 4, sodium: 85, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "lean meat"], synonyms: ["grilled chicken"], preparationMethod: "grilled or baked" }),
  food({ id: "chicken-thigh", name: "Chicken thigh", category: "meat", subcategory: "chicken", servingSize: 120, servingUnit: "g cooked", calories: 250, protein: 31, fats: 14, sodium: 95, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "thigh"], preparationMethod: "roasted or grilled, skin removed" }),
  food({ id: "chicken-drumstick", name: "Chicken drumstick", category: "meat", subcategory: "chicken", servingSize: 1, servingUnit: "drumstick", calories: 155, protein: 22, fats: 7, sodium: 85, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "drumstick"], preparationMethod: "roasted, skin removed" }),
  food({ id: "chicken-wings", name: "Chicken wings", category: "meat", subcategory: "chicken", servingSize: 3, servingUnit: "wings", calories: 290, protein: 27, fats: 20, sodium: 380, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "wings"], preparationMethod: "baked or grilled wings" }),
  food({ id: "roast-chicken", name: "Roast chicken", category: "meat", subcategory: "chicken", servingSize: 120, servingUnit: "g cooked", calories: 235, protein: 33, fats: 11, sodium: 110, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "roast"], preparationMethod: "roasted mixed chicken meat" }),
  food({ id: "grilled-chicken", name: "Grilled chicken", category: "meat", subcategory: "chicken", servingSize: 120, servingUnit: "g cooked", calories: 205, protein: 36, fats: 5, sodium: 95, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "grilled", "lean"], synonyms: ["grilled chicken breast"], preparationMethod: "grilled with light seasoning" }),
  food({ id: "shredded-chicken", name: "Shredded chicken", category: "meat", subcategory: "chicken", servingSize: 100, servingUnit: "g cooked", calories: 165, protein: 31, fats: 4, sodium: 90, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "meal prep"], preparationMethod: "boiled or slow cooked and shredded" }),
  food({ id: "chicken-curry", name: "Chicken curry", category: "cultural-foods", subcategory: "chicken", servingSize: 1, servingUnit: "bowl", calories: 420, protein: 32, carbs: 16, fats: 26, sugar: 5, fibre: 3, sodium: 760, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "curry", "indian"], preparationMethod: "chicken cooked in curry sauce" }),
  food({ id: "chicken-kebab", name: "Chicken kebab", category: "cultural-foods", subcategory: "chicken", servingSize: 1, servingUnit: "skewer", calories: 230, protein: 30, carbs: 4, fats: 10, sodium: 520, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "kebab", "grilled"], preparationMethod: "grilled marinated chicken pieces" }),
  food({ id: "chicken-mince", name: "Chicken mince", category: "meat", subcategory: "chicken", servingSize: 100, servingUnit: "g cooked", calories: 190, protein: 27, fats: 9, sodium: 80, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "chicken", "mince"], preparationMethod: "cooked lean chicken mince" }),
  food({ id: "lamb-chop", name: "Lamb chop", category: "meat", subcategory: "lamb", servingSize: 1, servingUnit: "chop", calories: 280, protein: 24, fats: 20, sodium: 75, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc"], tags: ["protein", "lamb", "chop"], preparationMethod: "grilled lamb chop" }),
  food({ id: "lamb-leg", name: "Lamb leg", category: "meat", subcategory: "lamb", servingSize: 120, servingUnit: "g roasted", calories: 250, protein: 34, fats: 12, sodium: 85, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc"], tags: ["protein", "lamb", "roast"], preparationMethod: "roasted lean lamb leg" }),
  food({ id: "lamb-shoulder", name: "Lamb shoulder", category: "meat", subcategory: "lamb", servingSize: 120, servingUnit: "g cooked", calories: 330, protein: 30, fats: 23, sodium: 90, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc"], tags: ["protein", "lamb", "shoulder"], preparationMethod: "slow roasted lamb shoulder" }),
  food({ id: "lamb-mince", name: "Lamb mince", category: "meat", subcategory: "lamb", servingSize: 100, servingUnit: "g cooked", calories: 280, protein: 25, fats: 20, sodium: 75, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc"], tags: ["protein", "lamb", "mince"], preparationMethod: "cooked lamb mince" }),
  food({ id: "lamb-kebab", name: "Lamb kebab", category: "cultural-foods", subcategory: "lamb", servingSize: 1, servingUnit: "skewer", calories: 260, protein: 25, carbs: 3, fats: 17, sodium: 560, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc"], tags: ["protein", "lamb", "kebab"], preparationMethod: "grilled marinated lamb" }),
  food({ id: "lamb-curry", name: "Lamb curry", category: "cultural-foods", subcategory: "lamb", servingSize: 1, servingUnit: "bowl", calories: 520, protein: 32, carbs: 18, fats: 36, sugar: 5, fibre: 3, sodium: 850, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc"], tags: ["protein", "lamb", "curry"], preparationMethod: "lamb cooked in curry sauce" }),
  food({ id: "lamb-stew", name: "Lamb stew", category: "soups", subcategory: "lamb", servingSize: 1, servingUnit: "bowl", calories: 430, protein: 30, carbs: 28, fats: 22, sugar: 6, fibre: 5, sodium: 780, vitamins: ["Vitamin B12"], minerals: ["Iron", "Zinc", "Potassium"], tags: ["protein", "lamb", "stew"], preparationMethod: "lamb stew with vegetables" }),
  food({ id: "pork-loin", name: "Pork loin", category: "meat", subcategory: "pork", servingSize: 120, servingUnit: "g cooked", calories: 240, protein: 34, fats: 11, sodium: 70, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "pork", "loin"], preparationMethod: "roasted or grilled lean pork loin" }),
  food({ id: "pork-chop", name: "Pork chop", category: "meat", subcategory: "pork", servingSize: 1, servingUnit: "chop", calories: 300, protein: 33, fats: 18, sodium: 90, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "pork", "chop"], preparationMethod: "grilled pork chop" }),
  food({ id: "pork-belly", name: "Pork belly", category: "meat", subcategory: "pork", servingSize: 100, servingUnit: "g cooked", calories: 520, protein: 19, fats: 49, sodium: 120, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["pork", "higher fat"], preparationMethod: "roasted pork belly" }),
  food({ id: "pork-mince", name: "Pork mince", category: "meat", subcategory: "pork", servingSize: 100, servingUnit: "g cooked", calories: 295, protein: 25, fats: 21, sodium: 75, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "pork", "mince"], preparationMethod: "cooked pork mince" }),
  food({ id: "ham", name: "Ham", category: "meat", subcategory: "pork", servingSize: 2, servingUnit: "slices", calories: 90, protein: 14, carbs: 1, fats: 3, sodium: 760, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["protein", "pork", "ham", "sandwich"], preparationMethod: "ready to eat sliced ham" }),
  food({ id: "bacon", name: "Bacon", category: "meat", subcategory: "pork", servingSize: 2, servingUnit: "rashers", calories: 120, protein: 8, fats: 10, sodium: 620, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["pork", "bacon", "breakfast"], preparationMethod: "grilled bacon rashers" }),
  food({ id: "pork-sausage", name: "Pork sausage", category: "meat", subcategory: "pork", servingSize: 1, servingUnit: "sausage", calories: 180, protein: 9, carbs: 2, fats: 15, sodium: 540, vitamins: ["Vitamin B12"], minerals: ["Zinc"], tags: ["pork", "sausage", "breakfast"], preparationMethod: "grilled pork sausage" }),
  food({ id: "turkey-slices", name: "Turkey slices", category: "meat", subcategory: "turkey", servingSize: 100, servingUnit: "g", calories: 120, protein: 24, carbs: 2, fats: 2, sodium: 820, tags: ["protein", "deli meat"], preparationMethod: "ready to eat" }),
  food({ id: "lean-beef-mince", name: "Lean beef mince", category: "meat", subcategory: "beef", servingSize: 100, servingUnit: "g cooked", calories: 210, protein: 26, fats: 11, sodium: 75, minerals: ["Iron", "Zinc"], tags: ["protein", "beef"], preparationMethod: "cooked 5 percent fat mince" }),
  food({ id: "tuna", name: "Tuna", category: "fish", subcategory: "canned fish", servingSize: 1, servingUnit: "can drained", calories: 132, protein: 29, fats: 1, sodium: 320, vitamins: ["Vitamin B12"], minerals: ["Omega-3"], tags: ["protein", "fish"], preparationMethod: "canned in water" }),
  food({ id: "salmon", name: "Salmon", category: "fish", subcategory: "oily fish", servingSize: 120, servingUnit: "g cooked", calories: 247, protein: 28, fats: 14, sodium: 70, vitamins: ["Vitamin D"], minerals: ["Omega-3", "Potassium"], tags: ["protein", "fish"], preparationMethod: "baked or grilled" }),
  food({ id: "cod", name: "Cod", category: "fish", subcategory: "white fish", servingSize: 120, servingUnit: "g cooked", calories: 105, protein: 24, fats: 1, sodium: 90, tags: ["protein", "fish"], preparationMethod: "baked" }),
  food({ id: "prawns", name: "Prawns", category: "fish", subcategory: "seafood", servingSize: 120, servingUnit: "g cooked", calories: 120, protein: 27, fats: 2, sodium: 190, vitamins: ["Vitamin B12"], minerals: ["Omega-3", "Zinc"], tags: ["protein", "seafood", "prawns"], preparationMethod: "boiled, grilled, or stir fried" }),
  food({ id: "shrimp", name: "Shrimp", category: "fish", subcategory: "seafood", servingSize: 120, servingUnit: "g cooked", calories: 118, protein: 27, fats: 2, sodium: 185, vitamins: ["Vitamin B12"], minerals: ["Omega-3", "Zinc"], tags: ["protein", "seafood", "shrimp"], preparationMethod: "boiled or grilled shrimp" }),
  food({ id: "crab", name: "Crab", category: "fish", subcategory: "seafood", servingSize: 120, servingUnit: "g cooked", calories: 115, protein: 24, fats: 2, sodium: 420, vitamins: ["Vitamin B12"], minerals: ["Omega-3", "Zinc"], tags: ["protein", "seafood", "crab"], preparationMethod: "cooked crab meat" }),
  food({ id: "mussels", name: "Mussels", category: "fish", subcategory: "seafood", servingSize: 120, servingUnit: "g cooked", calories: 170, protein: 24, carbs: 8, fats: 4, sodium: 370, vitamins: ["Vitamin B12"], minerals: ["Omega-3", "Iron"], tags: ["protein", "seafood", "mussels"], preparationMethod: "steamed mussels" }),
  food({ id: "sardines", name: "Sardines", category: "fish", subcategory: "oily fish", servingSize: 1, servingUnit: "tin", calories: 190, protein: 23, fats: 10, sodium: 360, vitamins: ["Vitamin D", "Vitamin B12"], minerals: ["Omega-3", "Calcium"], tags: ["protein", "seafood", "sardines", "omega-3"], preparationMethod: "tinned sardines in water or tomato sauce" }),
  food({ id: "mackerel", name: "Mackerel", category: "fish", subcategory: "oily fish", servingSize: 120, servingUnit: "g cooked", calories: 305, protein: 24, fats: 23, sodium: 95, vitamins: ["Vitamin D", "Vitamin B12"], minerals: ["Omega-3"], tags: ["protein", "seafood", "mackerel", "omega-3"], preparationMethod: "grilled or baked mackerel" }),
  food({ id: "scallops", name: "Scallops", category: "fish", subcategory: "seafood", servingSize: 120, servingUnit: "g cooked", calories: 130, protein: 24, carbs: 6, fats: 1, sodium: 380, vitamins: ["Vitamin B12"], minerals: ["Omega-3", "Zinc"], tags: ["protein", "seafood", "scallops"], preparationMethod: "seared or grilled scallops" }),
  food({ id: "squid", name: "Squid", category: "fish", subcategory: "seafood", servingSize: 120, servingUnit: "g cooked", calories: 155, protein: 22, carbs: 4, fats: 5, sodium: 310, vitamins: ["Vitamin B12"], minerals: ["Omega-3", "Zinc"], tags: ["protein", "seafood", "squid"], preparationMethod: "grilled or lightly sauteed squid" }),
  food({ id: "tofu", name: "Tofu", category: "protein", subcategory: "plant protein", servingSize: 150, servingUnit: "g firm", calories: 180, protein: 19, carbs: 4, fats: 11, sodium: 20, minerals: ["Calcium", "Iron"], tags: ["vegetarian", "vegan", "protein"], preparationMethod: "firm tofu" }),
  food({ id: "lentils", name: "Lentils", category: "protein", subcategory: "legumes", servingSize: 1, servingUnit: "cup cooked", calories: 230, protein: 18, carbs: 40, fats: 1, fibre: 16, sodium: 4, minerals: ["Iron", "Magnesium", "Potassium"], tags: ["vegetarian", "legume"] }),
  food({ id: "cottage-cheese", name: "Cottage cheese", category: "protein", subcategory: "dairy", servingSize: 200, servingUnit: "g", calories: 164, protein: 24, carbs: 7, fats: 4, sugar: 6, sodium: 620, minerals: ["Calcium"], vitamins: ["Vitamin B12"], tags: ["protein", "dairy"] }),
  food({ id: "greek-yogurt", name: "Greek yogurt", category: "protein", subcategory: "dairy", servingSize: 200, servingUnit: "g plain", calories: 146, protein: 20, carbs: 8, fats: 4, sugar: 7, sodium: 70, minerals: ["Calcium"], vitamins: ["Vitamin B12"], tags: ["protein", "yogurt", "dairy"] }),
  food({ id: "oats", name: "Oats", category: "grains", subcategory: "oats", servingSize: 50, servingUnit: "g dry", calories: 190, protein: 6, carbs: 32, fats: 4, sugar: 1, fibre: 5, sodium: 2, minerals: ["Magnesium", "Iron"], tags: ["carbs", "breakfast"] }),
  food({ id: "porridge-banana", name: "Porridge with banana", category: "grains", subcategory: "oats", servingSize: 1, servingUnit: "bowl", calories: 360, protein: 12, carbs: 64, fats: 7, sugar: 20, fibre: 8, sodium: 90, minerals: ["Magnesium", "Potassium"], tags: ["breakfast", "oats", "banana"], preparationMethod: "oats with milk and banana" }),
  food({ id: "rice", name: "Rice", category: "grains", subcategory: "rice", servingSize: 1, servingUnit: "cup cooked", calories: 205, protein: 4, carbs: 45, sodium: 2, minerals: ["Magnesium"], tags: ["carbs", "rice"] }),
  food({ id: "sweet-potato", name: "Sweet potato", category: "vegetables", subcategory: "starchy vegetables", servingSize: 1, servingUnit: "medium", calories: 112, protein: 2, carbs: 26, sugar: 5, fibre: 4, sodium: 72, vitamins: ["Vitamin A", "Vitamin C"], minerals: ["Potassium"], tags: ["carbs"] }),
  food({ id: "quinoa", name: "Quinoa", category: "grains", subcategory: "quinoa", servingSize: 1, servingUnit: "cup cooked", calories: 222, protein: 8, carbs: 39, fats: 4, fibre: 5, sodium: 13, minerals: ["Magnesium", "Iron", "Zinc"], tags: ["carbs", "grain"] }),
  food({ id: "banana", name: "Banana", category: "fruits", subcategory: "fruit", servingSize: 1, servingUnit: "medium", calories: 105, protein: 1, carbs: 27, sugar: 14, fibre: 3, sodium: 1, vitamins: ["Vitamin C"], minerals: ["Potassium"], tags: ["fruit", "pre-workout"] }),
  food({ id: "apple", name: "Apple", category: "fruits", subcategory: "fruit", servingSize: 1, servingUnit: "medium", calories: 95, carbs: 25, sugar: 19, fibre: 4, vitamins: ["Vitamin C"], tags: ["fruit", "snack"] }),
  food({ id: "avocado", name: "Avocado", category: "healthy-fats", subcategory: "fruit fat", servingSize: 0.5, servingUnit: "avocado", calories: 160, protein: 2, carbs: 9, fats: 15, sugar: 1, fibre: 7, sodium: 7, minerals: ["Potassium"], tags: ["healthy fat", "salad", "toast"] }),
  food({ id: "olive-oil", name: "Olive oil", category: "healthy-fats", subcategory: "oil", servingSize: 1, servingUnit: "tbsp", calories: 119, fats: 14, tags: ["oil", "healthy fat", "cooking"], preparationMethod: "extra virgin or cooking oil" }),
  food({ id: "butter", name: "Butter", category: "healthy-fats", subcategory: "butter", servingSize: 1, servingUnit: "tsp", calories: 34, fats: 4, sodium: 30, tags: ["butter", "cooking fat"] }),
  food({ id: "nuts", name: "Mixed nuts", category: "healthy-fats", subcategory: "nuts", servingSize: 30, servingUnit: "g", calories: 180, protein: 5, carbs: 6, fats: 16, sugar: 2, fibre: 3, sodium: 2, minerals: ["Magnesium", "Zinc"], tags: ["nuts", "snack", "healthy fat"] }),
  food({ id: "peanut-butter", name: "Peanut butter", category: "healthy-fats", subcategory: "nut butter", servingSize: 1, servingUnit: "tbsp", calories: 95, protein: 4, carbs: 3, fats: 8, sugar: 1, fibre: 1, sodium: 70, minerals: ["Magnesium"], tags: ["peanut butter", "toast", "smoothie"] }),
  food({ id: "chia-seeds", name: "Chia seeds", category: "healthy-fats", subcategory: "seeds", servingSize: 1, servingUnit: "tbsp", calories: 58, protein: 2, carbs: 5, fats: 4, fibre: 5, sodium: 2, minerals: ["Calcium", "Omega-3", "Magnesium"], tags: ["chia", "seeds", "smoothie", "oats"] }),
  food({ id: "sugar", name: "Sugar", category: "carbs", subcategory: "sweetener", servingSize: 1, servingUnit: "tsp", calories: 16, carbs: 4, sugar: 4, tags: ["sugar", "sweetener", "tea", "coffee"] }),
  food({ id: "cheddar-cheese", name: "Cheddar cheese", category: "protein", subcategory: "cheese", servingSize: 30, servingUnit: "g", calories: 120, protein: 7, carbs: 1, fats: 10, sodium: 190, minerals: ["Calcium"], tags: ["cheese", "omelette", "sandwich"] }),
  food({ id: "broccoli", name: "Broccoli", category: "vegetables", subcategory: "green vegetables", servingSize: 100, servingUnit: "g cooked", calories: 35, protein: 2, carbs: 7, sugar: 1, fibre: 3, sodium: 41, vitamins: ["Vitamin C", "Vitamin A"], minerals: ["Potassium"], tags: ["vegetable"] }),
  food({ id: "mixed-vegetables", name: "Mixed vegetables", category: "vegetables", subcategory: "mixed vegetables", servingSize: 100, servingUnit: "g cooked", calories: 65, protein: 3, carbs: 12, fats: 1, sugar: 4, fibre: 4, sodium: 50, vitamins: ["Vitamin A", "Vitamin C"], minerals: ["Potassium"], tags: ["vegetables", "omelette", "stir fry"] }),
  food({ id: "mixed-salad", name: "Mixed salad", category: "vegetables", subcategory: "salad", servingSize: 1, servingUnit: "bowl", calories: 70, protein: 3, carbs: 12, fats: 2, sugar: 5, fibre: 4, sodium: 80, vitamins: ["Vitamin A", "Vitamin C"], tags: ["vegetable", "salad"] }),
  food({ id: "wholegrain-bread", name: "Wholegrain bread", category: "bread", subcategory: "bread", servingSize: 2, servingUnit: "slices", calories: 180, protein: 8, carbs: 32, fats: 3, sugar: 4, fibre: 6, sodium: 320, minerals: ["Iron", "Magnesium"], tags: ["bread", "carbs"] }),
  food({ id: "white-toast", name: "White toast", category: "bread", subcategory: "toast", servingSize: 2, servingUnit: "slices", calories: 160, protein: 5, carbs: 30, fats: 2, sugar: 3, fibre: 2, sodium: 300, tags: ["bread", "toast"] }),
  food({ id: "chicken-rice-bowl", name: "Chicken rice bowl", category: "rice-dishes", subcategory: "meal bowl", servingSize: 1, servingUnit: "bowl", calories: 560, protein: 42, carbs: 64, fats: 14, sugar: 6, fibre: 6, sodium: 620, tags: ["meal", "chicken", "rice"], preparationMethod: "chicken, rice, vegetables and sauce" }),
  food({ id: "egg-fried-rice", name: "Egg fried rice", category: "rice-dishes", subcategory: "fried rice", servingSize: 1, servingUnit: "plate", calories: 520, protein: 16, carbs: 72, fats: 18, sugar: 4, fibre: 4, sodium: 820, tags: ["rice", "egg", "takeaway"], preparationMethod: "fried rice with egg" }),
  food({ id: "tomato-pasta", name: "Tomato pasta", category: "pasta", subcategory: "pasta meal", servingSize: 1, servingUnit: "bowl", calories: 480, protein: 14, carbs: 78, fats: 12, sugar: 10, fibre: 6, sodium: 540, tags: ["pasta", "meal"] }),
  food({ id: "chicken-noodles", name: "Chicken noodles", category: "noodles", subcategory: "noodle meal", servingSize: 1, servingUnit: "bowl", calories: 590, protein: 32, carbs: 76, fats: 17, sugar: 8, fibre: 5, sodium: 960, tags: ["noodles", "chicken"] }),
  food({ id: "vegetable-soup", name: "Vegetable soup", category: "soups", subcategory: "soup", servingSize: 1, servingUnit: "bowl", calories: 160, protein: 5, carbs: 28, fats: 3, sugar: 8, fibre: 6, sodium: 680, vitamins: ["Vitamin A", "Vitamin C"], tags: ["soup", "vegetable"] }),
  food({ id: "tomato-sauce", name: "Tomato sauce", category: "sauces", subcategory: "sauce", servingSize: 100, servingUnit: "g", calories: 70, protein: 2, carbs: 12, fats: 2, sugar: 8, fibre: 2, sodium: 450, tags: ["sauce"] }),
  food({ id: "biscuits", name: "Biscuits", category: "snacks", subcategory: "sweet snack", servingSize: 2, servingUnit: "biscuits", calories: 140, protein: 2, carbs: 20, fats: 6, sugar: 9, fibre: 1, sodium: 110, tags: ["snack", "dessert"], synonyms: ["cookies"] }),
  food({ id: "dark-chocolate", name: "Dark chocolate", category: "desserts", subcategory: "chocolate", servingSize: 30, servingUnit: "g", calories: 170, protein: 2, carbs: 14, fats: 12, sugar: 8, fibre: 3, sodium: 5, minerals: ["Magnesium"], tags: ["dessert", "snack"] }),
  food({ id: "burger-fries", name: "Burger and fries", category: "fast-food", subcategory: "burger meal", servingSize: 1, servingUnit: "meal", calories: 900, protein: 32, carbs: 98, fats: 42, sugar: 12, fibre: 7, sodium: 1500, tags: ["fast food", "restaurant"] }),
  food({ id: "pizza-slice", name: "Pizza slice", category: "fast-food", subcategory: "pizza", servingSize: 1, servingUnit: "slice", calories: 285, protein: 12, carbs: 36, fats: 10, sugar: 4, fibre: 2, sodium: 640, tags: ["pizza", "restaurant"] }),
  food({ id: "english-breakfast", name: "English breakfast", category: "restaurant-meals", subcategory: "breakfast", servingSize: 1, servingUnit: "plate", calories: 780, protein: 38, carbs: 52, fats: 46, sugar: 8, fibre: 8, sodium: 1800, tags: ["breakfast", "restaurant", "eggs"] }),
  food({ id: "tuna-sandwich", name: "Tuna sandwich", category: "bread", subcategory: "sandwich", servingSize: 1, servingUnit: "sandwich", calories: 312, protein: 33, carbs: 32, fats: 6, sugar: 4, fibre: 4, sodium: 680, vitamins: ["Vitamin B12"], minerals: ["Omega-3"], tags: ["sandwich", "tuna"] }),
  food({ id: "coffee-toast", name: "Coffee and toast", category: "restaurant-meals", subcategory: "breakfast", servingSize: 1, servingUnit: "meal", calories: 195, protein: 6, carbs: 33, fats: 4, sugar: 4, fibre: 2, sodium: 310, caffeineMg: 95, tags: ["breakfast", "coffee", "toast"] }),
  food({ id: "tea-biscuits", name: "Tea with biscuits", category: "snacks", subcategory: "tea snack", servingSize: 1, servingUnit: "snack", calories: 142, protein: 2, carbs: 20, fats: 6, sugar: 9, fibre: 1, sodium: 110, caffeineMg: 45, tags: ["tea", "biscuits", "snack"] })
];

export const mealTemplates: MealTemplate[] = [
  { id: "tpl-english-breakfast", name: "English breakfast", category: "restaurant meals", mealType: "breakfast", ingredientFoodIds: ["english-breakfast"], tags: ["eggs", "restaurant"], description: "A full breakfast plate estimate." },
  { id: "tpl-chicken-rice-bowl", name: "Chicken rice bowl", category: "meal prep", mealType: "lunch", ingredientFoodIds: ["chicken-breast", "rice", "broccoli"], tags: ["high protein", "rice"], description: "Chicken, rice and vegetables." },
  { id: "tpl-tuna-sandwich", name: "Tuna sandwich", category: "quick meal", mealType: "lunch", ingredientFoodIds: ["tuna-sandwich"], tags: ["sandwich", "protein"], description: "Simple tuna sandwich estimate." },
  { id: "tpl-protein-smoothie", name: "Protein smoothie", category: "post-workout", mealType: "post-workout", ingredientFoodIds: ["protein-smoothie"], tags: ["shake", "protein"], description: "Protein shake with fruit." },
  { id: "tpl-porridge-banana", name: "Porridge with banana", category: "breakfast", mealType: "breakfast", ingredientFoodIds: ["porridge-banana"], tags: ["oats", "banana"], description: "Oats, milk and banana." },
  { id: "tpl-egg-omelette", name: "Egg omelette breakfast", category: "breakfast", mealType: "breakfast", ingredientFoodIds: ["omelette", "wholegrain-bread"], tags: ["eggs"], description: "Omelette with toast." },
  { id: "tpl-coffee-toast", name: "Coffee and toast", category: "breakfast", mealType: "breakfast", ingredientFoodIds: ["coffee-toast"], tags: ["coffee", "toast"], description: "Simple light breakfast." },
  { id: "tpl-tea-biscuits", name: "Tea with biscuits", category: "snack", mealType: "snack", ingredientFoodIds: ["tea-biscuits"], tags: ["tea", "snack"], description: "Tea and two biscuits." }
];

export const micronutrients: MicronutrientItem[] = [
  { name: "Vitamin A", foods: ["Sweet potato", "Eggs"], whyItMatters: "Supports immune health and vision." },
  { name: "Vitamin B12", foods: ["Eggs", "Greek yogurt", "Tuna", "Salmon"], whyItMatters: "Supports energy metabolism and red blood cells." },
  { name: "Vitamin C", foods: ["Banana", "Potatoes"], whyItMatters: "Supports tissue repair and iron absorption." },
  { name: "Vitamin D", foods: ["Eggs", "Salmon"], whyItMatters: "Supports bones, muscles, and immune function." },
  { name: "Iron", foods: ["Lentils", "Tofu", "Oats", "Quinoa"], whyItMatters: "Helps transport oxygen for training capacity." },
  { name: "Magnesium", foods: ["Oats", "Quinoa", "Nuts", "Chia seeds"], whyItMatters: "Supports muscle and nerve function." },
  { name: "Zinc", foods: ["Chicken breast", "Quinoa", "Nuts"], whyItMatters: "Supports recovery and immune health." },
  { name: "Potassium", foods: ["Banana", "Sweet potato", "Potatoes", "Avocado"], whyItMatters: "Supports hydration and muscle contraction." },
  { name: "Calcium", foods: ["Greek yogurt", "Cottage cheese", "Tofu", "Chia seeds"], whyItMatters: "Supports bones and muscle contraction." },
  { name: "Omega-3", foods: ["Salmon", "Tuna", "Chia seeds"], whyItMatters: "Supports heart health and recovery." }
];
