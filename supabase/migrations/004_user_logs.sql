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

create table if not exists public.food_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  status text not null check (status in ('eaten', 'planned')),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'drink', 'post-workout')),
  food_id text,
  food_name text not null,
  serving text not null,
  serving_multiplier numeric not null default 1,
  calories integer not null,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fats numeric not null default 0,
  sugar numeric not null default 0,
  fibre numeric not null default 0,
  sodium numeric not null default 0,
  caffeine_mg numeric,
  key_micronutrients text[] not null default '{}',
  source text not null check (source in ('library', 'custom', 'template', 'combination')),
  created_at timestamptz not null default now()
);

create table if not exists public.hydration_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  drink_type text not null check (drink_type in ('water', 'sparkling water', 'tea', 'coffee', 'milk', 'electrolyte drink', 'protein shake')),
  amount_ml integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.hydration_adjustments (
  user_id uuid not null references auth.users(id) on delete cascade,
  adjustment_date date not null,
  adjustment text not null check (adjustment in ('workout-day', 'hot-weather', 'high-sweat')),
  created_at timestamptz not null default now(),
  primary key (user_id, adjustment_date, adjustment)
);

create table if not exists public.user_state_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  performance_summary jsonb not null,
  updated_at timestamptz not null default now()
);
