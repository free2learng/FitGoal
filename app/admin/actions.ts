"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase?.auth.getUser() ?? { data: { user: null } };
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase!.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard?permission=denied");

  return user;
}

function textArray(value: FormDataEntryValue | null) {
  return String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export async function upsertFood(formData: FormData) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const id = String(formData.get("id") || crypto.randomUUID());

  const { error } = await admin.from("nutrition_foods").upsert({
    id,
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || "protein"),
    subcategory: String(formData.get("subcategory") || "general"),
    serving_size: Number(formData.get("serving_size") || 1),
    serving_unit: String(formData.get("serving_unit") || "serving"),
    calories: Number(formData.get("calories") || 0),
    protein: Number(formData.get("protein") || 0),
    carbs: Number(formData.get("carbs") || 0),
    fats: Number(formData.get("fats") || 0),
    sugar: Number(formData.get("sugar") || 0),
    fibre: Number(formData.get("fibre") || 0),
    sodium: Number(formData.get("sodium") || 0),
    vitamins: textArray(formData.get("vitamins")),
    minerals: textArray(formData.get("minerals")),
    tags: textArray(formData.get("tags")),
    synonyms: textArray(formData.get("synonyms")),
    common_serving_options: [{ label: "1 serving", multiplier: 1 }],
    preparation_method: String(formData.get("preparation_method") || "standard"),
    is_drink: formData.get("is_drink") === "on",
    is_custom: false,
    source: "seed",
    verified_status: "estimated",
    fitness_benefit: String(formData.get("fitness_benefit") || "Supports a balanced fitness plan."),
    meal_use: String(formData.get("meal_use") || "Use in meals or snacks.")
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteFood(formData: FormData) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("nutrition_foods").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function upsertExercise(formData: FormData) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    program_id: String(formData.get("program_id") || "stubborn-belly-fat-killer"),
    name: String(formData.get("name") || ""),
    sets: Number(formData.get("sets") || 1),
    reps: String(formData.get("reps") || "10"),
    rest_seconds: Number(formData.get("rest_seconds") || 45),
    difficulty: String(formData.get("difficulty") || "beginner"),
    target_muscles: textArray(formData.get("target_muscles")),
    demo_video_url: String(formData.get("demo_video_url") || "https://www.youtube.com/results?search_query=exercise+demo"),
    animation_url: String(formData.get("animation_url") || "") || null,
    met_value: Number(formData.get("met_value") || 3),
    duration_minutes_per_set: Number(formData.get("duration_minutes_per_set") || 1),
    instructions: textArray(formData.get("instructions")),
    common_mistakes: textArray(formData.get("common_mistakes")),
    beginner_tips: textArray(formData.get("beginner_tips"))
  };

  const query = id ? admin.from("exercise_library").update(payload).eq("id", id) : admin.from("exercise_library").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteExercise(formData: FormData) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("exercise_library").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function upsertProgram(formData: FormData) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("workout_programs").upsert({
    id: String(formData.get("id") || crypto.randomUUID()),
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    goal: String(formData.get("goal") || "fat-loss"),
    level: String(formData.get("level") || "beginner"),
    target_daily_deficit: Number(formData.get("target_daily_deficit") || 0),
    weekly_fat_loss_estimate: String(formData.get("weekly_fat_loss_estimate") || ""),
    safety_note: String(formData.get("safety_note") || "")
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteProgram(formData: FormData) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("workout_programs").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
