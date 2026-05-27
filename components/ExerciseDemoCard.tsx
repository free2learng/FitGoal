import { Dumbbell, ExternalLink, Film, Target, TriangleAlert } from "lucide-react";

type ExerciseDemoCardProps = {
  exerciseName: string;
  videoUrl: string;
  animationUrl?: string;
  targetMuscles: string[];
  instructions: string[];
  commonMistakes: string[];
  beginnerTips: string[];
};

export function ExerciseDemoCard({ exerciseName, videoUrl, animationUrl, targetMuscles, instructions, commonMistakes, beginnerTips }: ExerciseDemoCardProps) {
  return (
    <article className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-mint/15 text-leaf">
          <Dumbbell size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-ink">{exerciseName}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {targetMuscles.map((muscle) => (
              <span key={muscle} className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-700">
                {muscle}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
        {animationUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={animationUrl} alt={`${exerciseName} animation`} className="h-40 w-full object-cover" />
        ) : (
          <div className="grid h-40 place-items-center bg-gradient-to-br from-zinc-50 to-mint/10 text-center">
            <div>
              <Film className="mx-auto text-leaf" size={26} />
              <p className="mt-2 text-sm font-black text-ink">Animation placeholder</p>
              <p className="text-xs text-zinc-500">Add a GIF URL later</p>
            </div>
          </div>
        )}
      </div>

      <a href={videoUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-black text-white">
        Watch demo video <ExternalLink size={16} />
      </a>

      <div className="mt-4 grid gap-3">
        <InfoBlock icon={<Target size={16} />} title="How to do it" items={instructions} />
        <InfoBlock icon={<TriangleAlert size={16} />} title="Common mistakes" items={commonMistakes} tone="warning" />
        <InfoBlock title="Beginner tips" items={beginnerTips} tone="tip" />
      </div>
    </article>
  );
}

function InfoBlock({ icon, title, items, tone = "default" }: { icon?: React.ReactNode; title: string; items: string[]; tone?: "default" | "warning" | "tip" }) {
  const styles = tone === "warning" ? "bg-peach/20 text-zinc-800" : tone === "tip" ? "bg-sky/15 text-zinc-800" : "bg-zinc-50 text-zinc-700";
  return (
    <div className={`rounded-lg p-3 ${styles}`}>
      <p className="flex items-center gap-2 text-sm font-black text-ink">
        {icon}
        {title}
      </p>
      <ul className="mt-2 space-y-1 text-sm leading-5">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
