"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="flex h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-fit-text text-sm font-black text-white shadow-premium transition-transform active:scale-95 disabled:opacity-70 dark:bg-white dark:text-fit-bg">
      {pending ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
      {pending ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
