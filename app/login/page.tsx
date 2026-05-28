import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";
import { HeroCard } from "@/components/PremiumUI";
import { signInWithGoogle } from "@/app/login/actions";
import { LoginButton } from "@/app/login/LoginButton";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

  return (
    <main className="min-h-screen bg-fit-bg px-5 py-6 text-fit-text dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center gap-5">
        <HeroCard
          eyebrow="FitGoal account"
          title="Save the glow-up."
          body="Use Google to sync progress, protect your logs, and unlock admin access if your profile has the admin role."
          icon={<Activity size={24} />}
        />

        <section className="rounded-[34px] border border-fit-border bg-fit-surfaceElevated p-5 shadow-premium dark:border-white/10 dark:bg-fit-darkElevated">
          <p className="flex items-center gap-2 text-sm font-black text-fit-primary"><ShieldCheck size={17} /> Secure login</p>
          <h1 className="mt-2 text-3xl font-black leading-none">Continue with Google</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-fit-mutedText dark:text-white/55">
            Supabase handles OAuth and session cookies. FitGoal never sees your Google password.
          </p>

          {!configured && (
            <p className="mt-4 rounded-[20px] bg-fit-warning/20 p-3 text-sm font-black text-fit-text dark:text-white">
              Supabase env variables are missing. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
            </p>
          )}

          {params.error && (
            <p className="mt-4 rounded-[20px] bg-fit-danger/15 p-3 text-sm font-black text-fit-danger">
              Login error: {decodeURIComponent(params.error)}
            </p>
          )}

          <form action={signInWithGoogle} className="mt-5">
            <LoginButton />
          </form>

          <Link href="/account" className="mt-3 flex h-12 items-center justify-center rounded-[20px] bg-fit-muted text-sm font-black text-fit-text transition-transform active:scale-95 dark:bg-white/5 dark:text-white">
            Use as guest
          </Link>
        </section>
      </div>
    </main>
  );
}
