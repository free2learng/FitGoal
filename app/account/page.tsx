"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Cloud, LogOut, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { loadAccount, loadState, performanceSummary, saveAccount, saveState } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { FitGoalAccount, FitGoalState } from "@/lib/types";

export default function AccountPage() {
  const [account, setAccount] = useState<FitGoalAccount | null>(null);
  const [state, setState] = useState<FitGoalState | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const saved = loadState();
      setState(saved);
      setAccount(saved?.account ?? loadAccount());

      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const googleAccount = saveAccount({
          mode: "google",
          userId: data.user.id,
          email: data.user.email ?? undefined,
          name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name,
          startedAt: saved?.account?.startedAt ?? new Date().toISOString(),
          lastSyncedAt: new Date().toISOString()
        });
        setAccount(googleAccount);
        if (saved) {
          const next = { ...saved, account: googleAccount };
          saveState(next);
          setState(next);
        }
        setMessage("Google account connected. Your FitGoal data will sync for performance analysis.");
      }
    }
    void init();
  }, []);

  async function continueWithGoogle() {
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add Supabase environment variables to enable Google sign-in.");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` }
    });
  }

  function continueAsGuest() {
    const guestAccount = saveAccount({
      mode: "guest",
      guestId: account?.guestId ?? crypto.randomUUID(),
      startedAt: account?.startedAt ?? new Date().toISOString()
    });
    setAccount(guestAccount);
    const saved = loadState();
    if (saved) {
      const next = { ...saved, account: guestAccount };
      saveState(next);
      setState(next);
    }
    setMessage("Guest mode enabled. Your data stays on this device until you connect Google.");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    continueAsGuest();
  }

  const summary = state ? performanceSummary(state) : null;
  const connected = account?.mode === "google";

  return (
    <AppShell>
      <section className="space-y-5 px-5 py-5">
        <div className="rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-bold text-mint">Account</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Save your FitGoal progress.</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">Use Google to sync performance data, or continue as a guest on this device.</p>
        </div>

        {message && <p className="rounded-lg bg-mint/20 p-3 text-sm font-bold text-ink">{message}</p>}

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-mint/20 text-leaf">
              {connected ? <Cloud size={20} /> : <UserRound size={20} />}
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-500">Current mode</p>
              <h2 className="mt-1 text-2xl font-black text-ink">{connected ? "Google account" : "Guest"}</h2>
              <p className="mt-1 text-sm text-zinc-600">{connected ? account?.email : "Stored locally on this browser"}</p>
            </div>
          </div>
        </article>

        <div className="grid gap-3">
          <button onClick={continueWithGoogle} className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-black text-white">
            Continue with Google <ArrowRight size={18} />
          </button>
          <button onClick={continueAsGuest} className="flex min-h-14 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-black text-ink">
            Use as guest
          </button>
          {connected && (
            <button onClick={signOut} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-peach/30 px-4 text-sm font-black text-ink">
              <LogOut size={17} /> Sign out
            </button>
          )}
        </div>

        <article className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-leaf"><CheckCircle2 size={17} /> Performance data saved</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Food logs" value={summary?.totalFoodLogs ?? 0} />
            <Stat label="Hydration logs" value={summary?.totalHydrationLogs ?? 0} />
            <Stat label="Workouts done" value={summary?.workoutsCompleted ?? 0} />
            <Stat label="Avg protein" value={`${summary?.averageProteinLogged ?? 0}g`} />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">Google users sync a secure snapshot for analysis. Guest users can still use FitGoal, but data stays in this browser.</p>
        </article>

        <Link href={state ? "/dashboard" : "/onboarding"} className="flex h-12 items-center justify-center rounded-lg bg-leaf text-sm font-black text-white">
          {state ? "Back to dashboard" : "Start setup"}
        </Link>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-xs font-bold uppercase tracking-normal text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-black text-ink">{value}</p>
    </div>
  );
}
