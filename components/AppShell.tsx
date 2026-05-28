import Link from "next/link";
import { Activity, UserRound } from "lucide-react";
import { BottomNav } from "@/components/PremiumUI";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-fit-bg text-fit-text">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-fit-surface/65 shadow-soft backdrop-blur-2xl dark:bg-fit-darkSurface/70">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-fit-border bg-fit-surface/80 px-5 py-4 backdrop-blur-2xl dark:bg-fit-darkSurface/80">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-fit-primary to-fit-secondary text-white shadow-sm">
              <Activity size={20} />
            </span>
            <span className="text-xl font-black tracking-normal text-fit-text dark:text-white">FitGoal</span>
          </Link>
          <Link href="/account" className="grid h-10 w-10 place-items-center rounded-2xl bg-fit-muted text-fit-text transition-transform active:scale-95 dark:text-white" aria-label="Account">
            <UserRound size={18} />
          </Link>
        </header>
        <div className="flex-1">{children}</div>
        <BottomNav />
      </div>
    </main>
  );
}
