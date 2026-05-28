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

create table if not exists public.workout_programs (
  id text primary key,
  title text not null,
  subtitle text not null,
  goal text not null check (goal in ('fat-loss', 'belly-fat-reduction', 'muscle-gain', 'maintenance')),
  level text not null check (level in ('beginner', 'intermediate', 'athletic')),
  target_daily_deficit integer,
  weekly_fat_loss_estimate text,
  safety_note text
);

create table if not exists public.exercise_library (
  id uuid primary key default uuid_generate_v4(),
  program_id text references public.workout_programs(id) on delete cascade,
  name text not null,
  sets integer not null,
  reps text not null,
  rest_seconds integer not null,
  difficulty text not null,
  target_muscles text[] not null default '{}',
  demo_video_url text not null,
  animation_url text,
  met_value numeric not null,
  duration_minutes_per_set numeric not null,
  instructions text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  beginner_tips text[] not null default '{}'
);
