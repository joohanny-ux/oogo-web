// Cloudflare Turnstile 토큰을 siteverify API로 검증한다.
// 키가 전혀 없으면 검증을 건너뛰고, 둘 중 하나만 있으면 설정 오류로 막는다.

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export type TurnstileVerificationResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim() && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string
): Promise<TurnstileVerificationResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!secret && !siteKey) {
    return { ok: true, skipped: true };
  }

  if (!secret || !siteKey) {
    return { ok: false, error: "보안 인증 설정이 완료되지 않았습니다." };
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
