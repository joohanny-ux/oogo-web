"use server";

// 관리자 세션을 종료하고 로그인 화면으로 이동하는 서버 액션
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/admin-content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logoutAdminAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  redirect("/admin/login");
}
