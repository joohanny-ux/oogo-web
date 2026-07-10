import { updateInquiryStatusAction } from "@/app/admin/inquiries/actions";
import { getAdminInquiries } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <main className="admin-page">
      <h1>Inquiries</h1>
      <p className="admin-page-note">구매, 리테일, 협업 및 일반 문의를 확인하고 상태를 관리합니다.</p>
      <div className="admin-table">
        <div className="admin-table-row inquiry-row admin-table-head">
          <span>Sender</span>
          <span>Type</span>
          <span>Email</span>
          <span>Status</span>
          <span>Message</span>
        </div>
        {inquiries.length === 0 ? (
          <p className="admin-empty">아직 접수된 문의가 없습니다.</p>
        ) : (
          inquiries.map((inquiry) => (
            <div className="admin-table-row inquiry-row" key={inquiry.id}>
              <span>{inquiry.name}</span>
              <span>{inquiry.type}</span>
              <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
              <form action={updateInquiryStatusAction}>
                <input type="hidden" name="id" value={inquiry.id} />
                <select name="status" defaultValue={inquiry.status}>
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="submit">Save</button>
              </form>
              <p>{inquiry.message}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
