import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between bg-white px-6 py-8 shadow-soft">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-mint/15 px-3 py-2 text-sm font-bold text-leaf">
            <CheckCircle2 size={18} /> Beginner friendly
          </div>
          <h1 className="mt-8 text-5xl font-black leading-none tracking-normal text-ink">FitGoal</h1>
          <p className="mt-5 text-lg leading-7 text-zinc-600">
            Build a workout and meal plan around your body, goal, schedule, and starting point.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center text-sm font-bold">
            <div className="rounded-lg bg-sky/15 p-3">Workouts</div>
            <div className="rounded-lg bg-peach/20 p-3">Meals</div>
            <div className="rounded-lg bg-mint/15 p-3">Progress</div>
          </div>
          <Link href="/onboarding" className="flex h-14 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-base font-black text-white">
            Start quiz <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
