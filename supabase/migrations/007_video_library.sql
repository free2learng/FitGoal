create table if not exists public.video_library (
  id text primary key,
  title text not null,
  category text not null,
  body_part text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'athletic')),
  duration_seconds integer not null default 60,
  thumbnail_url text not null default '',
  video_url text not null,
  external_url text,
  coach_name text not null default 'FitGoal Coach',
  tags text[] not null default '{}',
  target_muscles text[] not null default '{}',
  coach_tips text[] not null default '{}',
  safety_notes text[] not null default '{}',
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

insert into public.video_library (id, title, category, body_part, difficulty, duration_seconds, thumbnail_url, video_url, external_url, coach_name, tags, target_muscles, coach_tips, safety_notes, calories_estimate, related_exercise_id, like_count)
values
  ('demo-bodyweight-squat', 'Bodyweight squat: clean reps only', 'Legs', 'Legs', 'beginner', 70, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', null, 'Coach Noor', array['exercise demo','squat','legs','beginner'], array['quads','glutes','hamstrings','core'], array['Keep heels heavy','Track knees in line with toes','Use a chair target if depth feels messy'], array['Use pain-free depth','Slow down if knees cave inward'], 18, 'bodyweight-squat', 1380),
  ('demo-plank', 'Plank setup: ribs down, glutes on', 'Abs / core', 'Core', 'beginner', 55, 'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=80', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm', null, 'Coach Dan', array['exercise demo','plank','core','form'], array['abs','deep core','shoulders','glutes'], array['Elbows under shoulders','Breathe through the hold','End the set before your hips sag'], array['Drop to knees if your lower back feels loaded'], 8, 'plank', 940),
  ('belly-fat-total-loss', 'Belly fat reduces through total fat loss', 'Diet tips', 'Nutrition', 'beginner', 48, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80', '', null, 'Coach Noor', array['belly fat','fat loss','no spot reduction','calorie deficit'], array['total body'], array['Pair a small calorie deficit with strength, cardio, protein, sleep, and steps'], array['Avoid extreme deficits and crash diets'], 0, null, 3200),
  ('plan-beginner-7-day', 'Beginner 7-day training plan', 'Beginner tips', 'Full plan', 'beginner', 90, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', '', null, 'Coach Dan', array['beginner plan','weekly plan','strength','cardio'], array['full body'], array['Train 3 strength days, 2 cardio days, 2 recovery days','Repeat the week before progressing'], array['Leave one or two reps in reserve on strength exercises'], 0, null, 1930),
  ('nutrition-protein-30g', 'Build a 30g protein meal', 'Protein tips', 'Nutrition', 'beginner', 55, 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80', '', null, 'Coach Jay', array['nutrition short','protein','meal prep','muscle'], array['recovery'], array['Start with one palm of lean protein','Add carbs around training if energy is low'], array['Adjust portions to your calorie goal and dietary needs'], 0, null, 2410)
on conflict (id) do nothing;
