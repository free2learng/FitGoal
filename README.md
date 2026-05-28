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

## Ownership Transfer Checklist

Use this checklist when moving FitGoal under the accounts linked to `free2learng@gmail.com`.

### GitHub

1. Confirm the worktree is clean with `git status`.
2. Confirm `.env`, `.env.local`, and `.env.*.local` are ignored.
3. Keep `.env.example` committed as the only environment template.
4. Transfer the GitHub repository ownership to the GitHub account linked to `free2learng@gmail.com`.
5. Confirm the transfer from the receiving account email.
6. After transfer, update local `origin` if the repository URL changes:

```bash
git remote set-url origin https://github.com/NEW_OWNER/fitgoal.git
git remote -v
```

### Supabase

1. Create a new Supabase project from the Supabase account linked to `free2learng@gmail.com`.
2. Put Supabase values only in `.env.local` locally, and in Vercel environment variables for production.
3. Do not commit `.env.local` or secrets.
4. Run the migration files in `supabase/migrations/` in filename order, or run `supabase/schema.sql` as the all-in-one setup.
5. Configure Google OAuth using the setup guide below.

### Vercel

1. Log in to the Vercel account linked to `free2learng@gmail.com`.
2. Import the transferred GitHub repository into Vercel.
3. Add environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy from the GitHub `main` branch.
5. Connect a custom domain later if needed.
6. Add the final production callback URL in Supabase Auth URL configuration:

```text
https://YOUR_DOMAIN.com/auth/callback
```

### Railway

Do not add Railway unless backend/server jobs are actually needed.

Use Railway later only for background jobs, external API sync, AI workers, cron jobs, or separate backend services.

## Supabase Google Login Setup

1. Create a Supabase project at `https://supabase.com`.
2. In Supabase, open Project Settings -> API.
3. Copy your `Project URL` into `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy your publishable anon key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Copy `.env.example` to `.env.local`.
6. Add the values:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

7. Open Supabase SQL Editor and run `supabase/schema.sql`.
8. In Supabase, open Authentication -> Providers -> Google and enable Google.
9. In Google Cloud Console, create an OAuth client:
   - Application type: Web application
   - Name: FitGoal local/dev or FitGoal production
10. In Google Cloud Console, add this Supabase callback URL to Authorized redirect URIs:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

11. Copy the Google Client ID and Client Secret.
12. Paste the Google Client ID and Client Secret into Supabase Authentication -> Providers -> Google.
13. In Supabase Authentication -> URL Configuration, add the local app redirect URL:

```text
http://localhost:3000/auth/callback
```

14. For production, also add your deployed callback URL:

```text
https://YOUR_DOMAIN.com/auth/callback
```

15. Restart the local Next.js dev server after editing `.env.local`.

To test Google signup/login locally:

1. Run `npm run dev`.
2. Open `http://localhost:3000/login`.
3. Click `Continue with Google`.
4. Complete Google consent.
5. Supabase redirects back through `/auth/callback`.
6. You should land on `/dashboard`.
7. In Supabase Table Editor, check that a row was created in `public.profiles`.

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
supabase/migrations SQL migration files for a new Supabase project
prisma/             optional Prisma schema
```

## MVP notes

- Auth/database integration is prepared but not required for local testing.
- Adaptive logic currently tracks missed days in localStorage and rotates the next workout.
- Nutrition targets are simple estimates intended for MVP planning, not medical advice.
- The belly fat program explicitly avoids spot fat reduction claims. Belly fat reduction is framed as total body fat loss through calorie deficit, training, cardio, sleep, and nutrition.
- Calorie burn values use MET estimates and vary by weight, intensity, and fitness level.
- Food consumed data is never assumed. Users must log foods manually or plan foods from the library before the dashboard includes them.
