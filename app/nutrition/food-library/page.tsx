import Link from "next/link";
import { ArrowLeft, Beef, Bone, Carrot, Droplets, HeartPulse, Wheat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { micronutrients, nutritionFoods } from "@/lib/program-data";
import { FoodCategory } from "@/lib/types";

const categories: { id: FoodCategory; title: string; icon: React.ReactNode; description: string }[] = [
  { id: "protein", title: "Protein", icon: <Beef size={19} />, description: "Supports muscle repair, fullness, and recovery." },
  { id: "carbs", title: "Carbs", icon: <Wheat size={19} />, description: "Fuel training and support consistent energy." },
  { id: "healthy-fats", title: "Healthy fats", icon: <Droplets size={19} />, description: "Support hormones, joints, and meal satisfaction." }
];

export default function FoodLibraryPage() {
  return (
    <AppShell>
      <section className="space-y-5 px-5 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black text-zinc-600">
          <ArrowLeft size={18} /> Dashboard
        </Link>
        <div className="rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-bold text-mint">Nutrition library</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Food choices that support training.</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">Use this as a simple beginner reference for calories, macros, vitamins, minerals, and meal ideas.</p>
        </div>

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
                <div key={food.name} className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
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

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p>{value}</p>
    </div>
  );
}
