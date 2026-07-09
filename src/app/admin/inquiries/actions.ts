"use server";

import { updateInquiryStatus } from "@/lib/admin-content";

export async function updateInquiryStatusAction(formData: FormData) {
  const status = String(formData.get("status") ?? "open");
  if (status !== "open" && status !== "in_progress" && status !== "closed") {
    throw new Error("Invalid inquiry status.");
  }

  const result = await updateInquiryStatus(String(formData.get("id") ?? ""), status);
  if (!result.ok) {
    throw new Error(result.message);
  }
}
