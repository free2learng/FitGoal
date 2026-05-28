import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-fit-bg px-4 py-4 text-fit-text dark:text-white sm:px-6 sm:py-6">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col justify-between rounded-[34px] border border-fit-border bg-fit-surfaceElevated px-5 py-7 shadow-premium backdrop-blur-2xl dark:border-white/10 dark:bg-fit-darkElevated sm:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[18px] bg-fit-success/15 px-3 py-2 text-sm font-bold text-fit-text dark:text-white">
            <CheckCircle2 size={18} /> Beginner friendly
          </div>
          <h1 className="mt-8 text-[clamp(3.5rem,16vw,8rem)] font-black leading-none tracking-normal text-fit-text dark:text-white">FitGoal</h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-7 text-fit-mutedText">
            Build a workout and meal plan around your body, goal, schedule, and starting point.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2 text-center text-sm font-bold min-[360px]:grid-cols-3">
            <div className="rounded-[20px] bg-fit-secondary/15 p-3">Workouts</div>
            <div className="rounded-[20px] bg-fit-warning/25 p-3">Meals</div>
            <div className="rounded-[20px] bg-fit-success/20 p-3">Progress</div>
          </div>
          <Link href="/account" className="flex h-14 items-center justify-center gap-2 rounded-[24px] bg-fit-text px-5 text-base font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
            Start FitGoal <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
