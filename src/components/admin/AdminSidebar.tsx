import React from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/landing", label: "Landing Page" },
  { href: "/admin/files", label: "Files" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/company", label: "Company & Brand" },
  { href: "/admin/users", label: "Users & Roles" }
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <a className="admin-logo" href="/admin">
        OOGO
      </a>
      <nav aria-label="Admin navigation">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
