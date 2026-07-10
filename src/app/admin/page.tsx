import React from "react";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { getAdminDashboardSummary } from "@/lib/admin-content";

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();

  return <AdminDashboardOverview summary={summary} />;
}
