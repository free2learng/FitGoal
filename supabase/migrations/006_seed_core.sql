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
