import { Exercise } from "@/lib/types";

const videoSearch = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

type Coaching = Pick<Exercise,
  | "targetMuscles"
  | "equipmentNeeded"
  | "instructions"
  | "commonMistakes"
  | "beginnerTips"
  | "breathingTips"
  | "formCues"
  | "goodFor"
  | "regression"
  | "progression"
  | "safetyNotes"
  | "metValue"
  | "durationMinutesPerSet"
  | "shortVideoTipUrl"
>;

const coaching: Record<string, Coaching> = {
  "mountain climbers": {
    targetMuscles: ["core", "shoulders", "hip flexors", "cardio"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Stack shoulders over wrists", "Brace like a plank", "Drive one knee forward, then switch with control"],
    commonMistakes: ["Hips bouncing high", "Lower back sagging", "Racing before the plank is stable"],
    beginnerTips: ["Step one foot at a time", "Use hands on a bench to reduce load"],
    breathingTips: ["Exhale as each knee drives forward", "Keep short steady breaths"],
    formCues: ["Quiet hips", "Hands push the floor away", "Knee tracks toward chest"],
    goodFor: "Core conditioning, shoulder stability, and efficient calorie burn.",
    regression: "Incline mountain climber on a bench.",
    progression: "Cross-body mountain climber or faster intervals.",
    safetyNotes: ["Stop if wrists or lower back feel sharp pain."],
    metValue: 8,
    durationMinutesPerSet: 0.5,
    shortVideoTipUrl: videoSearch("mountain climber form mistake short")
  },
  "plank": {
    targetMuscles: ["core", "shoulders", "glutes"],
    equipmentNeeded: ["mat"],
    instructions: ["Elbows under shoulders", "Ribs down", "Squeeze glutes lightly and hold a straight line"],
    commonMistakes: ["Hips sagging", "Neck craning", "Holding breath"],
    beginnerTips: ["Use a knees-down plank", "Work in 10 second quality holds"],
    breathingTips: ["Slow nasal inhale, strong exhale through pursed lips"],
    formCues: ["Long neck", "Ribs tucked", "Glutes on"],
    goodFor: "Teaching bracing for squats, push-ups, carries, and daily posture.",
    regression: "Knees-down plank.",
    progression: "Long lever plank or shoulder taps.",
    safetyNotes: ["End the set before your lower back dips."],
    metValue: 3.3,
    durationMinutesPerSet: 0.42,
    shortVideoTipUrl: videoSearch("plank form cues beginner short")
  },
  "bodyweight squat": {
    targetMuscles: ["quads", "glutes", "hamstrings", "core"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Feet about shoulder width", "Sit hips back and down", "Stand by pushing the floor away"],
    commonMistakes: ["Knees collapsing inward", "Heels lifting", "Rounding the back at the bottom"],
    beginnerTips: ["Squat to a chair", "Use a counter for balance"],
    breathingTips: ["Inhale down, exhale as you stand"],
    formCues: ["Tripod foot", "Knees follow toes", "Chest proud"],
    goodFor: "Lower-body strength, glute engagement, and everyday movement quality.",
    regression: "Box squat to a chair.",
    progression: "Goblet squat or tempo squat.",
    safetyNotes: ["Use pain-free depth and keep heels grounded."],
    metValue: 5,
    durationMinutesPerSet: 0.75,
    shortVideoTipUrl: videoSearch("bodyweight squat form beginner short")
  },
  "jumping jacks": {
    targetMuscles: ["full body", "calves", "shoulders", "cardio"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Stand tall", "Jump feet out as arms rise", "Land softly and return"],
    commonMistakes: ["Hard landings", "Locked knees", "Moving faster than control allows"],
    beginnerTips: ["Step jacks remove impact", "Keep arms lower if shoulders feel tight"],
    breathingTips: ["Breathe rhythmically every few reps"],
    formCues: ["Soft knees", "Tall chest", "Quiet feet"],
    goodFor: "Simple warm-ups and low-equipment cardio intervals.",
    regression: "Step jack.",
    progression: "Power jack.",
    safetyNotes: ["Choose step jacks if jumping bothers knees or ankles."],
    metValue: 7.7,
    durationMinutesPerSet: 0.67,
    shortVideoTipUrl: videoSearch("jumping jacks low impact form short")
  },
  "high knees": {
    targetMuscles: ["quads", "hip flexors", "calves", "core"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Stand tall", "Drive knees up", "Pump arms like running"],
    commonMistakes: ["Leaning backward", "Stomping", "Letting knees cave"],
    beginnerTips: ["March instead of running", "Aim for waist height only if posture stays tall"],
    breathingTips: ["Use quick relaxed breaths"],
    formCues: ["Tall torso", "Fast arms", "Soft landing"],
    goodFor: "Cardio conditioning and running mechanics.",
    regression: "Marching high knees.",
    progression: "Sprint high knees.",
    safetyNotes: ["Reduce speed before form breaks."],
    metValue: 8,
    durationMinutesPerSet: 0.5,
    shortVideoTipUrl: videoSearch("high knees beginner form short")
  },
  "glute bridge": {
    targetMuscles: ["glutes", "hamstrings", "core"],
    equipmentNeeded: ["mat"],
    instructions: ["Feet flat under knees", "Ribs down", "Drive through heels and squeeze glutes at the top"],
    commonMistakes: ["Arching lower back", "Pushing through toes", "Overextending hips"],
    beginnerTips: ["Pause one second at top", "Move slowly"],
    breathingTips: ["Exhale as hips lift"],
    formCues: ["Heels heavy", "Ribs tucked", "Glutes finish the rep"],
    goodFor: "Glute activation, hip strength, and lower-back-friendly posterior chain work.",
    regression: "Shorter range glute bridge.",
    progression: "Single-leg glute bridge.",
    safetyNotes: ["Do not chase height by arching the back."],
    metValue: 3.5,
    durationMinutesPerSet: 0.7,
    shortVideoTipUrl: videoSearch("glute bridge form mistakes short")
  },
  "leg raises": {
    targetMuscles: ["lower abs", "hip flexors"],
    equipmentNeeded: ["mat"],
    instructions: ["Lie down and brace", "Lower legs only while back stays flat", "Return with control"],
    commonMistakes: ["Lower back lifting", "Swinging legs", "Neck tension"],
    beginnerTips: ["Bend knees", "Use reverse crunches first if needed"],
    breathingTips: ["Exhale as legs come up"],
    formCues: ["Back heavy", "Slow lower", "No swing"],
    goodFor: "Core control and hip flexor strength.",
    regression: "Bent-knee leg raise.",
    progression: "Straight-leg raise with slow eccentric.",
    safetyNotes: ["Stop the lower phase when your back wants to arch."],
    metValue: 3.8,
    durationMinutesPerSet: 0.65,
    shortVideoTipUrl: videoSearch("leg raise lower back fix short")
  },
  "bicycle crunches": {
    targetMuscles: ["abs", "obliques"],
    equipmentNeeded: ["mat"],
    instructions: ["Hands light behind head", "Rotate shoulder toward opposite knee", "Alternate slowly"],
    commonMistakes: ["Pulling the neck", "Rushing reps", "Elbows folding in"],
    beginnerTips: ["Keep one heel down between reps", "Use smaller rotation"],
    breathingTips: ["Exhale on each twist"],
    formCues: ["Shoulder to knee", "Elbows wide", "Slow tempo"],
    goodFor: "Oblique strength and trunk rotation control.",
    regression: "Dead bug or heel taps.",
    progression: "Slow bicycle crunch with full leg extension.",
    safetyNotes: ["Neck should feel relaxed."],
    metValue: 4,
    durationMinutesPerSet: 0.8,
    shortVideoTipUrl: videoSearch("bicycle crunch form short")
  },
  "russian twists": {
    targetMuscles: ["obliques", "abs"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Sit tall", "Lean back slightly", "Rotate ribs side to side"],
    commonMistakes: ["Only moving arms", "Rounding back", "Going too fast"],
    beginnerTips: ["Keep feet down", "Do not add weight yet"],
    breathingTips: ["Exhale on each rotation"],
    formCues: ["Tall spine", "Ribs rotate", "Control first"],
    goodFor: "Rotational core endurance.",
    regression: "Seated torso rotations upright.",
    progression: "Feet-up Russian twist or light weight.",
    safetyNotes: ["Avoid if twisting irritates your back."],
    metValue: 3.8,
    durationMinutesPerSet: 0.65,
    shortVideoTipUrl: videoSearch("russian twist beginner form short")
  },
  "burpee": {
    targetMuscles: ["full body", "legs", "chest", "core"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Squat down", "Step or jump to plank", "Return feet forward and stand tall"],
    commonMistakes: ["Collapsing into plank", "Skipping bracing", "Turning every rep into impact"],
    beginnerTips: ["Step back and skip push-up", "Use elevated hands"],
    breathingTips: ["Exhale as you stand"],
    formCues: ["Hands under shoulders", "Step clean", "Stand tall"],
    goodFor: "Full-body conditioning when used sparingly and with good form.",
    regression: "Step-back burpee to a bench.",
    progression: "Burpee with push-up or jump.",
    safetyNotes: ["Keep volume low if wrists, knees, or back are sensitive."],
    metValue: 8,
    durationMinutesPerSet: 0.9,
    shortVideoTipUrl: videoSearch("beginner burpee step back short")
  },
  "push-up": {
    targetMuscles: ["chest", "triceps", "shoulders", "core"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Hands under shoulders", "Body in one line", "Lower with elbows about 45 degrees"],
    commonMistakes: ["Hips sagging", "Elbows flaring", "Half reps without control"],
    beginnerTips: ["Use incline push-ups", "Keep reps clean before going lower"],
    breathingTips: ["Inhale down, exhale as you push"],
    formCues: ["Plank first", "Chest moves as one", "Push floor away"],
    goodFor: "Upper-body pushing strength and core tension.",
    regression: "Incline push-up.",
    progression: "Tempo push-up or full floor push-up.",
    safetyNotes: ["Wrists should feel comfortable; elevate hands if needed."],
    metValue: 3.8,
    durationMinutesPerSet: 0.75,
    shortVideoTipUrl: videoSearch("incline push up beginner form short")
  },
  "lunge": {
    targetMuscles: ["quads", "glutes", "hamstrings"],
    equipmentNeeded: ["bodyweight"],
    instructions: ["Step with control", "Keep front heel grounded", "Drive up through the front leg"],
    commonMistakes: ["Short stance", "Front knee caving", "Pushing off the back foot too much"],
    beginnerTips: ["Start with reverse lunges", "Hold support for balance"],
    breathingTips: ["Inhale down, exhale to stand"],
    formCues: ["Long stance", "Front foot heavy", "Tall chest"],
    goodFor: "Single-leg strength, balance, and glute work.",
    regression: "Supported reverse lunge.",
    progression: "Walking lunge or dumbbell lunge.",
    safetyNotes: ["Use a pain-free range for knees."],
    metValue: 4.5,
    durationMinutesPerSet: 0.8,
    shortVideoTipUrl: videoSearch("reverse lunge form beginner short")
  },
  "dead bug": {
    targetMuscles: ["core", "deep abs"],
    equipmentNeeded: ["mat"],
    instructions: ["Back flat", "Opposite arm and leg extend", "Return slowly"],
    commonMistakes: ["Back arching", "Moving too far", "Holding breath"],
    beginnerTips: ["Tap one heel at a time", "Keep arms still first"],
    breathingTips: ["Exhale during each reach"],
    formCues: ["Ribs down", "Slow reach", "Back quiet"],
    goodFor: "Core control with very low impact.",
    regression: "Heel taps.",
    progression: "Long-lever dead bug.",
    safetyNotes: ["Range only counts while your back stays flat."],
    metValue: 2.8,
    durationMinutesPerSet: 0.75,
    shortVideoTipUrl: videoSearch("dead bug exercise beginner form short")
  },
  "bird dog": {
    targetMuscles: ["core", "back", "glutes"],
    equipmentNeeded: ["mat"],
    instructions: ["Hands under shoulders", "Reach opposite arm and leg", "Pause without twisting"],
    commonMistakes: ["Rotating hips", "Arching back", "Moving too fast"],
    beginnerTips: ["Start with legs only", "Use a small range"],
    breathingTips: ["Exhale as you reach"],
    formCues: ["Hips square", "Reach long", "Quiet torso"],
    goodFor: "Back-friendly core stability and posture.",
    regression: "Quadruped leg extension.",
    progression: "Bird dog row or longer pauses.",
    safetyNotes: ["Keep movement controlled and pain-free."],
    metValue: 2.8,
    durationMinutesPerSet: 0.75,
    shortVideoTipUrl: videoSearch("bird dog form short")
  },
  "wall sit": {
    targetMuscles: ["quads", "glutes", "core"],
    equipmentNeeded: ["wall"],
    instructions: ["Back against wall", "Slide to a comfortable squat", "Hold with knees tracking toes"],
    commonMistakes: ["Knees too far forward", "Holding breath", "Sliding too low too soon"],
    beginnerTips: ["Start higher than parallel", "Use 15-20 second holds"],
    breathingTips: ["Slow steady breaths throughout"],
    formCues: ["Back flat", "Heels heavy", "Knees out"],
    goodFor: "Leg endurance with minimal equipment.",
    regression: "Higher wall sit.",
    progression: "Longer hold or single-leg emphasis.",
    safetyNotes: ["Stand up if knee pain appears."],
    metValue: 3.5,
    durationMinutesPerSet: 0.6,
    shortVideoTipUrl: videoSearch("wall sit form beginner short")
  }
};

function keyFor(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("burpee")) return "burpee";
  if (lower.includes("push-up") || lower.includes("push up")) return "push-up";
  if (lower.includes("lunge")) return "lunge";
  if (lower.includes("leg raise")) return "leg raises";
  if (lower.includes("russian twist")) return "russian twists";
  if (lower.includes("glute bridge")) return "glute bridge";
  if (lower.includes("bodyweight squat") || lower.includes("squat")) return "bodyweight squat";
  return Object.keys(coaching).find((item) => lower.includes(item)) ?? lower;
}

export function getExerciseCoaching(name: string) {
  return coaching[keyFor(name)];
}

export function enrichExercise<T extends Exercise>(exercise: T): T {
  const extra = getExerciseCoaching(exercise.name);
  if (!extra) return exercise;
  return {
    ...extra,
    ...exercise,
    targetMuscles: exercise.targetMuscles ?? extra.targetMuscles,
    tutorialUrl: exercise.tutorialUrl || extra.shortVideoTipUrl || videoSearch(`${exercise.name} exercise form`)
  };
}
