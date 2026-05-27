import Link from "next/link";
import { Activity, Dumbbell, Home, LineChart } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-soft">
        <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white">
              <Activity size={20} />
            </span>
            <span className="text-xl font-black tracking-normal">FitGoal</span>
          </Link>
        </header>
        <div className="flex-1">{children}</div>
        <nav className="sticky bottom-0 grid grid-cols-3 border-t border-zinc-100 bg-white/95 px-4 py-2 backdrop-blur">
          <Link className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-semibold text-zinc-700" href="/dashboard">
            <Home size={20} /> Home
          </Link>
          <Link className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-semibold text-zinc-700" href="/workouts/today">
            <Dumbbell size={20} /> Workout
          </Link>
          <Link className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-semibold text-zinc-700" href="/progress">
            <LineChart size={20} /> Progress
          </Link>
        </nav>
      </div>
    </main>
  );
}
