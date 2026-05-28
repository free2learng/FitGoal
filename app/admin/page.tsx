import Link from "next/link";
import { redirect } from "next/navigation";
import { Database, Dumbbell, LogOut, Plus, Search, ShieldCheck, UsersRound, Video } from "lucide-react";
import { logout } from "@/app/login/actions";
import { deleteExercise, deleteFood, deleteProgram, deleteVideo, upsertExercise, upsertFood, upsertProgram, upsertVideo } from "@/app/admin/actions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Tab = "foods" | "exercises" | "programs" | "videos" | "users";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: Tab; q?: string }> }) {
  const params = await searchParams;
  const tab = params.tab ?? "foods";
  const q = params.q ?? "";
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase?.auth.getUser() ?? { data: { user: null } };
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase!.from("profiles").select("role,email,full_name").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard?permission=denied");

  const admin = createSupabaseAdminClient();
  const [foods, exercises, programs, videos, users] = await Promise.all([
    admin.from("nutrition_foods").select("*").ilike("name", `%${q}%`).order("name").limit(40),
    admin.from("exercise_library").select("*").ilike("name", `%${q}%`).order("name").limit(40),
    admin.from("workout_programs").select("*").ilike("title", `%${q}%`).order("title").limit(40),
    admin.from("video_library").select("*").ilike("title", `%${q}%`).order("created_at", { ascending: false }).limit(40),
    admin.from("profiles").select("id,email,full_name,role,goal,created_at").or(q ? `email.ilike.%${q}%,full_name.ilike.%${q}%` : "role.ilike.%%").order("created_at", { ascending: false }).limit(50)
  ]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7fb] px-4 py-5 text-[#0b0f18] sm:px-5">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-[32px] bg-[#0b0f18] p-5 text-white shadow-premium">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-fit-accent"><ShieldCheck size={18} /> Admin control</p>
              <h1 className="mt-2 text-[clamp(2rem,9vw,3.5rem)] font-black leading-none">FitGoal Admin</h1>
              <p className="mt-2 text-sm font-bold text-white/60">{profile?.email ?? user.email}</p>
            </div>
            <form action={logout}>
              <button className="flex h-11 items-center gap-2 rounded-[18px] bg-white px-4 text-sm font-black text-[#0b0f18]"><LogOut size={16} /> Logout</button>
            </form>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto rounded-[28px] bg-white p-2 shadow-sm">
          <AdminTab href="/admin?tab=foods" active={tab === "foods"} icon={<Database size={17} />} label="Foods" />
          <AdminTab href="/admin?tab=exercises" active={tab === "exercises"} icon={<Dumbbell size={17} />} label="Exercises" />
          <AdminTab href="/admin?tab=programs" active={tab === "programs"} icon={<Plus size={17} />} label="Programs" />
          <AdminTab href="/admin?tab=videos" active={tab === "videos"} icon={<Video size={17} />} label="Videos" />
          <AdminTab href="/admin?tab=users" active={tab === "users"} icon={<UsersRound size={17} />} label="Users" />
        </nav>

        <form className="relative">
          <input type="hidden" name="tab" value={tab} />
          <Search className="absolute left-4 top-4 text-zinc-400" size={18} />
          <input name="q" defaultValue={q} placeholder="Search admin data..." className="h-14 w-full rounded-[24px] border border-zinc-200 bg-white pl-12 pr-4 text-sm font-black outline-none focus:border-fit-primary" />
        </form>

        {tab === "foods" && <FoodsPanel rows={foods.data ?? []} />}
        {tab === "exercises" && <ExercisesPanel rows={exercises.data ?? []} programs={programs.data ?? []} />}
        {tab === "programs" && <ProgramsPanel rows={programs.data ?? []} />}
        {tab === "videos" && <VideosPanel rows={videos.data ?? []} />}
        {tab === "users" && <UsersPanel rows={users.data ?? []} />}
      </div>
    </main>
  );
}

function AdminTab({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className={`flex h-11 shrink-0 items-center gap-2 rounded-[18px] px-4 text-sm font-black ${active ? "bg-[#0b0f18] text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
      {icon} {label}
    </Link>
  );
}

function FoodsPanel({ rows }: { rows: any[] }) {
  return (
    <AdminGrid title="Food database" form={<FoodForm />}>
      {rows.map((food) => (
        <AdminRow key={food.id} title={food.name} meta={`${food.category} / ${food.subcategory} - ${food.calories} cal - ${food.protein}g protein`}>
          <FoodForm food={food} compact />
          <DeleteButton action={deleteFood} id={food.id} label="Delete food" />
        </AdminRow>
      ))}
    </AdminGrid>
  );
}

function ExercisesPanel({ rows, programs }: { rows: any[]; programs: any[] }) {
  return (
    <AdminGrid title="Exercise database" form={<ExerciseForm programs={programs} />}>
      {rows.map((exercise) => (
        <AdminRow key={exercise.id} title={exercise.name} meta={`${exercise.difficulty} - ${exercise.sets} sets - MET ${exercise.met_value}`}>
          <ExerciseForm exercise={exercise} programs={programs} compact />
          <DeleteButton action={deleteExercise} id={exercise.id} label="Delete exercise" />
        </AdminRow>
      ))}
    </AdminGrid>
  );
}

function ProgramsPanel({ rows }: { rows: any[] }) {
  return (
    <AdminGrid title="Workout programs" form={<ProgramForm />}>
      {rows.map((program) => (
        <AdminRow key={program.id} title={program.title} meta={`${program.goal} / ${program.level}`}>
          <ProgramForm program={program} compact />
          <DeleteButton action={deleteProgram} id={program.id} label="Delete program" />
        </AdminRow>
      ))}
    </AdminGrid>
  );
}

function VideosPanel({ rows }: { rows: any[] }) {
  return (
    <AdminGrid title="Video hub" form={<VideoForm />}>
      {rows.map((video) => (
        <AdminRow key={video.id} title={video.title} meta={`${video.category} / ${video.body_part} - ${video.duration_seconds}s - ${video.difficulty}`}>
          <VideoForm video={video} compact />
          <DeleteButton action={deleteVideo} id={video.id} label="Delete video" />
        </AdminRow>
      ))}
    </AdminGrid>
  );
}

function UsersPanel({ rows }: { rows: any[] }) {
  return (
    <section className="rounded-[32px] bg-white p-5 shadow-premium">
      <h2 className="text-2xl font-black">Users</h2>
      <p className="mt-1 text-sm font-bold text-zinc-500">Shows account and goal context only. Private notes and raw health details are not exposed here.</p>
      <div className="mt-4 grid gap-3">
        {rows.map((user) => (
          <div key={user.id} className="rounded-[24px] bg-zinc-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black">{user.full_name || user.email || user.id}</p>
                <p className="text-sm font-bold text-zinc-500">{user.email ?? "No email"} - {user.goal ?? "No goal yet"}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-zinc-600">{user.role}</span>
            </div>
            <p className="mt-2 text-xs font-bold text-zinc-400">Signed up {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminGrid({ title, form, children }: { title: string; form: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-[32px] bg-white p-5 shadow-premium">
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-1 text-sm font-bold text-zinc-500">Add new, or paste an existing ID to update.</p>
        <div className="mt-4">{form}</div>
      </aside>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function AdminRow({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <article className="rounded-[28px] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{title}</h3>
          <p className="text-sm font-bold text-zinc-500">{meta}</p>
        </div>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-black text-fit-primary">Edit</summary>
        <div className="mt-3">{children}</div>
      </details>
    </article>
  );
}

function FoodForm({ food, compact = false }: { food?: any; compact?: boolean }) {
  return (
    <form action={upsertFood} className="grid gap-2">
      <Input name="id" label="ID" defaultValue={food?.id} placeholder="auto if blank" />
      <Input name="name" label="Name" defaultValue={food?.name} required />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input name="category" label="Category" defaultValue={food?.category ?? "protein"} />
        <Input name="subcategory" label="Subcategory" defaultValue={food?.subcategory} />
        <Input name="serving_size" label="Serving size" type="number" step="0.1" defaultValue={food?.serving_size ?? 1} />
        <Input name="serving_unit" label="Unit" defaultValue={food?.serving_unit ?? "serving"} />
        <Input name="calories" label="Calories" type="number" defaultValue={food?.calories ?? 0} />
        <Input name="protein" label="Protein" type="number" step="0.1" defaultValue={food?.protein ?? 0} />
        <Input name="carbs" label="Carbs" type="number" step="0.1" defaultValue={food?.carbs ?? 0} />
        <Input name="fats" label="Fats" type="number" step="0.1" defaultValue={food?.fats ?? 0} />
      </div>
      {!compact && <Input name="preparation_method" label="Preparation" defaultValue={food?.preparation_method} />}
      <Input name="vitamins" label="Vitamins" defaultValue={food?.vitamins?.join(", ")} />
      <Input name="minerals" label="Minerals" defaultValue={food?.minerals?.join(", ")} />
      <button className="mt-2 h-11 rounded-[18px] bg-[#0b0f18] text-sm font-black text-white">{food ? "Save food" : "Add food"}</button>
    </form>
  );
}

function ExerciseForm({ exercise, programs, compact = false }: { exercise?: any; programs: any[]; compact?: boolean }) {
  return (
    <form action={upsertExercise} className="grid gap-2">
      <input type="hidden" name="id" value={exercise?.id ?? ""} />
      <Input name="name" label="Name" defaultValue={exercise?.name} required />
      <label className="text-sm font-black">Program
        <select name="program_id" defaultValue={exercise?.program_id ?? programs[0]?.id ?? "stubborn-belly-fat-killer"} className="mt-1 h-11 w-full rounded-[16px] border border-zinc-200 px-3 font-bold">
          {programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}
        </select>
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input name="sets" label="Sets" type="number" defaultValue={exercise?.sets ?? 3} />
        <Input name="reps" label="Reps/duration" defaultValue={exercise?.reps ?? "10"} />
        <Input name="rest_seconds" label="Rest sec" type="number" defaultValue={exercise?.rest_seconds ?? 45} />
        <Input name="met_value" label="MET" type="number" step="0.1" defaultValue={exercise?.met_value ?? 3} />
      </div>
      <Input name="difficulty" label="Difficulty" defaultValue={exercise?.difficulty ?? "beginner"} />
      <Input name="target_muscles" label="Target muscles" defaultValue={exercise?.target_muscles?.join(", ")} />
      <Input name="demo_video_url" label="Demo video URL" defaultValue={exercise?.demo_video_url} />
      {!compact && <Input name="animation_url" label="Animation URL" defaultValue={exercise?.animation_url} />}
      <Input name="duration_minutes_per_set" label="Minutes per set" type="number" step="0.1" defaultValue={exercise?.duration_minutes_per_set ?? 1} />
      <button className="mt-2 h-11 rounded-[18px] bg-[#0b0f18] text-sm font-black text-white">{exercise ? "Save exercise" : "Add exercise"}</button>
    </form>
  );
}

function ProgramForm({ program, compact = false }: { program?: any; compact?: boolean }) {
  return (
    <form action={upsertProgram} className="grid gap-2">
      <Input name="id" label="ID" defaultValue={program?.id} required />
      <Input name="title" label="Title" defaultValue={program?.title} required />
      <Input name="subtitle" label="Subtitle" defaultValue={program?.subtitle} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input name="goal" label="Goal" defaultValue={program?.goal ?? "fat-loss"} />
        <Input name="level" label="Level" defaultValue={program?.level ?? "beginner"} />
        <Input name="target_daily_deficit" label="Deficit" type="number" defaultValue={program?.target_daily_deficit ?? 0} />
      </div>
      {!compact && <Input name="weekly_fat_loss_estimate" label="Weekly estimate" defaultValue={program?.weekly_fat_loss_estimate} />}
      <Input name="safety_note" label="Safety note" defaultValue={program?.safety_note} />
      <button className="mt-2 h-11 rounded-[18px] bg-[#0b0f18] text-sm font-black text-white">{program ? "Save program" : "Add program"}</button>
    </form>
  );
}

function VideoForm({ video, compact = false }: { video?: any; compact?: boolean }) {
  return (
    <form action={upsertVideo} className="grid gap-2">
      <Input name="id" label="ID" defaultValue={video?.id} placeholder="auto if blank" />
      <Input name="title" label="Title" defaultValue={video?.title} required />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input name="category" label="Category" defaultValue={video?.category ?? "Full body"} />
        <Input name="body_part" label="Body part" defaultValue={video?.body_part ?? "Full body"} />
        <Input name="difficulty" label="Difficulty" defaultValue={video?.difficulty ?? "beginner"} />
        <Input name="duration_seconds" label="Seconds" type="number" defaultValue={video?.duration_seconds ?? 60} />
        <Input name="coach_name" label="Coach" defaultValue={video?.coach_name ?? "FitGoal Coach"} />
        <Input name="like_count" label="Likes" type="number" defaultValue={video?.like_count ?? 0} />
      </div>
      <Input name="thumbnail_url" label="Thumbnail URL" defaultValue={video?.thumbnail_url} />
      <Input name="video_url" label="Video URL" defaultValue={video?.video_url} required />
      <Input name="tags" label="Tags" defaultValue={video?.tags?.join(", ")} />
      {!compact && (
        <>
          <Input name="calories_estimate" label="Calories estimate" type="number" defaultValue={video?.calories_estimate ?? ""} />
          <Input name="related_exercise_id" label="Related exercise ID" defaultValue={video?.related_exercise_id ?? ""} />
          <Input name="related_food_id" label="Related food ID" defaultValue={video?.related_food_id ?? ""} />
        </>
      )}
      <button className="mt-2 h-11 rounded-[18px] bg-[#0b0f18] text-sm font-black text-white">{video ? "Save video" : "Add video"}</button>
    </form>
  );
}

function DeleteButton({ action, id, label }: { action: (formData: FormData) => Promise<void>; id: string; label: string }) {
  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="id" value={id} />
      <button className="h-10 rounded-[16px] bg-fit-danger/15 px-4 text-sm font-black text-fit-danger">{label}</button>
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="text-sm font-black">{label}
      <input className="mt-1 h-11 w-full rounded-[16px] border border-zinc-200 px-3 font-bold outline-none focus:border-fit-primary" {...inputProps} />
    </label>
  );
}
