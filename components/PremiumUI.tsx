"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Droplets, Dumbbell, Flame, Home, LineChart, Play, Plus, Search, Sparkles, Target, Utensils, Video, Waves } from "lucide-react";
import { NumberStepper } from "@/components/NumberStepper";

type TokenTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger";

const toneClasses: Record<TokenTone, string> = {
  primary: "from-fit-primary to-fit-secondary text-white",
  secondary: "from-fit-secondary to-fit-accent text-fit-bg",
  accent: "from-fit-accent to-fit-warning text-fit-bg",
  success: "from-fit-success to-fit-accent text-fit-bg",
  warning: "from-fit-warning to-fit-accent text-fit-bg",
  danger: "from-fit-danger to-fit-warning text-white"
};

export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/programs/stubborn-belly-fat-killer", label: "Plan", icon: Flame },
    { href: "/workouts/today", label: "Workout", icon: Dumbbell },
    { href: "/nutrition/food-library", label: "Food", icon: Utensils },
    { href: "/videos", label: "Videos", icon: Video },
    { href: "/progress", label: "Progress", icon: LineChart }
  ];

  return (
    <nav className="sticky bottom-0 z-40 border-t border-fit-border/70 bg-fit-surface/80 px-2 py-2 shadow-[0_-16px_40px_rgba(10,15,13,0.08)] backdrop-blur-2xl dark:bg-fit-darkSurface/85 sm:px-3">
      <div className="mx-auto grid max-w-4xl grid-cols-6 gap-1 rounded-[28px] bg-fit-muted/70 p-1 dark:bg-white/5">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("/").slice(0, 3).join("/")));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`group flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] text-[9px] font-black transition-all duration-300 active:scale-95 min-[370px]:text-[10px] sm:text-[11px] ${active ? "bg-fit-bg text-fit-primary shadow-sm dark:bg-white dark:text-fit-bg" : "text-fit-mutedText hover:bg-white/70 dark:text-white/60 dark:hover:bg-white/10"}`}>
              <Icon size={18} className={`transition-transform duration-300 ${active ? "-translate-y-0.5 scale-110" : "group-active:scale-90"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function HeroCard({ eyebrow, title, body, action, tone = "primary", icon }: { eyebrow?: string; title: string; body?: string; action?: ReactNode; tone?: TokenTone; icon?: ReactNode }) {
  return (
    <section className={`relative overflow-hidden rounded-[30px] bg-gradient-to-br ${toneClasses[tone]} p-5 shadow-premium sm:rounded-[34px] sm:p-6`}>
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-black/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="text-xs font-black uppercase tracking-[0.18em] opacity-75">{eyebrow}</p>}
            <h1 className="mt-2 text-[clamp(2.05rem,10vw,3.6rem)] font-black leading-[0.92] tracking-normal">{title}</h1>
          </div>
          {icon && <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">{icon}</span>}
        </div>
        {body && <p className="mt-4 max-w-[26rem] text-sm font-bold leading-6 opacity-80">{body}</p>}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </section>
  );
}

export function ProgressRing({ value, size = 92, stroke = 10, label, sublabel, tone = "primary" }: { value: number; size?: number; stroke?: number; label?: string; sublabel?: string; tone?: TokenTone }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  const color = tone === "success" ? "#52e0a1" : tone === "warning" ? "#ffd166" : tone === "accent" ? "#8cf2ff" : "#7c5cff";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-fit-border dark:text-white/10" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute text-center">
        {label && <p className="text-lg font-black leading-none text-fit-text dark:text-white">{label}</p>}
        {sublabel && <p className="mt-1 text-[10px] font-black uppercase tracking-normal text-fit-mutedText dark:text-white/55">{sublabel}</p>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, suffix, icon, tone = "primary" }: { label: string; value: string | number; suffix?: string; icon?: ReactNode; tone?: TokenTone }) {
  return (
    <div className="rounded-[26px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium transition-transform duration-200 active:scale-[0.98] dark:border-white/10 dark:bg-fit-darkElevated">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-fit-mutedText dark:text-white/50">{label}</p>
        {icon && <span className={`grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br ${toneClasses[tone]}`}>{icon}</span>}
      </div>
      <p className="mt-3 text-3xl font-black leading-none text-fit-text dark:text-white">{value}</p>
      {suffix && <p className="mt-1 text-sm font-bold text-fit-mutedText dark:text-white/55">{suffix}</p>}
    </div>
  );
}

export function MissionCard({ title, focus, burn, completed, href = "/workouts/today" }: { title: string; focus: string; burn: number; completed: boolean; href?: string }) {
  return (
    <article className="rounded-[30px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated sm:rounded-[34px] sm:p-5">
      <div className="flex flex-col items-start justify-between gap-4 min-[390px]:flex-row">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-fit-primary dark:text-fit-accent"><Sparkles size={17} /> Today&apos;s mission</p>
          <h2 className="mt-3 text-[clamp(1.8rem,8vw,2.35rem)] font-black leading-none text-fit-text dark:text-white">{title}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-fit-mutedText dark:text-white/60">{focus}</p>
        </div>
        <ProgressRing value={completed ? 100 : 18} label={completed ? "100" : "Go"} sublabel={completed ? "done" : "start"} tone={completed ? "success" : "primary"} />
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-[24px] bg-fit-muted p-3 dark:bg-white/5 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
        <p className="text-sm font-black text-fit-text dark:text-white">{burn} kcal estimated burn</p>
        <Link href={href} className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-fit-text px-5 text-sm font-black text-white shadow-sm transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
          <Play size={16} fill="currentColor" /> Start
        </Link>
      </div>
    </article>
  );
}

export function CalorieBalanceCard({ eaten, burned, remaining, status, percent }: { eaten: number; burned: number; remaining: number; status: string; percent: number }) {
  return (
    <article className="rounded-[30px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated sm:rounded-[34px] sm:p-5">
      <div className="flex flex-col items-start justify-between gap-4 min-[390px]:flex-row min-[390px]:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-fit-danger"><Flame size={17} /> Calorie balance</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-fit-text dark:text-white">{status}</h2>
        </div>
        <ProgressRing value={percent} label={`${Math.min(100, Math.max(0, percent))}%`} sublabel="today" tone={percent > 95 ? "warning" : "accent"} />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-3">
        <MiniStat label="Eaten" value={eaten} />
        <MiniStat label="Burned" value={burned} />
        <MiniStat label="Left" value={remaining} />
      </div>
    </article>
  );
}

export function ProteinProgressCard({ eaten, target, perMeal }: { eaten: number; target: number; perMeal: number }) {
  const remaining = Math.max(0, target - eaten);
  const percent = target ? Math.min(100, Math.round((eaten / target) * 100)) : 0;
  return (
    <article className="rounded-[30px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated sm:rounded-[34px] sm:p-5">
      <div className="flex flex-col items-start justify-between gap-4 min-[390px]:flex-row min-[390px]:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-fit-primary"><Target size={17} /> Protein goal</p>
          <h2 className="mt-2 text-2xl font-black text-fit-text dark:text-white">You&apos;re {remaining}g away.</h2>
          <p className="mt-1 text-sm font-bold text-fit-mutedText dark:text-white/55">Aim for around {perMeal}g protein per meal today.</p>
        </div>
        <ProgressRing value={percent} label={`${eaten}g`} sublabel={`/ ${target}g`} tone="primary" />
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-fit-muted dark:bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-fit-primary to-fit-accent transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

export function HydrationTracker({ logged, target, onAdd }: { logged: number; target: number; onAdd?: (amount: number) => void }) {
  const [customAmount, setCustomAmount] = useState(250);
  const remaining = Math.max(0, target - logged);
  const percent = target ? Math.min(100, Math.round((logged / target) * 100)) : 0;
  const quickAdds = [250, 330, 500, 750, 1000];
  return (
    <article className="relative overflow-hidden rounded-[30px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated sm:rounded-[34px] sm:p-5">
      <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-fit-accent/25 to-transparent transition-all duration-700" style={{ transform: `translateY(${100 - percent}%)` }} />
      <div className="relative">
        <div className="flex flex-col items-start justify-between gap-4 min-[390px]:flex-row">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-fit-secondary"><Droplets size={17} /> Hydration</p>
            <h2 className="mt-2 text-2xl font-black text-fit-text dark:text-white">{remaining}ml left</h2>
            <p className="mt-1 text-sm font-bold text-fit-mutedText dark:text-white/55">{logged}ml logged of {target}ml.</p>
          </div>
          <ProgressRing value={percent} label={`${percent}%`} sublabel="water" tone="accent" />
        </div>
        {onAdd && (
          <>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {quickAdds.map((amount) => (
                <button key={amount} onClick={() => onAdd(amount)} className="shrink-0 rounded-[18px] bg-fit-text px-4 py-3 text-xs font-black text-white transition-transform active:scale-95 dark:bg-white dark:text-fit-bg">
                  +{amount >= 1000 ? "1L" : `${amount}ml`}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-2 min-[390px]:grid-cols-[1fr_auto] min-[390px]:items-end">
              <NumberStepper label="Custom water" value={customAmount} onChange={setCustomAmount} min={50} max={2500} step={50} unit="ml" />
              <button onClick={() => onAdd(customAmount)} className="h-14 rounded-[22px] bg-fit-secondary px-5 text-sm font-black text-fit-bg transition-transform active:scale-95">
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export function AchievementBadge({ label, detail, icon = <Sparkles size={16} /> }: { label: string; detail: string; icon?: ReactNode }) {
  return (
    <div className="inline-flex min-w-[150px] items-center gap-3 rounded-[22px] border border-fit-border bg-fit-surfaceElevated px-3 py-3 shadow-sm dark:border-white/10 dark:bg-white/5">
      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-fit-accent text-fit-bg">{icon}</span>
      <span>
        <span className="block text-sm font-black text-fit-text dark:text-white">{label}</span>
        <span className="block text-xs font-bold text-fit-mutedText dark:text-white/50">{detail}</span>
      </span>
    </div>
  );
}

export function FoodSearchCard({ query, onQueryChange, children }: { query: string; onQueryChange: (value: string) => void; children?: ReactNode }) {
  return (
    <article className="relative rounded-[32px] border border-fit-border bg-fit-surfaceElevated p-4 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
      <div className="relative">
        <Search className="absolute left-4 top-4 text-fit-mutedText" size={20} />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search eggs, latte, cauliflower..." className="h-14 w-full rounded-[24px] border border-fit-border bg-fit-muted pl-12 pr-4 text-base font-black text-fit-text outline-none transition focus:border-fit-primary focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10" />
      </div>
      {children}
    </article>
  );
}

export function FoodLogButton({ logged, disabled, children = "Log" }: { logged: boolean; disabled?: boolean; children?: ReactNode }) {
  return (
    <span className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-[18px] text-sm font-black transition-all duration-300 ${logged ? "scale-[1.02] bg-fit-success text-fit-bg shadow-[0_0_0_6px_rgba(82,224,161,0.14)]" : "bg-fit-text text-white active:scale-95 dark:bg-white dark:text-fit-bg"} ${disabled ? "opacity-80" : ""}`}>
      {logged ? <><Check size={16} /> Logged</> : children}
    </span>
  );
}

export function ExerciseStoryCard({ name, meta, calories, difficulty, muscles, action, children }: { name: string; meta: string; calories: string | number; difficulty: string; muscles: string[]; action?: ReactNode; children?: ReactNode }) {
  return (
    <article className="min-w-[82%] snap-center overflow-hidden rounded-[34px] border border-fit-border bg-fit-surfaceElevated shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
      <div className="relative h-44 bg-gradient-to-br from-fit-text via-fit-primary to-fit-accent p-4 text-white">
        <div className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-3xl bg-white/20 backdrop-blur">
          <Dumbbell size={24} />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">{difficulty}</p>
          <h3 className="mt-1 text-3xl font-black leading-none">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Plan" value={meta} />
          <MiniStat label="Burn" value={`${calories} cal`} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {muscles.map((muscle) => <span key={muscle} className="shrink-0 rounded-full bg-fit-muted px-3 py-1 text-xs font-black text-fit-mutedText dark:bg-white/5 dark:text-white/55">{muscle}</span>)}
        </div>
        {children}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </article>
  );
}

export function ToastNotification({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-5 right-5 z-50 mx-auto flex max-w-md animate-toast-in items-center gap-3 rounded-[24px] bg-fit-text px-4 py-4 text-sm font-black text-white shadow-premium dark:bg-white dark:text-fit-bg">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-fit-success text-fit-bg"><Check size={17} /></span>
      {message}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[20px] bg-fit-muted p-3 dark:bg-white/5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-fit-mutedText dark:text-white/45">{label}</p>
      <p className="mt-1 text-lg font-black leading-none text-fit-text dark:text-white">{value}</p>
    </div>
  );
}

export { Plus, Waves };
