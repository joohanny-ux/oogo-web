import { AdminCard } from "@/components/admin/AdminCard";

export default function AdminDashboardPage() {
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
    </main>
  );
}
