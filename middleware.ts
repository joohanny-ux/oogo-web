import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr/dist/module/types";
import { NextResponse, type NextRequest } from "next/server";

export function hasSupabaseMiddlewareEnv(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!hasSupabaseMiddlewareEnv()) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
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
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
