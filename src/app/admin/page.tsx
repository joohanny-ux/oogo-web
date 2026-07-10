import React from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { getLandingEditorPages, hasSupabaseEnv } from "@/lib/admin-content";

const setupSteps = [
  {
    label: "Supabase env",
    detail: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
  },
  {
    label: "Database migrations",
    detail: "Run supabase/migrations in order, then apply supabase/seed/seed-oogo-content.sql."
  },
  {
    label: "Storage bucket",
    detail: "Confirm the oogo-assets bucket and storage policies are active."
  },
  {
    label: "Admin auth",
    detail: "Create the admin user in Supabase Auth before editing live content."
  }
];

export default function AdminDashboardPage() {
  const landingPages = getLandingEditorPages();
  const supabaseConfigured = hasSupabaseEnv();

  return (
    <main className="admin-page">
      <h1>Dashboard</h1>
      <section className="admin-panel admin-setup-panel">
        <div className="admin-section-heading">
          <span>Setup Status</span>
          <small>{supabaseConfigured ? "Supabase connected" : "Connection required"}</small>
        </div>
        <p>
          {supabaseConfigured
            ? "Supabase environment values are present. Verify migrations, storage policies, and admin auth before publishing."
            : "Public pages are using fallback content until Supabase is connected. Complete these steps before saving CMS content."}
        </p>
        <ol className="admin-setup-list">
          {setupSteps.map((step, index) => (
            <li key={step.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.label}</strong>
                <small>{step.detail}</small>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <div className="admin-card-grid">
        <AdminCard label="Products" value="0" note="In catalog" />
        <AdminCard label="Public on site" value="0" note="Visible on storefront" />
        <AdminCard label="Open inquiries" value="0" note="Status not closed" />
        <AdminCard label="Landing drafts" value="0" note="Draft / modified" />
      </div>
      <section className="admin-panel">
        <h2>Shortcuts</h2>
        <div className="admin-shortcuts">
          <a href="/admin/products/new">Add product</a>
          <a href="/admin/landing">Landing page</a>
          <a href="/admin/files">Files</a>
        </div>
      </section>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <span>Landing Pages</span>
          <small>Matched to public routes</small>
        </div>
        <div className="admin-landing-page-grid">
          {landingPages.map((page) => (
            <article className="admin-landing-page-card" key={page.key}>
              <div>
                <span>{page.surface}</span>
                <strong>{page.label}</strong>
                <small>{page.routeLabel}</small>
              </div>
              <p>{page.description}</p>
              <nav aria-label={`${page.label} actions`}>
                <a href={`/admin/landing?page=${page.key}&locale=ko`}>Edit content</a>
                <a href={page.publicHref} target="_blank" rel="noreferrer">
                  View public
                </a>
              </nav>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
