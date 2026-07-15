// 공개 URL 로케일 prefix 유틸 (클라이언트/서버 공통)
import { isLocale, type Locale } from "@/lib/i18n";

export const LOCALE_HEADER = "x-oogo-locale";
export const LOCALE_PATH_HEADER = "x-oogo-pathname";
export const LOCALE_COOKIE = "oogo_locale";

const PREFIX_LOCALES: Locale[] = ["en", "zh"];

export function getPathLocale(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isLocale(segment) && PREFIX_LOCALES.includes(segment)) {
    return segment;
  }
  return "ko";
}

export function stripLocalePrefix(pathname: string): string {
  const locale = getPathLocale(pathname);
  if (locale === "ko") {
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
  }

  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function withLocalePrefix(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/admin")) {
    return href;
  }

  const [pathPart, query = ""] = href.split("?");
  const path = stripLocalePrefix(pathPart);
  const prefixed = locale === "ko" ? path : path === "/" ? `/${locale}` : `/${locale}${path}`;
  return query ? `${prefixed}?${query}` : prefixed;
}

export function localizedHrefForLocale(currentPathname: string, nextLocale: Locale): string {
  return withLocalePrefix(stripLocalePrefix(currentPathname), nextLocale);
}
