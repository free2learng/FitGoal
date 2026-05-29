update public.video_library
set video_url = case id
  when 'demo-bodyweight-squat' then 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Squat_-_exercise_demonstration_video.webm'
  when 'demo-plank' then 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Leg_raises_-_exercise_demonstration_video.webm'
  when 'belly-fat-total-loss' then 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Bent-over_row_-_exercise_demonstration_video.webm'
  when 'plan-beginner-7-day' then 'https://upload.wikimedia.org/wikipedia/commons/1/16/Basic_single_leg_squat.webm'
  when 'nutrition-protein-30g' then 'https://upload.wikimedia.org/wikipedia/commons/1/15/Pull-ups_-_exercise_demonstration_video.webm'
  else video_url
end,
external_url = case id
  when 'demo-bodyweight-squat' then 'https://commons.wikimedia.org/wiki/File:Squat_-_exercise_demonstration_video.webm'
  when 'demo-plank' then 'https://commons.wikimedia.org/wiki/File:Leg_raises_-_exercise_demonstration_video.webm'
  when 'belly-fat-total-loss' then 'https://commons.wikimedia.org/wiki/File:Bent-over_row_-_exercise_demonstration_video.webm'
  when 'plan-beginner-7-day' then 'https://commons.wikimedia.org/wiki/File:Basic_single_leg_squat.webm'
  when 'nutrition-protein-30g' then 'https://commons.wikimedia.org/wiki/File:Pull-ups_-_exercise_demonstration_video.webm'
  else external_url
end
where id in (
  'demo-bodyweight-squat',
  'demo-plank',
  'belly-fat-total-loss',
  'plan-beginner-7-day',
  'nutrition-protein-30g'
)
and (
  video_url = ''
  or video_url ilike '%interactive-examples.mdn.mozilla.net%'
  or video_url ilike '%youtube.com%'
  or video_url ilike '%youtu.be%'
);
