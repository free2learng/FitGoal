# FitGoal

FitGoal is a mobile-first MVP fitness app built with Next.js, TypeScript, Tailwind CSS, and Supabase-ready schemas.

## What is included

- Onboarding quiz for goal, age, height, weight, fitness level, equipment, and diet preference
- Dashboard with today’s workout, calorie target, protein target, water goal, and weekly progress
- Beginner, intermediate, and athletic workout plan generation
- Fat loss, muscle gain, and maintenance goal support
- 7-day meal plan with calories and protein
- Workout detail page with exercises, sets, reps, rest time, and tutorial links
- Progress tracker for weight, waist measurement, calories, and completed workouts
- Adaptive missed-day logic that rotates/reschedules the next workout
- Stubborn Belly Fat Killer program at `/programs/stubborn-belly-fat-killer`
- MET-based calorie burn calculator with exercise demo cards
- Nutrition food library at `/nutrition/food-library`
- Supabase SQL schema and optional Prisma schema

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The MVP works immediately with browser localStorage. Supabase credentials are optional until you wire persistence and auth into the UI.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
DATABASE_URL="..."
```

4. Open the Supabase SQL editor and run `supabase/schema.sql`.

## Prisma option

The repo includes `prisma/schema.prisma` for teams that prefer Prisma against the same Postgres database.

```bash
npx prisma generate
npx prisma db push
```

For this MVP, the frontend uses local seed data from `lib/seed-data.ts`. A practical next step is inserting those workouts into `public.workouts` and `public.exercises`, then reading user-specific profiles, workout logs, meal days, and progress entries from Supabase.

The new program and nutrition seed data live in `lib/program-data.ts`. It includes the Stubborn Belly Fat Killer program, exercise demo metadata, nutrition foods, and vitamin/mineral reference data. `lib/calories.ts` contains the MET calorie calculator.

## Project structure

```text
app/
  onboarding/       quiz flow
  dashboard/        daily plan, targets, meals
  workouts/[id]/    workout detail page
  progress/         progress tracker
components/         shared app shell and cards
lib/                types, seed data, program data, calculators, generators, storage, Supabase client
supabase/           SQL schema with RLS policies
prisma/             optional Prisma schema
```

## MVP notes

- Auth/database integration is prepared but not required for local testing.
- Adaptive logic currently tracks missed days in localStorage and rotates the next workout.
- Nutrition targets are simple estimates intended for MVP planning, not medical advice.
- The belly fat program explicitly avoids spot fat reduction claims. Belly fat reduction is framed as total body fat loss through calorie deficit, training, cardio, sleep, and nutrition.
- Calorie burn values use MET estimates and vary by weight, intensity, and fitness level.
