"use client";

import { usePathname } from "next/navigation";

const pageLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/landing": "Landing Page",
  "/admin/archive": "Archive",
  "/admin/files": "Files",
  "/admin/inquiries": "Inquiries",
  "/admin/company": "Company & Brand",
  "/admin/users": "Users & Roles"
};

export function AdminTopbar() {
  const pathname = usePathname();
  const matchedPath = Object.keys(pageLabels)
    .sort((left, right) => right.length - left.length)
    .find((path) => (path === "/admin" ? pathname === path : pathname.startsWith(path)));

  return (
    <header className="admin-topbar">
      <strong>{pageLabels[matchedPath ?? "/admin"]}</strong>
      <div>
        <a href="/" target="_blank" rel="noreferrer">
          Open public page
        </a>
        <span>Admin Mode: Master</span>
        <b aria-label="Admin profile">AD</b>
      </div>
    </header>
  );
}
