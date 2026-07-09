import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <div>
        <p className="admin-kicker">OOGO Admin</p>
        <h1>Sign in</h1>
        <p>Manage products, landing content, files, inquiries, and brand settings.</p>
      </div>
      <LoginForm />
    </main>
  );
}
