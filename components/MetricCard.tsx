export function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-normal text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink">{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{hint}</p>
    </div>
  );
}
