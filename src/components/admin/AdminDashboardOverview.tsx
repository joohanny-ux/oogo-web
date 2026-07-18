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
        <p>공개 콘텐츠, 랜딩 초안과 문의 현황을 한눈에 확인합니다.</p>
      </div>

      <div className="admin-card-grid admin-dashboard-metrics">
        <AdminCard label="Products" value={String(summary.products)} note="등록된 전체 상품" />
        <AdminCard label="Public on site" value={String(summary.publishedProducts)} note="공개 페이지에 게시 중" />
        <AdminCard label="Open inquiries" value={String(summary.openInquiries)} note="확인이 필요한 문의" />
        <AdminCard label="Landing drafts" value={String(summary.landingDrafts)} note="게시 내용과 다른 초안" />
      </div>

      <div className="admin-dashboard-layout">
        <section className="admin-panel admin-dashboard-workflow">
          <div className="admin-section-heading">
            <span>Content workflow</span>
            <small>현재 작업 상태</small>
          </div>
          <div className="admin-dashboard-workflow-copy">
            <strong>{summary.landingDrafts > 0 ? `${summary.landingDrafts}개 랜딩 초안이 게시를 기다리고 있습니다.` : "모든 랜딩 콘텐츠가 최신 상태입니다."}</strong>
            <p>페이지별 초안을 검토한 뒤 Landing Page에서 저장 후 게시하세요.</p>
            <a className="admin-secondary-button" href="/admin/landing">
              Landing Page 열기
            </a>
          </div>
        </section>

        <section className="admin-panel admin-dashboard-shortcuts">
          <div className="admin-section-heading">
            <span>Quick actions</span>
            <small>자주 사용하는 메뉴</small>
          </div>
          <div className="admin-shortcuts">
            <a href="/admin/products/new">
              <strong>Add product</strong>
              <small>새 상품 등록</small>
            </a>
            <a href="/admin/landing">
              <strong>Landing page</strong>
              <small>페이지 콘텐츠 편집</small>
            </a>
            <a href="/admin/files">
              <strong>Files</strong>
              <small>브랜드 미디어 관리</small>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
