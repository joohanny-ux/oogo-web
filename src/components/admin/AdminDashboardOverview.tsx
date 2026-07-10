import React from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import type { AdminDashboardSummary } from "@/lib/admin-content";

type AdminDashboardOverviewProps = {
  summary: AdminDashboardSummary;
};

export function AdminDashboardOverview({ summary }: AdminDashboardOverviewProps) {
  return (
    <main className="admin-page admin-dashboard-page">
      <div className="admin-page-intro">
        <h1>Dashboard</h1>
        <p>현재 공개 콘텐츠와 문의 현황을 빠르게 확인합니다.</p>
      </div>

      <div className="admin-card-grid admin-dashboard-metrics">
        <AdminCard label="Products" value={String(summary.products)} note="등록된 전체 상품" />
        <AdminCard label="Public on site" value={String(summary.publishedProducts)} note="공개 페이지에 게시 중" />
        <AdminCard label="Open inquiries" value={String(summary.openInquiries)} note="확인이 필요한 문의" />
      </div>

      <section className="admin-panel admin-dashboard-shortcuts">
        <div className="admin-section-heading">
          <span>Quick actions</span>
          <small>자주 사용하는 관리 메뉴입니다.</small>
        </div>
        <div className="admin-shortcuts">
          <a href="/admin/products/new">Add product</a>
          <a href="/admin/landing">Landing page</a>
          <a href="/admin/files">Files</a>
        </div>
      </section>
    </main>
  );
}
