create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  goal text check (goal in ('fat-loss', 'belly-fat-reduction', 'muscle-gain', 'maintenance')),
  age integer,
  height_cm integer,
  weight_kg numeric,
  fitness_level text check (fitness_level in ('beginner', 'intermediate', 'athletic')),
  equipment text check (equipment in ('none', 'dumbbells', 'gym')),
  diet_preference text check (diet_preference in ('balanced', 'high-protein', 'vegetarian')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles alter column role set default 'user';
update public.profiles set role = 'user' where role is null;
alter table public.profiles alter column role set not null;
alter table public.profiles alter column goal drop not null;
alter table public.profiles alter column age drop not null;
alter table public.profiles alter column height_cm drop not null;
alter table public.profiles alter column weight_kg drop not null;
alter table public.profiles alter column fitness_level drop not null;
alter table public.profiles alter column equipment drop not null;
alter table public.profiles alter column diet_preference drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles add constraint profiles_role_check check (role in ('user', 'admin'));
  end if;
end $$;

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

create table if not exists public.nutrition_foods (
  id text primary key,
  name text not null,
  category text not null check (category in ('drinks', 'protein', 'carbs', 'healthy-fats', 'meat', 'fish', 'vegetables', 'fruits', 'grains', 'bread', 'rice-dishes', 'pasta', 'noodles', 'soups', 'sauces', 'snacks', 'desserts', 'fast-food', 'restaurant-meals', 'cultural-foods', 'supplements')),
  subcategory text not null,
  serving_size numeric not null,
  serving_unit text not null,
  calories integer not null,
  protein numeric not null,
  carbs numeric not null,
  fats numeric not null,
  sugar numeric not null default 0,
  fibre numeric not null default 0,
  sodium numeric not null default 0,
  caffeine_mg numeric,
  vitamins text[] not null default '{}',
  minerals text[] not null default '{}',
  tags text[] not null default '{}',
  synonyms text[] not null default '{}',
  common_serving_options jsonb not null default '[]'::jsonb,
  preparation_method text not null default 'standard',
  is_drink boolean not null default false,
  is_custom boolean not null default false,
  source text not null check (source in ('seed', 'custom', 'usda', 'open-food-facts', 'barcode', 'restaurant')),
  verified_status text not null check (verified_status in ('verified', 'estimated', 'user')),
  external_provider text,
  external_id text,
  barcode text,
  brand_name text,
  fitness_benefit text not null,
  meal_use text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_custom_foods (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  subcategory text not null,
  serving_size numeric not null,
  serving_unit text not null,
  calories integer not null,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fats numeric not null default 0,
  sugar numeric not null default 0,
  fibre numeric not null default 0,
  sodium numeric not null default 0,
  caffeine_mg numeric,
  vitamins text[] not null default '{}',
  minerals text[] not null default '{}',
  tags text[] not null default '{}',
  synonyms text[] not null default '{}',
  common_serving_options jsonb not null default '[]'::jsonb,
  preparation_method text not null default 'custom',
  is_drink boolean not null default false,
  source text not null default 'custom',
  verified_status text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.favorite_foods (
  user_id uuid not null references auth.users(id) on delete cascade,
  food_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, food_id)
);

create table if not exists public.meal_templates (
  id text primary key,
  name text not null,
  category text not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'drink', 'post-workout')),
  ingredient_food_ids text[] not null default '{}',
  tags text[] not null default '{}',
  description text not null
);

create table if not exists public.micronutrients (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  foods text[] not null default '{}',
  why_it_matters text not null
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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.meal_days enable row level security;
alter table public.meals enable row level security;
alter table public.workout_logs enable row level security;
alter table public.progress_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_programs enable row level security;
alter table public.exercise_library enable row level security;
alter table public.nutrition_foods enable row level security;
alter table public.user_custom_foods enable row level security;
alter table public.favorite_foods enable row level security;
alter table public.meal_templates enable row level security;
alter table public.micronutrients enable row level security;
alter table public.food_logs enable row level security;
alter table public.hydration_logs enable row level security;
alter table public.hydration_adjustments enable row level security;
alter table public.user_state_snapshots enable row level security;

drop policy if exists "Users can manage own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can read profiles" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = 'user');
create policy "Admins can read profiles" on public.profiles for select using (
  public.is_admin()
);
create policy "Admins can manage profiles" on public.profiles for all using (
  public.is_admin()
) with check (
  public.is_admin()
);
drop policy if exists "Users can manage own meal days" on public.meal_days;
drop policy if exists "Users can read own meals" on public.meals;
drop policy if exists "Users can manage own logs" on public.workout_logs;
drop policy if exists "Users can manage own progress" on public.progress_entries;
drop policy if exists "Anyone can read seed workouts" on public.workouts;
drop policy if exists "Anyone can read seed exercises" on public.exercises;
drop policy if exists "Anyone can read workout programs" on public.workout_programs;
drop policy if exists "Anyone can read exercise library" on public.exercise_library;
drop policy if exists "Anyone can read nutrition foods" on public.nutrition_foods;
drop policy if exists "Admins can manage workouts" on public.workouts;
drop policy if exists "Admins can manage exercises" on public.exercises;
drop policy if exists "Admins can manage workout programs" on public.workout_programs;
drop policy if exists "Admins can manage exercise library" on public.exercise_library;
drop policy if exists "Admins can manage nutrition foods" on public.nutrition_foods;
drop policy if exists "Users can manage own custom foods" on public.user_custom_foods;
drop policy if exists "Users can manage own favorite foods" on public.favorite_foods;
drop policy if exists "Anyone can read meal templates" on public.meal_templates;
drop policy if exists "Anyone can read micronutrients" on public.micronutrients;
drop policy if exists "Users can manage own food logs" on public.food_logs;
drop policy if exists "Users can manage own hydration logs" on public.hydration_logs;
drop policy if exists "Users can manage own hydration adjustments" on public.hydration_adjustments;
drop policy if exists "Users can manage own state snapshots" on public.user_state_snapshots;

create policy "Users can manage own meal days" on public.meal_days for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read own meals" on public.meals for select using (
  exists (select 1 from public.meal_days where public.meal_days.id = meal_day_id and public.meal_days.user_id = auth.uid())
);
create policy "Users can manage own logs" on public.workout_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own progress" on public.progress_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Anyone can read seed workouts" on public.workouts for select using (true);
create policy "Anyone can read seed exercises" on public.exercises for select using (true);
create policy "Anyone can read workout programs" on public.workout_programs for select using (true);
create policy "Anyone can read exercise library" on public.exercise_library for select using (true);
create policy "Anyone can read nutrition foods" on public.nutrition_foods for select using (true);
create policy "Admins can manage workouts" on public.workouts for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage exercises" on public.exercises for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage workout programs" on public.workout_programs for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage exercise library" on public.exercise_library for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage nutrition foods" on public.nutrition_foods for all using (public.is_admin()) with check (public.is_admin());
create policy "Users can manage own custom foods" on public.user_custom_foods for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own favorite foods" on public.favorite_foods for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Anyone can read meal templates" on public.meal_templates for select using (true);
create policy "Anyone can read micronutrients" on public.micronutrients for select using (true);
create policy "Users can manage own food logs" on public.food_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own hydration logs" on public.hydration_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own hydration adjustments" on public.hydration_adjustments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own state snapshots" on public.user_state_snapshots for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.workout_programs (id, title, subtitle, goal, level, target_daily_deficit, weekly_fat_loss_estimate, safety_note)
values ('stubborn-belly-fat-killer', 'Stubborn Belly Fat Killer', 'Beginner fat-loss conditioning with simple strength moves', 'belly-fat-reduction', 'beginner', 400, 'About 0.25-0.5 kg per week when paired with nutrition and recovery', 'Avoid extreme calorie deficits. Beginners usually do best with a 300-500 calorie daily deficit.')
on conflict (id) do nothing;

insert into public.micronutrients (name, foods, why_it_matters)
values
  ('Vitamin A', array['Sweet potato','Eggs'], 'Supports immune health and vision.'),
  ('Vitamin B12', array['Eggs','Greek yogurt','Tuna','Salmon'], 'Supports energy metabolism and red blood cells.'),
  ('Vitamin C', array['Banana','Potatoes'], 'Supports tissue repair and iron absorption.'),
  ('Vitamin D', array['Eggs','Salmon'], 'Supports bones, muscles, and immune function.'),
  ('Iron', array['Lentils','Tofu','Oats','Quinoa'], 'Helps transport oxygen for training capacity.'),
  ('Magnesium', array['Oats','Quinoa','Nuts','Chia seeds'], 'Supports muscle and nerve function.'),
  ('Zinc', array['Chicken breast','Quinoa','Nuts'], 'Supports recovery and immune health.'),
  ('Potassium', array['Banana','Sweet potato','Potatoes','Avocado'], 'Supports hydration and muscle contraction.'),
  ('Calcium', array['Greek yogurt','Cottage cheese','Tofu','Chia seeds'], 'Supports bones and muscle contraction.'),
  ('Omega-3', array['Salmon','Tuna','Chia seeds'], 'Supports heart health and recovery.')
on conflict (name) do nothing;
