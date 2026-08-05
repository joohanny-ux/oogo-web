import { createSupabaseServerClient } from "@/lib/supabase/server";

/** API routes should return JSON 401 instead of redirecting. */
export async function getAdminSupabaseClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return supabase;
}
