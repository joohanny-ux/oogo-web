import React from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { getLandingEditorPages } from "@/lib/admin-content";

export default function AdminDashboardPage() {
  const landingPages = getLandingEditorPages();

  return (
    <main className="admin-page">
      <h1>Dashboard</h1>
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
