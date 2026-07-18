"use client";

import React from "react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  supabaseConfigured?: boolean;
};

export function LoginForm({ supabaseConfigured = true }: LoginFormProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setMessage("");

    if (!supabaseConfigured) {
      setMessage("Supabase connection is required before admin sign-in.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form className="admin-login-form" action={handleSubmit}>
      {!supabaseConfigured ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>관리자 로그인은 Supabase Auth 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      <label>
        Email
        <input name="email" type="email" required disabled={!supabaseConfigured} />
      </label>
      <label>
        Password
        <input name="password" type="password" required disabled={!supabaseConfigured} />
      </label>
      <button type="submit" disabled={!supabaseConfigured}>
        {supabaseConfigured ? "Sign in" : "Connect Supabase to sign in"}
      </button>
      {message ? <p role="alert">{message}</p> : null}
    </form>
  );
}
