"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Beef, Bone, Carrot, Check, HeartPulse, Plus, Trash2, Utensils, Wheat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { todayKey } from "@/lib/generators";
import { foodLogTotals, scaleFoodLog } from "@/lib/nutrition";
import { micronutrients, nutritionFoods } from "@/lib/program-data";
import { addFoodLog, convertPlannedFood, deleteFoodLog, loadState } from "@/lib/storage";
import { FitGoalState, FoodCategory, FoodItem, FoodLogEntry, FoodLogStatus, MealType } from "@/lib/types";

const categories: { id: FoodCategory; title: string; icon: React.ReactNode; description: string }[] = [
  { id: "protein", title: "Protein", icon: <Beef size={19} />, description: "Supports muscle repair, fullness, and recovery." },
  { id: "carbs", title: "Carbs", icon: <Wheat size={19} />, description: "Fuel training and support consistent energy." },
  { id: "healthy-fats", title: "Healthy fats", icon: <Utensils size={19} />, description: "Support hormones, joints, and meal satisfaction." }
];

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack", "post-workout"];

export default function FoodLibraryPage() {
  const [state, setState] = useState<FitGoalState | null>(null);
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem>(nutritionFoods[0]);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [status, setStatus] = useState<FoodLogStatus>("eaten");
  const [servings, setServings] = useState(1);
  const [customOpen, setCustomOpen] = useState(false);

  useEffect(() => {
    setState(loadState());
  }, []);

  const today = todayKey();
  const todaysLogs = (state?.foodLogs ?? []).filter((entry) => entry.date === today);
  const eatenLogs = todaysLogs.filter((entry) => entry.status === "eaten");
  const plannedLogs = todaysLogs.filter((entry) => entry.status === "planned");
  const eatenTotals = foodLogTotals(eatenLogs);
  const plannedTotals = foodLogTotals(plannedLogs);

  const filteredFoods = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return nutritionFoods;
    return nutritionFoods.filter((food) => [food.name, food.category, food.keyMicronutrients.join(" ")].join(" ").toLowerCase().includes(term));
  }, [query]);

  function logLibraryFood() {
    if (!state) return;
    const scaled = scaleFoodLog({
      date: today,
      status,
      mealType,
      foodName: selectedFood.name,
      serving: selectedFood.serving,
      servingMultiplier: servings,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fats: selectedFood.fats,
      keyMicronutrients: selectedFood.keyMicronutrients,
      source: "library"
    });
    setState(addFoodLog(state, scaled));
  }

  function logCustomFood(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;
    const form = new FormData(event.currentTarget);
    const micros = String(form.get("micronutrients") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
    const scaled = scaleFoodLog({
      date: today,
      status: String(form.get("status")) as FoodLogStatus,
      mealType: String(form.get("mealType")) as MealType,
      foodName: String(form.get("name")),
      serving: String(form.get("serving") || "1 serving"),
      servingMultiplier: Number(form.get("servings") || 1),
      calories: Number(form.get("calories") || 0),
      protein: Number(form.get("protein") || 0),
      carbs: Number(form.get("carbs") || 0),
      fats: Number(form.get("fats") || 0),
      keyMicronutrients: micros,
      source: "custom"
    });
    setState(addFoodLog(state, scaled));
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
          <h1 className="mt-2 text-3xl font-black tracking-normal">Log what you eat.</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">Food intake is based only on what you add here. Plan meals ahead, then convert them to eaten after you eat.</p>
        </div>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-leaf"><Plus size={17} /> Add from food library</p>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chicken, yogurt, banana..." className="mt-3 h-12 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf" />
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-lg bg-zinc-50 p-2">
            {filteredFoods.map((food) => (
              <button key={food.name} type="button" onClick={() => setSelectedFood(food)} className={`w-full rounded-lg p-3 text-left ${selectedFood.name === food.name ? "bg-ink text-white" : "bg-white text-ink"}`}>
                <span className="block font-black">{food.name}</span>
                <span className={`text-xs ${selectedFood.name === food.name ? "text-white/70" : "text-zinc-500"}`}>{food.calories} cal - {food.protein}g protein - {food.serving}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label>
              <span className="mb-2 block text-sm font-black text-ink">Servings</span>
              <input type="number" min="0.25" step="0.25" value={servings} onChange={(event) => setServings(Number(event.target.value))} className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf" />
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

          <button onClick={logLibraryFood} disabled={!state} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-black text-white disabled:opacity-50">
            <Plus size={18} /> Add {status} food
          </button>
        </article>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <button onClick={() => setCustomOpen(!customOpen)} className="flex w-full items-center justify-between text-left">
            <span>
              <span className="block text-sm font-bold text-leaf">Custom food</span>
              <span className="text-xl font-black text-ink">Add something not listed</span>
            </span>
            <Plus size={20} />
          </button>
          {customOpen && (
            <form onSubmit={logCustomFood} className="mt-4 grid gap-3">
              <Input name="name" label="Food name" required />
              <Input name="serving" label="Serving label" placeholder="1 bowl, 150g, 1 bar" />
              <div className="grid grid-cols-2 gap-3">
                <Input name="servings" label="Servings" type="number" min="0.25" step="0.25" defaultValue="1" required />
                <Select name="mealType" label="Meal type" options={mealTypes} />
                <Input name="calories" label="Calories" type="number" min="0" required />
                <Input name="protein" label="Protein g" type="number" min="0" required />
                <Input name="carbs" label="Carbs g" type="number" min="0" required />
                <Input name="fats" label="Fats g" type="number" min="0" required />
              </div>
              <Input name="micronutrients" label="Vitamins/minerals" placeholder="Vitamin C, Iron, Potassium" />
              <select name="status" className="h-11 rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-leaf">
                <option value="eaten">Eaten</option>
                <option value="planned">Planned</option>
              </select>
              <button className="h-12 rounded-lg bg-ink text-sm font-black text-white">Save custom food</button>
            </form>
          )}
        </article>

        <LogSummary title="Eaten today" logs={eatenLogs} totals={eatenTotals} state={state} onChange={setState} />
        <LogSummary title="Planned later" logs={plannedLogs} totals={plannedTotals} state={state} onChange={setState} planned />

        {categories.map((category) => (
          <article key={category.id} className="space-y-3">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint/15 text-leaf">{category.icon}</span>
                {category.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">{category.description}</p>
            </div>
            <div className="space-y-3">
              {nutritionFoods.filter((food) => food.category === category.id).map((food) => (
                <FoodLibraryCard key={food.name} food={food} />
              ))}
            </div>
          </article>
        ))}

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-peach/20 text-ink"><Carrot size={19} /></span>
            Vitamins and minerals
          </h2>
          <div className="mt-4 grid gap-3">
            {micronutrients.map((item) => (
              <div key={item.name} className="rounded-lg bg-zinc-50 p-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-white text-leaf shadow-sm">
                    {item.name === "Calcium" ? <Bone size={16} /> : <HeartPulse size={16} />}
                  </span>
                  <div>
                    <h3 className="font-black text-ink">{item.name}</h3>
                    <p className="mt-1 text-sm leading-5 text-zinc-600">{item.whyItMatters}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-normal text-zinc-500">Foods</p>
                    <p className="text-sm font-semibold text-zinc-700">{item.foods.join(", ")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function LogSummary({ title, logs, totals, state, onChange, planned = false }: { title: string; logs: FoodLogEntry[]; totals: ReturnType<typeof foodLogTotals>; state: FitGoalState | null; onChange: (state: FitGoalState) => void; planned?: boolean }) {
  return (
    <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-black">
        <Macro label="Cal" value={totals.calories} />
        <Macro label="Pro" value={`${totals.protein}g`} />
        <Macro label="Carb" value={`${totals.carbs}g`} />
        <Macro label="Fat" value={`${totals.fats}g`} />
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
                <p className="text-sm text-zinc-600">{log.calories} cal - {log.protein}g protein</p>
              </div>
              <div className="flex gap-2">
                {planned && state && (
                  <button onClick={() => onChange(convertPlannedFood(state, log.id))} className="grid h-9 w-9 place-items-center rounded-lg bg-leaf text-white" aria-label="Mark eaten">
                    <Check size={16} />
                  </button>
                )}
                {state && (
                  <button onClick={() => onChange(deleteFoodLog(state, log.id))} className="grid h-9 w-9 place-items-center rounded-lg bg-white text-zinc-500" aria-label="Delete food">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function FoodLibraryCard({ food }: { food: FoodItem }) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-ink">{food.name}</h3>
          <p className="text-sm text-zinc-500">{food.serving}</p>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2 text-right">
          <p className="text-xs font-bold text-zinc-500">Calories</p>
          <p className="text-lg font-black">{food.calories}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm font-black">
        <Macro label="Protein" value={`${food.protein}g`} />
        <Macro label="Carbs" value={`${food.carbs}g`} />
        <Macro label="Fats" value={`${food.fats}g`} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {food.keyMicronutrients.map((nutrient) => (
          <span key={nutrient} className="rounded-lg bg-sky/15 px-2 py-1 text-xs font-bold text-ink">
            {nutrient}
          </span>
        ))}
      </div>
      <div className="mt-3 grid gap-2 rounded-lg bg-zinc-50 p-3 text-sm leading-5 text-zinc-700">
        <p><span className="font-black text-ink">Why it helps:</span> {food.fitnessBenefit}</p>
        <p><span className="font-black text-ink">Meal use:</span> {food.mealUse}</p>
      </div>
    </div>
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
