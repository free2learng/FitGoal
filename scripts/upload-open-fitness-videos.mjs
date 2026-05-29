import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = loadEnv(".env.local");
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const bucket = "fitgoal-videos";

const openVideos = [
  source("squat-demo", "Squat - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/5/5c/Squat_-_exercise_demonstration_video.webm", "Squat demo", "FitnessScape", "CC BY 3.0"),
  source("bench-press-demo", "Bench press - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/d/df/Bench_press_-_exercise_demonstration_video.webm", "Bench press demo", "FitnessScape", "CC BY 3.0"),
  source("bent-over-row-demo", "Bent-over row - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bent-over_row_-_exercise_demonstration_video.webm", "Bent-over row demo", "FitnessScape", "CC BY 3.0"),
  source("deadlift-demo", "Deadlift - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/6/62/Deadlift_-_exercise_demonstration_video.webm", "Deadlift demo", "FitnessScape", "CC BY 3.0"),
  source("pull-up-demo", "Pull-ups - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/1/15/Pull-ups_-_exercise_demonstration_video.webm", "Pull-up demo", "FitnessScape", "CC BY 3.0"),
  source("shoulder-press-demo", "Shoulder press - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/6/69/Shoulder_press_-_exercise_demonstration_video.webm", "Shoulder press demo", "FitnessScape", "CC BY 3.0"),
  source("incline-press-demo", "Incline press - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/8/80/Incline_press_-_exercise_demonstration_video.webm", "Incline press demo", "FitnessScape", "CC BY 3.0"),
  source("leg-raise-demo", "Leg raises - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/b/bf/Leg_raises_-_exercise_demonstration_video.webm", "Leg raise demo", "FitnessScape", "CC BY 3.0"),
  source("hanging-crunch-demo", "Hanging crunches - exercise demonstration video.webm", "https://upload.wikimedia.org/wikipedia/commons/5/5e/Hanging_crunches_-_exercise_demonstration_video.webm", "Hanging crunch demo", "FitnessScape", "CC BY 3.0"),
  source("single-leg-squat-demo", "Basic single leg squat.webm", "https://upload.wikimedia.org/wikipedia/commons/1/16/Basic_single_leg_squat.webm", "Single-leg squat demo", "RickyBennison", "CC BY-SA 4.0")
];

await ensureBucket();

const uploaded = [];
for (const item of openVideos) {
  const response = await fetch(item.downloadUrl);
  if (!response.ok) {
    console.warn(`Skipped ${item.id}: ${response.status} ${response.statusText}`);
    continue;
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] || "video/webm";
  const buffer = Buffer.from(await response.arrayBuffer());
  const path = `open-source/${item.id}.webm`;
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    upsert: true,
    contentType
  });
  if (error) throw new Error(`Upload failed for ${item.id}: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  uploaded.push({ ...item, publicUrl: data.publicUrl });
  console.log(`Uploaded ${item.id}`);
}

const { data: rows, error: rowsError } = await supabase
  .from("video_library")
  .select("id, video_url")
  .order("created_at", { ascending: true });

if (rowsError) throw new Error(rowsError.message);

const replaceableRows = (rows ?? []).filter((row) => {
  const url = row.video_url ?? "";
  return !url || url.includes("interactive-examples.mdn.mozilla.net") || url.includes("commons.wikimedia.org");
});

for (let index = 0; index < replaceableRows.length; index += 1) {
  const replacement = uploaded[index % uploaded.length];
  const { error } = await supabase
    .from("video_library")
    .update({
      video_url: replacement.publicUrl,
      external_url: replacement.sourcePage
    })
    .eq("id", replaceableRows[index].id);
  if (error) throw new Error(`DB update failed for ${replaceableRows[index].id}: ${error.message}`);
}

console.log(`Updated ${replaceableRows.length} video_library rows with Supabase Storage URLs.`);

function source(id, fileName, downloadUrl, title, author, license) {
  return {
    id,
    fileName,
    title,
    author,
    license,
    downloadUrl,
    sourcePage: `https://commons.wikimedia.org/wiki/File:${fileName.replaceAll(" ", "_")}`
  };
}

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket(bucket, {
    public: true,
    allowedMimeTypes: ["video/mp4", "video/webm", "video/ogg", "image/jpeg", "image/png", "image/webp"],
    fileSizeLimit: 524288000
  });
  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(`Bucket create failed: ${error.message}`);
  }
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index);
        const value = line.slice(index + 1).replace(/^["']|["']$/g, "");
        return [key, value];
      })
  );
}
