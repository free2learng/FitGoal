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
