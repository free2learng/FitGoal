create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  goal text not null check (goal in ('fat-loss', 'muscle-gain', 'maintenance')),
  age integer not null,
  height_cm integer not null,
  weight_kg numeric not null,
  fitness_level text not null check (fitness_level in ('beginner', 'intermediate', 'athletic')),
  equipment text not null check (equipment in ('none', 'dumbbells', 'gym')),
  diet_preference text not null check (diet_preference in ('balanced', 'high-protein', 'vegetarian')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id text primary key,
  title text not null,
  level text not null,
  goal text not null,
  day integer not null,
  duration_minutes integer not null,
  focus text not null
);

create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_id text not null references public.workouts(id) on delete cascade,
  name text not null,
  sets integer not null,
  reps text not null,
  rest_seconds integer not null,
  tutorial_url text not null,
  position integer not null
);

create table if not exists public.meal_days (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  day integer not null,
  title text not null,
  calories integer not null,
  protein integer not null
);

create table if not exists public.meals (
  id uuid primary key default uuid_generate_v4(),
  meal_day_id uuid not null references public.meal_days(id) on delete cascade,
  name text not null,
  calories integer not null,
  protein integer not null,
  position integer not null
);

create table if not exists public.workout_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id text references public.workouts(id),
  status text not null check (status in ('completed', 'missed', 'rescheduled')),
  scheduled_for date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  weight_kg numeric not null,
  waist_cm numeric not null,
  calories integer not null,
  workouts_completed integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.meal_days enable row level security;
alter table public.meals enable row level security;
alter table public.workout_logs enable row level security;
alter table public.progress_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;

create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can manage own meal days" on public.meal_days for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read own meals" on public.meals for select using (
  exists (select 1 from public.meal_days where public.meal_days.id = meal_day_id and public.meal_days.user_id = auth.uid())
);
create policy "Users can manage own logs" on public.workout_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own progress" on public.progress_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Anyone can read seed workouts" on public.workouts for select using (true);
create policy "Anyone can read seed exercises" on public.exercises for select using (true);
