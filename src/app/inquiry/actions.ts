"use server";

import { headers } from "next/headers";
import {
  type InquirySubmitState,
  validateInquiryInput
} from "@/lib/inquiries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function submitInquiry(
  _prevState: InquirySubmitState,
  formData: FormData
): Promise<InquirySubmitState> {
  try {
    const input = {
      type: String(formData.get("type") ?? "buyer"),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
      country: String(formData.get("country") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      privacyConsent: formData.get("privacyConsent") === "yes"
    };

    const validation = validateInquiryInput(input);
    if (!validation.ok) {
      return { ok: false, message: validation.message };
    }

    const requestHeaders = await headers();
    const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
    const turnstile = await verifyTurnstileToken(turnstileToken || undefined, ip);

    if (!turnstile.ok) {
      return { ok: false, message: turnstile.error };
    }

    if (!hasSupabaseEnv()) {
      return { ok: false, message: "문의 접수 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요." };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("inquiries").insert({
      type: validation.value.type,
      name: validation.value.name,
      email: validation.value.email,
      message: validation.value.message,
      company: validation.value.company || null,
      country: validation.value.country || null,
      phone: validation.value.phone || null
    });

    if (error) {
      return { ok: false, message: "문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요." };
    }

    return { ok: true, message: "문의가 접수되었습니다." };
  } catch {
    return { ok: false, message: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}
