export type OpenFitnessVideoSource = {
  id: string;
  fileName: string;
  videoUrl: string;
  title: string;
  author: string;
  license: string;
  sourcePage: string;
};

export const openFitnessVideoSources: OpenFitnessVideoSource[] = [
  {
    id: "squat-demo",
    fileName: "Squat - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Squat_-_exercise_demonstration_video.webm",
    title: "Weighted squat demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Squat_-_exercise_demonstration_video.webm"
  },
  {
    id: "bench-press-demo",
    fileName: "Bench press - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Bench_press_-_exercise_demonstration_video.webm",
    title: "Bench press demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Bench_press_-_exercise_demonstration_video.webm"
  },
  {
    id: "bent-over-row-demo",
    fileName: "Bent-over row - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bent-over_row_-_exercise_demonstration_video.webm",
    title: "Bent-over row demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Bent-over_row_-_exercise_demonstration_video.webm"
  },
  {
    id: "deadlift-demo",
    fileName: "Deadlift - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/Deadlift_-_exercise_demonstration_video.webm",
    title: "Deadlift demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Deadlift_-_exercise_demonstration_video.webm"
  },
  {
    id: "pull-up-demo",
    fileName: "Pull-ups - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Pull-ups_-_exercise_demonstration_video.webm",
    title: "Pull-up demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Pull-ups_-_exercise_demonstration_video.webm"
  },
  {
    id: "shoulder-press-demo",
    fileName: "Shoulder press - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Shoulder_press_-_exercise_demonstration_video.webm",
    title: "Shoulder press demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Shoulder_press_-_exercise_demonstration_video.webm"
  },
  {
    id: "incline-press-demo",
    fileName: "Incline press - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Incline_press_-_exercise_demonstration_video.webm",
    title: "Incline press demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Incline_press_-_exercise_demonstration_video.webm"
  },
  {
    id: "leg-raise-demo",
    fileName: "Leg raises - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Leg_raises_-_exercise_demonstration_video.webm",
    title: "Leg raise demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Leg_raises_-_exercise_demonstration_video.webm"
  },
  {
    id: "hanging-crunch-demo",
    fileName: "Hanging crunches - exercise demonstration video.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Hanging_crunches_-_exercise_demonstration_video.webm",
    title: "Hanging crunch demonstration",
    author: "FitnessScape",
    license: "CC BY 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Hanging_crunches_-_exercise_demonstration_video.webm"
  },
  {
    id: "single-leg-squat-demo",
    fileName: "Basic single leg squat.webm",
    videoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/Basic_single_leg_squat.webm",
    title: "Single-leg squat demonstration",
    author: "RickyBennison",
    license: "CC BY-SA 4.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Basic_single_leg_squat.webm"
  }
];

export function openFitnessVideoUrl(seed: string) {
  const index = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % openFitnessVideoSources.length;
  return openFitnessVideoSources[index].videoUrl;
}
