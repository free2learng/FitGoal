alter table public.video_library add column if not exists external_url text;

comment on column public.video_library.video_url is 'Direct native video file URL for HTML5 playback. Use Supabase Storage public .mp4, .webm, or .ogg URLs.';
comment on column public.video_library.external_url is 'Optional external fallback link such as YouTube. This is not used as the primary player.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fitgoal-videos',
  'fitgoal-videos',
  true,
  524288000,
  array['video/mp4', 'video/webm', 'video/ogg', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read FitGoal videos" on storage.objects;
drop policy if exists "Admins manage FitGoal videos" on storage.objects;

create policy "Public read FitGoal videos"
on storage.objects for select
using (bucket_id = 'fitgoal-videos');

create policy "Admins manage FitGoal videos"
on storage.objects for all
using (bucket_id = 'fitgoal-videos' and public.is_admin())
with check (bucket_id = 'fitgoal-videos' and public.is_admin());

update public.video_library
set
  video_url = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  external_url = null
where id = 'demo-bodyweight-squat';

update public.video_library
set
  video_url = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  external_url = null
where id = 'demo-plank';

update public.video_library
set
  external_url = case
    when video_url ilike '%youtube.com%' or video_url ilike '%youtu.be%' then video_url
    else external_url
  end,
  video_url = case
    when video_url ilike '%youtube.com%' or video_url ilike '%youtu.be%' then ''
    else video_url
  end
where video_url ilike '%youtube.com%'
   or video_url ilike '%youtu.be%';
