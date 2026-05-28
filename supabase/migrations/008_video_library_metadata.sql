alter table public.video_library
  add column if not exists target_muscles text[] not null default '{}',
  add column if not exists coach_tips text[] not null default '{}',
  add column if not exists safety_notes text[] not null default '{}';

update public.video_library
set
  target_muscles = case
    when id = 'full-body-10-min-beginner' then array['full body','legs','glutes','core']
    when id = 'core-plank-fix' then array['abs','deep core','shoulders','glutes']
    when id = 'diet-deficit-no-spot' then array['total body']
    else target_muscles
  end,
  coach_tips = case
    when id = 'full-body-10-min-beginner' then array['Keep intensity at 6-7 out of 10','Move well before moving fast']
    when id = 'core-plank-fix' then array['Elbows under shoulders','Ribs down','End before hips sag']
    when id = 'diet-deficit-no-spot' then array['Use a small calorie deficit','Combine strength, cardio, protein, sleep, and steps']
    else coach_tips
  end,
  safety_notes = case
    when id = 'full-body-10-min-beginner' then array['Stop if dizzy; hydrate and rest as needed']
    when id = 'core-plank-fix' then array['Drop to knees if your lower back feels loaded']
    when id = 'diet-deficit-no-spot' then array['Avoid extreme deficits and crash diets']
    else safety_notes
  end
where id in ('full-body-10-min-beginner', 'core-plank-fix', 'diet-deficit-no-spot');
