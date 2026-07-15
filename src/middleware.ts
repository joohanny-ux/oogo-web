// 공개 로케일 rewrite와 admin 세션 가드
import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr/dist/module/types";
import { NextResponse, type NextRequest } from "next/server";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  getPathLocale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  LOCALE_PATH_HEADER,
  stripLocalePrefix
} from "@/lib/locale-path";

export function hasSupabaseMiddlewareEnv(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** rewrite 재진입 시 첫 패스에서 심어 둔 로케일을 유지한다. */
export function resolveMiddlewareLocale(pathname: string, inheritedLocale: string | null): Locale {
  const pathLocale = getPathLocale(pathname);
  if (pathLocale !== "ko") {
    return pathLocale;
  }

  if (inheritedLocale && isLocale(inheritedLocale) && inheritedLocale !== "ko") {
    return inheritedLocale;
  }

  return "ko";
}

export function resolveMiddlewarePathname(pathname: string, inheritedPathname: string | null): string {
  if (getPathLocale(pathname) !== "ko") {
    return pathname;
  }

  if (inheritedPathname && getPathLocale(inheritedPathname) !== "ko") {
    return inheritedPathname;
  }

  return pathname;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathLocale = getPathLocale(pathname);
  const locale = resolveMiddlewareLocale(pathname, request.headers.get(LOCALE_HEADER));
  const publicPathname = resolveMiddlewarePathname(pathname, request.headers.get(LOCALE_PATH_HEADER));
  const pathnameWithoutLocale = stripLocalePrefix(pathname);

  if (pathnameWithoutLocale.startsWith("/admin") && pathLocale !== "ko") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = pathnameWithoutLocale;
    return NextResponse.redirect(adminUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  requestHeaders.set(LOCALE_PATH_HEADER, publicPathname);

  let response: NextResponse;

  if (pathLocale !== "ko") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathnameWithoutLocale;
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders }
    });
  } else {
    response = NextResponse.next({
      request: { headers: requestHeaders }
    });
  }

  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax"
  });

  if (!pathnameWithoutLocale.startsWith("/admin")) {
    return response;
  }

  if (pathnameWithoutLocale === "/admin/login") {
    if (!hasSupabaseMiddlewareEnv()) {
      return response;
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      adminUrl.search = "";
      return NextResponse.redirect(adminUrl);
    }

    return response;
  }

  if (!hasSupabaseMiddlewareEnv()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("reason", "session-expired");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"]
};
