# FitGoal

FitGoal is a mobile-first MVP fitness app built with Next.js, TypeScript, Tailwind CSS, and Supabase-ready schemas.

## What is included

- Onboarding quiz for goal, age, height, weight, fitness level, equipment, and diet preference
- Dashboard with today’s workout, calorie target, protein target, water goal, and weekly progress
- Beginner, intermediate, and athletic workout plan generation
- Adaptive 7-day training split with upper body, lower body, full body, leg day, HIIT, incline walk, treadmill, swimming, and mobility guidance
- Fat loss, muscle gain, and maintenance goal support
- 7-day meal plan with calories and protein
- Workout detail page with exercises, sets, reps, rest time, and tutorial links
- Progress tracker for weight, waist measurement, calories, and completed workouts
- Adaptive missed-day logic that rotates/reschedules the next workout
- Stubborn Belly Fat Killer program at `/programs/stubborn-belly-fat-killer`
- MET-based calorie burn calculator with exercise demo cards
- Nutrition food library at `/nutrition/food-library`
- Manual food logging with eaten foods, planned foods, custom foods, serving size, and meal type
- Expandable food database with everyday foods, drinks, cooked variations, meal templates, favourites, recents, and ingredient combinations
- Food search supports exact/partial matches, synonyms, category/subcategory filters, and light typo tolerance
- Large vegetable coverage with raw, boiled, steamed, roasted, grilled, stir-fried, with-oil, and without-oil variations
- Clear food logging confirmation with logged-state buttons, duplicate-tap protection, toast feedback, and a top-of-page daily logged-foods card
- Dashboard calorie balance based only on user-logged foods
- Protein tracking with body-weight based goals, per-meal protein guidance, and meal-level protein status
- Hydration logging with quick-add water amounts, hydration drink types, daily goal adjustments, and remaining water tracking
- Account screen at `/account` with Google sign-in through Supabase or guest mode
- Login screen at `/login` using Supabase Google OAuth with SSR cookie auth
- Protected admin dashboard at `/admin` for users whose `profiles.role` is `admin`
- Supabase-ready state snapshots for performance analysis of food logs, hydration, workouts, weight, and waist progress
- Supabase SQL schema and optional Prisma schema

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The user fitness MVP still works with browser localStorage for guest mode. Supabase credentials are required for Google login and the protected admin dashboard.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
DATABASE_URL="..."
```

4. Open the Supabase SQL editor and run `supabase/schema.sql`.
5. In Supabase Auth providers, enable Google OAuth.
6. Add your Google Client ID and Google Client Secret in Supabase Auth provider settings.
7. Add redirect URLs in Supabase and Google Cloud Console:
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://fitgoal-ten.vercel.app/auth/callback`

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are safe for browser use. `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side; FitGoal uses it only in server actions for admin-safe database management.

Google sign-in is optional for normal users. Guest mode stores FitGoal data in browser localStorage. When signed in with Google, FitGoal also saves a `user_state_snapshots` row with the current app state and a compact performance summary.

## Admin setup

The `/admin` route is protected by Supabase SSR cookie auth and the `profiles.role` field.

1. Sign in once with Google so Supabase creates your auth user and profile row.
2. In Supabase SQL editor, promote your user:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

Admins can manage global foods, exercises, and workout programs. Normal users can read public food/exercise/program data, but cannot create, update, or delete global records. User food logs, workout logs, hydration logs, progress entries, and state snapshots are private to the owning user through RLS.

## Prisma option

The repo includes `prisma/schema.prisma` for teams that prefer Prisma against the same Postgres database.

```bash
npx prisma generate
npx prisma db push
```

For this MVP, the frontend uses local seed data from `lib/seed-data.ts`. A practical next step is inserting those workouts into `public.workouts` and `public.exercises`, then reading user-specific profiles, workout logs, meal days, and progress entries from Supabase.

The program and nutrition seed data live in `lib/program-data.ts`. It includes the Stubborn Belly Fat Killer program, exercise demo metadata, a larger API-ready nutrition food library, meal templates, and vitamin/mineral reference data. `lib/calories.ts` contains the MET calorie calculator.

The food schema is designed for later integrations with USDA FoodData Central, Open Food Facts, barcode scanning, branded supermarket foods, and restaurant nutrition data through fields such as `source`, `external_provider`, `external_id`, `barcode`, `brand_name`, serving options, tags, synonyms, and verification status.

## Project structure

```text
app/
  admin/            protected admin dashboard and server actions
  auth/callback/    Supabase OAuth callback
  login/            Google OAuth login
  onboarding/       quiz flow
  dashboard/        daily plan, targets, meals
  workouts/[id]/    workout detail page
  nutrition/        food library, logging, custom foods, combinations
  progress/         progress tracker
components/         shared app shell and cards
lib/                types, seed data, program data, calculators, generators, storage, Supabase clients
supabase/           SQL schema with RLS policies
prisma/             optional Prisma schema
```

## MVP notes

- Auth/database integration is prepared but not required for local testing.
- Adaptive logic currently tracks missed days in localStorage and rotates the next workout.
- Nutrition targets are simple estimates intended for MVP planning, not medical advice.
- The belly fat program explicitly avoids spot fat reduction claims. Belly fat reduction is framed as total body fat loss through calorie deficit, training, cardio, sleep, and nutrition.
- Calorie burn values use MET estimates and vary by weight, intensity, and fitness level.
- Food consumed data is never assumed. Users must log foods manually or plan foods from the library before the dashboard includes them.
