create table if not exists public.video_library (
  id text primary key,
  title text not null,
  category text not null,
  body_part text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'athletic')),
  duration_seconds integer not null default 60,
  thumbnail_url text not null default '',
  video_url text not null,
  coach_name text not null default 'FitGoal Coach',
  tags text[] not null default '{}',
  calories_estimate integer,
  related_exercise_id text,
  related_food_id text,
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.video_library enable row level security;

drop policy if exists "Anyone can read videos" on public.video_library;
drop policy if exists "Admins can manage videos" on public.video_library;

create policy "Anyone can read videos" on public.video_library for select using (true);
create policy "Admins can manage videos" on public.video_library for all using (public.is_admin()) with check (public.is_admin());

insert into public.video_library (id, title, category, body_part, difficulty, duration_seconds, thumbnail_url, video_url, coach_name, tags, calories_estimate, related_exercise_id, like_count)
values
  ('full-body-10-min-beginner', '10-minute full body starter', 'Full body', 'Total body', 'beginner', 600, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', 'https://www.youtube.com/results?search_query=10+minute+beginner+full+body+workout+follow+along', 'Coach Maya', array['beginner','no equipment','follow along'], 85, 'bodyweight-squat', 1240),
  ('core-plank-fix', 'Stop sagging in planks', 'Abs / core', 'Core', 'beginner', 45, 'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=80', 'https://www.youtube.com/results?search_query=plank+form+mistakes+beginner+short', 'Coach Dan', array['plank','form fix','core'], 8, 'plank', 890),
  ('diet-deficit-no-spot', 'Belly fat truth in 45 seconds', 'Diet tips', 'Nutrition', 'beginner', 45, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80', 'https://www.youtube.com/results?search_query=belly+fat+spot+reduction+myth+calorie+deficit', 'Coach Noor', array['fat loss','calorie deficit','no spot reduction'], null, null, 2450)
on conflict (id) do nothing;
