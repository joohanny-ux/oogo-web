export function AdminCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="admin-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
