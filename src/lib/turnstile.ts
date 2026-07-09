// Cloudflare Turnstile 토큰을 siteverify API로 검증한다.

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export type TurnstileVerificationResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string
): Promise<TurnstileVerificationResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!secret) {
    if (isProduction()) {
      return { ok: false, error: "보안 인증이 설정되지 않았습니다." };
    }

    return { ok: true, skipped: true };
  }

  if (!siteKey) {
    if (isProduction()) {
      return { ok: false, error: "보안 인증 키가 설정되지 않았습니다." };
    }

    return { ok: true, skipped: true };
  }

  if (!token?.trim()) {
    return { ok: false, error: "보안 인증을 완료해 주세요." };
  }

  const body = new URLSearchParams({
    secret,
    response: token
  });

  if (ip) {
    body.set("remoteip", ip);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString(),
      cache: "no-store"
    });

    if (!response.ok) {
      return { ok: false, error: "보안 인증 요청에 실패했습니다." };
    }

    const result = (await response.json()) as TurnstileVerifyResponse;

    if (!result.success) {
      return { ok: false, error: "보안 인증에 실패했습니다." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "보안 인증 요청에 실패했습니다." };
  }
}
