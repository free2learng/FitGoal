"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Coffee, Heart, Plus, Search, Star, Trash2, Utensils } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { todayKey } from "@/lib/generators";
import { foodLogTotals, foodToLogBase, scaleFoodLog, searchFoods } from "@/lib/nutrition";
import { mealTemplates, nutritionFoods } from "@/lib/program-data";
import { addFoodLog, convertPlannedFood, deleteFoodLog, loadState, saveCustomFood, toggleFavoriteFood } from "@/lib/storage";
import { FitGoalState, FoodCategory, FoodItem, FoodLogEntry, FoodLogStatus, MealType } from "@/lib/types";

const categoryChips: { id: "all" | FoodCategory | string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "drinks", label: "Drinks" },
  { id: "tea", label: "Tea" },
  { id: "coffee", label: "Coffee" },
  { id: "milk", label: "Milk" },
  { id: "plant-based milk", label: "Plant milk" },
  { id: "protein", label: "Protein" },
  { id: "vegetables", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
  { id: "dairy", label: "Dairy" },
  { id: "chicken", label: "Chicken" },
  { id: "lamb", label: "Lamb" },
  { id: "pork", label: "Pork" },
  { id: "seafood", label: "Seafood" },
  { id: "eggs", label: "Eggs" },
  { id: "meat", label: "Meat" },
  { id: "fish", label: "Fish" },
  { id: "grains", label: "Grains" },
  { id: "bread", label: "Bread" },
  { id: "rice-dishes", label: "Rice dishes" },
  { id: "pasta", label: "Pasta" },
  { id: "noodles", label: "Noodles" },
  { id: "sauces", label: "Sauces" },
  { id: "snacks", label: "Snacks" },
  { id: "desserts", label: "Desserts" },
  { id: "cultural-foods", label: "Cultural meals" },
  { id: "restaurant-meals", label: "Restaurant" },
  { id: "fast-food", label: "Fast food" }
];

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack", "drink", "post-workout"];
const customFoodCategories: FoodCategory[] = [
  "drinks",
  "protein",
  "carbs",
  "healthy-fats",
  "meat",
  "fish",
  "vegetables",
  "fruits",
  "grains",
  "bread",
  "rice-dishes",
  "pasta",
  "noodles",
  "soups",
  "sauces",
  "snacks",
  "desserts",
  "fast-food",
  "restaurant-meals",
  "cultural-foods",
  "supplements"
];

export default function FoodLibraryPage() {
  const [state, setState] = useState<FitGoalState | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem>(nutritionFoods[0]);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [status, setStatus] = useState<FoodLogStatus>("eaten");
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [customOpen, setCustomOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [comboIds, setComboIds] = useState<string[]>([]);
  const [loggedFoods, setLoggedFoods] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const today = todayKey();
  const allFoods = useMemo(() => [...nutritionFoods, ...(state?.customFoods ?? [])], [state?.customFoods]);
  const todaysLogs = (state?.foodLogs ?? []).filter((entry) => entry.date === today);
  const eatenLogs = todaysLogs.filter((entry) => entry.status === "eaten");
  const plannedLogs = todaysLogs.filter((entry) => entry.status === "planned");
  const topLoggedFoods = todaysLogs.slice(0, 5);
  const eatenTotals = foodLogTotals(eatenLogs);
  const plannedTotals = foodLogTotals(plannedLogs);
  const favoriteIds = state?.favoriteFoodIds ?? [];
  const favoriteFoods = allFoods.filter((food) => favoriteIds.includes(food.id));
  const commonDrinks = allFoods.filter((food) => food.isDrink).slice(0, 12);
  const recentNames = Array.from(new Set([...(state?.foodLogs ?? [])].reverse().map((entry) => entry.foodName))).slice(0, 8);
  const recentFoods = recentNames.map((name) => allFoods.find((food) => food.name === name)).filter(Boolean) as FoodItem[];
  const mostLoggedFoods = Object.entries((state?.foodLogs ?? []).reduce<Record<string, number>>((counts, entry) => {
    counts[entry.foodName] = (counts[entry.foodName] ?? 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name]) => allFoods.find((food) => food.name === name)).filter(Boolean) as FoodItem[];
  const filteredFoods = searchFoods(allFoods, query, category).slice(0, 80);
  const searchDropdownFoods = query.trim() ? filteredFoods.slice(0, 12) : [];
  const browseFoods = query.trim() ? [] : filteredFoods.slice(0, 24);
  const comboCandidates = query
    ? searchFoods(allFoods, query, category).slice(0, 30)
    : allFoods.filter((food) => [
      "black-tea",
      "whole-milk",
      "semi-skimmed-milk",
      "sugar",
      "boiled-egg",
      "omelette",
      "egg-whites",
      "olive-oil",
      "butter",
      "cheddar-cheese",
      "mixed-vegetables",
      "wholegrain-bread",
      "rice",
      "chicken-breast",
      "tuna",
      "biscuits"
    ].includes(food.id));

  function updateState(next: FitGoalState) {
    setState(next);
  }

  function pickFood(food: FoodItem) {
    setSelectedFood(food);
    setServingMultiplier(1);
  }

  function logKey(food: FoodItem, override?: { status?: FoodLogStatus; mealType?: MealType }) {
    return `${food.id}-${override?.status ?? status}-${override?.mealType ?? (food.isDrink ? "drink" : mealType)}`;
  }

  function recentlyLogged(food: FoodItem, override?: { status?: FoodLogStatus; mealType?: MealType }) {
    return (loggedFoods[logKey(food, override)] ?? 0) > Date.now();
  }

  function logFood(food: FoodItem, override?: { status?: FoodLogStatus; mealType?: MealType; multiplier?: number; source?: FoodLogEntry["source"] }) {
    if (!state) return;
    const key = logKey(food, override);
    if ((loggedFoods[key] ?? 0) > Date.now()) return;
    const finalMealType = override?.mealType ?? (food.isDrink ? "drink" : mealType);
    const finalStatus = override?.status ?? status;
    const scaled = scaleFoodLog({
      date: today,
      status: finalStatus,
      mealType: finalMealType,
      servingMultiplier: override?.multiplier ?? servingMultiplier,
      ...foodToLogBase(food),
      source: override?.source ?? foodToLogBase(food).source
    });
    updateState(addFoodLog(state, scaled));
    setLoggedFoods((current) => ({ ...current, [key]: Date.now() + 2000 }));
    setToast(`${food.name} logged to ${finalMealType}`);
    if (typeof window !== "undefined" && "navigator" in window && "vibrate" in window.navigator) {
      window.navigator.vibrate?.(20);
    }
    window.setTimeout(() => {
      setLoggedFoods((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }, 2000);
    window.setTimeout(() => setToast(null), 1500);
  }

  function logTemplate(templateId: string) {
    const template = mealTemplates.find((item) => item.id === templateId);
    if (!template || !state) return;
    const foods = template.ingredientFoodIds.map((id) => allFoods.find((food) => food.id === id)).filter(Boolean) as FoodItem[];
    if (!foods.length) return;
    const combined = combineFoods(template.name, foods, template.tags);
    const scaled = scaleFoodLog({ date: today, status, mealType: template.mealType, servingMultiplier: 1, ...foodToLogBase(combined), source: "template" });
    updateState(addFoodLog(state, scaled));
  }

  function logCombination() {
    if (!state) return;
    const foods = comboIds.map((id) => allFoods.find((food) => food.id === id)).filter(Boolean) as FoodItem[];
    if (!foods.length) return;
    const combined = combineFoods(foods.map((food) => food.name).join(" + "), foods, ["combination"]);
    const scaled = scaleFoodLog({ date: today, status, mealType, servingMultiplier: 1, ...foodToLogBase(combined), source: "combination" });
    updateState(addFoodLog(state, scaled));
    setComboIds([]);
    setComboOpen(false);
  }

  function logCustomFood(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;
    const form = new FormData(event.currentTarget);
    const customFood: FoodItem = {
      id: `custom-${crypto.randomUUID()}`,
      name: String(form.get("name")),
      category: String(form.get("category")) as FoodCategory,
      subcategory: String(form.get("subcategory") || "custom"),
      servingSize: Number(form.get("servingSize") || 1),
      servingUnit: String(form.get("servingUnit") || "serving"),
      calories: Number(form.get("calories") || 0),
      protein: Number(form.get("protein") || 0),
      carbs: Number(form.get("carbs") || 0),
      fats: Number(form.get("fats") || 0),
      sugar: Number(form.get("sugar") || 0),
      fibre: Number(form.get("fibre") || 0),
      sodium: Number(form.get("sodium") || 0),
      caffeineMg: Number(form.get("caffeineMg") || 0) || undefined,
      vitamins: splitList(String(form.get("vitamins") || "")),
      minerals: splitList(String(form.get("minerals") || "")),
      tags: splitList(String(form.get("tags") || "custom")),
      synonyms: [],
      commonServingOptions: [{ label: "1 serving", multiplier: 1 }, { label: "1/2 serving", multiplier: 0.5 }, { label: "2 servings", multiplier: 2 }],
      preparationMethod: String(form.get("preparationMethod") || "custom"),
      isDrink: form.get("isDrink") === "on",
      isCustom: true,
      source: "custom",
      verifiedStatus: "user",
      fitnessBenefit: "Custom food saved by you.",
      mealUse: "Reuse from your personal food library."
    };
    const withCustom = saveCustomFood(state, customFood);
    updateState(withCustom);
    const scaled = scaleFoodLog({ date: today, status: String(form.get("status")) as FoodLogStatus, mealType: String(form.get("mealType")) as MealType, servingMultiplier: Number(form.get("servings") || 1), ...foodToLogBase(customFood), source: "custom" });
    updateState(addFoodLog(withCustom, scaled));
    event.currentTarget.reset();
    setCustomOpen(false);
  }

  return (
    <AppShell>
      <section className="space-y-5 px-5 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black text-zinc-600">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <div className="rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-bold text-mint">Food logging</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Find, build, or save foods.</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">Search real everyday foods, drinks, cooked variations, templates, custom foods, favourites and combinations.</p>
        </div>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-zinc-400" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search coffee, tea, egg, latte..." className="h-12 w-full rounded-lg border border-zinc-200 pl-10 pr-3 text-sm font-bold outline-none focus:border-leaf" />
            {query.trim() && (
              <div className="absolute left-0 right-0 top-14 z-20 max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                {searchDropdownFoods.length === 0 ? (
                  <p className="p-3 text-sm font-bold text-zinc-500">No match yet. Add it as a custom food below.</p>
                ) : searchDropdownFoods.map((food) => (
                  <FoodDropdownRow
                    key={food.id}
                    food={food}
                    logged={recentlyLogged(food)}
                    disabled={!state || recentlyLogged(food)}
                    onPick={() => pickFood(food)}
                    onLog={(quantity) => logFood(food, { multiplier: quantity })}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categoryChips.map((chip) => (
              <button key={chip.id} type="button" onClick={() => setCategory(chip.id)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-black ${category === chip.id ? "bg-ink text-white" : "bg-zinc-100 text-zinc-700"}`}>
                {chip.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label>
              <span className="mb-2 block text-sm font-black text-ink">Serving</span>
              <select value={servingMultiplier} onChange={(event) => setServingMultiplier(Number(event.target.value))} className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf">
                {selectedFood.commonServingOptions.map((option) => <option key={option.label} value={option.multiplier}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-black text-ink">Meal type</span>
              <select value={mealType} onChange={(event) => setMealType(event.target.value as MealType)} className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf">
                {mealTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setStatus("eaten")} className={`h-11 rounded-lg text-sm font-black ${status === "eaten" ? "bg-leaf text-white" : "border border-zinc-200 text-ink"}`}>Eaten</button>
            <button type="button" onClick={() => setStatus("planned")} className={`h-11 rounded-lg text-sm font-black ${status === "planned" ? "bg-sky text-ink" : "border border-zinc-200 text-ink"}`}>Planned</button>
          </div>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">Today&apos;s logged foods</h2>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-black">
            <Macro label="Cal" value={foodLogTotals(todaysLogs).calories} />
            <Macro label="Pro" value={`${foodLogTotals(todaysLogs).protein}g`} />
            <Macro label="Carbs" value={`${foodLogTotals(todaysLogs).carbs}g`} />
            <Macro label="Fats" value={`${foodLogTotals(todaysLogs).fats}g`} />
          </div>
          <div className="mt-3 space-y-2">
            {topLoggedFoods.length === 0 ? (
              <p className="rounded-lg bg-zinc-50 p-3 text-sm font-semibold text-zinc-500">Logged foods will appear here immediately.</p>
            ) : topLoggedFoods.map((log) => (
              <div key={log.id} className="rounded-lg bg-mint/15 p-3">
                <p className="font-black text-ink">{log.foodName}</p>
                <p className="text-sm text-zinc-600">{log.mealType} - {log.calories} cal - {log.protein}g protein</p>
              </div>
            ))}
          </div>
        </article>

        <FoodRail title="Common drinks" icon={<Coffee size={17} />} foods={commonDrinks} onPick={pickFood} onLog={logFood} isLogged={recentlyLogged} state={state} onState={updateState} />
        <FoodRail title="Recent foods" foods={recentFoods} onPick={pickFood} onLog={logFood} isLogged={recentlyLogged} state={state} onState={updateState} empty="No recent foods yet." />
        <FoodRail title="Favourites" icon={<Heart size={17} />} foods={favoriteFoods} onPick={pickFood} onLog={logFood} isLogged={recentlyLogged} state={state} onState={updateState} empty="Tap the star on a food to favourite it." />
        <FoodRail title="Most logged" foods={mostLoggedFoods} onPick={pickFood} onLog={logFood} isLogged={recentlyLogged} state={state} onState={updateState} empty="Most logged foods will appear here." />

        {!query.trim() && (
          <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">Browse food library</h2>
            <p className="mt-1 text-sm text-zinc-600">Search above for a shorter dropdown when logging a specific food.</p>
            <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto">
              {browseFoods.map((food) => (
                <FoodSearchRow key={food.id} food={food} selected={selectedFood.id === food.id} favorite={favoriteIds.includes(food.id)} logged={recentlyLogged(food)} onPick={pickFood} onLog={logFood} state={state} onState={updateState} />
              ))}
            </div>
          </article>
        )}

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">Meal templates</h2>
          <div className="mt-3 grid gap-2">
            {mealTemplates.map((template) => (
              <button key={template.id} onClick={() => logTemplate(template.id)} disabled={!state} className="rounded-lg bg-zinc-50 p-3 text-left disabled:opacity-50">
                <span className="block font-black text-ink">{template.name}</span>
                <span className="text-sm text-zinc-600">{template.description}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <button onClick={() => setComboOpen(!comboOpen)} className="flex w-full items-center justify-between text-left">
            <span>
              <span className="block text-sm font-bold text-leaf">Food combinations</span>
              <span className="text-xl font-black text-ink">Build from ingredients</span>
            </span>
            <Plus size={20} />
          </button>
          {comboOpen && (
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-6 text-zinc-600">Examples: tea with milk and sugar, or omelette with eggs, oil, vegetables and cheese.</p>
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg bg-zinc-50 p-2">
                {comboCandidates.map((food) => (
                  <label key={food.id} className="flex items-center gap-3 rounded-lg bg-white p-3">
                    <input type="checkbox" checked={comboIds.includes(food.id)} onChange={() => setComboIds((ids) => ids.includes(food.id) ? ids.filter((id) => id !== food.id) : [...ids, food.id])} />
                    <span>
                      <span className="block font-black text-ink">{food.name}</span>
                      <span className="text-xs text-zinc-500">{food.calories} cal - {food.servingSize}{food.servingUnit}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button onClick={logCombination} disabled={!state || comboIds.length === 0} className="h-12 w-full rounded-lg bg-ink text-sm font-black text-white disabled:opacity-50">Log combination</button>
            </div>
          )}
        </article>

        <CustomFoodForm open={customOpen} setOpen={setCustomOpen} onSubmit={logCustomFood} />

        <LogSummary title="Eaten today" logs={eatenLogs} totals={eatenTotals} state={state} onChange={updateState} />
        <LogSummary title="Planned later" logs={plannedLogs} totals={plannedTotals} state={state} onChange={updateState} planned />
        {toast && (
          <div className="fixed bottom-24 left-5 right-5 z-50 mx-auto flex max-w-md animate-pulse items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-black text-white shadow-xl">
            <Check size={18} className="text-mint" /> {toast}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function FoodRail({ title, icon, foods, onPick, onLog, isLogged, state, onState, empty = "Nothing here yet." }: { title: string; icon?: React.ReactNode; foods: FoodItem[]; onPick: (food: FoodItem) => void; onLog: (food: FoodItem) => void; isLogged: (food: FoodItem) => boolean; state: FitGoalState | null; onState: (state: FitGoalState) => void; empty?: string }) {
  return (
    <article className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-black text-ink">{icon}{title}</h2>
      {foods.length === 0 ? <p className="mt-2 text-sm font-semibold text-zinc-500">{empty}</p> : (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {foods.map((food) => (
            <FoodChip key={food.id} food={food} logged={isLogged(food)} onPick={onPick} onLog={onLog} state={state} onState={onState} />
          ))}
        </div>
      )}
    </article>
  );
}

function FoodChip({ food, logged, onPick, onLog, state, onState }: { food: FoodItem; logged: boolean; onPick: (food: FoodItem) => void; onLog: (food: FoodItem) => void; state: FitGoalState | null; onState: (state: FitGoalState) => void }) {
  const isFavorite = Boolean(state?.favoriteFoodIds?.includes(food.id));
  return (
    <div className="min-w-44 shrink-0 rounded-lg bg-zinc-50 p-3">
      <button onClick={() => onPick(food)} className="w-full text-left">
        <span className="block font-black text-ink">{food.name}</span>
        <span className="text-xs text-zinc-500">{food.calories} cal - {food.protein}g protein</span>
      </button>
      <div className="mt-2 flex gap-2">
        <button onClick={() => onLog(food)} disabled={!state || logged} className={`flex-1 rounded-lg py-2 text-xs font-black text-white transition-all disabled:opacity-90 ${logged ? "scale-[1.02] bg-leaf" : "bg-ink"}`}>
          {logged ? <span className="inline-flex items-center gap-1"><Check size={14} /> Logged</span> : "Log"}
        </button>
        {state && <button onClick={() => onState(toggleFavoriteFood(state, food.id))} className={`grid h-8 w-8 place-items-center rounded-lg ${isFavorite ? "bg-peach/30 text-ink" : "bg-white text-zinc-500"}`} aria-label="Favourite food"><Star size={15} /></button>}
      </div>
    </div>
  );
}

function FoodDropdownRow({ food, logged, disabled, onPick, onLog }: { food: FoodItem; logged: boolean; disabled: boolean; onPick: () => void; onLog: (quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

  return (
    <div className="grid grid-cols-[1fr_72px_74px] items-center gap-2 rounded-lg p-2 hover:bg-zinc-50">
      <button type="button" onClick={onPick} className="min-w-0 text-left">
        <span className="block truncate text-sm font-black text-ink">{food.name}</span>
        <span className="block truncate text-xs font-semibold text-zinc-500">
          {food.subcategory} - {food.calories} cal per {food.servingSize}{food.servingUnit}
        </span>
      </button>
      <label className="min-w-0">
        <span className="sr-only">Quantity for {food.name}</span>
        <input
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          type="number"
          min="0.25"
          step="0.25"
          className="h-10 w-full rounded-lg border border-zinc-200 px-2 text-center text-sm font-black outline-none focus:border-leaf"
          aria-label={`Quantity for ${food.name}`}
        />
      </label>
      <button type="button" onClick={() => onLog(safeQuantity)} disabled={disabled} className={`h-10 rounded-lg px-3 text-xs font-black text-white transition-all disabled:opacity-90 ${logged ? "scale-[1.03] bg-leaf" : "bg-ink"}`}>
        {logged ? <span className="inline-flex items-center gap-1"><Check size={14} /> Logged</span> : "Log"}
      </button>
    </div>
  );
}

function FoodSearchRow({ food, selected, favorite, logged, onPick, onLog, state, onState }: { food: FoodItem; selected: boolean; favorite: boolean; logged: boolean; onPick: (food: FoodItem) => void; onLog: (food: FoodItem, override?: { multiplier?: number }) => void; state: FitGoalState | null; onState: (state: FitGoalState) => void }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className={`rounded-lg p-3 ${selected ? "bg-ink text-white" : "bg-zinc-50 text-ink"}`}>
      <button onClick={() => onPick(food)} className="w-full text-left">
        <span className="block font-black">{food.name}</span>
        <span className={`text-xs ${selected ? "text-white/70" : "text-zinc-500"}`}>{food.subcategory} - {food.calories} cal - {food.servingSize}{food.servingUnit}</span>
        <span className={`mt-1 block text-xs ${selected ? "text-white/70" : "text-zinc-500"}`}>{food.verifiedStatus} - {food.source} - {food.tags.slice(0, 4).join(", ")}</span>
      </button>
      <div className="mt-2 grid grid-cols-[76px_1fr_40px] gap-2">
        <input
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          type="number"
          min="0.25"
          step="0.25"
          aria-label={`Quantity for ${food.name}`}
          className={`h-10 rounded-lg border px-2 text-center text-xs font-black outline-none ${selected ? "border-white/20 bg-white/10 text-white" : "border-zinc-200 bg-white text-ink"}`}
        />
        <button onClick={() => onLog(food, { multiplier: Number.isFinite(quantity) && quantity > 0 ? quantity : 1 })} disabled={!state || logged} className={`h-10 rounded-lg text-xs font-black transition-all disabled:opacity-90 ${logged ? "scale-[1.02] bg-leaf text-white" : selected ? "bg-mint text-ink" : "bg-ink text-white"}`}>
          {logged ? <span className="inline-flex items-center gap-1"><Check size={14} /> Logged</span> : "Log selected"}
        </button>
        {state && <button onClick={() => onState(toggleFavoriteFood(state, food.id))} className={`grid h-10 place-items-center rounded-lg ${favorite ? "bg-peach/30 text-ink" : "bg-white text-zinc-500"}`} aria-label="Favourite food"><Star size={16} /></button>}
      </div>
    </div>
  );
}

function CustomFoodForm({ open, setOpen, onSubmit }: { open: boolean; setOpen: (open: boolean) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span>
          <span className="block text-sm font-bold text-leaf">Custom food</span>
          <span className="text-xl font-black text-ink">Add missing food</span>
        </span>
        <Plus size={20} />
      </button>
      {open && (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <Input name="name" label="Food name" required />
          <div className="grid grid-cols-2 gap-3">
            <Select name="category" label="Category" options={customFoodCategories} />
            <Input name="subcategory" label="Subcategory" placeholder="brand, cooked style" />
            <Input name="servingSize" label="Serving size" type="number" min="0" step="0.1" defaultValue="1" required />
            <Input name="servingUnit" label="Unit" placeholder="cup, g, ml, slice" required />
            <Input name="servings" label="Servings to log" type="number" min="0.25" step="0.25" defaultValue="1" required />
            <Select name="mealType" label="Meal type" options={mealTypes} />
            <Input name="calories" label="Calories" type="number" min="0" required />
            <Input name="protein" label="Protein g" type="number" min="0" required />
            <Input name="carbs" label="Carbs g" type="number" min="0" required />
            <Input name="fats" label="Fats g" type="number" min="0" required />
            <Input name="sugar" label="Sugar g" type="number" min="0" defaultValue="0" />
            <Input name="fibre" label="Fibre g" type="number" min="0" defaultValue="0" />
            <Input name="sodium" label="Sodium mg" type="number" min="0" defaultValue="0" />
            <Input name="caffeineMg" label="Caffeine mg" type="number" min="0" />
          </div>
          <Input name="vitamins" label="Vitamins" placeholder="Vitamin C, Vitamin D" />
          <Input name="minerals" label="Minerals" placeholder="Iron, Calcium, Potassium" />
          <Input name="tags" label="Tags/synonyms" placeholder="brand, takeaway, drink" />
          <Input name="preparationMethod" label="Preparation" placeholder="boiled, fried, oat milk, restaurant estimate" />
          <label className="flex items-center gap-2 text-sm font-black text-ink"><input name="isDrink" type="checkbox" /> Drink</label>
          <select name="status" className="h-11 rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf">
            <option value="eaten">Eaten</option>
            <option value="planned">Planned</option>
          </select>
          <button className="h-12 rounded-lg bg-ink text-sm font-black text-white">Save to my foods and log</button>
        </form>
      )}
    </article>
  );
}

function LogSummary({ title, logs, totals, state, onChange, planned = false }: { title: string; logs: FoodLogEntry[]; totals: ReturnType<typeof foodLogTotals>; state: FitGoalState | null; onChange: (state: FitGoalState) => void; planned?: boolean }) {
  return (
    <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-black">
        <Macro label="Cal" value={totals.calories} />
        <Macro label="Pro" value={`${totals.protein}g`} />
        <Macro label="Sugar" value={`${totals.sugar}g`} />
        <Macro label="Caff" value={`${totals.caffeineMg}mg`} />
      </div>
      <div className="mt-3 space-y-2">
        {logs.length === 0 ? (
          <p className="rounded-lg bg-zinc-50 p-3 text-sm font-semibold text-zinc-500">No {planned ? "planned" : "eaten"} foods yet.</p>
        ) : logs.map((log) => (
          <div key={log.id} className="rounded-lg bg-zinc-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-ink">{log.foodName}</p>
                <p className="text-xs font-semibold text-zinc-500">{log.mealType} - {log.servingMultiplier}x {log.serving}</p>
                <p className="text-sm text-zinc-600">{log.calories} cal - {log.protein}g protein - {log.source}</p>
              </div>
              <div className="flex gap-2">
                {planned && state && <button onClick={() => onChange(convertPlannedFood(state, log.id))} className="grid h-9 w-9 place-items-center rounded-lg bg-leaf text-white" aria-label="Mark eaten"><Check size={16} /></button>}
                {state && <button onClick={() => onChange(deleteFoodLog(state, log.id))} className="grid h-9 w-9 place-items-center rounded-lg bg-white text-zinc-500" aria-label="Delete food"><Trash2 size={16} /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label>
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      <input className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf" {...inputProps} />
    </label>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      <select name={name} className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Macro({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function combineFoods(name: string, foods: FoodItem[], tags: string[]): FoodItem {
  const vitamins = Array.from(new Set(foods.flatMap((food) => food.vitamins)));
  const minerals = Array.from(new Set(foods.flatMap((food) => food.minerals)));
  return {
    id: `combo-${foods.map((food) => food.id).join("-")}`,
    name,
    category: "restaurant-meals",
    subcategory: "combination",
    servingSize: 1,
    servingUnit: "combo",
    calories: foods.reduce((sum, food) => sum + food.calories, 0),
    protein: foods.reduce((sum, food) => sum + food.protein, 0),
    carbs: foods.reduce((sum, food) => sum + food.carbs, 0),
    fats: foods.reduce((sum, food) => sum + food.fats, 0),
    sugar: foods.reduce((sum, food) => sum + food.sugar, 0),
    fibre: foods.reduce((sum, food) => sum + food.fibre, 0),
    sodium: foods.reduce((sum, food) => sum + food.sodium, 0),
    caffeineMg: foods.reduce((sum, food) => sum + (food.caffeineMg ?? 0), 0),
    vitamins,
    minerals,
    tags,
    synonyms: [],
    commonServingOptions: [{ label: "1 combo", multiplier: 1 }, { label: "1/2 combo", multiplier: 0.5 }],
    preparationMethod: "built from ingredients",
    isDrink: foods.every((food) => food.isDrink),
    isCustom: false,
    source: "custom",
    verifiedStatus: "estimated",
    fitnessBenefit: "Built from selected ingredients so the estimate is more personal.",
    mealUse: "Use when a ready-made food is missing."
  };
}
