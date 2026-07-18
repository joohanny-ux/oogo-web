import React from "react";
import { logoutAdminAction } from "@/app/admin/actions";

const managementLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inquiries", label: "Inquiries" }
];

const systemLinks = [
  { href: "/admin/landing", label: "Landing Page" },
  { href: "/admin/archive", label: "Archive" },
  { href: "/admin/files", label: "Files" },
  { href: "/admin/company", label: "Company & Brand" },
  { href: "/admin/users", label: "Users & Roles" }
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <a className="admin-logo" href="/admin">
        <strong>OOGO</strong>
        <small>Management</small>
      </a>
      <div className="admin-sidebar-navigation">
        <section>
          <span>Management</span>
          <nav aria-label="Management navigation">
            {managementLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </section>
        <section>
          <span>System</span>
          <nav aria-label="System navigation">
            {systemLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </section>
      </div>
      <form className="admin-sidebar-footer" action={logoutAdminAction}>
        <button type="submit">Log out</button>
      </form>
    </aside>
  );
}
